import { z } from 'zod';
import { ai } from '@/ai/genkit';

// 1. Audit Mapping Output Schema 정의 (Zod)
export const AuditMappingOutputSchema = z.object({
  sections: z.array(
    z.object({
      clause: z.string().describe('ISO 9001 조항 번호 (예: 8.5.1, 8.7, 10.2)'),
      summary: z.string().describe('해당 조항에 매핑된 데이터의 상세 분석 및 요약'),
      confidence_score: z
        .number()
        .int()
        .min(0)
        .max(100)
        .describe('매핑 신뢰도 점수 (0~100)'),
    })
  ),
});

export type AuditMappingOutput = z.infer<typeof AuditMappingOutputSchema>;

// 2. 핵심 매핑 함수 정의
export async function mapSessionDataToISO9001(
  rawData: any[]
): Promise<AuditMappingOutput> {
  // 입력 검증 (Null/Empty 체크)
  if (!rawData || rawData.length === 0) {
    throw new Error('Input raw data is empty');
  }

  // 필수 조항 매핑 누락 방지 규칙 수립 (If-Then)
  // - 기본적으로 모든 데이터 입력 건은 8.5.1(생산 제어) 매핑 대상
  // - 불량 데이터가 포함된 경우 8.7(부적합 제어) 및 10.2(시정조치) 조항 필수 포함
  const hasDefects = rawData.some(
    (entry) =>
      entry.defect_code !== undefined &&
      entry.defect_code !== null &&
      entry.defect_code !== ''
  );

  const requiredClauses = new Set<string>(['8.5.1']);
  if (hasDefects) {
    requiredClauses.add('8.7');
    requiredClauses.add('10.2');
  }

  // 모의 AI 엔진 모드 지원 (Rate Limit 및 속도 극복용)
  if (process.env.MOCK_AI === 'true') {
    return generateMockMapping(rawData, requiredClauses);
  }

  const promptText = `
다음 제조 현장의 작업 수집 데이터를 ISO 9001 품질 경영 시스템 규격에 맞춰 매핑하고 요약해 주세요.

[수집 데이터]
${JSON.stringify(rawData, null, 2)}

[ISO 9001 필수 조항 가이드]
- 8.5.1 (생산 및 서비스 제공 제어): 정상 생산 공정 및 작업 수량 기록 매핑
- 8.7 (부적합 출력 제어): 공정 중 발생한 불량 현상 및 수량 제어 기록 매핑 (불량 데이터가 존재하는 경우 필수)
- 10.2 (부적합 및 시정조치): 불량 원인 분석 및 시정 조치 프로세스 연계 매핑 (불량 데이터가 존재하는 경우 필수)

[규칙]
1. 반드시 입력 데이터 내의 모든 항목을 해당 조항으로 분류하고 분석 요약해야 합니다.
2. 각 매핑 결과는 요약(summary)과 매핑 신뢰도 점수(confidence_score, 0~100)를 포함해야 합니다.
3. confidence_score는 LLM이 스스로 추론 과정(Chain of Thought)을 통해 판단한 매핑 신뢰도 점수입니다.
`;

  try {
    const { output } = await ai.generate({
      prompt: promptText,
      output: { schema: AuditMappingOutputSchema },
    });

    if (!output || !output.sections || output.sections.length === 0) {
      throw new Error('AI mapping failed to generate sections');
    }

    // AI 결과물 후검증 (누락률 0% 및 필수 항목 누락 방지 규칙)
    validateMappingResults(output, requiredClauses);

    return output;
  } catch (error: any) {
    console.error('AI Mapping Engine Error:', error.message);
    throw error;
  }
}

// 3. 매핑 결과 유효성 후검증 함수 (필수 조항 및 Null 체크)
function validateMappingResults(
  output: AuditMappingOutput,
  requiredClauses: Set<string>
) {
  const mappedClauses = new Set(output.sections.map((s) => s.clause));

  // 필수 조항 누락 체크
  for (const reqClause of requiredClauses) {
    if (!mappedClauses.has(reqClause)) {
      throw new Error(
        `[VALIDATION_FAILED] Mandatory ISO 9001 clause ${reqClause} is missing in mapping results`
      );
    }
  }

  // 필드 null 체크
  for (const sec of output.sections) {
    if (
      !sec.clause ||
      !sec.summary ||
      sec.confidence_score === undefined ||
      sec.confidence_score === null
    ) {
      throw new Error(
        '[VALIDATION_FAILED] One or more required fields in mapped sections are null or missing'
      );
    }
  }
}

// 4. 고품질 로컬 모의 매핑 생성기 (규칙 기반)
function generateMockMapping(
  rawData: any[],
  requiredClauses: Set<string>
): AuditMappingOutput {
  const sections: { clause: string; summary: string; confidence_score: number }[] = [];

  // 8.5.1 생산 제어 요약 생성
  if (requiredClauses.has('8.5.1')) {
    const totalQty = rawData.reduce((sum, entry) => sum + (entry.quantity || 0), 0);
    const uniqueProcesses = Array.from(
      new Set(rawData.map((entry) => entry.process_name))
    ).join(', ');

    sections.push({
      clause: '8.5.1',
      summary: `제조 현장의 ${uniqueProcesses} 공정에서 수집된 총 ${totalQty}건의 정상 생산 실적을 반영하여 제품 및 서비스 제공 과정을 정상 제어 및 기록 완료함.`,
      confidence_score: 98,
    });
  }

  // 불량 데이터 발췌
  const defectEntries = rawData.filter(
    (entry) =>
      entry.defect_code !== undefined &&
      entry.defect_code !== null &&
      entry.defect_code !== ''
  );

  // 8.7 부적합 출력 제어 요약 생성
  if (requiredClauses.has('8.7') && defectEntries.length > 0) {
    const defectDetails = defectEntries
      .map((entry) => `${entry.process_name} 공정(${entry.defect_code})`)
      .join(', ');

    sections.push({
      clause: '8.7',
      summary: `점검 결과 ${defectDetails}에서 불합격품(부적합 출력)이 발생하여 식별 표시 및 격리 조치 대상(Clause 8.7.1)으로 즉각 플래깅하고 기록함.`,
      confidence_score: 95,
    });
  }

  // 10.2 부적합 및 시정조치 요약 생성
  if (requiredClauses.has('10.2') && defectEntries.length > 0) {
    const defectCount = defectEntries.length;

    sections.push({
      clause: '10.2',
      summary: `식별된 ${defectCount}건의 불량 사건에 대하여 근본 원인 분석을 지시하였으며, 향후 동일 문제 재발 방지를 위한 시정 조치 계획(Corrective Action) 및 교육 프로세스를 수립할 것을 요구함.`,
      confidence_score: 92,
    });
  }

  const result = { sections };

  // 스키마/필수 검증 재수행하여 검증 모듈 정합성 유지
  validateMappingResults(result, requiredClauses);

  return result;
}
