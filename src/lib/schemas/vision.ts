import { z } from 'zod';

export const VisionAnalysisSchema = z.object({
  analysis_type: z.literal('visual_inspection'),
  process_code: z.string(),
  detected_items: z.array(
    z.object({
      item_type: z.enum(['defect', 'measurement', 'work_status']),
      label: z.string(),
      location: z.string().describe('결함/객체의 화면 상 대략적 위치'),
      severity: z.enum(['critical', 'major', 'minor', 'ok']),
      measured_value: z
        .string()
        .optional()
        .describe('게이지나 디스플레이에서 읽을 수 있는 텍스트/숫자'),
      confidence_score: z.number().min(0).max(1.0),
    })
  ),
  overall_result: z.enum(['pass', 'fail', 'needs_review']),
  needs_review: z.boolean(),
  raw_description: z
    .string()
    .describe('이미지에 대한 AI의 전반적인 요약 설명 (내부 로깅용)'),
});

export type VisionAnalysis = z.infer<typeof VisionAnalysisSchema>;
