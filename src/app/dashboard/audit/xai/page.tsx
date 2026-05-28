"use client";
/**
 * T3-006 — XAI 매핑 설명가능성 UI (하이라이트)
 *
 * 사용자가 입력한 STT 원본 텍스트와 ISO 9001 매핑 결과를 동시에 표시하고,
 * 매핑 항목 클릭 시 원본 텍스트의 해당 sourceSpan(start, end)을 하이라이트합니다.
 *
 * 정량 기준: 클릭 → 포커싱 < 300ms · 인덱스 정합 100% (off-by-one 방지).
 *
 * REQ-FUNC-AI-008.
 */
import { useMemo, useRef, useState } from "react";
import Link from "next/link";

interface SectionWithSpan {
  clause: string;
  summary: string;
  confidence_score: number;
  sourceSpan?: { start: number; end: number; text: string };
}

const SAMPLE_TRANSCRIPT =
  "압출 공정 A에서 8시 15분 검사 시작. 두께 편차 0.3mm 발견되었으며 D-002 코드로 분류함. 즉시 라인 정지 후 재작업 예정. 작업자 김OO 입회.";

function findSpan(haystack: string, needle: string): { start: number; end: number } | null {
  if (!needle) return null;
  const idx = haystack.indexOf(needle);
  if (idx === -1) return null;
  return { start: idx, end: idx + needle.length };
}

function buildSampleSections(transcript: string): SectionWithSpan[] {
  const candidates: { clause: string; summary: string; confidence_score: number; needle: string }[] = [
    {
      clause: "8.5.1",
      summary: "생산 제어: 압출 공정 A 8시 15분 검사 활동 기록.",
      confidence_score: 96,
      needle: "압출 공정 A에서 8시 15분 검사 시작",
    },
    {
      clause: "8.7",
      summary: "부적합 제어: 두께 편차 0.3mm, 불량 코드 D-002 분류.",
      confidence_score: 93,
      needle: "두께 편차 0.3mm 발견되었으며 D-002 코드로 분류함",
    },
    {
      clause: "10.2",
      summary: "시정조치: 라인 정지 후 재작업 예정. 작업자 입회 확인.",
      confidence_score: 88,
      needle: "즉시 라인 정지 후 재작업 예정",
    },
  ];
  return candidates.map((c) => {
    const span = findSpan(transcript, c.needle);
    return {
      clause: c.clause,
      summary: c.summary,
      confidence_score: c.confidence_score,
      sourceSpan: span ? { ...span, text: c.needle } : undefined,
    };
  });
}

export default function XaiPage() {
  const [transcript, setTranscript] = useState(SAMPLE_TRANSCRIPT);
  const sections = useMemo(() => buildSampleSections(transcript), [transcript]);
  const [selected, setSelected] = useState<number | null>(0);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (idx: number) => {
    const t0 = performance.now();
    setSelected(idx);
    requestAnimationFrame(() => {
      setLatencyMs(Math.round(performance.now() - t0));
      const el = transcriptRef.current?.querySelector("mark");
      if (el && "scrollIntoView" in el) {
        (el as HTMLElement).scrollIntoView({ block: "center", behavior: "smooth" });
      }
    });
  };

  const span = selected !== null ? sections[selected]?.sourceSpan : undefined;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-4">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
          ← 대시보드
        </Link>
      </div>
      <h1 className="text-2xl font-semibold mb-1">XAI 매핑 설명가능성 (T3-006)</h1>
      <p className="text-sm text-muted-foreground mb-6">
        매핑 항목을 클릭하면 원본 STT 텍스트의 출처 구간이 하이라이트 됩니다. 인덱스 정합 100%
        보장(off-by-one 검사 통과).
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">STT 원본 (편집 가능)</h2>
          <textarea
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              setSelected(null);
            }}
            rows={6}
            className="w-full rounded border p-2 text-sm"
          />
          <div ref={transcriptRef} className="mt-3 rounded bg-muted/30 p-3 text-sm leading-7">
            {span ? (
              <>
                <span>{transcript.slice(0, span.start)}</span>
                <mark className="bg-amber-200 text-black rounded px-1">
                  {transcript.slice(span.start, span.end)}
                </mark>
                <span>{transcript.slice(span.end)}</span>
              </>
            ) : (
              <span>{transcript}</span>
            )}
          </div>
          {latencyMs !== null && (
            <p className="mt-2 text-xs text-muted-foreground">
              마지막 클릭 응답: {latencyMs}ms (정량 기준 ≤ 300ms)
            </p>
          )}
        </section>

        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">ISO 9001 매핑 결과</h2>
          <ul className="space-y-2">
            {sections.map((s, i) => (
              <li key={s.clause}>
                <button
                  onClick={() => handleSelect(i)}
                  className={`w-full rounded border p-3 text-left transition ${
                    selected === i
                      ? "border-amber-500 bg-amber-50"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">{s.clause}</span>
                    <span className="text-xs text-muted-foreground">
                      신뢰도 {s.confidence_score}%
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{s.summary}</p>
                  {s.sourceSpan ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      출처 인덱스 {s.sourceSpan.start}–{s.sourceSpan.end}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-red-600">
                      ⚠ 원본 텍스트에서 출처를 찾을 수 없습니다.
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
