"use client";
/**
 * COPQ 경영진 요약 대시보드 + 인쇄용 PDF (T3-002 / T3-003)
 *
 * 클라이언트 측 차트(SVG bar) + 인쇄 전용 스타일로 PDF Export.
 * Vercel 60s 제한을 우회하기 위해 모든 처리는 클라이언트에서 이루어집니다.
 *
 * REQ-FUNC-019/021/022 — 4 wastes 비용 환산 + 임원 PDF.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface CopqDaily {
  date: string;
  defect: number;
  rework: number;
  waiting: number;
  overproduction: number;
  total: number;
}
interface CopqResponse {
  summary: {
    defect: number;
    rework: number;
    waiting: number;
    overproduction: number;
    total: number;
  };
  daily: CopqDaily[];
}

const WASTE_LABELS: Record<keyof CopqResponse["summary"], string> = {
  defect: "불량(Defect)",
  rework: "재작업(Rework)",
  waiting: "대기(Waiting)",
  overproduction: "과잉생산(Overproduction)",
  total: "합계",
};

function formatKrw(n: number) {
  return n.toLocaleString("ko-KR", { maximumFractionDigits: 0 }) + " 원";
}

export default function CopqDashboard() {
  const today = useMemo(() => new Date(), []);
  const defaultEnd = today.toISOString().slice(0, 10);
  const defaultStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [data, setData] = useState<CopqResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/v1/copq/analytics?startDate=${startDate}&endDate=${endDate}`,
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message ?? "조회 실패");
      }
      const j = await res.json();
      setData(j.data as CopqResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const daysSpan = useMemo(() => {
    const diff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000;
    return Math.max(0, Math.floor(diff) + 1);
  }, [startDate, endDate]);

  const validityWarning = daysSpan < 7;

  const max = data ? Math.max(1, ...data.daily.map((d) => d.total)) : 1;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="no-print mb-4">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
          ← 대시보드
        </Link>
      </div>

      <div className="no-print mb-6 flex items-end gap-3">
        <div>
          <label className="block text-xs text-muted-foreground">시작일</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded border px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground">종료일</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded border px-2 py-1 text-sm"
          />
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "조회 중…" : "조회"}
        </button>
        <button
          onClick={() => window.print()}
          disabled={!data}
          className="ml-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          경영진 PDF 저장 (인쇄)
        </button>
      </div>

      {error && (
        <div className="no-print mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <article id="copq-report" className="rounded-lg border bg-white p-8 text-black">
        <header className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">COPQ 경영진 요약 리포트</h1>
          <p className="text-sm text-gray-600">
            기간: {startDate} ~ {endDate} ({daysSpan}일) · 출력 시각:{" "}
            {new Date().toLocaleString("ko-KR")}
          </p>
          {validityWarning && (
            <div className="mt-2 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              ⚠ 경고: 기간이 7일 미만입니다. 통계 신뢰도가 낮을 수 있어 의사결정 시 주의하세요.
              (REQ-FUNC-022)
            </div>
          )}
        </header>

        {data ? (
          <>
            <section className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
              {(Object.keys(WASTE_LABELS) as Array<keyof typeof WASTE_LABELS>).map((k) => (
                <div key={k} className="rounded border p-3">
                  <p className="text-xs text-gray-500">{WASTE_LABELS[k]}</p>
                  <p className="mt-1 text-lg font-semibold">{formatKrw(data.summary[k])}</p>
                </div>
              ))}
            </section>

            <section className="mb-6">
              <h2 className="mb-3 text-lg font-semibold">일자별 추이</h2>
              <svg viewBox="0 0 800 220" className="w-full">
                {data.daily.map((d, i) => {
                  const barW = 800 / Math.max(1, data.daily.length) - 4;
                  const x = i * (800 / Math.max(1, data.daily.length)) + 2;
                  const h = (d.total / max) * 180;
                  const y = 200 - h;
                  return (
                    <g key={d.date}>
                      <rect x={x} y={y} width={barW} height={h} fill="#2563eb" opacity={0.85} />
                      <text x={x + barW / 2} y={215} fontSize="9" textAnchor="middle" fill="#475569">
                        {d.date.slice(5)}
                      </text>
                    </g>
                  );
                })}
                <line x1="0" y1="200" x2="800" y2="200" stroke="#94a3b8" />
              </svg>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold">일자별 상세</h2>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">날짜</th>
                    <th className="border p-2 text-right">불량</th>
                    <th className="border p-2 text-right">재작업</th>
                    <th className="border p-2 text-right">대기</th>
                    <th className="border p-2 text-right">과잉</th>
                    <th className="border p-2 text-right">합계</th>
                  </tr>
                </thead>
                <tbody>
                  {data.daily.map((d) => (
                    <tr key={d.date}>
                      <td className="border p-2">{d.date}</td>
                      <td className="border p-2 text-right">{formatKrw(d.defect)}</td>
                      <td className="border p-2 text-right">{formatKrw(d.rework)}</td>
                      <td className="border p-2 text-right">{formatKrw(d.waiting)}</td>
                      <td className="border p-2 text-right">{formatKrw(d.overproduction)}</td>
                      <td className="border p-2 text-right font-medium">{formatKrw(d.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">조회 후 결과가 표시됩니다.</p>
        )}

        <footer className="mt-6 border-t pt-3 text-xs text-gray-500">
          PRO ALI SMART · REQ-FUNC-019~022 · COPQ 4 wastes 분석.
        </footer>
      </article>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #copq-report, #copq-report * { visibility: visible; }
          #copq-report { position: absolute; inset: 0; padding: 24px; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
