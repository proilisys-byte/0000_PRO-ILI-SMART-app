/**
 * GET /api/v1/ai/stream-demo — T4-004 데모 엔드포인트
 *
 * Vercel 60초 제한 우회 검증용. SSE 형식으로 점진적 응답.
 * 실 LLM 통합은 producer 자리에 Genkit/Gemini 스트리밍 호출로 교체.
 */
import { NextRequest } from "next/server";
import { fakeStreamProducer, streamResponse } from "@/lib/ai/streaming";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const text =
    request.nextUrl.searchParams.get("text") ??
    "PRO ALI SMART 스트리밍 데모입니다. 본 응답은 점진적으로 전달됩니다.";
  return streamResponse((signal) => fakeStreamProducer(text, signal));
}
