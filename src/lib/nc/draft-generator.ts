import { ai } from '@/ai/genkit';
import { NcDraftOutputSchema, NcDraftOutput } from '../schemas/nc';

// 1. 핵심 초안 생성 함수 정의
export async function generateNcDraft(ncReasonText: string): Promise<NcDraftOutput> {
  if (!ncReasonText || ncReasonText.trim() === '') {
    throw new Error('비적합(NC) 사유 입력값이 유효하지 않습니다.');
  }

  // 모의 AI 엔진 모드 지원 (Rate Limit 및 속도 극복용)
  if (process.env.MOCK_AI === 'true') {
    return generateMockDraft(ncReasonText);
  }

  const promptText = `
귀하는 제조 공장의 품질 경영 전문가이자 ISO 9001 심사원입니다.
다음 제조 현장의 비적합(NC) 사유를 정밀 분석하여 근본 원인(root cause)을 진단하고, 이에 완벽히 대응하여 재발을 원천 차단하는 시정 조치(Corrective Actions) 계획서 초안을 자동으로 작성해 주세요.

[비적합(NC) 사유 텍스트]
"${ncReasonText}"

[ISO 9001 기반 대응 가이드라인 및 필수 포함 규칙]
1. 원청사나 심사원이 지시한 핵심 시정 사항(예: 교육, 표준서 개정, 설비 점검 등)을 절대 파싱 단계에서 누락하지 마십시오.
2. 입력 비적합 사유 텍스트에 "온도", "센서", "설비"가 포함되어 있다면 추천 시정 조치에 반드시 '설비 점검', '센서 보정', '교체', 또는 '온도 보정' 등 설비 하드웨어적 개선 액션이 포함되어야 합니다.
3. 입력 비적합 사유 텍스트에 "교육", "미숙", "작업자"가 포함되어 있다면 추천 시정 조치에 반드시 '작업자 교육', '검증 훈련', '가이드라인 전파' 등 인적 교육 액션이 포함되어야 합니다.
4. 입력 비적합 사유 텍스트에 "표준", "절차", "매뉴얼"이 포함되어 있다면 추천 시정 조치에 반드시 '작업 표준서 개정', '절차서 반영', '업데이트' 등 제도적/시스템적 개정 액션이 포함되어야 합니다.

[작성 규칙]
- analysis: 비적합 사유 분석 및 핵심 쟁점 리스트
- actions: 추천되는 시정 조치 목록 (조치 제목, 추천 담당자/부서, 완료 기한(일수), 도출 근거 필수 포함)
`;

  try {
    const { output } = await ai.generate({
      prompt: promptText,
      output: { schema: NcDraftOutputSchema },
    });

    if (!output) {
      throw new Error('AI failed to generate NC draft');
    }

    // AI 생성물 비즈니스 룰 후검증 (누락률 0% 보장)
    validateDraftResults(ncReasonText, output);

    return output;
  } catch (error: any) {
    console.error('AI NC Draft Engine Error:', error.message);
    throw error;
  }
}

// 2. 비즈니스 룰 기반 사후 검증 함수 (누락 차단)
export function validateDraftResults(ncReasonText: string, output: NcDraftOutput) {
  const lowercaseReason = ncReasonText.toLowerCase();

  // Rule 1: 설비/센서/온도 관련 원인에 대비한 조치 필수 포함
  if (lowercaseReason.includes('온도') || lowercaseReason.includes('센서') || lowercaseReason.includes('설비')) {
    const hasHardwareAction = output.actions.some(a => 
      a.action_title.includes('설비') || 
      a.action_title.includes('센서') || 
      a.action_title.includes('온도') || 
      a.action_title.includes('점검') || 
      a.action_title.includes('교체') ||
      a.action_title.includes('장치') ||
      a.action_title.includes('수리')
    );
    if (!hasHardwareAction) {
      throw new Error('[VALIDATION_FAILED] 설비/센서/온도 관련 비적합 원인에 대응하는 점검/개선 조치가 누락되었습니다.');
    }
  }

  // Rule 2: 교육/미숙/작업자 관련 원인에 대비한 조치 필수 포함
  if (lowercaseReason.includes('교육') || lowercaseReason.includes('미숙') || lowercaseReason.includes('작업자')) {
    const hasHumanAction = output.actions.some(a => 
      a.action_title.includes('교육') || 
      a.action_title.includes('훈련') || 
      a.action_title.includes('숙지') || 
      a.action_title.includes('지도') || 
      a.action_title.includes('가이드') ||
      a.action_title.includes('재교육')
    );
    if (!hasHumanAction) {
      throw new Error('[VALIDATION_FAILED] 작업자/교육 관련 비적합 원인에 대응하는 훈련/재교육 조치가 누락되었습니다.');
    }
  }

  // Rule 3: 표준/절차/매뉴얼 관련 원인에 대비한 조치 필수 포함
  if (lowercaseReason.includes('표준') || lowercaseReason.includes('절차') || lowercaseReason.includes('매뉴얼')) {
    const hasProcessAction = output.actions.some(a => 
      a.action_title.includes('표준') || 
      a.action_title.includes('절차') || 
      a.action_title.includes('매뉴얼') || 
      a.action_title.includes('개정') || 
      a.action_title.includes('업데이트') ||
      a.action_title.includes('반영')
    );
    if (!hasProcessAction) {
      throw new Error('[VALIDATION_FAILED] 표준/절차 관련 비적합 원인에 대응하는 표준서 개정/업데이트 조치가 누락되었습니다.');
    }
  }
}

