import { NextRequest, NextResponse } from 'next/server';
import { handleRouteError, AppError } from '@/lib/errors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Next.js App Router dynamic route params
type RouteParams = {
  params: Promise<{
    jobId: string;
  }>;
};

// ─── GET /api/v1/bulk-imports/[jobId] ──────────────────────────
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
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
    const { jobId } = await params;

    // 2. Job 조회
    const batch = await prisma.bulkImportBatch.findUnique({
      where: {
        id: jobId,
        tenantId: mockUser.tenant_id, // 테넌트 격리
      },
    });

    if (!batch) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '요청한 배치 업로드 작업을 찾을 수 없습니다.',
        404
      );
    }

    // 3. 에러 배열 파싱
    let errorsList: any[] = [];
    if (batch.errors) {
      try {
        if (typeof batch.errors === 'string') {
          errorsList = JSON.parse(batch.errors);
        } else if (Array.isArray(batch.errors)) {
          errorsList = batch.errors;
        }
      } catch (e) {
        console.error('Failed to parse errors JSON:', e);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        status: batch.status.toLowerCase(), // 명세: queued, processing, completed, failed
        processed_rows: batch.processedRows,
        success_count: batch.successCount,
        error_count: batch.failedCount,
        errors: errorsList, // 간단히 포함
      },
    });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
