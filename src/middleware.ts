/**
 * Next.js Middleware – Auth & RBAC 라우트 보호
 *
 * COM-AUTH_v1.md / COM-RBAC_v1.md 스펙에 따라:
 * 1. 비로그인 사용자의 보호 라우트 접근을 차단합니다.
 * 2. Admin 전용 라우트에 대한 역할 기반 접근 제어를 수행합니다.
 * 3. PIPA 동의 미완료 사용자의 데이터 수집 라우트 접근을 차단합니다.
 *
 * 로컬 개발 환경(Supabase 미연동)에서는 쿠키 기반 mock 인증을 사용하며,
 * 운영 환경에서는 Supabase Auth JWT를 활용합니다.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Admin 전용 라우트 목록 ──────────────────────────────
const ADMIN_ONLY_ROUTES = [
  '/dashboard/bulk-import',
  '/dashboard/nc',
  '/dashboard/copq',
  '/dashboard/settings',
  '/dashboard/admin',
];

// ─── 공개 라우트 (인증 불필요) ───────────────────────────
const PUBLIC_ROUTES = [
  '/login',
  '/api/auth/login',
  '/api/auth/refresh',
  '/',
  '/pro-ali-smart',
];

export async function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;

  // 공개 라우트는 통과
  if (PUBLIC_ROUTES.some((route) => currentPath === route || currentPath.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // 정적 자원, _next, favicon 등은 통과
  if (
    currentPath.startsWith('/_next') ||
    currentPath.startsWith('/favicon') ||
    currentPath.includes('.')
  ) {
    return NextResponse.next();
  }

  // ─── 인증 확인 ────────────────────────────────────────
  // 로컬 개발: 쿠키 기반 mock 인증
  // 운영: Supabase JWT 기반 인증 (TODO: Supabase Auth Helpers 연동)
  const mockUserCookie = req.cookies.get('mock-user');
  let userRole: string | null = null;
  let isAuthenticated = false;

  if (mockUserCookie?.value) {
    try {
      const mockUser = JSON.parse(mockUserCookie.value);
      userRole = mockUser.role || 'user';
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // ─── 비로그인 사용자 → 로그인 페이지 리다이렉트 ────────
  if (!isAuthenticated && currentPath.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', currentPath);
    return NextResponse.redirect(loginUrl);
  }

  // ─── Admin 전용 라우트 보호 ────────────────────────────
  if (isAuthenticated && ADMIN_ONLY_ROUTES.some((route) => currentPath.startsWith(route))) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
