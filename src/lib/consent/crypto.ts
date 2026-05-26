import { createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';

function getEncryptionKey(): Buffer {
  const secret =
    process.env.CONSENT_ENCRYPTION_KEY ||
    'dev-consent-key-change-in-production';
  return scryptSync(secret, 'pipa-consent-salt', 32);
}

export function hashConsentIdentifier(
  userId: string,
  consentType: string,
  consentVersion: string
): string {
  return createHash('sha256')
    .update(`${userId}:${consentType}:${consentVersion}`)
    .digest('hex');
}

export function encryptConsentField(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decryptConsentField(payload: string): string {
  const key = getEncryptionKey();
  const buffer = Buffer.from(payload, 'base64');
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const encrypted = buffer.subarray(28);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString('utf8');
}
