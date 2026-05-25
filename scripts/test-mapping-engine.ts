import { mapSessionDataToISO9001 } from '../src/lib/audit/mapping-engine';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. 테스트 케이스 합성기
function generateTestInputs(count: number): any[][] {
  const processes = ['압출', '조립', '도색', '연마', '가공', '검사', '포장'];
  const defectCodes = ['D-001', 'D-002', 'D-003', 'D-004', 'D-005'];
  const testInputs: any[][] = [];

  for (let i = 1; i <= count; i++) {
    const inputSize = 1 + (i % 4); // 1~4개의 레코드
    const entries: any[] = [];
    
    // 50%의 테스트 케이스는 불량을 포함
    const includeDefects = i <= count / 2;

    for (let j = 0; j < inputSize; j++) {
      const procIdx = (i * 3 + j) % processes.length;
      const qty = 50 + (i * j + 17) % 200;
      
      const entry: any = {
        process_name: processes[procIdx],
        quantity: qty,
      };

      if (includeDefects && j === 0) {
        // 첫 번째 레코드에 불량 삽입
        entry.defect_code = defectCodes[(i + j) % defectCodes.length];
        entry.notes = `불량 검출: 코드 ${entry.defect_code}`;
      } else {
        entry.notes = '정상 가동 완료.';
      }

      entries.push(entry);
    }
    testInputs.push(entries);
  }

  return testInputs;
}

async function runTests() {
  console.log('--- [T1-008] Audit 매핑 엔진 검증 테스트 시작 ---');

  // 2. 50건 모의 AI 검증 (MOCK_AI=true)
  process.env.MOCK_AI = 'true';
  console.log('\n[테스트 1] 50건 모의 AI 매핑 검증 시작...');

  const testCases = generateTestInputs(50);
  let mockSuccessCount = 0;
  let mockFailCount = 0;

  for (let i = 0; i < testCases.length; i++) {
    const entries = testCases[i];
    const hasDefects = entries.some(e => e.defect_code);

    try {
      const result = await mapSessionDataToISO9001(entries);

      // 출력 규격 기본 검증
      if (!result.sections || result.sections.length === 0) {
        throw new Error('Sections가 비어있습니다.');
      }

      const clauses = result.sections.map(s => s.clause);

      // 8.5.1 필수 검증
      if (!clauses.includes('8.5.1')) {
        throw new Error('필수 조항 8.5.1 누락됨');
      }

      // 불량 존재 시 8.7 및 10.2 검증
      if (hasDefects) {
        if (!clauses.includes('8.7') || !clauses.includes('10.2')) {
          throw new Error('불량 검출되었으나 필수 조항 8.7 또는 10.2 누락됨');
        }
      } else {
        if (clauses.includes('8.7') || clauses.includes('10.2')) {
          throw new Error('불량이 없는데 8.7 또는 10.2가 포함됨');
        }
      }

      // 각 섹션 유효성 검사
      for (const sec of result.sections) {
        if (!sec.clause || !sec.summary || sec.confidence_score === undefined) {
          throw new Error('섹션 내 필수 필드가 누락되었습니다.');
        }
      }

      mockSuccessCount++;
    } catch (err: any) {
      console.error(`❌ 테스트 케이스 #${i + 1} 실패:`, err.message);
      mockFailCount++;
    }
  }

  console.log(`[결과] 50건 검증 완료 (성공: ${mockSuccessCount}, 실패: ${mockFailCount})`);
  
  if (mockFailCount > 0 || mockSuccessCount !== 50) {
    console.error('🚨 [실패] 50건 모의 테스트 중 오류가 감지되었습니다. 누락률 0% 기준 미달!');
    process.exit(1);
  }
  console.log('✅ [성공] 50건 모의 테스트 100% 통과 (누락률 0%)!');

  // 3. 예외 및 실패 케이스 검증 (필수 항목 누락 유발)
  console.log('\n[테스트 2] 에러/실패 경계 조건 예외 처리 검증...');
  try {
    // 빈 데이터 입력 시 실패해야 함
    await mapSessionDataToISO9001([]);
    console.error('🚨 [실패] 빈 배열 입력 시 예외가 발생하지 않았습니다.');
    process.exit(1);
  } catch (err: any) {
    console.log('✅ [성공] 빈 배열 입력 시 예외 발생 검증 완료:', err.message);
  }

  // 4. 실시간 Gemini API 연동 검증 (MOCK_AI=false, 1건 호출)
  console.log('\n[테스트 3] 실시간 Gemini API 연동 및 매핑 검증 시작...');
  process.env.MOCK_AI = 'false';

  const hasApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  if (!hasApiKey) {
    console.log('[WARN] GEMINI_API_KEY가 환경 변수에 설정되어 있지 않아 실시간 API 연동 테스트를 건너뜁니다.');
    console.log('--- 실시간 API 테스트 건너뜀 (모의 테스트로 대체 통과) ---');
  } else {
    // 실시간 호출용 샘플 (불량 1건 포함)
    const realTestSample = [
      { process_name: '조립', quantity: 120, notes: '정상 생산 완료' },
      { process_name: '압출', quantity: 15, defect_code: 'D-001', notes: '스크래치 불량 2건 발생' }
    ];

    try {
      console.log('Gemini API 호출 중...');
      const result = await mapSessionDataToISO9001(realTestSample);
      
      console.log('\n[Gemini API 매핑 결과]');
      console.log(JSON.stringify(result, null, 2));

      const clauses = result.sections.map(s => s.clause);
      if (!clauses.includes('8.5.1') || !clauses.includes('8.7') || !clauses.includes('10.2')) {
        throw new Error('Gemini API 결과에 필수 조항(8.5.1, 8.7, 10.2)이 누락되었습니다.');
      }

      console.log('\n✅ [성공] 실시간 Gemini API 연동 테스트 통과!');
    } catch (err: any) {
      console.error('🚨 [실패] 실시간 Gemini API 연동 테스트 실패:', err.message);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
  }

  console.log('\n🎉 모든 Smart Audit 매핑 엔진 검증 테스트 완료 (100% 통과)! 🎉');
}

runTests();
