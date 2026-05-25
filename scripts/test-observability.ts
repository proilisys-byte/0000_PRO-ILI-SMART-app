import { NextRequest } from 'next/server';
import { POST as sttHandler } from '../src/app/api/v1/stt/route';
import { registerLogSpy, unregisterLogSpy, StructuredLog, StructuredLogSchema, logger } from '../src/lib/monitoring/logger';

// ─── 1. 로거 단위 테스트: 필수 필드 누락 시 예외 발생 여부 검증 ──────────────────
function testLoggerValidation() {
  console.log('--- Unit Test: Logger Validation ---');
  
  // A. timestamp 누락 시도
  let timestampExceptionThrown = false;
  try {
    logger.info({
      service: 'test-service',
      session_id: 'sess_test_123',
      event: 'test_event',
      metadata: {},
    });
  } catch (err: any) {
    if (err.message.includes('Log missing or invalid timestamp') || err.message.includes('Log missing')) {
      timestampExceptionThrown = true;
      console.log('✅ Correctly threw exception on missing timestamp');
    } else {
      console.error('❌ Threw unexpected exception on missing timestamp:', err.message);
    }
  }
  
  if (!timestampExceptionThrown) {
    throw new Error('FAIL: Logger allowed log entry without timestamp');
  }

  // B. session_id 누락 시도
  let sessionExceptionThrown = false;
  try {
    logger.info({
      timestamp: new Date().toISOString(),
      service: 'test-service',
      session_id: '',
      event: 'test_event',
      metadata: {},
    });
  } catch (err: any) {
    if (err.message.includes('Log missing session_id') || err.message.includes('Log missing')) {
      sessionExceptionThrown = true;
      console.log('✅ Correctly threw exception on missing session_id');
    } else {
      console.error('❌ Threw unexpected exception on missing session_id:', err.message);
    }
  }

  if (!sessionExceptionThrown) {
    throw new Error('FAIL: Logger allowed log entry without session_id');
  }

  console.log('🎉 Logger validation unit tests passed.');
}

// ─── 2. E2E Load Test: 초당 50건 이상의 API 에러 강제 주입 및 100% 적재 검증 ───
async function testObservabilityLoad() {
  console.log('\n--- E2E Load Test: Injecting 100 API Errors ---');

  const capturedLogs: StructuredLog[] = [];
  
  // Mock Log Collector 등록
  registerLogSpy((log) => {
    capturedLogs.push(log);
  });

  const totalRequests = 100;
  const requests: Promise<any>[] = [];

  // sttHandler에 인증 쿠키 없이 100건의 POST 요청을 고속으로 직접 호출
  // AUTH_401_UNAUTHORIZED_ACCESS AppError가 발생하여 handleRouteError로 연동,
  // 100건의 warn 레벨 로그가 누수 없이 수집되는지 검증
  for (let i = 0; i < totalRequests; i++) {
    const req = new NextRequest('http://localhost:3000/api/v1/stt', {
      method: 'POST',
      headers: {
        'x-trace-id': `tr_loadtest_${i}`,
      },
    });
    requests.push(sttHandler(req));
  }

  const startTime = Date.now();
  const responses = await Promise.all(requests);
  const elapsed = Date.now() - startTime;

  // Mock Log Collector 해제
  unregisterLogSpy();

  console.log(`Finished ${totalRequests} API error requests in ${elapsed} ms. (Average: ${(elapsed / totalRequests).toFixed(2)} ms/req)`);

  // A. 응답 검증 (모두 Unauthorized 401 에러를 응답해야 함)
  let unauthorizedCount = 0;
  for (const res of responses) {
    if (res.status === 401) {
      unauthorizedCount++;
    }
  }
  console.log(`Received ${unauthorizedCount} / ${totalRequests} HTTP 401 responses.`);
  if (unauthorizedCount !== totalRequests) {
    throw new Error(`FAIL: Expected ${totalRequests} HTTP 401 status, but got ${unauthorizedCount}`);
  }

  // B. 적재 누락률 검증 (가로채진 로그 건수가 요청 건수와 정확히 일치해야 함)
  console.log(`Captured ${capturedLogs.length} logs in collector.`);
  if (capturedLogs.length !== totalRequests) {
    throw new Error(`FAIL: Log leakage detected! Expected ${totalRequests} logs, but got ${capturedLogs.length}. (누락률: ${(((totalRequests - capturedLogs.length) / totalRequests) * 100).toFixed(2)}%)`);
  }
  console.log('✅ Log Leakage: 0% (All logs successfully captured)');

  // C. 로그 스키마 및 무결성 검증
  for (let i = 0; i < capturedLogs.length; i++) {
    const log = capturedLogs[i];
    try {
      // Zod 스키마 검증 실행 (timestamp, level, service, event, session_id, metadata 체크)
      StructuredLogSchema.parse(log);
      
      // session_id가 fallback 값인 'sess_unknown'으로 올바르게 세팅되었는지 검증
      if (log.session_id !== 'sess_unknown') {
        throw new Error(`Expected fallback session_id 'sess_unknown', but got '${log.session_id}'`);
      }
      
      // trace_id가 요청과 올바르게 매핑되는지 검증
      if (log.trace_id !== `tr_loadtest_${i}`) {
        throw new Error(`Expected trace_id 'tr_loadtest_${i}', but got '${log.trace_id}'`);
      }

      // level이 warn으로 남았는지 검증 (401은 클라이언트 에러이므로 warn 레벨)
      if (log.level !== 'warn') {
        throw new Error(`Expected error level 'warn', but got '${log.level}'`);
      }
    } catch (err: any) {
      throw new Error(`FAIL: Log index ${i} failed schema verification: ${err.message}`);
    }
  }

  console.log('✅ Log schema & integrity validation passed for all logs.');
  console.log('🎉 Observability Load Test passed successfully!');
}

// ─── 실행 메인 함수 ──────────────────────────────────────────────────────────
async function main() {
  try {
    testLoggerValidation();
    await testObservabilityLoad();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Observability verification failed!');
    console.error(error.message);
    process.exit(1);
  }
}

main();
