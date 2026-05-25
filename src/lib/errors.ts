/**
 * 공통 에러 처리 유틸리티 (API-001_common_error_schema.md 준수)
 *
 * 모든 API Route Handler와 Server Action에서 일관된 에러 응답 포맷을 보장합니다.
 */
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from '@/lib/monitoring/logger';

// ─── AppError: 커스텀 에러 클래스 ───────────────────────
export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    status: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// ─── 에러 응답 생성 헬퍼 ─────────────────────────────────
function createErrorResponse(
  code: string,
  message: string,
  status: number,
  details?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        status,
        ...(details ? { details } : {}),
      },
    },
    { status }
  );
}

// ─── Route Handler용 에러 핸들러 ─────────────────────────
export function handleRouteError(
  error: unknown,
  context?: {
    sessionId?: string;
    userId?: string;
    traceId?: string;
    service?: string;
  }
): NextResponse {
  const sessionId = context?.sessionId || 'sess_unknown';
  const traceId = context?.traceId;
  const userId = context?.userId;
  const service = context?.service || 'api-gateway';
  const timestamp = new Date().toISOString();

  // 1. AppError: 의도된 비즈니스 에러
  if (error instanceof AppError) {
    const isServerError = error.status >= 500;
    const logPayload = {
      timestamp,
      service,
      session_id: sessionId,
      trace_id: traceId,
      user_id: userId,
      event: isServerError ? 'api_server_error' : 'api_client_warning',
      metadata: {
        errorCode: error.code,
        errorMessage: error.message,
        statusCode: error.status,
        ...(error.details ? { details: error.details } : {}),
      },
    };

    if (isServerError) {
      logger.error(logPayload);
    } else {
      logger.warn(logPayload);
    }

    return createErrorResponse(
      error.code,
      error.message,
      error.status,
      error.details
    );
  }

  // 2. ZodError: 요청 형식 검증 실패
  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    logger.warn({
      timestamp,
      service,
      session_id: sessionId,
      trace_id: traceId,
      user_id: userId,
      event: 'api_validation_warning',
      metadata: {
        errorMessage: '요청 형식 검증 실패',
        issues,
      },
    });

    return createErrorResponse(
      'VAL_400_VALIDATION_FAILED',
      '요청 형식이 올바르지 않습니다.',
      400,
      { issues }
    );
  }

  // 3. 기타 알 수 없는 에러
  const errorMsg = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  logger.error({
    timestamp,
    service,
    session_id: sessionId,
    trace_id: traceId,
    user_id: userId,
    event: 'api_unhandled_error',
    metadata: {
      errorMessage: errorMsg,
      errorStack,
    },
  });

  console.error('[Unhandled API Error]', error);
  return createErrorResponse(
    'SYS_500_INTERNAL_SERVER_ERROR',
    '서버 내부 오류가 발생했습니다.',
    500
  );
}

