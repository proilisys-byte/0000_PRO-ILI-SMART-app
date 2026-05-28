"use client";
/**
 * T2-005 — 조치 전/후 무결성 비교 UI
 *
 * 1. 사용자가 afterPayload(JSON) 를 입력
 * 2. POST /api/v1/nc/cases/[id]/integrity-check 호출
 * 3. before/after 해시 비교 결과 표시 + 변조(beforeIntact=false) 시 경고
 * 4. 키 단위 diff 시각화
 *
 * REQ-FUNC-009 / REQ-FUNC-025 (Audit Log Insert-only).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface IntegrityResponse {
  beforeIntact: boolean;
  storedBeforeHash: string | null;
  recomputedBeforeHash: string;
  afterHash: string;
  delta: { added: string[]; removed: string[]; changed: string[] };
  canonicalBefore: string;
  canonicalAfter: string;
}

export default function IntegrityPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [json, setJson] = useState(
    `{\n  "title": "예시 제목",\n  "severity": "MEDIUM",\n  "rawReason": "수정된 사유"\n}`,
  );
  const [result, setResult] = useState<IntegrityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [originalDraft, setOriginalDraft] = useState<unknown>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/v1/nc/cases`);
        if (!res.ok) return;
        const j = await res.json();
        const found = (j.data?.cases ?? []).find((c: { id: string }) => c.id === id);
        if (found?.draftPayload) {
          setOriginalDraft(found.draftPayload);
          setJson(JSON.stringify(found.draftPayload, null, 2));
        }
      } catch {
        /* noop */
      }
    })();
  }, [id]);

  const handleRun = async () => {
    if (!id) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const parsed = JSON.parse(json);
      const res = await fetch(`/api/v1/nc/cases/${id}/integrity-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ afterPayload: parsed }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message ?? "검증 실패");
      }
      const j = await res.json();
      setResult(j.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-4">
        <Link href="/dashboard/nc" className="text-sm text-muted-foreground hover:underline">
          ← NC 목록
        </Link>
      </div>
      <h1 className="text-2xl font-semibold mb-1">조치 전/후 무결성 비교</h1>
      <p className="text-sm text-muted-foreground mb-6">
        REQ-FUNC-009 · T2-005. 변경된 페이로드를 입력하면 SHA-256 해시 비교 결과를 표시합니다.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">변경 후(after) 페이로드 (JSON)</label>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            rows={14}
            className="w-full rounded border p-3 font-mono text-xs"
          />
          <button
            onClick={handleRun}
            disabled={busy}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {busy ? "검증 중…" : "무결성 검증 실행"}
          </button>
          {error && (
            <p className="text-sm text-red-700">{error}</p>
          )}
        </div>

        <div className="space-y-3">
          {result ? (
            <>
              <div
                className={`rounded-lg border p-3 text-sm ${
                  result.beforeIntact
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-red-300 bg-red-50 text-red-800"
                }`}
              >
                {result.beforeIntact
                  ? "✓ 저장된 원본(before) 데이터의 무결성이 유지되고 있습니다."
                  : "⚠ 원본 데이터가 변조된 것으로 의심됩니다. 즉시 보안 검토가 필요합니다."}
              </div>
              <div className="rounded-lg border p-3 text-xs space-y-1 font-mono">
                <p>storedBeforeHash : {result.storedBeforeHash ?? "(없음)"}</p>
                <p>recomputed       : {result.recomputedBeforeHash}</p>
                <p>afterHash        : {result.afterHash}</p>
              </div>
              <div className="rounded-lg border p-3 text-sm">
                <p className="mb-2 font-medium">키 단위 변경 내역</p>
                <ul className="space-y-1 text-xs">
                  {result.delta.added.map((k) => (
                    <li key={`a-${k}`} className="text-emerald-700">+ 추가 : {k}</li>
                  ))}
                  {result.delta.removed.map((k) => (
                    <li key={`r-${k}`} className="text-red-700">- 제거 : {k}</li>
                  ))}
                  {result.delta.changed.map((k) => (
                    <li key={`c-${k}`} className="text-amber-700">~ 변경 : {k}</li>
                  ))}
                  {result.delta.added.length + result.delta.removed.length + result.delta.changed.length === 0 && (
                    <li className="text-muted-foreground">변경 없음</li>
                  )}
                </ul>
              </div>
              {originalDraft != null && (
                <details className="rounded border p-3 text-xs">
                  <summary className="cursor-pointer">원본(before) 정규화 JSON</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-all">{result.canonicalBefore}</pre>
                </details>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              왼쪽에서 페이로드를 입력하고 검증을 실행하세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
