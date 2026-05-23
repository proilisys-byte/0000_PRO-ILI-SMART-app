/**
 * Auth 유틸리티 – Tenant Context 추출 및 RBAC 검증 헬퍼
 *
 * Supabase Auth가 없는 로컬 개발 환경에서도 작동하도록
 * Prisma DB 기반의 세션 모킹(Mock) 기능을 내장합니다.
 *
 * 운영 환경에서는 Supabase Auth JWT의 app_metadata에서
 * tenant_id와 role을 추출합니다.
 */
import { PrismaClient } from '@prisma/client';
import type { RoleId } from '@/lib/schemas/auth';
import { ROLES } from '@/lib/schemas/auth';

const prisma = new PrismaClient();

// ─── Tenant Context 타입 ────────────────────────────────
export interface TenantContext {
  userId: string;
  email: string;
  name: string | null;
  tenantId: string;
  roleId: RoleId;
  isMfaEnabled: boolean;
}

// ─── 로컬 개발용: Mock Tenant Context ───────────────────
/**
 * 로컬/테스트 환경에서 Supabase 없이도 인증 컨텍스트를 제공하기 위해
 * Prisma DB에서 직접 유저를 조회합니다.
 *
 * 운영 환경에서는 이 함수 대신 Supabase JWT 기반 헬퍼를 사용합니다.
 */
export async function getLocalTenantContext(
  email: string
): Promise<TenantContext | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: true, role: true },
  });

  if (!user) return null;

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    tenantId: user.tenantId,
    roleId: user.roleId as RoleId,
    isMfaEnabled: user.isMfaEnabled,
  };
}

// ─── RBAC 검증: 필요 역할 확인 ─────────────────────────
export function assertRole(
  ctx: TenantContext,
  requiredRoles: RoleId[]
): void {
  if (!requiredRoles.includes(ctx.roleId)) {
    const error = new Error('이 작업을 수행할 권한이 없습니다.');
    (error as any).code = 'ACCESS_DENIED';
    (error as any).status = 403;
    (error as any).details = {
      required_role: requiredRoles,
      current_role: ctx.roleId,
    };
    throw error;
  }
}

// ─── Tenant 경계 검증 ───────────────────────────────────
export function assertTenantBoundary(
  ctx: TenantContext,
  resourceTenantId: string
): void {
  if (ctx.tenantId !== resourceTenantId) {
    const error = new Error(
      'Cross-Tenant 접근이 차단되었습니다. 이 접근 시도는 보안 이벤트로 기록됩니다.'
    );
    (error as any).code = 'CROSS_TENANT_ACCESS_DENIED';
    (error as any).status = 403;
    throw error;
  }
}

// ─── Admin 전용 라우트 목록 ──────────────────────────────
export const ADMIN_ONLY_ROUTES = [
  '/dashboard/bulk-import',
  '/dashboard/nc',
  '/dashboard/copq',
  '/dashboard/settings',
  '/dashboard/admin',
];
