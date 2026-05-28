"use client";
/**
 * NC 사례 목록 + 신규 등록
 * REQ-FUNC-006~009 / T2-003 / T2-005.
 */
import { useEffect, useState } from "react";
import Link from "next/link";

interface Action {
  id: string;
  status: string;
  description: string;
}
interface NcCaseRow {
  id: string;
  title: string;
  severity: string;
  status: string;
  beforeHash: string | null;
  afterHash: string | null;
  createdAt: string;
  actions: Action[];
}

export default function NcCasesPage() {
  const [cases, setCases] = useState<NcCaseRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ title: "", severity: "MEDIUM", rawReason: "" });
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/nc/cases");
      if (!res.ok) throw new Error("NC 사례 목록 조회 실패");
      const json = await res.json();
      setCases(json.data?.cases ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/nc/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          severity: form.severity,
          rawReason: form.rawReason || undefined,
          draftPayload: { title: form.title, rawReason: form.rawReason, severity: form.severity },
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message ?? "NC 등록 실패");
      }
      setForm({ title: "", severity: "MEDIUM", rawReason: "" });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-4">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
          ← 대시보드
        </Link>
      </div>
      <h1 className="text-2xl font-semibold mb-2">부적합(NC) 사례</h1>
      <p className="text-sm text-muted-foreground mb-6">
        REQ-FUNC-006~009 — NC 등록, 시정 조치, 무결성 비교(T2-005).
      </p>

      <form
        onSubmit={handleCreate}
        className="mb-8 grid gap-3 rounded-lg border p-4 md:grid-cols-[2fr_1fr_auto]"
      >
        <input
          required
          placeholder="NC 제목"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded border px-3 py-2 text-sm"
        />
        <select
          value={form.severity}
          onChange={(e) => setForm({ ...form, severity: e.target.value })}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? "등록 중…" : "등록"}
        </button>
        <textarea
          placeholder="현장 관찰 사유 / STT 결과"
          value={form.rawReason}
          onChange={(e) => setForm({ ...form, rawReason: e.target.value })}
          className="rounded border px-3 py-2 text-sm md:col-span-3"
          rows={2}
        />
      </form>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">불러오는 중…</p>
      ) : cases.length === 0 ? (
        <p className="text-sm text-muted-foreground">등록된 NC 사례가 없습니다.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {cases.map((c) => (
            <li key={c.id} className="flex items-center justify-between p-4 hover:bg-muted/40">
              <div>
                <Link
                  href={`/dashboard/nc/${c.id}/integrity`}
                  className="font-medium hover:underline"
                >
                  {c.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {c.id.slice(0, 8)}… · 생성 {new Date(c.createdAt).toLocaleString("ko-KR")}
                  {c.beforeHash && ` · beforeHash ${c.beforeHash.slice(0, 8)}…`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-muted px-2 py-0.5">{c.severity}</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
                  {c.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
