import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ROLES } from '@/lib/schemas/auth';
import { SignupSchema } from '@/lib/schemas/consent';
import {
  REQUIRED_SIGNUP_CONSENT_TYPES,
  type ConsentType,
} from '@/lib/consent/constants';
import { recordConsent } from '@/lib/consent/record-consent';
import { AppError, handleRouteError } from '@/lib/errors';

const prisma = new PrismaClient();

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || null;
  }

  return request.headers.get('x-real-ip');
}

function validateSignupConsents(
  consents: Array<{
    consent_type: ConsentType;
    consent_version: string;
    is_agreed: boolean;
  }>
): void {
  const consentMap = new Map<ConsentType, (typeof consents)[number]>();

  for (const consent of consents) {
    if (consentMap.has(consent.consent_type)) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '동일한 consent_type이 중복 전달되었습니다.',
        400,
        { consent_type: consent.consent_type }
      );
    }
    consentMap.set(consent.consent_type, consent);
  }

  for (const requiredType of REQUIRED_SIGNUP_CONSENT_TYPES) {
    const consent = consentMap.get(requiredType);
    if (!consent) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        `필수 동의 항목(${requiredType})이 누락되었습니다.`,
        400
      );
    }

    if (!consent.is_agreed) {
      throw new AppError(
        'BIZ_403_LOCKUP_UNMET',
        '필수 PIPA 동의 항목에 동의하지 않으면 가입할 수 없습니다.',
        403,
        { consent_type: requiredType }
      );
    }
  }
}

// ─── POST /api/auth/signup ──────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = SignupSchema.parse(body);
    validateSignupConsents(payload.consents);

    const tenant = await prisma.tenant.findUnique({
      where: { id: payload.tenant_id },
    });

    if (!tenant) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '존재하지 않는 tenant_id입니다.',
        400
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '이미 등록된 이메일입니다.',
        400
      );
    }

    const clientIp = getClientIp(request);
    const deviceFingerprint = payload.device_fingerprint ?? null;

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          tenantId: payload.tenant_id,
          roleId: ROLES.SITE_USER,
        },
      });

      const consentRecords = [];
      for (const consent of payload.consents) {
        const record = await recordConsent(tx, {
          userId: createdUser.id,
          consentType: consent.consent_type,
          consentVersion: consent.consent_version,
          isAgreed: consent.is_agreed,
          ipAddress: clientIp,
          deviceFingerprint,
        });
        consentRecords.push(record);
      }

      await tx.auditLog.create({
        data: {
          tenantId: createdUser.tenantId,
          tableName: 'consent_records',
          recordId: consentRecords[0]?.id ?? createdUser.id,
          action: 'CONSENT_AGREED',
          newData: {
            user_id: createdUser.id,
            consent_count: consentRecords.length,
            consent_types: consentRecords.map((record) => record.consentType),
          },
          changedBy: createdUser.id,
        },
      });

      return createdUser;
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.roleId,
            tenant_id: user.tenantId,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleRouteError(error);
  } finally {
    await prisma.$disconnect();
  }
}
