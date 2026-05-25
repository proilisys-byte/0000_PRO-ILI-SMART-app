import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { AppError, handleRouteError } from '@/lib/errors';
import { SttOutputSchema } from '@/lib/schemas/stt';
import { trackedGeminiCall } from '@/lib/monitoring/ai-tracker';

const MAX_AUDIO_SIZE = 20 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/x-m4a',
  'audio/m4a',
  'audio/flac',
  'audio/x-flac',
]);

const EXTENSION_TO_MIME: Record<string, string> = {
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.flac': 'audio/flac',
};

const STT_PROMPT = [
  '다음 제조 현장 음성 녹음을 분석하여 공정명, 작업 수량, 불량 코드, 특이사항을 추출하세요.',
  '현장 작업자의 방언이나 부정확한 발음은 제조 도메인 맥락에서 보정하세요.',
  'process_name과 quantity는 반드시 채우고, defect_code와 notes는 해당 정보가 있을 때만 포함하세요.',
].join('\n');

function resolveAudioMimeType(file: File): string | null {
  const normalizedType = file.type.split(';')[0].trim().toLowerCase();
  if (normalizedType && ALLOWED_MIME_TYPES.has(normalizedType)) {
    return normalizedType === 'audio/mp3' ? 'audio/mpeg' : normalizedType;
  }

  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
  if (extension && extension in EXTENSION_TO_MIME) {
    return EXTENSION_TO_MIME[extension];
  }

  return null;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString('base64');
}

// ─── POST /api/v1/stt ───────────────────────────────────────
export async function POST(request: NextRequest) {
  let sessionId = 'sess_unknown';
  let userId: string | undefined;
  const traceId = request.headers.get('x-trace-id') || crypto.randomUUID();

  try {
    const mockUserCookie = request.cookies.get('mock-user');
    if (!mockUserCookie?.value) {
      throw new AppError(
        'AUTH_401_UNAUTHORIZED_ACCESS',
        '로그인이 필요합니다.',
        401
      );
    }

    const userContext = JSON.parse(decodeURIComponent(mockUserCookie.value));
    userId = userContext?.id;

    // query parameter에서 session_id 우선 추출 시도
    const querySessionId = request.nextUrl.searchParams.get('sessionId') || request.nextUrl.searchParams.get('session_id');
    if (querySessionId) {
      sessionId = querySessionId;
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio');

    // FormData에 sessionId가 지정된 경우 덮어쓰기
    const formSessionId = formData.get('sessionId') || formData.get('session_id');
    if (formSessionId && typeof formSessionId === 'string') {
      sessionId = formSessionId;
    }

    if (!(audioFile instanceof File)) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '업로드할 오디오 파일이 누락되었습니다.',
        400
      );
    }

    if (audioFile.size === 0) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '빈 오디오 파일은 처리할 수 없습니다.',
        400
      );
    }

    if (audioFile.size > MAX_AUDIO_SIZE) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '오디오 파일 크기는 최대 20MB까지 허용됩니다.',
        400
      );
    }

    const mimeType = resolveAudioMimeType(audioFile);
    if (!mimeType) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '지원하지 않는 오디오 형식입니다. (WAV, MP3, M4A, FLAC만 허용)',
        400
      );
    }

    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = arrayBufferToBase64(audioBuffer);

    // trackedGeminiCall을 사용하여 Gemini 호출 성능/결과 로깅
    const { output } = await trackedGeminiCall(
      () =>
        ai.generate({
          prompt: [
            { text: STT_PROMPT },
            {
              media: {
                url: `data:${mimeType};base64,${audioBase64}`,
              },
            },
          ],
          output: { schema: SttOutputSchema },
        }),
      {
        type: 'stt',
        session_id: sessionId,
        user_id: userId,
        trace_id: traceId,
        audio_length_sec: Math.round(audioFile.size / 32000), // 임의 근사 계산 또는 메타데이터
      }
    );

    if (!output) {
      throw new AppError(
        'EXT_502_EXTERNAL_SERVICE_ERROR',
        '음성 인식 결과를 생성하지 못했습니다.',
        502
      );
    }

    return NextResponse.json({
      success: true,
      data: output,
    });
  } catch (error) {
    return handleRouteError(error, {
      sessionId,
      userId,
      traceId,
      service: 'stt-service',
    });
  }
}

