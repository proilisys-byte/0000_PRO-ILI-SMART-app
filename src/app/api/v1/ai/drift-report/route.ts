/**
 * POST /api/v1/ai/drift-report — T3-005 / REQ-FUNC-AI-005
 *
 * Body: { samples: { groupId: string, metricValue: number, sampleSize: number }[],
 *         baseline?: number, thresholdPct?: number }
 *
 * - 하위 그룹 편차 5%p 초과 시 알림 트리거
 * - audit_log 에 결과 Insert
 */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AppError, handleRouteError } from "@/lib/errors";
import { detectDrift, postAlert } from "@/lib/ai-governance/drift-detector";

const prisma = new PrismaClient();

const Schema = z.object({
  samples: z
    .array(
      z.object({
        groupId: z.string(),
        metricValue: z.number().min(0).max(1),
        sampleSize: z.number().int().nonnegative(),
      }),
    )
    .min(1),
  baseline: z.number().min(0).max(1).optional(),
  thresholdPct: z.number().min(0).max(100).optional(),
});

function requireUser(request: NextRequest) {
  const cookie = request.cookies.get("mock-user");
  if (!cookie?.value) {
    throw new AppError("AUTH_401_UNAUTHORIZED_ACCESS", "로그인이 필요합니다.", 401);
  }
  return JSON.parse(decodeURIComponent(cookie.value)) as {
    id: string;
    role: string;
    tenant_id: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const user = requireUser(request);
    if (user.role !== "admin" && user.role !== "system_admin") {
      throw new AppError(
        "AUTH_403_FORBIDDEN_ACCESS",
        "Drift 보고는 관리자 권한이 필요합니다.",
        403,
      );
    }
    const body = await request.json().catch(() => ({}));
    const parsed = Schema.parse(body);

    const report = detectDrift(parsed.samples, {
      thresholdPct: parsed.thresholdPct,
      baseline: parsed.baseline,
    });

    const alert = await postAlert(report);
    const finalReport = {
      ...report,
      alertedAt: alert.ok && report.triggered.length > 0 ? new Date().toISOString() : undefined,
    };

    await prisma.auditLog.create({
      data: {
        tenantId: user.tenant_id,
        tableName: "ai_model_registry",
        recordId: "drift-report",
        action: "DRIFT_REPORT",
        changedBy: user.id,
        newData: { report: finalReport, alert } as object,
      },
    });

    return NextResponse.json({ success: true, data: { report: finalReport, alert } });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
