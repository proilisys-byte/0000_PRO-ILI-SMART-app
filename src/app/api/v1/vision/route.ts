import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { AppError, handleRouteError } from '@/lib/errors';
import { VisionAnalysisSchema } from '@/lib/schemas/vision';
import { trackedGeminiCall } from '@/lib/monitoring/ai-tracker';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const EXTENSION_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

const SYSTEM_PROMPT = [
  'System: 당신은 반도체 소부장 제조 공정 현장의 정밀 품질 검사를 담당하는 전문 Vision AI입니다.',
  '현장 작업자가 촬영한 이미지를 분석하여 공정 상태, 불량 유형, 그리고 시각적으로 확인 가능한 측정값을 객관적으로 추출하세요.',
  '',
  '[규칙]',
  '1. 주어진 JSON 스키마에 정확히 맞추어 응답을 생성해야 합니다. 마크다운이나 부가 설명은 절대 금지합니다.',
  '2. 발견된 모든 객체와 결함을 `detected_items` 배열에 포함하십시오.',
  '3. 이미지 품질이 나쁘거나 결함 판단이 모호한 경우(confidence_score < 0.7) 또는 저조도인 경우, `needs_review`를 반드시 `true`로 설정하고 `overall_result`를 `needs_review`로 지정하세요.',
  '4. 환각(Hallucination) 방지: 사진에 명확히 보이지 않는 결함이나 숫자를 유추하여 적지 마십시오.',
].join('\n');

function resolveImageMimeType(file: File): string | null {
  const normalizedType = file.type.split(';')[0].trim().toLowerCase();
  if (normalizedType && ALLOWED_MIME_TYPES.has(normalizedType)) {
    return normalizedType === 'image/jpg' ? 'image/jpeg' : normalizedType;
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

// ─── POST /api/v1/vision ────────────────────────────────────
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

    // query parameter에서 session_id 및 파라미터 추출 시도
    const querySessionId =
      request.nextUrl.searchParams.get('sessionId') ||
      request.nextUrl.searchParams.get('session_id');
    if (querySessionId) {
      sessionId = querySessionId;
    }

    const formData = await request.formData();
    const imageFile = formData.get('image');

    const formSessionId =
      formData.get('sessionId') || formData.get('session_id');
    if (formSessionId && typeof formSessionId === 'string') {
      sessionId = formSessionId;
    }

    const processCode =
      formData.get('processCode') ||
      formData.get('process_code') ||
      'unknown_proc';
    const expectedItemsRaw =
      formData.get('expectedItems') ||
      formData.get('expected_items') ||
      '';
    
    const expectedItems = String(expectedItemsRaw)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!(imageFile instanceof File)) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '업로드할 이미지 파일이 누락되었습니다.',
        400
      );
    }

    if (imageFile.size === 0) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '빈 이미지 파일은 처리할 수 없습니다.',
        400
      );
    }

    if (imageFile.size > MAX_IMAGE_SIZE) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '이미지 파일 크기는 최대 2MB까지 허용됩니다.',
        400
      );
    }

    const mimeType = resolveImageMimeType(imageFile);
    if (!mimeType) {
      throw new AppError(
        'VAL_400_VALIDATION_FAILED',
        '지원하지 않는 이미지 형식입니다. (JPEG, PNG, WEBP만 허용)',
        400
      );
    }

    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = arrayBufferToBase64(imageBuffer);

    const userPrompt = [
      '[컨텍스트 정보]',
      `- 현재 세션 ID: ${sessionId}`,
      `- 타겟 공정 코드: ${processCode}`,
      `- 기대 검사 항목(BOM/매뉴얼 기준): ${expectedItems.join(', ')}`,
      '',
      '이 이미지를 바탕으로 기대 검사 항목의 정상 조립 여부 및 표면 불량(크랙, 스크래치, 이물질 등) 유무를 분석해 주십시오.',
    ].join('\n');

    const isMock = process.env.MOCK_AI === 'true' || !process.env.GEMINI_API_KEY;

    let output: any;

    if (isMock) {
      // Simulate low-light vs normal light detection based on expectedItems or sessionId
      const isLowLight = expectedItems.includes('needs_review') || sessionId.includes('low') || String(processCode).includes('low');
      
      if (isLowLight) {
        output = {
          analysis_type: 'visual_inspection',
          process_code: String(processCode),
          detected_items: [
            {
              item_type: 'defect',
              label: '저조도 판정 불가',
              location: '전체 화면',
              severity: 'minor',
              confidence_score: 0.50,
            },
          ],
          overall_result: 'needs_review',
          needs_review: true,
          raw_description: '저조도로 인해 분석이 불가하여 수동 검토 필요를 요청합니다 (MOCK).',
        };
      } else {
        output = {
          analysis_type: 'visual_inspection',
          process_code: String(processCode),
          detected_items: expectedItems.map((item, idx) => ({
            item_type: 'work_status',
            label: item,
            location: idx === 0 ? '상단 중앙 영역' : '우측 결합부',
            severity: 'ok',
            confidence_score: 0.95,
          })),
          overall_result: 'pass',
          needs_review: false,
          raw_description: '모든 기대 검사 항목이 정상으로 탐지되었습니다 (MOCK).',
        };
      }

      // Track the simulated call in audit logs
      await trackedGeminiCall(
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          return output;
        },
        {
          type: 'vision',
          session_id: sessionId,
          user_id: userId,
          trace_id: traceId,
          process_code: String(processCode),
          is_mock: true,
        }
      );
    } else {
      // trackedGeminiCall을 사용하여 Gemini 호출 성능/결과 로깅
      const { output: liveOutput } = await trackedGeminiCall(
        () =>
          ai.generate({
            prompt: [
              { text: SYSTEM_PROMPT },
              { text: userPrompt },
              {
                media: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
            ],
            output: { schema: VisionAnalysisSchema },
          }),
        {
          type: 'vision',
          session_id: sessionId,
          user_id: userId,
          trace_id: traceId,
          process_code: String(processCode),
        }
      );
      output = liveOutput;
    }

    if (!output) {
      throw new AppError(
        'EXT_502_EXTERNAL_SERVICE_ERROR',
        '이미지 분석 결과를 생성하지 못했습니다.',
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
      service: 'vision-service',
    });
  }
}
