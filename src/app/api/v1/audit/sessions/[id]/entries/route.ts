/**
 * Audit Session Entries Route Handlers
 *
 * POST /api/v1/audit/sessions/[id]/entries – 엔트리 추가
 *   - rawData: STT 결과 또는 수동 입력
 *   - mappedData: optional, mapping engine 통과 후 페이로드
 *
 * REQ-FUNC-011 (Zero-UI 음성 수집), REQ-FUNC-002 (매핑 결과 저장).
 */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AppError, handleRouteError } from "@/lib/errors";

const prisma = new PrismaClient();

const EntrySchema = z.object({
  rawData: z.record(z.unknown()),
  mappedData: z.record(z.unknown()).optional(),
});

function requireAuth(request: NextRequest) {
  const cookie = request.cookies.get("mock-user");
  if (!cookie?.value) {
    throw new AppError("AUTH_401_UNAUTHORIZED_ACCESS", "로그인이 필요합니다.", 401);
  }
  return JSON.parse(decodeURIComponent(cookie.value)) as {
    id: string;
    tenant_id: string;
  };
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = requireAuth(request);
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { rawData, mappedData } = EntrySchema.parse(body);

    const session = await prisma.auditSession.findUnique({ where: { id } });
    if (!session) {
      throw new AppError("RES_404_RESOURCE_NOT_FOUND", "세션을 찾을 수 없습니다.", 404);
    }
    if (session.tenantId !== user.tenant_id) {
      throw new AppError(
        "AUTH_403_FORBIDDEN_ACCESS",
        "해당 테넌트의 세션에 접근 권한이 없습니다.",
        403,
      );
    }
    if (session.status !== "IN_PROGRESS") {
      throw new AppError(
        "VAL_400_VALIDATION_FAILED",
        "진행 중인 세션에만 엔트리를 추가할 수 있습니다.",
        400,
      );
    }

    const entry = await prisma.auditDataEntry.create({
      data: {
        sessionId: id,
        rawData: rawData as object,
        mappedData: mappedData as object | undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId: user.tenant_id,
        tableName: "audit_data_entries",
        recordId: entry.id,
        action: "CREATE",
        changedBy: user.id,
        newData: { sessionId: id, hasMappedData: Boolean(mappedData) },
      },
    });

    return NextResponse.json({ success: true, data: { entry } }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
