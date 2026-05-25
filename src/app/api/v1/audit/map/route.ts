import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AppError, handleRouteError } from '@/lib/errors';
import { mapSessionDataToISO9001 } from '@/lib/audit/mapping-engine';

const prisma = new PrismaClient();

// ─── POST /api/v1/audit/map ──────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // 1. 인증 확인 (mock-user 쿠키 파싱)
    const mockUserCookie = request.cookies.get('mock-user');
    if (!mockUserCookie?.value) {
      throw new AppError(
        'AUTH_401_UNAUTHORIZED_ACCESS',
        '로그인이 필요합니다.',
        401
      );
    }

    const userContext = JSON.parse(decodeURIComponent(mockUserCookie.value));
    const tenantId = userContext.tenant_id;
    const userId = userContext.id;

    // 2. 요청 Body 파싱
    const body = await request.json().catch(() => ({}));
    const { sessionId, entries } = body;

    let targetEntries: any[] = [];
    let auditRecordId = '';

    // Case A: sessionId가 주어지는 경우 (DB 연계)
    if (sessionId) {
      if (typeof sessionId !== 'string') {
        throw new AppError(
          'VAL_400_VALIDATION_FAILED',
          '올바르지 않은 세션 ID 형식입니다.',
          400
        );
      }

      auditRecordId = sessionId;

      // 세션 존재 여부 및 테넌트 권한 교차 검증
      const session = await prisma.auditSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        throw new AppError(
          'RES_404_RESOURCE_NOT_FOUND',
          '요청한 세션을 찾을 수 없습니다.',
          404
        );
      }

      if (session.tenantId !== tenantId) {
        throw new AppError(
          'AUTH_403_FORBIDDEN_ACCESS',
          '해당 테넌트의 데이터에 접근 권한이 없습니다.',
          403
        );
      }

      // 세션에 매핑된 데이터 엔트리 조회
      const dataEntries = await prisma.auditDataEntry.findMany({
        where: { sessionId: sessionId },
        orderBy: { createdAt: 'asc' },
      });

      if (!dataEntries || dataEntries.length === 0) {
        throw new AppError(
          'VAL_400_VALIDATION_FAILED',
          '해당 세션에 감사 데이터가 존재하지 않습니다.',
          400
        );
      }

      // 데이터 가공 (mappedData 우선, 없으면 rawData 적용)
      targetEntries = dataEntries.map((de) => {
        const md = de.mappedData;
        const rd = de.rawData;

        // mappedData가 존재하고 객체 형태인 경우
        if (md && typeof md === 'object' && Object.keys(md).length > 0) {
          return md;
        }

        // rawData가 객체이고 text가 있으면 텍스트 기반 구조로 변환
        if (rd && typeof rd === 'object') {
          return {
            process_name: (rd as any).process_name || '미지정',
            quantity: (rd as any).quantity || 0,
            defect_code: (rd as any).defect_code,
            notes: (rd as any).notes || (rd as any).text,
          };
        }

        return rd;
      });
    }
    // Case B: entries 배열이 직접 제공되는 경우 (직접 호출)
    else if (entries) {
      if (!Array.isArray(entries)) {
        throw new AppError(
          'VAL_400_VALIDATION_FAILED',
          'entries는 배열 형식이어야 합니다.',
          400
        );
      }
      targetEntries = entries;
      auditRecordId = '00000000-0000-0000-0000-000000000000'; // 임시 가상 UUID
    } else {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        'sessionId 또는 entries 파라미터가 필수적입니다.',
        400
      );
    }

    // 3. 매핑 엔진 실행
    const startTime = Date.now();
    const result = await mapSessionDataToISO9001(targetEntries);
    const elapsedMs = Date.now() - startTime;

    // 4. 감사 로그 적재 (Insert-only Audit Log 정책)
    await prisma.auditLog.create({
      data: {
        tableName: 'audit_sessions',
        recordId: auditRecordId,
        action: 'ISO9001_MAPPING',
        changedBy: userId,
        tenantId: tenantId,
        newData: result as any,
        oldData: { entries_count: targetEntries.length } as any,
      },
    });

    // 5. 성공 응답 반환
    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        traceId: request.headers.get('x-trace-id') || crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        elapsed_ms: elapsedMs,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
