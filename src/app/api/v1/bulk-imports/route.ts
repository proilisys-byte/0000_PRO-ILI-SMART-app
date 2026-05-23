import { NextRequest, NextResponse } from 'next/server';
import { handleRouteError, AppError } from '@/lib/errors';
import { PrismaClient } from '@prisma/client';
import {
  parseAndValidateCsv,
  ProductCsvSchema,
  ProcessCsvSchema,
  BomCsvSchema,
  DefectCsvSchema
} from '@/lib/csv';

const prisma = new PrismaClient();

// ─── POST /api/v1/bulk-imports ──────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // 1. 사용자 인증 확인
    const mockUserCookie = request.cookies.get('mock-user');
    if (!mockUserCookie?.value) {
      throw new AppError(
        'AUTH_401_UNAUTHORIZED_ACCESS',
        '로그인이 필요합니다.',
        401
      );
    }
    const mockUser = JSON.parse(mockUserCookie.value);

    // 2. Form Data 및 파일 추출
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const importTypeRaw = formData.get('import_type') as string | null;

    if (!file) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '업로드할 파일이 누락되었습니다.',
        400
      );
    }
    if (!importTypeRaw) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '업로드 타입(import_type)이 누락되었습니다.',
        400
      );
    }

    const importType = importTypeRaw.toLowerCase();
    const validImportTypes = ['product', 'process', 'bom', 'defect'];
    if (!validImportTypes.includes(importType)) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '올바르지 않은 업로드 타입입니다. (product, process, bom, defect 중 하나여야 합니다.)',
        400
      );
    }

    // 3. 파일 크기 제한 검사 (10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '파일 크기는 최대 10MB까지 허용됩니다.',
        400
      );
    }

    // 4. CSV 텍스트 파싱
    const csvContent = await file.text();
    let schema: any;
    if (importType === 'product') schema = ProductCsvSchema;
    else if (importType === 'process') schema = ProcessCsvSchema;
    else if (importType === 'bom') schema = BomCsvSchema;
    else if (importType === 'defect') schema = DefectCsvSchema;

    const parseResult = parseAndValidateCsv(csvContent, schema);
    let validData = parseResult.data;
    const errors = parseResult.errors;
    const totalRows = validData.length + errors.length;

    // 5. 참조 무결성 검증 (BOM인 경우)
    if (importType === 'bom') {
      const products = await prisma.product.findMany({
        where: { tenantId: mockUser.tenant_id },
        select: { productCode: true }
      });
      const productCodeSet = new Set(products.map(p => p.productCode));

      const finalValidData: any[] = [];
      validData.forEach((row: any, idx: number) => {
        const parentValid = productCodeSet.has(row.parent_item_code);
        const childValid = productCodeSet.has(row.child_item_code);

        if (!parentValid || !childValid) {
          const rowNum = idx + 2; // header가 첫 번째 라인이므로
          if (!parentValid) {
            errors.push({
              row: rowNum,
              column: 'parent_item_code',
              message: `제품 마스터에 존재하지 않는 상위제품코드입니다: ${row.parent_item_code}`
            });
          }
          if (!childValid) {
            errors.push({
              row: rowNum,
              column: 'child_item_code',
              message: `제품 마스터에 존재하지 않는 하위부품코드입니다: ${row.child_item_code}`
            });
          }
        } else {
          finalValidData.push(row);
        }
      });
      validData = finalValidData;
    }

    // 6. DB 적재 진행 (트랜잭션)
    const successCount = validData.length;
    const failedCount = totalRows - successCount;

    const batch = await prisma.$transaction(async (tx) => {
      // (1) BulkImportBatch 레코드 생성
      const createdBatch = await tx.bulkImportBatch.create({
        data: {
          tenantId: mockUser.tenant_id,
          uploadedBy: mockUser.id,
          fileName: file.name,
          importType: importType.toUpperCase(),
          status: 'PROCESSING',
          totalRows,
          processedRows: 0,
          successCount: 0,
          failedCount: 0,
        }
      });

      // (2) 성공 데이터 벌크 Insert (성공 건수가 있을 때만)
      if (successCount > 0) {
        if (importType === 'product') {
          const dbProducts = validData.map((item: any) => ({
            tenantId: mockUser.tenant_id,
            productCode: item.product_code,
            name: item.product_name,
            spec: item.specification,
            unit: item.unit,
            clientCode: item.client_code,
            isActive: item.is_active,
          }));
          await tx.product.createMany({
            data: dbProducts,
          });
        } else if (importType === 'process') {
          const dbProcesses = validData.map((item: any) => ({
            tenantId: mockUser.tenant_id,
            processCode: item.process_code,
            name: item.process_name,
            lineCode: item.line_code,
            cycleTimeSec: item.cycle_time_sec,
            defectCodes: item.defect_codes,
          }));
          await tx.process.createMany({
            data: dbProcesses,
          });
        } else if (importType === 'bom') {
          const dbBoms = validData.map((item: any) => ({
            tenantId: mockUser.tenant_id,
            parentItemCode: item.parent_item_code,
            childItemCode: item.child_item_code,
            quantity: item.quantity,
            unit: item.unit,
            validFrom: item.valid_from,
            validTo: item.valid_to,
          }));
          await tx.bom.createMany({
            data: dbBoms,
          });
        } else if (importType === 'defect') {
          const dbDefects = validData.map((item: any) => ({
            tenantId: mockUser.tenant_id,
            defectCode: item.defect_code,
            name: item.defect_name,
            category: item.category,
            severity: item.severity,
          }));
          await tx.defect.createMany({
            data: dbDefects,
          });
        }
      }

      // (3) BulkImportBatch 레코드 상태 업데이트 (완료)
      const updatedBatch = await tx.bulkImportBatch.update({
        where: { id: createdBatch.id },
        data: {
          status: 'COMPLETED',
          processedRows: totalRows,
          successCount,
          failedCount,
          errors: errors.length > 0 ? errors : undefined,
        }
      });

      // (4) Audit Log 생성
      let targetTable = '';
      if (importType === 'product') targetTable = 'products';
      else if (importType === 'process') targetTable = 'processes';
      else if (importType === 'bom') targetTable = 'boms';
      else if (importType === 'defect') targetTable = 'defects';

      await tx.auditLog.create({
        data: {
          tenantId: mockUser.tenant_id,
          tableName: targetTable,
          recordId: updatedBatch.id,
          action: 'BULK_IMPORT',
          newData: {
            fileName: file.name,
            totalRows,
            successCount,
            failedCount,
            importType: importType.toUpperCase()
          },
          changedBy: mockUser.id,
        }
      });

      return updatedBatch;
    });

    return NextResponse.json({
      success: true,
      data: {
        job_id: batch.id,
        status: batch.status,
        total_rows: batch.totalRows,
        success_count: batch.successCount,
        failed_count: batch.failedCount
      }
    });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}

// ─── GET /api/v1/bulk-imports ───────────────────────────────
export async function GET(request: NextRequest) {
  try {
    // 1. 사용자 인증 확인
    const mockUserCookie = request.cookies.get('mock-user');
    if (!mockUserCookie?.value) {
      throw new AppError(
        'AUTH_401_UNAUTHORIZED_ACCESS',
        '로그인이 필요합니다.',
        401
      );
    }
    const mockUser = JSON.parse(mockUserCookie.value);

    // 2. Query Parameters 추출
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // 3. 테넌트의 배치 목록 조회
    const [list, total] = await Promise.all([
      prisma.bulkImportBatch.findMany({
        where: { tenantId: mockUser.tenant_id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bulkImportBatch.count({
        where: { tenantId: mockUser.tenant_id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        list: list.map(item => ({
          job_id: item.id,
          fileName: item.fileName,
          importType: item.importType,
          status: item.status,
          total_rows: item.totalRows,
          processed_rows: item.processedRows,
          success_count: item.successCount,
          failed_count: item.failedCount,
          createdAt: item.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }
    });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
