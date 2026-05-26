import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AppError, handleRouteError } from '@/lib/errors';
import { generateNcDraft } from '@/lib/nc/draft-generator';
import { trackedGeminiCall } from '@/lib/monitoring/ai-tracker';

const prisma = new PrismaClient();

// ─── POST /api/v1/nc/draft ────────────────────────────────────
export async function POST(request: NextRequest) {
  let userId: string | undefined;
  let recordId = 'nc_unknown';
  const traceId = request.headers.get('x-trace-id') || crypto.randomUUID();

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
    userId = userContext.id;

    // 2. 요청 Body 파싱
    const body = await request.json().catch(() => ({}));
    const { ncReason } = body;

    if (!ncReason || typeof ncReason !== 'string' || ncReason.trim() === '') {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '비적합(NC) 사유 텍스트(ncReason)는 필수 항목입니다.',
        400
      );
    }

    recordId = crypto.randomUUID();

    // 3. AI NC 초안 생성 엔진 실행
    const startTime = Date.now();
    const result = await trackedGeminiCall(
      () => generateNcDraft(ncReason),
      {
        type: 'nc',
        session_id: recordId,
        user_id: userId,
        trace_id: traceId,
        entries_count: 1,
      }
    );
    const elapsedMs = Date.now() - startTime;

    // 4. 감사 로그 적재 (Insert-only Audit Log 정책 준수)
    await prisma.auditLog.create({
      data: {
        tableName: 'nc_drafts',
        recordId: recordId,
        action: 'NC_DRAFT_GENERATION',
        changedBy: userId,
        tenantId: tenantId,
        newData: result as any,
        oldData: { ncReason } as any,
      },
    });

    // 5. 성공 응답 반환
    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        traceId: traceId,
        timestamp: new Date().toISOString(),
        elapsed_ms: elapsedMs,
      },
    });
  } catch (error) {
    return handleRouteError(error, {
      sessionId: recordId,
      userId,
      traceId,
      service: 'nc-draft-service',
    });
  } finally {
    await prisma.$disconnect();
  }
}
