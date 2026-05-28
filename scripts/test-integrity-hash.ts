/**
 * T2-005 — 무결성 해시 자가 검증
 *
 * 1. canonicalize 가 키 순서 무관하게 동일 해시를 산출해야 함
 * 2. 단일 키 변조 시 100% 탐지
 * 3. diffKeys 가 added/removed/changed 를 정확히 분류
 */
import { canonicalize, diffKeys, hashPayload } from "../src/lib/integrity/hash";

let pass = 0;
let fail = 0;

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

console.log("== Integrity hash self-test ==");

const a = { x: 1, y: { z: 2, w: [3, 4] } };
const b = { y: { w: [3, 4], z: 2 }, x: 1 };
check("canonical 동일 (키 순서 무관)", canonicalize(a) === canonicalize(b));
check("hash 동일", hashPayload(a) === hashPayload(b));

const tampered = { ...a, x: 2 };
check("단일 변조 탐지", hashPayload(a) !== hashPayload(tampered));

const before = { title: "x", severity: "MEDIUM" };
const after = { title: "x", severity: "HIGH", note: "added" };
const delta = diffKeys(before, after);
check("added 분류", delta.added.includes("note"));
check("changed 분류", delta.changed.includes("severity"));
check("removed 없음", delta.removed.length === 0);

const summary = { pass, fail, total: pass + fail };
console.log(`\nResult: ${JSON.stringify(summary)}`);
process.exit(fail > 0 ? 1 : 0);
