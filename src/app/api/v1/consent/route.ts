/**
 * PIPA 개인정보 수집 동의 API
 *
 * GET  /api/v1/consent  – 현재 사용자의 활성 동의 상태 조회
 * POST /api/v1/consent  – 동의 기록 (Insert-only)
 *
 * REQ-FUNC-024 (감사 로그), REQ-FUNC-NF-COMPLIANCE (PIPA), T1-014 / T4-002 보강.
 * 정책상 동의 철회는 별도 엔드포인트(미구현)에서 새 레코드를 Insert 합니다.
 */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AppError, handleRouteError } from "@/lib/errors";

const prisma = new PrismaClient();

const REQUIRED_TYPES = ["PIPA_DATA_COLLECTION", "PIPA_VOICE_RECORDING"] as const;

const ConsentSchema = z.object({
  consents: z
    .array(
      z.object({
        consentType: z.string().min(1),
        isAgreed: z.boolean(),
      }),
    )
    .min(1),
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
    const records = await prisma.consentRecord.findMany({
      where: { userId: user.id },
      orderBy: { agreedAt: "desc" },
    });

    const latestByType = new Map<string, boolean>();
    for (const r of records) {
      if (!latestByType.has(r.consentType)) {
        latestByType.set(r.consentType, r.isAgreed);
      }
    }
    const allRequiredAgreed = REQUIRED_TYPES.every((t) => latestByType.get(t) === true);
    return NextResponse.json({
      success: true,
      data: {
        allRequiredAgreed,
        requiredTypes: REQUIRED_TYPES,
        statuses: Object.fromEntries(latestByType),
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
    const { consents } = ConsentSchema.parse(body);

    const created = await prisma.$transaction(
      consents.map((c) =>
        prisma.consentRecord.create({
          data: {
            userId: user.id,
            consentType: c.consentType,
            isAgreed: c.isAgreed,
          },
        }),
      ),
    );

    await prisma.auditLog.create({
      data: {
        tenantId: user.tenant_id,
        tableName: "consent_records",
        recordId: created.map((r) => r.id).join(","),
        action: "CONSENT_RECORD",
        changedBy: user.id,
        newData: { consents } as object,
      },
    });

    return NextResponse.json({ success: true, data: { records: created } }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
