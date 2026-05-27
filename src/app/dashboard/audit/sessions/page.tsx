"use client";
/**
 * Audit Sessions 목록 + 신규 생성
 * REQ-FUNC-001/002, F1-Q-001 기준의 세션 리스트 진입점.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuditSessionRow {
  id: string;
  status: string;
  startTime: string;
  endTime: string | null;
  _count?: { dataEntries: number };
}

export default function AuditSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<AuditSessionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/audit/sessions");
        if (!res.ok) throw new Error("세션 목록을 불러오지 못했습니다.");
        const json = await res.json();
        if (!aborted) setSessions(json.data?.sessions ?? []);
      } catch (err) {
        if (!aborted) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!aborted) setIsLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/audit/sessions", { method: "POST" });
      if (!res.ok) throw new Error("세션 생성에 실패했습니다.");
      const json = await res.json();
      router.push(`/dashboard/audit/sessions/${json.data.session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setIsCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
            ← 대시보드
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Smart Audit 세션</h1>
          <p className="text-sm text-muted-foreground">
            ISO 9001 기반 감사 세션을 생성하고 음성/매핑/리포트를 관리합니다.
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60"
        >
          {isCreating ? "생성 중…" : "+ 새 세션"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">불러오는 중…</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 생성된 세션이 없습니다.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center justify-between p-4 hover:bg-muted/40">
              <div>
                <Link
                  href={`/dashboard/audit/sessions/${s.id}`}
                  className="font-medium hover:underline"
                >
                  {s.id.slice(0, 8)}…
                </Link>
                <p className="text-xs text-muted-foreground">
                  시작: {new Date(s.startTime).toLocaleString("ko-KR")}
                  {s.endTime && ` · 종료: ${new Date(s.endTime).toLocaleString("ko-KR")}`}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  엔트리 {s._count?.dataEntries ?? 0}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    s.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : s.status === "CANCELLED"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
