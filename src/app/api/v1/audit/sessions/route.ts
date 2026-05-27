/**
 * Audit Sessions Route Handlers
 *
 * GET  /api/v1/audit/sessions  – 세션 목록 조회 (테넌트 격리)
 * POST /api/v1/audit/sessions  – 새 세션 생성
 *
 * REQ-FUNC-001/002 (Smart Audit), REQ-FUNC-024/025 (Audit Log) 준수.
 * Insert-only 정책에 따라 세션 변경 이력은 audit_log 에 기록됩니다.
 */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AppError, handleRouteError } from "@/lib/errors";

const prisma = new PrismaClient();

function requireAuth(request: NextRequest) {
  const cookie = request.cookies.get("mock-user");
  if (!cookie?.value) {
    throw new AppError(
      "AUTH_401_UNAUTHORIZED_ACCESS",
      "로그인이 필요합니다.",
      401,
    );
  }
  try {
    const user = JSON.parse(decodeURIComponent(cookie.value));
    if (!user?.id || !user?.tenant_id) {
      throw new Error("invalid cookie");
    }
    return user as {
      id: string;
      email: string;
      role: string;
      tenant_id: string;
    };
  } catch {
    throw new AppError(
      "AUTH_401_UNAUTHORIZED_ACCESS",
      "세션이 유효하지 않습니다.",
      401,
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const sessions = await prisma.auditSession.findMany({
      where: { tenantId: user.tenant_id },
      orderBy: { startTime: "desc" },
      take: 50,
      include: {
        _count: { select: { dataEntries: true } },
      },
    });
    return NextResponse.json({
      success: true,
      data: { sessions },
    });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const session = await prisma.auditSession.create({
      data: {
        tenantId: user.tenant_id,
        userId: user.id,
        status: "IN_PROGRESS",
      },
    });
    await prisma.auditLog.create({
      data: {
        tenantId: user.tenant_id,
        tableName: "audit_sessions",
        recordId: session.id,
        action: "CREATE",
        changedBy: user.id,
        newData: { status: session.status, startTime: session.startTime },
      },
    });
    return NextResponse.json({ success: true, data: { session } }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
