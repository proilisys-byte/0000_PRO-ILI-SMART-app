import { z } from 'zod';

export const SttOutputSchema = z.object({
  process_name: z
    .string()
    .describe('공정명 (예: 압출, 조립, 도색)'),
  quantity: z
    .number()
    .int()
    .describe('작업 수량 또는 불량 수량'),
  defect_code: z
    .string()
    .optional()
    .describe('불량 발생 시 코드명 (예: D-001)'),
  notes: z
    .string()
    .optional()
    .describe('기타 현장 작업자 특이사항 메모'),
});

export type SttOutput = z.infer<typeof SttOutputSchema>;
