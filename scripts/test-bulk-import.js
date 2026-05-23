const { PrismaClient } = require('@prisma/client');

async function runTests() {
  const prisma = new PrismaClient();
  try {
    console.log('🔍 테스트 시작...');

    // 1. 테스트 유저 조회
    const user = await prisma.user.findUnique({
      where: { email: 'admin@mirae.com' }
    });
    if (!user) {
      throw new Error('Seed user not found. Please run seed first.');
    }
    const tenantId = user.tenantId;

    // 1.5. 테스트 실행용 마스터 데이터 클렌징 (멱등성 보장)
    console.log('🧹 테스트용 데이터 정리 중...');
    await prisma.bom.deleteMany({ where: { tenantId } });
    await prisma.product.deleteMany({ where: { tenantId } });
    await prisma.process.deleteMany({ where: { tenantId } });
    await prisma.defect.deleteMany({ where: { tenantId } });

    // 2. HTTP 쿠키 정보 생성
    const mockUserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roleId,
      tenant_id: user.tenantId,
    };
    const cookieHeader = `mock-user=${encodeURIComponent(JSON.stringify(mockUserPayload))}`;

    const baseUrl = 'http://localhost:9002';

    // 헬퍼: 파일 업로드 요청 함수 (FormData 지원)
    async function uploadCsv(fileName, csvContent, importType) {
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
      let body = '';
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name="import_type"\r\n\r\n${importType}\r\n`;
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`;
      body += `Content-Type: text/csv\r\n\r\n${csvContent}\r\n`;
      body += `--${boundary}--\r\n`;

      const response = await fetch(`${baseUrl}/api/v1/bulk-imports`, {
        method: 'POST',
        headers: {
          'Cookie': cookieHeader,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
        body: body,
      });

      return response.json();
    }

    // 헬퍼: GET 요청
    async function getApi(urlPath) {
      const response = await fetch(`${baseUrl}${urlPath}`, {
        headers: {
          'Cookie': cookieHeader,
        },
      });
      return response.json();
    }

    console.log('--- TEST 1: 제품 마스터 업로드 (정상 & 오류 혼합) ---');
    const productCsv = `product_code,product_name,specification,unit,client_code,is_active
PROD001,스마트 센서 A,100x100mm,EA,,TRUE
PROD002,스마트 브래킷 B,SUS304,BOX,,TRUE
PROD_ERR,오류 규격 C,,EA,,INVALID_BOOL`; // 세 번째 행은 boolean 형식 에러여야 함

    const res1 = await uploadCsv('products.csv', productCsv, 'product');
    console.log('Upload Response:', res1);

    if (!res1.success) {
      throw new Error(`Upload Product failed: ${JSON.stringify(res1)}`);
    }

    const jobId = res1.data.job_id;
    console.log(`Created Job ID: ${jobId}`);

    // 작업 결과 조회
    const statusRes = await getApi(`/api/v1/bulk-imports/${jobId}`);
    console.log('Job Status Response:', JSON.stringify(statusRes, null, 2));
    if (!statusRes.success || statusRes.data.status !== 'completed') {
      throw new Error('Job status is not completed');
    }
    if (statusRes.data.success_count !== 2 || statusRes.data.error_count !== 2) {
      throw new Error(`Count mismatch: expected 2 success, 2 errors. Got ${statusRes.data.success_count} success, ${statusRes.data.error_count} error.`);
    }

    // 실패 상세 조회
    const failRes = await getApi(`/api/v1/bulk-imports/${jobId}/failures`);
    console.log('Job Failures Response:', JSON.stringify(failRes, null, 2));
    if (!failRes.success || failRes.data.errors.length !== 2) {
      throw new Error('Failures response mismatch');
    }

    // DB 조회 검증
    const dbProducts = await prisma.product.findMany({ where: { tenantId } });
    console.log(`DB Products count: ${dbProducts.length}`);
    if (dbProducts.length !== 2) {
      throw new Error('Expected 2 products in DB');
    }

    console.log('--- TEST 2: BOM 참조 무결성 오류 테스트 ---');
    const bomCsv = `parent_item_code,child_item_code,quantity,unit,valid_from,valid_to
PROD001,PROD002,2.5,EA,2026-01-01,2026-12-31
PROD001,NON_EXISTENT_PART,1,EA,2026-01-01,`; // 두 번째 행은 존재하지 않는 부품코드로 에러 발생해야 함

    const res2 = await uploadCsv('boms.csv', bomCsv, 'bom');
    console.log('BOM Upload Response:', res2);
    const bomJobId = res2.data.job_id;

    const bomStatusRes = await getApi(`/api/v1/bulk-imports/${bomJobId}`);
    console.log('BOM Job Status:', bomStatusRes);
    if (bomStatusRes.data.success_count !== 1 || bomStatusRes.data.error_count !== 1) {
      throw new Error(`BOM Count mismatch. Got success=${bomStatusRes.data.success_count}, error=${bomStatusRes.data.error_count}`);
    }

    // DB BOM 검사
    const dbBoms = await prisma.bom.findMany({ where: { tenantId } });
    console.log(`DB BOMs count: ${dbBoms.length}`);
    if (dbBoms.length !== 1) {
      throw new Error('Expected 1 BOM in DB');
    }

    console.log('--- TEST 3: 전체 배치 목록 페이징 조회 ---');
    const listRes = await getApi('/api/v1/bulk-imports?page=1&limit=5');
    console.log('List Response:', listRes);
    if (!listRes.success || listRes.data.list.length < 2) {
      throw new Error('List response failed');
    }

    console.log('--- TEST 4: Audit Log 검증 ---');
    const auditLogs = await prisma.auditLog.findMany({
      where: { tenantId, action: 'BULK_IMPORT' }
    });
    console.log(`Audit Logs count: ${auditLogs.length}`);
    if (auditLogs.length < 2) {
      throw new Error('Audit logs missing');
    }

    console.log('✅ 모든 자가진단 테스트 통과!!');
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
