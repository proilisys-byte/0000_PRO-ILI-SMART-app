import { z } from 'zod';

export const NcDraftOutputSchema = z.object({
  analysis: z.object({
    root_cause: z.string().describe("비적합 원인 분석 및 규명된 근본 원인"),
    key_issues: z.array(z.string()).describe("핵심 분석 쟁점 및 포인트 리스트"),
  }),
  actions: z.array(
    z.object({
      action_title: z.string().describe("구체적이고 실천적인 시정 조치 계획 권장 사항"),
      assignee: z.string().describe("권장 담당 부서 혹은 담당자 유형 (예: 품질관리부, 설비보전팀, 조립공정 작업자 등)"),
      due_days: z.number().int().min(1).describe("권장 조치 완료 기한 일수"),
      rationale: z.string().describe("해당 시정 조치를 도출한 규격적/프로세스적 합리적 근거"),
    })
  ).describe("추천 시정 조치(Corrective Actions) 목록"),
});

export type NcDraftOutput = z.infer<typeof NcDraftOutputSchema>;
