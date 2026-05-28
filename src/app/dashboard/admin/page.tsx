"use client";
/**
 * 관리자 운영 대시보드 — T4-001 SLI 모니터링
 *
 * /api/v1/health 와 /api/v1/monitoring/sli 를 조회해 가용성, 오류율, 처리량을 표시.
 */
import { useEffect, useState } from "react";
import Link from "next/link";

interface Sli {
  audit_log_count_24h: number;
  error_rate_24h: number;
  audit_sessions_24h: number;
  bulk_imports_24h: number;
  bulk_import_failure_rate_24h: number;
}

interface Slo {
  error_rate_threshold: number;
  breached: boolean;
}

interface Health {
  status: string;
  checks: { db: boolean };
  elapsedMs: number;
}

export default function AdminDashboard() {
  const [sli, setSli] = useState<Sli | null>(null);
  const [slo, setSlo] = useState<Slo | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [sliRes, healthRes] = await Promise.all([
          fetch("/api/v1/monitoring/sli"),
          fetch("/api/v1/health"),
        ]);
        if (sliRes.ok) {
          const j = await sliRes.json();
          setSli(j.data?.sli);
          setSlo(j.data?.slo);
        } else {
          const body = await sliRes.json().catch(() => ({}));
          setError(body?.error?.message ?? "SLI 조회 실패");
        }
        if (healthRes.ok) setHealth(await healthRes.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-4">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
          ← 대시보드
        </Link>
      </div>
      <h1 className="text-2xl font-semibold mb-1">운영 대시보드 (Admin Only)</h1>
      <p className="text-sm text-muted-foreground mb-6">
        T4-001 모니터링/SLI · 24시간 윈도우.
      </p>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">시스템 상태</p>
          <p className={`mt-1 text-lg font-semibold ${health?.status === "ok" ? "text-emerald-700" : "text-red-700"}`}>
            {health?.status ?? "…"}
          </p>
          <p className="text-xs text-muted-foreground">
            DB: {health?.checks.db ? "OK" : "FAIL"} · {health?.elapsedMs ?? "-"} ms
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">오류율 (24h)</p>
          <p className="mt-1 text-lg font-semibold">
            {sli ? (sli.error_rate_24h * 100).toFixed(2) : "…"}%
          </p>
          <p className="text-xs text-muted-foreground">
            기준 ≤ {((slo?.error_rate_threshold ?? 0.01) * 100).toFixed(0)}%
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">SLO 상태</p>
          <p className={`mt-1 text-lg font-semibold ${slo?.breached ? "text-red-700" : "text-emerald-700"}`}>
            {slo == null ? "…" : slo.breached ? "Breach" : "Compliant"}
          </p>
        </div>
      </section>

      {sli && (
        <section className="rounded-lg border p-4">
          <h2 className="mb-3 font-semibold">상세 SLI</h2>
          <dl className="grid gap-3 md:grid-cols-2 text-sm">
            <div>
              <dt className="text-muted-foreground">감사 로그 건수 (24h)</dt>
              <dd>{sli.audit_log_count_24h.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">감사 세션 (24h)</dt>
              <dd>{sli.audit_sessions_24h.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Bulk Import (24h)</dt>
              <dd>{sli.bulk_imports_24h.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Bulk Import 실패율</dt>
              <dd>{(sli.bulk_import_failure_rate_24h * 100).toFixed(2)}%</dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  );
}
