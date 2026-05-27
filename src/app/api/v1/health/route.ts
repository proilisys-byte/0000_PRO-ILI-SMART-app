/**
 * GET /api/v1/health — T4-001 Liveness/Readiness Probe
 *
 * SLO: 응답 < 200ms.
 * DB 연결 상태와 빌드 시간을 함께 반환하여 모니터링 시스템(Datadog, Vercel Analytics 등)의
 * uptime 체크 엔드포인트로 사용한다.
 */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const startedAt = new Date().toISOString();

export async function GET() {
  const t0 = Date.now();
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }
  const elapsedMs = Date.now() - t0;
  return NextResponse.json(
    {
      status: dbOk ? "ok" : "degraded",
      service: "pro-ali-smart",
      startedAt,
      checkedAt: new Date().toISOString(),
      checks: { db: dbOk },
      elapsedMs,
    },
    { status: dbOk ? 200 : 503 },
  );
}
