import type { Prisma, PrismaClient } from '@prisma/client';
import { AppError } from '@/lib/errors';
import {
  ALLOWED_CONSENT_VERSIONS,
  type ConsentType,
} from '@/lib/consent/constants';
import {
  encryptConsentField,
  hashConsentIdentifier,
} from '@/lib/consent/crypto';

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export interface ConsentRecordInput {
  userId: string;
  consentType: ConsentType;
  consentVersion: string;
  isAgreed: boolean;
  ipAddress?: string | null;
  deviceFingerprint?: string | null;
}

export function assertConsentIntegrity(input: ConsentRecordInput): void {
  const consentVersion = input.consentVersion?.trim();
  if (!consentVersion) {
    throw new AppError(
      'COMPLIANCE_LOCKUP_CONSENT_VERSION_MISSING',
      '동의서 버전(consent_version)이 누락되어 컴플라이언스 락업 조건을 충족하지 못했습니다.',
      403
    );
  }

  if (
    !ALLOWED_CONSENT_VERSIONS.includes(
      consentVersion as (typeof ALLOWED_CONSENT_VERSIONS)[number]
    )
  ) {
    throw new AppError(
      'VAL_400_VALIDATION_FAILED',
      '지원하지 않는 동의서 버전입니다.',
      400,
      { consent_version: consentVersion }
    );
  }

  const identifierHash = hashConsentIdentifier(
    input.userId,
    input.consentType,
    consentVersion
  );

  if (!identifierHash) {
    throw new AppError(
      'COMPLIANCE_LOCKUP_IDENTIFIER_HASH_MISSING',
      '식별자 해시(identifier_hash) 생성에 실패하여 컴플라이언스 락업 조건을 충족하지 못했습니다.',
      403
    );
  }
}

export async function recordConsent(
  tx: TransactionClient,
  input: ConsentRecordInput
): Promise<Prisma.ConsentRecordGetPayload<object>> {
  assertConsentIntegrity(input);

  const consentVersion = input.consentVersion.trim();
  const identifierHash = hashConsentIdentifier(
    input.userId,
    input.consentType,
    consentVersion
  );

  return tx.consentRecord.create({
    data: {
      userId: input.userId,
      consentType: input.consentType,
      consentVersion,
      identifierHash,
      isAgreed: input.isAgreed,
      ipAddressEncrypted: input.ipAddress
        ? encryptConsentField(input.ipAddress)
        : null,
      deviceFingerprintEncrypted: input.deviceFingerprint
        ? encryptConsentField(input.deviceFingerprint)
        : null,
    },
  });
}
