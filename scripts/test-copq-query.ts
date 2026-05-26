import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';
import { calculateCopqForDate } from '../src/lib/copq/calculator';
import { GET as getCopqAnalytics } from '../src/app/api/v1/copq/analytics/route';
import { POST as postLeanDiagnose } from '../src/app/api/v1/lean/diagnose/route';

const prisma = new PrismaClient();

// Ground Truth Data (수작업 정답 데이터셋)
const GROUND_TRUTH = {
  summary: {
    defect: 430000,
    rework: 4500,
    waiting: 30000,
    overproduction: 340000,
    total: 804500,
  },
  daily: [
    { date: '2026-05-19', defect: 160000, rework: 500, waiting: 0, overproduction: 0, total: 160500 },
    { date: '2026-05-20', defect: 150000, rework: 1000, waiting: 15000, overproduction: 60000, total: 226000 },
    { date: '2026-05-21', defect: 0, rework: 0, waiting: 0, overproduction: 250000, total: 250000 },
    { date: '2026-05-22', defect: 0, rework: 0, waiting: 15000, overproduction: 0, total: 15000 },
    { date: '2026-05-23', defect: 120000, rework: 3000, waiting: 0, overproduction: 0, total: 123000 },
    { date: '2026-05-24', defect: 0, rework: 0, waiting: 0, overproduction: 30000, total: 30000 },
    { date: '2026-05-25', defect: 0, rework: 0, waiting: 0, overproduction: 0, total: 0 },
  ],
};

async function prepareDatabase() {
  console.log('🧹 [1/4] DB 데이터 클렌징 및 마스터 데이터 등록...');

  // 1. 테넌트 및 관리자 정보 조회/생성
  let tenant = await prisma.tenant.findFirst({ where: { name: '미래정밀' } });
  if (!tenant) {
    tenant = await prisma.tenant.create({ data: { name: '미래정밀', status: 'ACTIVE' } });
  }

  let adminRole = await prisma.rbacRole.findUnique({ where: { id: 'admin' } });
  if (!adminRole) {
    adminRole = await prisma.rbacRole.create({ data: { id: 'admin', description: 'Administrator' } });
  }

  let user = await prisma.user.findUnique({ where: { email: 'admin@mirae.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'admin@mirae.com',
        tenantId: tenant.id,
        roleId: adminRole.id,
        name: '미래정밀 관리자',
      },
    });
  }

  const tenantId = tenant.id;

  // 2. 관련 데이터 클렌징
  await prisma.copqMetric.deleteMany({ where: { tenantId } });
  await prisma.auditDataEntry.deleteMany({
    where: {
      session: { tenantId },
    },
  });
  await prisma.auditSession.deleteMany({ where: { tenantId } });
  await prisma.bom.deleteMany({ where: { tenantId } });
  await prisma.product.deleteMany({ where: { tenantId } });
  await prisma.process.deleteMany({ where: { tenantId } });
  await prisma.defect.deleteMany({ where: { tenantId } });

  // 3. 테스트용 마스터 데이터 적재
  // (1) 제품 마스터
  const products = [
    { tenantId, productCode: 'PROD001', name: '스마트 센서 A', unit: 'EA' },
    { tenantId, productCode: 'PROD002', name: '스마트 브래킷 B', unit: 'EA' },
  ];
  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  // (2) 공정 마스터
  const processes = [
    { tenantId, processCode: 'PROC001', name: '조립 공정', lineCode: 'L-01', cycleTimeSec: 30 },
    { tenantId, processCode: 'PROC002', name: '가공 공정', lineCode: 'L-02', cycleTimeSec: 120 },
  ];
  for (const proc of processes) {
    await prisma.process.create({ data: proc });
  }

  // (3) 불량 마스터
  const defects = [
    { tenantId, defectCode: 'D-001', name: '스크래치 불량', category: 'MATERIAL', severity: 'A' },
    { tenantId, defectCode: 'D-002', name: '크랙 불량', category: 'MACHINE', severity: 'S' },
    { tenantId, defectCode: 'D-003', name: '찍힘 불량', category: 'MAN', severity: 'B' },
  ];
  for (const def of defects) {
    await prisma.defect.create({ data: def });
  }

  // 4. 7일간의 생산 수집 데이터(AuditDataEntry) 생성
  console.log('📥 [2/4] 7일간의 AuditDataEntry 및 세션 테스트 데이터 적재...');
  const session = await prisma.auditSession.create({
    data: {
      tenantId,
      userId: user.id,
      status: 'COMPLETED',
      startTime: new Date('2026-05-19T08:00:00Z'),
      endTime: new Date('2026-05-25T18:00:00Z'),
    },
  });

  const dailyEntries = [
    // 2026-05-19 (불량 D-001 2개, 조립 공정)
    {
      date: '2026-05-19',
      rawData: { text: '조립 공정에서 스마트 센서 A 작업 중 스크래치 불량 2건 발생' },
      mappedData: {
        productCode: 'PROD001',
        process: 'PROC001',
        totalQty: 80,
        defectQty: 2,
        defectCode: 'D-001',
        notes: '정상가동 완료',
      },
    },
    // 2026-05-20 (불량 D-002 1개, 가공 공정, 대기 지연, 초과 생산 120개)
    {
      date: '2026-05-20',
      rawData: { text: '가공 공정 기동 중 설비 이상 대기 지연 발생으로 120개 생산' },
      mappedData: {
        productCode: 'PROD002',
        process: 'PROC002',
        totalQty: 120,
        defectQty: 1,
        defectCode: 'D-002',
        notes: '설비 이상으로 인한 대기 지연 발생',
      },
    },
    // 2026-05-21 (정상, 초과 생산 150개)
    {
      date: '2026-05-21',
      rawData: { text: '스마트 센서 A 정상 완료 150개 적재' },
      mappedData: {
        productCode: 'PROD001',
        process: 'PROC001',
        totalQty: 150,
        defectQty: 0,
        notes: '정상 완료',
      },
    },
    // 2026-05-22 (대기 발생, 90개 생산)
    {
      date: '2026-05-22',
      rawData: { text: '가공 공정 작업 대기 중' },
      mappedData: {
        productCode: 'PROD002',
        process: 'PROC002',
        totalQty: 90,
        defectQty: 0,
        notes: '작업 대기 중',
      },
    },
    // 2026-05-23 (불량 D-003 3개, 가공 공정, 100개 생산)
    {
      date: '2026-05-23',
      rawData: { text: '스마트 센서 A 100개 생산 중 찍힘 3건' },
      mappedData: {
        productCode: 'PROD001',
        process: 'PROC002',
        totalQty: 100,
        defectQty: 3,
        defectCode: 'D-003',
        notes: '정상 완료',
      },
    },
    // 2026-05-24 (정상, 초과 생산 110개)
    {
      date: '2026-05-24',
      rawData: { text: '스마트 브래킷 B 110개 완료' },
      mappedData: {
        productCode: 'PROD002',
        process: 'PROC001',
        totalQty: 110,
        defectQty: 0,
        notes: '정상 완료',
      },
    },
    // 2026-05-25 (정상, 70개 생산)
    {
      date: '2026-05-25',
      rawData: { text: '스마트 센서 A 정상 가동 70개 생산 완료' },
      mappedData: {
        productCode: 'PROD001',
        process: 'PROC001',
        totalQty: 70,
        defectQty: 0,
        notes: '정상 완료',
      },
    },
  ];

  for (const entry of dailyEntries) {
    const entryDate = new Date(`${entry.date}T12:00:00Z`); // UTC 기준 동일 날짜 범위에 들어가도록 낮 12시로 설정
    await prisma.auditDataEntry.create({
      data: {
        sessionId: session.id,
        rawData: entry.rawData,
        mappedData: entry.mappedData,
        createdAt: entryDate,
      },
    });
  }

  return { tenantId, adminUser: user };
}

