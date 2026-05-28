/**
 * Streaming wrapper — T4-004 (REQ-NF-001)
 *
 * Vercel Hobby 60s 제한을 회피하기 위해 LLM 응답을 ReadableStream 으로 노출.
 * 클라이언트는 청크 단위로 즉시 수신하여 UX 멈춤을 방지한다.
 *
 * AbortSignal 을 전달받아 탭 닫힘/네비게이션 시 안전 취소.
 */

export interface StreamChunk {
  text: string;
  done?: boolean;
}

export type ChunkProducer = (
  signal: AbortSignal,
) => AsyncIterable<StreamChunk>;

export function streamResponse(
  producer: ChunkProducer,
  init: { keepAliveMs?: number } = {},
): Response {
  const keepAliveMs = init.keepAliveMs ?? 5000;
  const encoder = new TextEncoder();
  const controller = new AbortController();
  const stream = new ReadableStream({
    async start(c) {
      const heartbeat = setInterval(() => {
        c.enqueue(encoder.encode(": ping\n\n"));
      }, keepAliveMs);
      try {
        for await (const chunk of producer(controller.signal)) {
          c.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
          if (chunk.done) break;
        }
        c.enqueue(encoder.encode("event: done\ndata: end\n\n"));
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        c.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({ message })}\n\n`,
          ),
        );
      } finally {
        clearInterval(heartbeat);
        c.close();
      }
    },
    cancel() {
      controller.abort();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function* fakeStreamProducer(
  text: string,
  signal: AbortSignal,
  chunkSize = 20,
): AsyncIterable<StreamChunk> {
  for (let i = 0; i < text.length; i += chunkSize) {
    if (signal.aborted) break;
    yield { text: text.slice(i, i + chunkSize) };
    await new Promise((r) => setTimeout(r, 50));
  }
  yield { text: "", done: true };
}