// 3. 고품질 로컬 모의 초안 생성기
function generateMockDraft(ncReasonText: string): NcDraftOutput {
  const lowercaseReason = ncReasonText.toLowerCase();
  const actions: any[] = [];
  const key_issues: string[] = [];
  let root_cause = '';

  // 1. 하드웨어/설비/센서/온도/장치 관련 분기 및 키워드 풍부화
  if (
    lowercaseReason.includes('온도') || 
    lowercaseReason.includes('센서') || 
    lowercaseReason.includes('설비') ||
    lowercaseReason.includes('장치') ||
    lowercaseReason.includes('수리') ||
    lowercaseReason.includes('교체') ||
    lowercaseReason.includes('점검')
  ) {
    root_cause += '설비 부품 노후화 및 제어 센서/장치 오작동으로 인한 비정상 구동. ';
    key_issues.push('핵심 제어 장치 및 센서의 주기적인 검교정 및 점검 프로세스 누락');
    actions.push({
      action_title: '설비/장치 긴급 점검 및 고장 센서 수리/교체',
      assignee: '설비보전팀',
      due_days: 7,
      rationale: '센서 및 제어 장치의 온도/속도/압력 저하 재발을 방지하기 위해 노후 부품 수리 및 교체 점검 필수'
    });
  }

  // 2. 인적/교육/작업자/훈련/미숙 관련 분기 및 키워드 풍부화
  if (
    lowercaseReason.includes('교육') || 
    lowercaseReason.includes('미숙') || 
    lowercaseReason.includes('작업자') ||
    lowercaseReason.includes('훈련')
  ) {
    root_cause += '신입/대체 작업자의 공정 숙련도 부족 및 기량 미숙. ';
    key_issues.push('현장 작업 투입 전 필수 직무 교육 및 기량 검증 절차 미흡');
    actions.push({
      action_title: '현장 작업자 대상 특별 직무 교육 및 기량 훈련 실시',
      assignee: '품질관리부',
      due_days: 14,
      rationale: '작업자 실수 및 미숙으로 인한 부적합을 방지하기 위한 정기 교육 및 훈련 가이드 전파 필요'
    });
  }

  // 3. 프로세스/표준/절차/매뉴얼/개정 관련 분기 및 키워드 풍부화
  if (
    lowercaseReason.includes('표준') || 
    lowercaseReason.includes('절차') || 
    lowercaseReason.includes('매뉴얼') ||
    lowercaseReason.includes('개정')
  ) {
    root_cause += '현행 작업 표준서 및 업무 절차서의 최신 개정 사항 반영 누락. ';
    key_issues.push('개정된 표준 절차의 작업대 실시간 배포 및 문서 관리 체계 미흡');
    actions.push({
      action_title: '작업 표준서 및 공정 절차서 개정/업데이트',
      assignee: '생산기술팀',
      due_days: 5,
      rationale: '최신 개정 표준을 일치시키고 부적합 절차 위반을 차단하기 위한 표준서 절차서 업데이트 필수'
    });
  }

  // 기본 폴백
  if (actions.length === 0) {
    root_cause = '식별된 공정 및 원인 파악의 어려움으로 인한 추가 상세 조사 필요.';
    key_issues.push('원인 규명을 위한 원인 분석 회의 소집');
    actions.push({
      action_title: '품질 분석 및 시정 조치 대책 회의',
      assignee: '품질보증부',
      due_days: 3,
      rationale: '비적합 원인 규명 및 추가 조치를 설정하기 위한 협의 체계 가동'
    });
  }

  const result = {
    analysis: {
      root_cause,
      key_issues
    },
    actions
  };

  // 모의 데이터 역시 비즈니스 룰 검증을 통과하도록 보장
  validateDraftResults(ncReasonText, result);

  return result;
}