async function testDirectCalculation(tenantId: string) {
  console.log('🧪 [3/4] 계산 엔진(calculateCopqForDate) 단위 검증 시작...');

  for (const expectedDaily of GROUND_TRUTH.daily) {
    const date = new Date(`${expectedDaily.date}T12:00:00Z`);
    const result = await calculateCopqForDate(tenantId, date);

    const diff = Math.abs(result.defect - expectedDaily.defect) +
                 Math.abs(result.rework - expectedDaily.rework) +
                 Math.abs(result.waiting - expectedDaily.waiting) +
                 Math.abs(result.overproduction - expectedDaily.overproduction);

    if (diff > 0) {
      console.error(`❌ [오류] ${expectedDaily.date} 계산 불일치!`);
      console.error('Expected:', expectedDaily);
      console.error('Actual:', result);
      throw new Error(`Calculation mismatch on ${expectedDaily.date}`);
    }
    console.log(`  - ${expectedDaily.date}: 계산 검증 성공 (일치)`);
  }
  console.log('✅ 계산 엔진 단위 검증 통과!');
}

async function runDirectRouteHandlerTests(user: any) {
  console.log('🚀 [4/4] API Route Handler E2E 연동 및 성능/회계 정확도 검증 시작...');

  const cookieValue = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.roleId,
    tenant_id: user.tenantId,
  });

  const cookieHeader = `mock-user=${encodeURIComponent(cookieValue)}`;

  // --- 1. GET /api/v1/copq/analytics 검증 ---
  console.log('\n(1) GET /api/v1/copq/analytics 직접 호출...');
  
  const startReq = Date.now();
  const getReq = new NextRequest(
    `http://localhost:9002/api/v1/copq/analytics?startDate=2026-05-19&endDate=2026-05-25`,
    {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
      },
    }
  );
  
  const getRes = await getCopqAnalytics(getReq);
  const latencyGet = Date.now() - startReq;
  
  if (!getRes.ok) {
    throw new Error(`GET API failed with status ${getRes.status}: ${await getRes.text()}`);
  }

  const getBody = await getRes.json();
  console.log(`  - API 호출 속도: ${latencyGet}ms (SLA 기준: <= 10,000ms)`);
  if (latencyGet > 10000) {
    throw new Error(`Latency SLA exceeded: ${latencyGet}ms`);
  }

  // 정확도 검증
  const apiSummary = getBody.data.summary;
  const gtSummary = GROUND_TRUTH.summary;

  console.log('  [비교] API vs Ground Truth (요약)');
  console.log('  - Defect Cost:', apiSummary.defect, 'vs', gtSummary.defect);
  console.log('  - Rework Cost:', apiSummary.rework, 'vs', gtSummary.rework);
  console.log('  - Waiting Cost:', apiSummary.waiting, 'vs', gtSummary.waiting);
  console.log('  - Overproduction Cost:', apiSummary.overproduction, 'vs', gtSummary.overproduction);
  console.log('  - Total Cost:', apiSummary.total, 'vs', gtSummary.total);

  const errorRate = Math.abs(apiSummary.total - gtSummary.total) / gtSummary.total;
  const accuracy = (1 - errorRate) * 100;
  console.log(`  - 요약 오차율: ${(errorRate * 100).toFixed(4)}% (정확도: ${accuracy.toFixed(2)}%)`);
  
  if (accuracy < 98) {
    throw new Error(`Accuracy target not met: ${accuracy.toFixed(2)}% (Target: >= 98%)`);
  }
  console.log('  - 일자별 데이터 대조 검증...');
  
  getBody.data.daily.forEach((dayData: any) => {
    const expected = GROUND_TRUTH.daily.find(d => d.date === dayData.date);
    if (!expected) {
      throw new Error(`Unexpected date in API response: ${dayData.date}`);
    }
    const dayDiff = Math.abs(dayData.defect - expected.defect) +
                     Math.abs(dayData.rework - expected.rework) +
                     Math.abs(dayData.waiting - expected.waiting) +
                     Math.abs(dayData.overproduction - expected.overproduction) +
                     Math.abs(dayData.total - expected.total);
    if (dayDiff > 0) {
      throw new Error(`Daily cost mismatch on ${dayData.date}`);
    }
  });
  console.log('  ✅ GET API 검증 성공!');

  // --- 2. POST /api/v1/lean/diagnose 검증 ---
  console.log('\n(2) POST /api/v1/lean/diagnose 직접 호출 (하위 호환)...');
  
  const startPost = Date.now();
  const postReq = new NextRequest(
    `http://localhost:9002/api/v1/lean/diagnose`,
    {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        site_id: 'dummy-site-id',
        period_start: '2026-05-19',
        period_end: '2026-05-25',
      }),
    }
  );

  const postRes = await postLeanDiagnose(postReq);
  const latencyPost = Date.now() - startPost;

  if (!postRes.ok) {
    throw new Error(`POST API failed with status ${postRes.status}: ${await postRes.text()}`);
  }

  const postBody = await postRes.json();
  console.log(`  - API 호출 속도: ${latencyPost}ms (SLA 기준: <= 10,000ms)`);
  if (latencyPost > 10000) {
    throw new Error(`Latency SLA exceeded: ${latencyPost}ms`);
  }

  // 대략적인 검사 (GET과 동일해야 함)
  if (postBody.data.summary.total !== gtSummary.total) {
    throw new Error(`POST summary total mismatch. Expected ${gtSummary.total}, got ${postBody.data.summary.total}`);
  }
  console.log('  ✅ POST API 검증 성공!');

  // --- 3. 성능 인덱스 동작 속도 2차 검증 (Cache Hit 상태) ---
  console.log('\n(3) 성능 인덱스 캐시 속도 검증 (2차 호출)...');
  const startCache = Date.now();
  const getCacheReq = new NextRequest(
    `http://localhost:9002/api/v1/copq/analytics?startDate=2026-05-19&endDate=2026-05-25`,
    {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
      },
    }
  );
  
  const getCacheRes = await getCopqAnalytics(getCacheReq);
  const latencyCache = Date.now() - startCache;
  if (!getCacheRes.ok) throw new Error('Cache fetch failed');
  console.log(`  - 캐시 조회 응답 속도: ${latencyCache}ms (목표: < 50ms)`);
}

async function main() {
  console.log('==================================================');
  console.log('      COPQ 4대 낭비 환산 산식 및 API 직접 검증 테스트      ');
  console.log('==================================================\n');

  try {
    // 1. DB 준비
    const { tenantId, adminUser } = await prepareDatabase();

    // 2. 비즈니스 로직 단위 테스트
    await testDirectCalculation(tenantId);

    // 3. API Handler E2E 테스트 직접 호출
    await runDirectRouteHandlerTests(adminUser);

    console.log('\n==================================================');
    console.log('   🎉 [성공] COPQ 4대 낭비 환산 및 API 검증 성공! (100% 통과)');
    console.log('==================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n🚨 [실패] 테스트 실행 중 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
