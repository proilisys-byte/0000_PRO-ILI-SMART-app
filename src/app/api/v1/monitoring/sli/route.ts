/**
 * GET /api/v1/monitoring/sli — T4-001 SLI 집계
 *
 * 최근 24시간의 audit_log 기반 운영 지표 노출:
 *  - error_rate: ERROR/WARN 비율
 *  - audit_session_throughput
 *  - bulk_import_failure_rate
 *
 * REQ-NF-001 / NFR-MON-003.
 */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AppError, handleRouteError } from "@/lib/errors";

const prisma = new PrismaClient();

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

export async function GET(request: NextRequest) {
  try {
    const user = requireUser(request);
    if (user.role !== "admin" && user.role !== "system_admin") {
      throw new AppError("AUTH_403_FORBIDDEN_ACCESS", "관리자 권한이 필요합니다.", 403);
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [auditLogCount, errorActions, sessionsCount, importsTotal, importsFailed] = await Promise.all([
      prisma.auditLog.count({ where: { tenantId: user.tenant_id, createdAt: { gte: since } } }),
      prisma.auditLog.count({
        where: {
          tenantId: user.tenant_id,
          createdAt: { gte: since },
          action: { contains: "ERROR" },
        },
      }),
      prisma.auditSession.count({ where: { tenantId: user.tenant_id, startTime: { gte: since } } }),
      prisma.bulkImportBatch.count({ where: { tenantId: user.tenant_id, createdAt: { gte: since } } }),
      prisma.bulkImportBatch.count({
        where: { tenantId: user.tenant_id, createdAt: { gte: since }, status: "FAILED" },
      }),
    ]);

    const errorRate = auditLogCount > 0 ? errorActions / auditLogCount : 0;
    const importFailureRate = importsTotal > 0 ? importsFailed / importsTotal : 0;

    return NextResponse.json({
      success: true,
      data: {
        windowHours: 24,
        sli: {
          audit_log_count_24h: auditLogCount,
          error_rate_24h: errorRate,
          audit_sessions_24h: sessionsCount,
          bulk_imports_24h: importsTotal,
          bulk_import_failure_rate_24h: importFailureRate,
        },
        slo: {
          error_rate_threshold: 0.01,
          breached: errorRate > 0.01 || importFailureRate > 0.05,
        },
      },
    });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
