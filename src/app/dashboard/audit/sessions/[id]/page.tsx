"use client";
/**
 * Audit Session 상세 + E2E 워크플로우 페이지
 *
 * 한 화면에서 다음을 모두 수행합니다:
 * 1. 수동 엔트리 추가 (process_name / quantity / defect_code)
 * 2. ISO 9001 매핑 실행 (/api/v1/audit/map)
 * 3. 매핑 결과를 PDF 형식으로 인쇄/저장 (window.print + 인쇄 전용 스타일)
 *
 * REQ-FUNC-001 (PDF 일괄 생성), REQ-FUNC-002 (매핑 엔진), REQ-FUNC-011 (Zero-UI).
 * T1-009 (Audit PDF 클라이언트 생성) 보강 — Vercel 60s 타임아웃 회피를 위해 모두 클라이언트 처리.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface DataEntry {
  id: string;
  rawData: Record<string, unknown>;
  mappedData: Record<string, unknown> | null;
  createdAt: string;
}

interface SessionDetail {
  id: string;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;
  startTime: string;
  endTime: string | null;
  dataEntries: DataEntry[];
}

interface MappingSection {
  clause: string;
  summary: string;
  confidence_score: number;
}

export default function AuditSessionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [mapping, setMapping] = useState<MappingSection[] | null>(null);

  const [entryInput, setEntryInput] = useState({
    process_name: "",
    quantity: "",
    defect_code: "",
    notes: "",
  });

  const reload = useCallback(async () => {
    if (!id) return;
    const res = await fetch(`/api/v1/audit/sessions/${id}`);
    if (!res.ok) throw new Error("세션을 불러오지 못했습니다.");
    const json = await res.json();
    setSession(json.data.session as SessionDetail);
  }, [id]);

  useEffect(() => {
    reload().catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, [reload]);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsBusy(true);
    setError(null);
    try {
      const rawData: Record<string, unknown> = {
        process_name: entryInput.process_name,
        quantity: entryInput.quantity ? Number(entryInput.quantity) : undefined,
        defect_code: entryInput.defect_code || undefined,
        notes: entryInput.notes || undefined,
      };
      const res = await fetch(`/api/v1/audit/sessions/${id}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawData }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message ?? "엔트리 추가에 실패했습니다.");
      }
      setEntryInput({ process_name: "", quantity: "", defect_code: "", notes: "" });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsBusy(false);
    }
  };

  const handleRunMapping = async () => {
    if (!id) return;
    setIsBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/audit/map`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message ?? "매핑 실행에 실패했습니다.");
      }
      const json = await res.json();
      setMapping(json.data?.sections ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsBusy(false);
    }
  };

  const handleComplete = async () => {
    if (!id) return;
    setIsBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/audit/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (!res.ok) throw new Error("세션 종료에 실패했습니다.");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsBusy(false);
    }
  };

  const printedAt = useMemo(() => new Date().toLocaleString("ko-KR"), []);

  if (!session) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : (
          "세션 정보를 불러오는 중…"
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="no-print mb-4">
        <Link
          href="/dashboard/audit/sessions"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← 세션 목록
        </Link>
      </div>

      {error && (
        <div className="no-print mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── 인쇄 영역 시작 (PDF 출력 대상) ─────────────── */}
      <article id="audit-report" className="rounded-lg border bg-white p-8 text-black shadow-sm print:border-0 print:shadow-none">
        <header className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">Smart Audit 리포트</h1>
          <p className="text-sm text-gray-600">
            세션 ID: <span className="font-mono">{session.id}</span>
          </p>
          <p className="text-sm text-gray-600">
            상태: {session.status} · 시작 {new Date(session.startTime).toLocaleString("ko-KR")}
            {session.endTime && ` · 종료 ${new Date(session.endTime).toLocaleString("ko-KR")}`}
          </p>
          <p className="text-sm text-gray-600">출력 시각: {printedAt}</p>
        </header>

        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">수집 데이터 ({session.dataEntries.length})</h2>
          {session.dataEntries.length === 0 ? (
            <p className="text-sm text-gray-500">아직 수집된 엔트리가 없습니다.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">시각</th>
                  <th className="border p-2 text-left">공정</th>
                  <th className="border p-2 text-left">수량</th>
                  <th className="border p-2 text-left">불량코드</th>
                  <th className="border p-2 text-left">비고</th>
                </tr>
              </thead>
              <tbody>
                {session.dataEntries.map((entry) => {
                  const r = entry.rawData ?? {};
                  return (
                    <tr key={entry.id}>
                      <td className="border p-2">
                        {new Date(entry.createdAt).toLocaleString("ko-KR")}
                      </td>
                      <td className="border p-2">{String(r.process_name ?? "-")}</td>
                      <td className="border p-2">{String(r.quantity ?? "-")}</td>
                      <td className="border p-2">{String(r.defect_code ?? "-")}</td>
                      <td className="border p-2">{String(r.notes ?? "-")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        {mapping && mapping.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">ISO 9001 매핑 결과</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">조항</th>
                  <th className="border p-2 text-left">요약</th>
                  <th className="border p-2 text-right">신뢰도</th>
                </tr>
              </thead>
              <tbody>
                {mapping.map((section) => (
                  <tr key={section.clause}>
                    <td className="border p-2 font-mono">{section.clause}</td>
                    <td className="border p-2 whitespace-pre-wrap">{section.summary}</td>
                    <td className="border p-2 text-right">{section.confidence_score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <footer className="mt-8 border-t pt-4 text-xs text-gray-500">
          본 리포트는 PRO ALI SMART 가 자동 생성하였으며, REQ-FUNC-001/002 의 추적 대상입니다.
        </footer>
      </article>
      {/* ── 인쇄 영역 끝 ─────────────────────────────── */}

      <section className="no-print mt-8 grid gap-6 md:grid-cols-2">
        <form
          onSubmit={handleAddEntry}
          className="rounded-lg border p-4 space-y-3"
          aria-label="엔트리 추가 폼"
        >
          <h2 className="font-semibold">수동 엔트리 추가</h2>
          <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="공정명 (예: 압출 공정 A)"
            value={entryInput.process_name}
            onChange={(e) => setEntryInput({ ...entryInput, process_name: e.target.value })}
            required
          />
          <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="수량"
            type="number"
            value={entryInput.quantity}
            onChange={(e) => setEntryInput({ ...entryInput, quantity: e.target.value })}
          />
          <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="불량 코드 (옵션)"
            value={entryInput.defect_code}
            onChange={(e) => setEntryInput({ ...entryInput, defect_code: e.target.value })}
          />
          <textarea
            className="w-full rounded border px-3 py-2 text-sm"
            rows={2}
            placeholder="비고 / STT 결과 등"
            value={entryInput.notes}
            onChange={(e) => setEntryInput({ ...entryInput, notes: e.target.value })}
          />
          <button
            type="submit"
            disabled={isBusy || session.status !== "IN_PROGRESS"}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            엔트리 추가
          </button>
        </form>

        <div className="rounded-lg border p-4 space-y-3">
          <h2 className="font-semibold">감사 워크플로우</h2>
          <button
            onClick={handleRunMapping}
            disabled={isBusy || session.dataEntries.length === 0}
            className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            ISO 9001 매핑 실행
          </button>
          <button
            onClick={() => window.print()}
            disabled={!mapping}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            PDF로 저장 (브라우저 인쇄)
          </button>
          <button
            onClick={handleComplete}
            disabled={isBusy || session.status !== "IN_PROGRESS"}
            className="w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted/50 disabled:opacity-60"
          >
            세션 종료
          </button>
        </div>
      </section>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #audit-report, #audit-report * { visibility: visible; }
          #audit-report { position: absolute; inset: 0; padding: 24px; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
