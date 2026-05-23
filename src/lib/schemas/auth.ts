import { z } from 'zod';

// ─── Login ────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
});
export type LoginRequest = z.infer<typeof LoginSchema>;

// ─── Role Definitions ─────────────────────────────────
export const ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  TENANT_ADMIN: 'admin',
  SITE_USER: 'user',
} as const;

export type RoleId = (typeof ROLES)[keyof typeof ROLES];
