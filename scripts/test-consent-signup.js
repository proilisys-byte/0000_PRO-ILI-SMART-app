const { PrismaClient } = require('@prisma/client');
const { createHash } = require('crypto');

const BASE_URL = 'http://localhost:9002';
const CURRENT_CONSENT_VERSION = 'v1.0';

function buildConsents(options = {}) {
  const {
    includeVoice = true,
    includeWorkRecord = true,
    voiceAgreed = true,
    workRecordAgreed = true,
    voiceVersion = CURRENT_CONSENT_VERSION,
    workRecordVersion = CURRENT_CONSENT_VERSION,
  } = options;

  const consents = [];

  if (includeVoice) {
    consents.push({
      consent_type: 'PIPA_VOICE',
      consent_version: voiceVersion,
      is_agreed: voiceAgreed,
    });
  }

  if (includeWorkRecord) {
    consents.push({
      consent_type: 'PIPA_WORK_RECORD',
      consent_version: workRecordVersion,
      is_agreed: workRecordAgreed,
    });
  }

  return consents;
}

async function signup(payload) {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '203.0.113.10',
    },
    body: JSON.stringify(payload),
  });

  return {
    status: response.status,
    json: await response.json(),
  };
}

function assertEncryptedField(value, plainText) {
  if (!value || typeof value !== 'string') {
    throw new Error('Encrypted field is missing');
  }
  if (value === plainText) {
    throw new Error('Sensitive field was stored in plaintext');
  }
}

async function runTests() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 T1-014 Consent Signup 테스트 시작...');

    const tenant = await prisma.tenant.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    if (!tenant) {
      throw new Error('Seed tenant not found. Please run seed first.');
    }

    const uniqueSuffix = Date.now();

    console.log('--- TEST 1: 정상 회원가입 + 동의 파라미터 무결성 ---');
    const validEmail = `consent.test.${uniqueSuffix}@mirae.com`;
    const validPayload = {
      email: validEmail,
      password: 'Password123!',
      name: '동의 테스트 사용자',
      tenant_id: tenant.id,
      device_fingerprint: `device-${uniqueSuffix}`,
      consents: buildConsents(),
    };

    const successRes = await signup(validPayload);
    console.log('Signup Response:', JSON.stringify(successRes.json, null, 2));

    if (successRes.status !== 201 || !successRes.json.success) {
      throw new Error(`Valid signup failed: ${JSON.stringify(successRes.json)}`);
    }

    const createdUser = await prisma.user.findUnique({
      where: { email: validEmail },
      include: { consentRecords: true },
    });

    if (!createdUser || createdUser.consentRecords.length < 2) {
      throw new Error('Consent records were not persisted');
    }

    for (const record of createdUser.consentRecords) {
      if (!record.consentVersion) {
        throw new Error('consent_version missing in DB record');
      }
      if (!record.identifierHash) {
        throw new Error('identifier_hash missing in DB record');
      }

      const expectedHash = createHash('sha256')
        .update(`${createdUser.id}:${record.consentType}:${record.consentVersion}`)
        .digest('hex');

      if (record.identifierHash !== expectedHash) {
        throw new Error('identifier_hash mismatch');
      }

      assertEncryptedField(record.ipAddressEncrypted, '203.0.113.10');
      assertEncryptedField(
        record.deviceFingerprintEncrypted,
        `device-${uniqueSuffix}`
      );
    }

    console.log('--- TEST 2: consent_version 누락 시 실패 ---');
    const missingVersionRes = await signup({
      email: `missing.version.${uniqueSuffix}@mirae.com`,
      password: 'Password123!',
      name: '버전 누락 테스트',
      tenant_id: tenant.id,
      consents: [
        {
          consent_type: 'PIPA_VOICE',
          consent_version: '',
          is_agreed: true,
        },
        {
          consent_type: 'PIPA_WORK_RECORD',
          consent_version: CURRENT_CONSENT_VERSION,
          is_agreed: true,
        },
      ],
    });

    if (missingVersionRes.json.success) {
      throw new Error('Missing consent_version should fail');
    }

    console.log('--- TEST 3: 필수 동의 거부 시 실패 ---');
    const rejectVoiceRes = await signup({
      email: `reject.voice.${uniqueSuffix}@mirae.com`,
      password: 'Password123!',
      name: '동의 거부 테스트',
      tenant_id: tenant.id,
      consents: buildConsents({ voiceAgreed: false }),
    });

    if (rejectVoiceRes.json.success) {
      throw new Error('Rejected required consent should fail');
    }

    console.log('--- TEST 4: ConsentRecord UPDATE 차단 ---');
    const targetRecord = createdUser.consentRecords[0];
    let updateBlocked = false;

    try {
      await prisma.consentRecord.update({
        where: { id: targetRecord.id },
        data: { isAgreed: false },
      });
    } catch {
      updateBlocked = true;
    }

    if (!updateBlocked) {
      throw new Error('ConsentRecord UPDATE was not blocked by trigger');
    }

    console.log('✅ T1-014 Consent Signup 자가진단 테스트 통과!!');
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
