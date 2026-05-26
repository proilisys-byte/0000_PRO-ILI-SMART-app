import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

async function uploadImage(cookieHeader: string, imageBuffer: Buffer): Promise<{ status: number; json: any }> {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  
  const bodyParts = [
    `--${boundary}\r\n`,
    'Content-Disposition: form-data; name="image"; filename="vision_sample_001.webp"\r\n',
    'Content-Type: image/webp\r\n\r\n',
    imageBuffer,
    `\r\n--${boundary}\r\n`,
    'Content-Disposition: form-data; name="sessionId"\r\n\r\n',
    'sess_test_123\r\n',
    `--${boundary}\r\n`,
    'Content-Disposition: form-data; name="processCode"\r\n\r\n',
    'P-ASM-02\r\n',
    `--${boundary}\r\n`,
    'Content-Disposition: form-data; name="expectedItems"\r\n\r\n',
    '오링안착, 핀조립상태\r\n',
    `--${boundary}--\r\n`,
  ];

  const body = Buffer.concat(
    bodyParts.map((part) => (Buffer.isBuffer(part) ? part : Buffer.from(part, 'utf8')))
  );

  const response = await fetch('http://localhost:9002/api/v1/vision', {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  return {
    status: response.status,
    json: await response.json(),
  };
}

async function runTests() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Vision AI API 엔드포인트 통합 테스트 시작...');

    const user = await prisma.user.findFirst({
      where: { email: 'admin@mirae.com' },
    });

    if (!user) {
      throw new Error('데이터베이스에서 admin@mirae.com 사용자를 찾을 수 없습니다. 시드를 먼저 기동하세요.');
    }

    const mockUserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roleId,
      tenant_id: user.tenantId,
    };
    const cookieHeader = `mock-user=${encodeURIComponent(JSON.stringify(mockUserPayload))}`;

    const imagePath = path.resolve(__dirname, '../data/golden/vision/images/vision_sample_001.webp');
    if (!fs.existsSync(imagePath)) {
      throw new Error(`테스트용 플레이스홀더 이미지 파일이 없습니다: ${imagePath}`);
    }
    const imageBuffer = fs.readFileSync(imagePath);

    console.log('API 호출 전송 중 (http://localhost:9002/api/v1/vision)...');
    const { status, json } = await uploadImage(cookieHeader, imageBuffer);

    console.log('HTTP 응답 상태 코드:', status);
    console.log('HTTP 응답 바디:', JSON.stringify(json, null, 2));

    if (status !== 200) {
      throw new Error(`예상치 못한 HTTP 상태 코드: ${status}`);
    }

    if (!json.success) {
      throw new Error(`Vision AI API 실패: ${JSON.stringify(json)}`);
    }

    const data = json.data;
    if (data.analysis_type !== 'visual_inspection') {
      throw new Error(`분석 타입 필드가 맞지 않습니다: ${data.analysis_type}`);
    }
    if (!Array.isArray(data.detected_items)) {
      throw new Error(`detected_items 필드가 배열이 아닙니다.`);
    }

    console.log('✅ Vision AI API 엔드포인트 통합 테스트 통과!!');
  } catch (error: any) {
    console.error('❌ 테스트 중 예외 발생:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
