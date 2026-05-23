/**
 * 공통 에러 처리 유틸리티 (API-001_common_error_schema.md 준수)
 *
 * 모든 API Route Handler와 Server Action에서 일관된 에러 응답 포맷을 보장합니다.
 */
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

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
export function handleRouteError(error: unknown): NextResponse {
  // 1. AppError: 의도된 비즈니스 에러
  if (error instanceof AppError) {
    return createErrorResponse(
      error.code,
      error.message,
      error.status,
      error.details
    );
  }

  // 2. ZodError: 요청 형식 검증 실패
  if (error instanceof ZodError) {
    return createErrorResponse(
      'VAL_400_VALIDATION_FAILED',
      '요청 형식이 올바르지 않습니다.',
      400,
      {
        issues: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      }
    );
  }

  // 3. 기타 알 수 없는 에러
  console.error('[Unhandled API Error]', error);
  return createErrorResponse(
    'SYS_500_INTERNAL_SERVER_ERROR',
    '서버 내부 오류가 발생했습니다.',
    500
  );
}
