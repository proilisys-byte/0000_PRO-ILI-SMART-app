import { logger } from './logger';

export async function trackedGeminiCall<T>(
  callFn: () => Promise<T>,
  metadata: {
    type: 'stt' | 'vision' | 'audit' | 'nc';
    session_id: string;
    user_id?: string;
    trace_id?: string;
    [key: string]: any; // 추가적인 커스텀 메타데이터 허용
  }
): Promise<T> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  let success = true;
  let errorDetail: string | null = null;

  try {
    const result = await callFn();
    return result;
  } catch (error) {
    success = false;
    errorDetail = error instanceof Error ? error.message : String(error);
    throw error;
  } finally {
    const duration_ms = Date.now() - startTime;
    const { type, session_id, user_id, trace_id, ...extraMetadata } = metadata;

    const logPayload = {
      timestamp,
      service: 'ai-pipeline',
      session_id,
      trace_id,
      user_id,
      event: success ? 'gemini_call_completed' : 'gemini_call_failed',
      duration_ms,
      metadata: {
        type,
        success,
        ...(errorDetail ? { errorDetail } : {}),
        ...extraMetadata,
      },
    };

    if (success) {
      logger.info(logPayload);
    } else {
      logger.error(logPayload);
    }
  }
}
