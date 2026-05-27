/**
 * 데이터 무결성 해시 유틸 — T2-005 / REQ-FUNC-009
 *
 * 정규화된 JSON 직렬화 후 SHA-256 해시를 산출하여
 * 시정 조치 전/후 데이터 변조를 100% 탐지하도록 한다.
 */
import { createHash } from "node:crypto";

export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`)
    .join(",")}}`;
}

export function hashPayload(payload: unknown): string {
  const canonical = canonicalize(payload);
  return createHash("sha256").update(canonical).digest("hex");
}

export interface IntegrityResult {
  matches: boolean;
  storedHash: string | null;
  computedHash: string;
  delta: { added: string[]; removed: string[]; changed: string[] };
}

export function diffKeys(
  before: Record<string, unknown> | null | undefined,
  after: Record<string, unknown> | null | undefined,
): { added: string[]; removed: string[]; changed: string[] } {
  const beforeKeys = new Set(before ? Object.keys(before) : []);
  const afterKeys = new Set(after ? Object.keys(after) : []);
  const added: string[] = [];
  const removed: string[] = [];
  const changed: string[] = [];
  for (const k of afterKeys) if (!beforeKeys.has(k)) added.push(k);
  for (const k of beforeKeys) if (!afterKeys.has(k)) removed.push(k);
  for (const k of beforeKeys) {
    if (afterKeys.has(k) && canonicalize(before?.[k]) !== canonicalize(after?.[k])) {
      changed.push(k);
    }
  }
  return { added, removed, changed };
}
