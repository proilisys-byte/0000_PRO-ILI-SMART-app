import { z } from 'zod';
import { CONSENT_TYPES } from '@/lib/consent/constants';

const consentTypeValues = [
  CONSENT_TYPES.PIPA_VOICE,
  CONSENT_TYPES.PIPA_LOCATION,
  CONSENT_TYPES.PIPA_WORK_RECORD,
] as const;

export const ConsentItemSchema = z.object({
  consent_type: z.enum(consentTypeValues),
  consent_version: z.string().min(1, '동의서 버전(consent_version)은 필수입니다.'),
  is_agreed: z.boolean(),
});

export const SignupSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  name: z.string().min(1, '이름은 필수입니다.'),
  tenant_id: z.string().uuid('유효한 tenant_id가 필요합니다.'),
  consents: z
    .array(ConsentItemSchema)
    .min(1, '최소 1개 이상의 동의 항목이 필요합니다.'),
  device_fingerprint: z.string().optional(),
});

export type ConsentItem = z.infer<typeof ConsentItemSchema>;
export type SignupRequest = z.infer<typeof SignupSchema>;
