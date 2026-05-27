/**
 * T4-003 — TOTP 자가 검증
 *
 * RFC 6238 사양에 따라 직전 윈도우/현재/다음 윈도우 코드를 모두 수용.
 * 잘못된 코드는 거절.
 */
import { generateBase32Secret, generateTotp, verifyTotp } from "../src/lib/auth/totp";

const secret = generateBase32Secret();
const now = Math.floor(Date.now() / 1000);

const code = generateTotp(secret, { t: now });
const ok = verifyTotp(secret, code);

const wrong = "000000";
const fail = !verifyTotp(secret, wrong);

console.log(JSON.stringify({ secretLen: secret.length, code, ok, wrongRejected: fail }));

if (!ok || !fail) {
  console.error("TOTP self-test FAILED");
  process.exit(1);
}
console.log("TOTP self-test PASSED");
