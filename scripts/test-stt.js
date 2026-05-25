const { PrismaClient } = require('@prisma/client');

function createSilentWav(durationSec = 0.5, sampleRate = 16000) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);

  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

function validateSttOutput(data) {
  if (typeof data.process_name !== 'string' || data.process_name.length === 0) {
    throw new Error('Invalid process_name');
  }

  if (typeof data.quantity !== 'number' || !Number.isInteger(data.quantity)) {
    throw new Error('Invalid quantity');
  }

  if (data.defect_code !== undefined && typeof data.defect_code !== 'string') {
    throw new Error('Invalid defect_code');
  }

  if (data.notes !== undefined && typeof data.notes !== 'string') {
    throw new Error('Invalid notes');
  }
}

async function uploadAudio(cookieHeader, wavBuffer) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const bodyParts = [
    `--${boundary}\r\n`,
    'Content-Disposition: form-data; name="audio"; filename="test-stt.wav"\r\n',
    'Content-Type: audio/wav\r\n\r\n',
    wavBuffer,
    `\r\n--${boundary}--\r\n`,
  ];

  const body = Buffer.concat(
    bodyParts.map((part) => (Buffer.isBuffer(part) ? part : Buffer.from(part, 'utf8')))
  );

  const response = await fetch('http://localhost:9002/api/v1/stt', {
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
    console.log('🔍 STT API 테스트 시작...');

    const user = await prisma.user.findUnique({
      where: { email: 'admin@mirae.com' },
    });

    if (!user) {
      throw new Error('Seed user not found. Please run seed first.');
    }

    const mockUserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roleId,
      tenant_id: user.tenantId,
    };
    const cookieHeader = `mock-user=${encodeURIComponent(JSON.stringify(mockUserPayload))}`;

    const wavBuffer = createSilentWav();
    const { status, json } = await uploadAudio(cookieHeader, wavBuffer);

    console.log('STT Response Status:', status);
    console.log('STT Response Body:', JSON.stringify(json, null, 2));

    if (status !== 200) {
      throw new Error(`Unexpected HTTP status: ${status}`);
    }

    if (!json.success) {
      throw new Error(`STT API failed: ${JSON.stringify(json)}`);
    }

    validateSttOutput(json.data);
    console.log('✅ STT API 자가진단 테스트 통과!!');
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
