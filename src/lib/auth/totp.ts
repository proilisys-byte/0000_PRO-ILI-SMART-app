/**
 * RFC 6238 호환 TOTP 구현 — T4-003
 *
 * 외부 의존성 없이 Node.js `crypto` 만 사용. 30초 윈도우, 6자리 코드, HMAC-SHA1.
 * 시크릿은 base32 인코딩으로 저장/공유합니다.
 */
import { createHmac, randomBytes } from "node:crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function generateBase32Secret(byteLen = 20): string {
  const bytes = randomBytes(byteLen);
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32Decode(input: string): Buffer {
  const cleaned = input.replace(/=+$/, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of cleaned) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      out.push((value >>> bits) & 0xff);
    }
  }
  return Buffer.from(out);
}

export function generateTotp(secret: string, options: { step?: number; digits?: number; t?: number } = {}): string {
  const step = options.step ?? 30;
  const digits = options.digits ?? 6;
  const time = options.t ?? Math.floor(Date.now() / 1000);
  const counter = Math.floor(time / step);
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  const mod = 10 ** digits;
  return String(code % mod).padStart(digits, "0");
}

export function verifyTotp(
  secret: string,
  token: string,
  options: { step?: number; digits?: number; window?: number } = {},
): boolean {
  const window = options.window ?? 1;
  const now = Math.floor(Date.now() / 1000);
  const step = options.step ?? 30;
  const digits = options.digits ?? 6;
  for (let w = -window; w <= window; w++) {
    const expected = generateTotp(secret, { step, digits, t: now + w * step });
    if (timingSafeEqualStr(expected, token)) return true;
  }
  return false;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export function buildOtpauthUrl(params: {
  issuer: string;
  account: string;
  secret: string;
}) {
  const label = `${encodeURIComponent(params.issuer)}:${encodeURIComponent(params.account)}`;
  const query = new URLSearchParams({
    secret: params.secret,
    issuer: params.issuer,
    algorithm: "SHA1",
    digits: "6",
    period: "30",
  });
  return `otpauth://totp/${label}?${query.toString()}`;
}
