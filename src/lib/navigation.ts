/**
 * Figma SPA PageType → Next.js Route Path 매핑
 * REQ-FUNC-026 (RBAC), C-TEC-001 (App Router) 준수
 */
export const PAGE_TO_ROUTE: Record<string, string> = {
  home: '/',
  consultation: '/consultation',
  dashboard: '/dashboard',
  login: '/login',
  ncr: '/dashboard/ncr',
  rootcause: '/dashboard/rootcause',
  capa: '/dashboard/capa',
  eightd: '/dashboard/eightd',
  audit: '/dashboard/audit',
  improvement: '/dashboard/improvement',
  training: '/dashboard/training',
  'bulk-import': '/dashboard/bulk-import',
  'zero-ui-mobile': '/dashboard/zero-ui-mobile',
  nc: '/dashboard/nc',
  copq: '/dashboard/copq',
  admin: '/dashboard/admin',
};

export function pageToRoute(page: string): string {
  return PAGE_TO_ROUTE[page] ?? `/dashboard/${page}`;
}
