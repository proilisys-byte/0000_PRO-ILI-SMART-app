#!/usr/bin/env node
/**
 * T4-005 — 보안 정적 점검 (SAST 게이트 시드)
 *
 * 1. `npm audit --json` 실행
 * 2. Critical 또는 High 취약점이 발견되면 종료 코드 1 로 빌드 실패
 *
 * 사용: node scripts/security-audit.mjs
 */
import { execSync } from "node:child_process";

let raw;
try {
  raw = execSync("npm audit --json", { stdio: ["ignore", "pipe", "pipe"] }).toString();
} catch (err) {
  if (err && err.stdout) raw = err.stdout.toString();
  else throw err;
}

let report;
try {
  report = JSON.parse(raw);
} catch {
  console.error("npm audit 출력을 파싱하지 못했습니다.");
  process.exit(2);
}

const meta = report.metadata?.vulnerabilities ?? {};
const critical = meta.critical ?? 0;
const high = meta.high ?? 0;

console.log(JSON.stringify(meta));

if (critical > 0 || high > 0) {
  console.error(`Critical=${critical}, High=${high} — 릴리즈 차단.`);
  process.exit(1);
}
console.log("보안 점검 통과 (Critical=0, High=0).");
