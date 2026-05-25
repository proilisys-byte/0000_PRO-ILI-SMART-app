import { ZodError, z } from 'zod';

export interface StructuredLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service: string;
  trace_id?: string;
  user_id?: string;
  session_id: string;
  event: string;
  duration_ms?: number;
  metadata: Record<string, any>;
}

// Zod 스키마를 통한 구조화 로그 검증
export const StructuredLogSchema = z.object({
  timestamp: z.string().datetime({ message: 'Log missing or invalid timestamp' }),
  level: z.enum(['info', 'warn', 'error', 'debug']),
  service: z.string(),
  trace_id: z.string().optional(),
  user_id: z.string().optional(),
  session_id: z.string({ required_error: 'Log missing session_id' }).min(1, 'Log missing session_id'),
  event: z.string().min(1),
  duration_ms: z.number().optional(),
  metadata: z.record(z.any()),
});

type SpyCallback = (log: StructuredLog) => void;
let spyCallback: SpyCallback | null = null;

/**
 * 테스트 검증을 위해 로그 출력을 가로채는 콜백을 등록합니다.
 */
export function registerLogSpy(callback: SpyCallback) {
  spyCallback = callback;
}

/**
 * 로그 스파이 콜백을 해제합니다.
 */
export function unregisterLogSpy() {
  spyCallback = null;
}

/**
 * 구조화된 로그 페이로드를 검증하고 stdout으로 출력합니다.
 * 필수 필드(session_id, timestamp)가 누락되거나 규격에 맞지 않으면 즉시 예외를 트리거합니다.
 */
export function writeLog(logInput: Omit<StructuredLog, 'timestamp'> & { timestamp?: string }) {
  // timestamp가 생략된 경우 validation 에러를 내기 위해 runtime 체크
  if (!logInput.timestamp) {
    throw new Error('Log validation failed: Log missing or invalid timestamp');
  }

  if (!logInput.session_id) {
    throw new Error('Log validation failed: Log missing session_id');
  }

  // Zod 스키마 유효성 검증
  try {
    const validatedLog = StructuredLogSchema.parse(logInput) as StructuredLog;
    const logJsonString = JSON.stringify(validatedLog);
    
    // stdout 표준 출력
    console.log(logJsonString);

    // Spy 콜백이 등록되어 있다면 실행
    if (spyCallback) {
      spyCallback(validatedLog);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0];
      throw new Error(`Log validation failed: ${firstIssue.message}`);
    }
    throw error;
  }
}

export const logger = {
  info: (log: Omit<StructuredLog, 'level' | 'timestamp'> & { timestamp?: string }) => {
    writeLog({ ...log, level: 'info' });
  },
  warn: (log: Omit<StructuredLog, 'level' | 'timestamp'> & { timestamp?: string }) => {
    writeLog({ ...log, level: 'warn' });
  },
  error: (log: Omit<StructuredLog, 'level' | 'timestamp'> & { timestamp?: string }) => {
    writeLog({ ...log, level: 'error' });
  },
  debug: (log: Omit<StructuredLog, 'level' | 'timestamp'> & { timestamp?: string }) => {
    writeLog({ ...log, level: 'debug' });
  },
};
