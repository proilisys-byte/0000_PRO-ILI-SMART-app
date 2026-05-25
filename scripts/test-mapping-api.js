const { PrismaClient } = require('@prisma/client');
const { spawn } = require('child_process');
const http = require('http');

const prisma = new PrismaClient();

// Helper to wait
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to check if server is up
function isServerUp(port) {
  return new Promise((resolve) => {
    const req = http.request({
      host: 'localhost',
      port,
      path: '/api/auth/login', // Simple check
      method: 'GET',
      timeout: 1000
    }, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function runApiTests() {
  console.log('--- [T1-008] Audit 매핑 API 엔드포인트 E2E 테스트 시작 ---');
  let devProcess = null;
  const PORT = 9002;

  try {
    // 1. 데이터베이스에서 테스트용 세션 ID 조회
    console.log('DB에서 테스트용 세션 조회 중...');
    const session = await prisma.auditSession.findFirst({
      include: { dataEntries: true }
    });

    if (!session) {
      throw new Error('데이터베이스에 세션 데이터가 없습니다. 먼저 prisma/seed.ts를 실행하세요.');
    }
    console.log(`조회된 세션 ID: ${session.id} (엔트리 개수: ${session.dataEntries.length})`);

    // 2. Next.js 개발 서버 실행 (MOCK_AI=true 활성화)
    console.log(`포트 ${PORT}에서 Next.js 개발 서버 구동 중...`);
    devProcess = spawn('npx', ['next', 'dev', '-p', PORT.toString()], {
      env: { ...process.env, MOCK_AI: 'true' },
      shell: true,
      stdio: 'ignore'
    });

    // 서버가 켜질 때까지 대기 (최대 30초)
    let retries = 30;
    while (retries > 0) {
      const up = await isServerUp(PORT);
      if (up) {
        console.log('Next.js 서버 구동 완료!');
        break;
      }
      await sleep(1000);
      retries--;
    }

    if (retries === 0) {
      throw new Error('Next.js 개발 서버를 구동하지 못했습니다.');
    }

    // 3. API 요청 파라미터 및 Mock 사용자 인증 정보 구성
    const user = await prisma.user.findUnique({
      where: { email: 'admin@mirae.com' },
    });

    if (!user) {
      throw new Error('미래정밀 관리자 사용자를 찾을 수 없습니다.');
    }

    const mockUserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roleId,
      tenant_id: user.tenantId,
    };
    const cookieHeader = `mock-user=${encodeURIComponent(JSON.stringify(mockUserPayload))}`;

    // 4. Case A: sessionId 기반 API 호출 테스트
    console.log('\n[테스트 A] sessionId 기반 API 매핑 호출...');
    const responseA = await fetch(`http://localhost:${PORT}/api/v1/audit/map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'x-trace-id': 'test-trace-id-abc'
      },
      body: JSON.stringify({ sessionId: session.id })
    });

    console.log(`Status A: ${responseA.status}`);
    const jsonA = await responseA.json();
    console.log('Response A Body:', JSON.stringify(jsonA, null, 2));

    if (responseA.status !== 200 || !jsonA.success) {
      throw new Error(`API 호출 실패: A (상태코드 ${responseA.status})`);
    }

    // 5. Case B: entries 직접 제공 API 호출 테스트
    console.log('\n[테스트 B] entries 배열 직접 주입 API 호출...');
    const responseB = await fetch(`http://localhost:${PORT}/api/v1/audit/map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify({
        entries: [
          { process_name: '조립', quantity: 80, notes: '정상 생산 완료' },
          { process_name: '도색', quantity: 12, defect_code: 'D-003', notes: '찍힘 불량 발생' }
        ]
      })
    });

    console.log(`Status B: ${responseB.status}`);
    const jsonB = await responseB.json();
    console.log('Response B Body:', JSON.stringify(jsonB, null, 2));

    if (responseB.status !== 200 || !jsonB.success) {
      throw new Error(`API 호출 실패: B (상태코드 ${responseB.status})`);
    }

    // 6. Case C: 비정상 권한 접근 테스트 (쿠키 없음)
    console.log('\n[테스트 C] 인증 쿠키 미포함 시 401 차단 검증...');
    const responseC = await fetch(`http://localhost:${PORT}/api/v1/audit/map`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id })
    });

    console.log(`Status C: ${responseC.status} (기대값: 401)`);
    const jsonC = await responseC.json();
    if (responseC.status !== 401 || jsonC.success) {
      throw new Error('인증쿠키가 없는데 401로 차단되지 않았습니다.');
    }
    console.log('✅ 인증 차단 확인 성공!');

    // 7. Case D: 감사 로그 테이블 적재 여부 확인
    console.log('\n[테스트 D] API 호출에 따른 감사 로그 적재 검증...');
    const latestLog = await prisma.auditLog.findFirst({
      where: { action: 'ISO9001_MAPPING', changedBy: user.id },
      orderBy: { createdAt: 'desc' }
    });

    if (!latestLog) {
      throw new Error('감사 로그가 적재되지 않았습니다.');
    }
    console.log(`최근 적재된 감사 로그 ID: ${latestLog.id}`);
    console.log(`감사 로그 기록된 세션 ID: ${latestLog.recordId}`);
    console.log('✅ 감사 로그 적재 성공 확인!');

    console.log('\n🎉 [성공] 모든 E2E API 엔드포인트 테스트 성공 통과! 🎉');
  } catch (err) {
    console.error('❌ E2E 테스트 에러 발생:', err.message);
    process.exit(1);
  } finally {
    if (devProcess) {
      console.log('개발 서버 프로세스 종료 중...');
      devProcess.kill('SIGINT');
    }
    await prisma.$disconnect();
  }
}

runApiTests();
