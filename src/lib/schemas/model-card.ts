import { z } from 'zod';

export const ModelCardSchema = z.object({
  model_name: z.string().describe("모델 명칭"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).describe("모델 시맨틱 버전"),
  provider: z.literal('google').describe("모델 제공자"),
  model_id: z.string().describe("모델 식별 ID"),
  intended_use: z.string().describe("의도된 사용 용도"),
  training_data_summary: z.string().optional().describe("학습 및 검증 데이터 개요"),
  performance_metrics: z.object({
    stt_accuracy: z.number().min(0).max(1).describe("STT 오디오 추출 정확도"),
    mapping_f1_score: z.number().min(0).max(1).describe("ISO 9001 매핑 F1-Score"),
    vision_f1_score: z.number().min(0).max(1).optional().describe("Vision AI 분석 F1-Score"),
  }),
  last_evaluated: z.string().datetime().describe("최종 품질 평가 일시"),
  approved_by: z.string().optional().describe("Human-in-the-Loop 최종 승인자"),
});

export type ModelCard = z.infer<typeof ModelCardSchema>;
