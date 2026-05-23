/**
 * Auth API Route Handlers
 *
 * POST /api/auth/login  – 로그인 (이메일/비밀번호 검증)
 * POST /api/auth/logout – 로그아웃 (쿠키 삭제)
 * GET  /api/auth/me     – 현재 유저 프로필 조회
 *
 * 로컬 개발 환경: Prisma DB 기반 Mock 인증
 * 운영 환경: Supabase Auth 연동 (TODO)
 */
import { NextRequest, NextResponse } from 'next/server';
import { LoginSchema } from '@/lib/schemas/auth';
import { handleRouteError, AppError } from '@/lib/errors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── POST /api/auth/login ───────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = LoginSchema.parse(body);

    // 로컬 개발용 Mock 인증: DB에서 이메일로 유저 조회
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true, role: true },
    });

    if (!user) {
      throw new AppError(
        'AUTH_401_UNAUTHORIZED_ACCESS',
        '이메일 또는 비밀번호가 일치하지 않습니다.',
        401
      );
    }

    // 쿠키에 mock user 정보 저장
    const mockUserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roleId,
      tenant_id: user.tenantId,
    };

    const response = NextResponse.json({
      success: true,
      data: {
        user: mockUserPayload,
      },
    });

    response.cookies.set('mock-user', JSON.stringify(mockUserPayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8시간
    });

    return response;
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}

// ─── DELETE /api/auth/login (로그아웃) ───────────────────
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('mock-user');
  return response;
}

// ─── GET /api/auth/login (현재 유저 조회 – /me) ─────────
export async function GET(request: NextRequest) {
  try {
    const mockUserCookie = request.cookies.get('mock-user');

    if (!mockUserCookie?.value) {
      throw new AppError(
        'AUTH_401_UNAUTHORIZED_ACCESS',
        '로그인이 필요합니다.',
        401
      );
    }

    const mockUser = JSON.parse(mockUserCookie.value);

    return NextResponse.json({
      success: true,
      data: { user: mockUser },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
