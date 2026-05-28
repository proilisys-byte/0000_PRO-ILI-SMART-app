/**
 * NC Case 무결성 검증 (T2-005 / REQ-FUNC-009)
 *
 * POST /api/v1/nc/cases/[id]/integrity-check
 *   body: { afterPayload: object }
 *
 * 1. 저장된 beforeHash 와 현재 draftPayload 의 해시를 재계산하여 비교
 * 2. 클라이언트가 보낸 afterPayload 의 해시를 산출하여 변경 영역 표시
 * 3. 결과를 audit_log 에 Insert (조작 시도 추적)
 *
 * 정량 기준: 변조 탐지율 100% (해시 비교 연산 기반).
 */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AppError, handleRouteError } from "@/lib/errors";
import { canonicalize, diffKeys, hashPayload } from "@/lib/integrity/hash";

const prisma = new PrismaClient();

const Schema = z.object({
  afterPayload: z.record(z.unknown()),
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

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = requireUser(request);
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { afterPayload } = Schema.parse(body);

    const ncCase = await prisma.ncCase.findUnique({ where: { id } });
    if (!ncCase) {
      throw new AppError("RES_404_RESOURCE_NOT_FOUND", "NC 사례를 찾을 수 없습니다.", 404);
    }
    if (ncCase.tenantId !== user.tenant_id) {
      throw new AppError("AUTH_403_FORBIDDEN_ACCESS", "테넌트 경계 위반.", 403);
    }

    // 1) 저장된 draftPayload (before) 재해시 — 외부 변조 감지
    const storedDraft = (ncCase.draftPayload ?? {}) as Record<string, unknown>;
    const recomputedBeforeHash = hashPayload(storedDraft);
    const beforeIntact = ncCase.beforeHash
      ? recomputedBeforeHash === ncCase.beforeHash
      : true;

    // 2) afterPayload 해시 산출 + diff
    const afterHash = hashPayload(afterPayload);
    const delta = diffKeys(storedDraft, afterPayload);

    // 3) afterHash 저장 (Insert-only 정책: ncCase 자체는 갱신하되, 변경 이력 audit_log 적재)
    await prisma.ncCase.update({
      where: { id },
      data: { afterHash },
    });
    await prisma.auditLog.create({
      data: {
        tenantId: user.tenant_id,
        tableName: "nc_cases",
        recordId: id,
        action: "INTEGRITY_CHECK",
        changedBy: user.id,
        oldData: { beforeHash: ncCase.beforeHash, recomputedBeforeHash, beforeIntact },
        newData: { afterHash, delta },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        beforeIntact,
        storedBeforeHash: ncCase.beforeHash,
        recomputedBeforeHash,
        afterHash,
        delta,
        canonicalBefore: canonicalize(storedDraft),
        canonicalAfter: canonicalize(afterPayload),
      },
    });
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
