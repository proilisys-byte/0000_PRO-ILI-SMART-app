/**
 * MFA (TOTP) 등록/검증 API — T4-003 / REQ-FUNC-026 (관리자 보호)
 *
 * GET    /api/v1/auth/mfa  – 현재 사용자의 MFA 상태 + 신규 시크릿 발급(otpauth url)
 * POST   /api/v1/auth/mfa  – { token } 검증 후 isMfaEnabled=true
 * DELETE /api/v1/auth/mfa  – MFA 비활성화 (Admin only)
 *
 * 본 단순 구현은 시크릿을 메모리 캐시에 보관합니다. 운영 환경에서는
 * 시크릿 해시를 별도 user_mfa 테이블에 저장하고 키 회전 정책을 적용해야 합니다.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { AppError, handleRouteError } from "@/lib/errors";
import { buildOtpauthUrl, generateBase32Secret, verifyTotp } from "@/lib/auth/totp";

const prisma = new PrismaClient();

const VerifySchema = z.object({
  token: z.string().regex(/^\d{6}$/),
  secret: z.string().min(8),
});

function requireUser(request: NextRequest) {
  const cookie = request.cookies.get("mock-user");
  if (!cookie?.value) {
    throw new AppError("AUTH_401_UNAUTHORIZED_ACCESS", "로그인이 필요합니다.", 401);
  }
  return JSON.parse(decodeURIComponent(cookie.value)) as {
    id: string;
    email: string;
    role: string;
    tenant_id: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = requireUser(request);
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    const secret = generateBase32Secret();
    return NextResponse.json({
      success: true,
      data: {
        isMfaEnabled: dbUser?.isMfaEnabled ?? false,
        secret,
        otpauthUrl: buildOtpauthUrl({
          issuer: "PRO-ALI-SMART",
          account: user.email,
          secret,
        }),
      },
    });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireUser(request);
    const body = await request.json().catch(() => ({}));
    const { token, secret } = VerifySchema.parse(body);

    if (!verifyTotp(secret, token)) {
      throw new AppError(
        "AUTH_401_UNAUTHORIZED_ACCESS",
        "TOTP 코드가 일치하지 않습니다.",
        401,
      );
    }

    await prisma.user.update({ where: { id: user.id }, data: { isMfaEnabled: true } });
    await prisma.auditLog.create({
      data: {
        tenantId: user.tenant_id,
        tableName: "users",
        recordId: user.id,
        action: "MFA_ENABLE",
        changedBy: user.id,
      },
    });

    return NextResponse.json({ success: true, data: { isMfaEnabled: true } });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = requireUser(request);
    if (user.role !== "admin" && user.role !== "system_admin") {
      throw new AppError("AUTH_403_FORBIDDEN_ACCESS", "관리자 권한이 필요합니다.", 403);
    }
    await prisma.user.update({ where: { id: user.id }, data: { isMfaEnabled: false } });
    await prisma.auditLog.create({
      data: {
        tenantId: user.tenant_id,
        tableName: "users",
        recordId: user.id,
        action: "MFA_DISABLE",
        changedBy: user.id,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
