/**
 * NC Cases — 부적합 사례 CRUD
 *
 * GET  /api/v1/nc/cases  – 목록
 * POST /api/v1/nc/cases  – 생성 (beforeHash 자동 산출)
 *
 * REQ-FUNC-006/009 (NC 시정), REQ-FUNC-025 (Insert-only audit log).
 */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AppError, handleRouteError } from "@/lib/errors";
import { hashPayload } from "@/lib/integrity/hash";

const prisma = new PrismaClient();

const CreateSchema = z.object({
  title: z.string().min(1),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  rawReason: z.string().optional(),
  draftPayload: z.record(z.unknown()).optional(),
});

function requireUser(request: NextRequest) {
  const cookie = request.cookies.get("mock-user");
  if (!cookie?.value) {
    throw new AppError("AUTH_401_UNAUTHORIZED_ACCESS", "로그인이 필요합니다.", 401);
  }
  return JSON.parse(decodeURIComponent(cookie.value)) as {
    id: string;
    tenant_id: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = requireUser(request);
    const cases = await prisma.ncCase.findMany({
      where: { tenantId: user.tenant_id },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { actions: true },
    });
    return NextResponse.json({ success: true, data: { cases } });
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
    const parsed = CreateSchema.parse(body);

    const beforeHash = parsed.draftPayload ? hashPayload(parsed.draftPayload) : null;

    const created = await prisma.ncCase.create({
      data: {
        tenantId: user.tenant_id,
        reportedBy: user.id,
        title: parsed.title,
        severity: parsed.severity,
        rawReason: parsed.rawReason,
        draftPayload: parsed.draftPayload as object | undefined,
        beforeHash,
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId: user.tenant_id,
        tableName: "nc_cases",
        recordId: created.id,
        action: "CREATE",
        changedBy: user.id,
        newData: { title: created.title, severity: created.severity, beforeHash },
      },
    });

    return NextResponse.json({ success: true, data: { case: created } }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
