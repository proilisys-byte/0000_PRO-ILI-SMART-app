import fs from 'fs';
import path from 'path';
import { generateNcDraft, validateDraftResults } from '../src/lib/nc/draft-generator';
import { ai } from '../src/ai/genkit';
import { z } from 'zod';

const datasetPath = path.resolve(__dirname, '..', 'data', 'golden', 'nc', 'nc-golden-dataset.json');

const JudgeOutputSchema = z.object({
  verdict: z.enum(['PASS', 'FAIL']).describe("최종 채점 판정 결과"),
  reason: z.string().describe("채점 사유 및 구체적 근거"),
});

async function evaluateNcDrafts() {
  console.log('🔍 [T2-003] AI NC 사유 분석 및 시정조치 초안 생성 파이프라인 평가 가동...');

  if (!fs.existsSync(datasetPath)) {
    console.error(`❌ 골든 데이터셋 파일을 찾을 수 없습니다: ${datasetPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(datasetPath, 'utf8');
  const dataset = JSON.parse(rawData);

  console.log(`📦 로드된 평가 대상 골든 데이터셋: 총 ${dataset.length} 건`);

  let passedCount = 0;
  const resultsTable: any[] = [];
  const startTime = Date.now();

  for (const item of dataset) {
    const itemStartTime = Date.now();
    console.log(`\n📋 [${item.id}] 비적합 사유 분석 중...`);
    console.log(`   - 입력 사유: "${item.nc_reason.substring(0, 60)}..."`);

    let draftOutput: any;
    try {
      draftOutput = await generateNcDraft(item.nc_reason);
    } catch (e: any) {
      console.error(`   ❌ 초안 생성 실패: ${e.message}`);
      resultsTable.push({
        id: item.id,
        category: item.category,
        verdict: 'FAIL',
        elapsed_ms: Date.now() - itemStartTime,
        reason: `엔진 에러: ${e.message}`,
      });
      continue;
    }

    let verdict: 'PASS' | 'FAIL' = 'FAIL';
    let judgeReason = '';

    // LLM-as-a-Judge 채점 로직 분기
    if (process.env.MOCK_AI === 'true') {
      // 1. Mock 모드: 정밀 정적 분석 규칙 판사 (Regex/키워드 분석)
      try {
        validateDraftResults(item.nc_reason, draftOutput);
        
        // expected_keywords 교차 매핑 검사 추가 검증
        const allText = (
          draftOutput.analysis.root_cause +
          ' ' +
          draftOutput.analysis.key_issues.join(' ') +
          ' ' +
          draftOutput.actions.map((a: any) => a.action_title + ' ' + a.rationale).join(' ')
        ).toLowerCase();

        const missingKeywords = item.expected_keywords.filter(
          (k: string) => !allText.includes(k.toLowerCase())
        );

        if (missingKeywords.length === 0) {
          verdict = 'PASS';
          judgeReason = `모의 가드 통과 및 기대 핵심 키워드(${item.expected_keywords.join(', ')})가 초안 내에 모두 정합성 있게 포함됨.`;
        } else {
          verdict = 'FAIL';
          judgeReason = `기대 키워드 누락 감지: [${missingKeywords.join(', ')}]`;
        }
      } catch (validationError: any) {
        verdict = 'FAIL';
        judgeReason = `비즈니스 규칙 검증 실패: ${validationError.message}`;
      }
    } else {
      // 2. Live 모드: Gemini 모델을 Judge로 가동하여 의미론적 채점 E2E
      try {
        const judgePrompt = `
귀하는 제조 현장의 ISO 9001 수석 심사원입니다.
비적합(NC) 사유 텍스트와 AI가 도출한 시정 조치 초안의 품질 정합성을 정량 채점해 주십시오.

[비적합(NC) 사유]
"${item.nc_reason}"

[기대 핵심 대응 키워드 목록]
${JSON.stringify(item.expected_keywords)}

[AI가 생성한 시정 조치 계획 초안]
${JSON.stringify(draftOutput, null, 2)}

[심사 및 채점 기준]
1. 비적합 원인 분석(analysis)이 비적합 사유의 근본적인 원인을 정확히 짚고 있는가?
2. 도출된 추천 시정 조치 목록(actions)이 문제의 재발 방지 대책으로 가치가 있는가?
3. 기대 핵심 대응 키워드(예: '교육', '센서', '표준서' 등)에 대응하는 실질적인 시정 액션이 누락되지 않고 반영되었는가?

위 기준을 바탕으로 최종 합격(PASS) 또는 불합격(FAIL) 여부를 가려 주십시오.
반드시 응답 양식(Zod 스키마)을 준수해 주세요.
`;

        const { output: judgeOutput } = await ai.generate({
          prompt: judgePrompt,
          output: { schema: JudgeOutputSchema },
        });

        if (judgeOutput) {
          verdict = judgeOutput.verdict;
          judgeReason = judgeOutput.reason;
        } else {
          verdict = 'FAIL';
          judgeReason = 'Judge LLM 응답을 파싱할 수 없습니다.';
        }
      } catch (judgeError: any) {
        verdict = 'FAIL';
        judgeReason = `Judge LLM 호출 에러: ${judgeError.message}`;
      }
    }

    const elapsed = Date.now() - itemStartTime;
    console.log(`   - 판정 결과: ${verdict === 'PASS' ? '✅ PASS' : '❌ FAIL'} (${elapsed}ms)`);
    console.log(`   - 심사 사유: ${judgeReason}`);

    if (verdict === 'PASS') {
      passedCount++;
    }

    resultsTable.push({
      id: item.id,
      category: item.category,
      verdict,
      elapsed_ms: elapsed,
      reason: judgeReason,
    });
  }

  const totalElapsed = Date.now() - startTime;
  const coverageScore = (passedCount / dataset.length) * 100;

  console.log('\n========================================================================');
  console.log('📊 [T2-003] AI NC 사유 분석 및 시정조치 초안 평가 최종 보고서');
  console.log('========================================================================');
  console.log(`- 전체 평가 건수: ${dataset.length} 건`);
  console.log(`- 합격 건수: ${passedCount} 건`);
  console.log(`- 시정 커버리지 점수: ${coverageScore.toFixed(2)} % (기준: >= 95.00%)`);
  console.log(`- 총 소요 시간: ${(totalElapsed / 1000).toFixed(2)} 초`);
  console.log('========================================================================');

  // 마크다운 형식 리포트 출력
  console.log('\n| ID | Category | Verdict | Elapsed (ms) | Judgment Reason |');
  console.log('| --- | --- | --- | --- | --- |');
  for (const r of resultsTable) {
    console.log(`| ${r.id} | ${r.category} | ${r.verdict === 'PASS' ? '✅ PASS' : '❌ FAIL'} | ${r.elapsed_ms} | ${r.reason} |`);
  }

  if (coverageScore >= 95) {
    console.log('\n🎉 [SUCCESS] AI NC 시정 조치 초안 생성 품질 게이트를 만족스럽게 통과했습니다.');
    process.exit(0);
  } else {
    console.error('\n🚨 [FATAL] AI NC 시정 조치 초안 생성 품질 게이트 기준(95%)에 미달했습니다. 배포를 차단합니다.');
    process.exit(1);
  }
}

evaluateNcDrafts();
