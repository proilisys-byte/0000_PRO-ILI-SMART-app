/**
 * Audit Session Detail Route Handlers
 *
 * GET   /api/v1/audit/sessions/[id]  – 세션 상세 + 엔트리 조회
 * PATCH /api/v1/audit/sessions/[id]  – 상태 전이 (IN_PROGRESS → COMPLETED 등)
 *
 * REQ-FUNC-001/002, REQ-FUNC-025 (Insert-only audit log).
 */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AppError, handleRouteError } from "@/lib/errors";

const prisma = new PrismaClient();

const PatchSchema = z.object({
  status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

function requireAuth(request: NextRequest) {
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

async function loadSession(id: string, tenantId: string) {
  const session = await prisma.auditSession.findUnique({
    where: { id },
    include: { dataEntries: { orderBy: { createdAt: "asc" } } },
  });
  if (!session) {
    throw new AppError("RES_404_RESOURCE_NOT_FOUND", "세션을 찾을 수 없습니다.", 404);
  }
  if (session.tenantId !== tenantId) {
    throw new AppError(
      "AUTH_403_FORBIDDEN_ACCESS",
      "해당 테넌트의 세션에 접근 권한이 없습니다.",
      403,
    );
  }
  return session;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = requireAuth(request);
    const { id } = await context.params;
    const session = await loadSession(id, user.tenant_id);
    return NextResponse.json({ success: true, data: { session } });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = requireAuth(request);
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { status } = PatchSchema.parse(body);

    const existing = await loadSession(id, user.tenant_id);
    const updated = await prisma.auditSession.update({
      where: { id },
      data: {
        status,
        endTime: status === "COMPLETED" ? new Date() : existing.endTime,
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId: user.tenant_id,
        tableName: "audit_sessions",
        recordId: id,
        action: `STATUS_CHANGE_${status}`,
        changedBy: user.id,
        oldData: { status: existing.status },
        newData: { status: updated.status, endTime: updated.endTime },
      },
    });

    return NextResponse.json({ success: true, data: { session: updated } });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
