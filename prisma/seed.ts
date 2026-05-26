import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function disableTriggers() {
  console.log("🔓 기존 트리거 일시 비활성화 중...");
  try {
    const dbTypeResult = await prisma.$queryRawUnsafe<any[]>(`SELECT sqlite_version()`).catch(() => null);
    const isSQLite = !!dbTypeResult;
    
    if (isSQLite) {
      await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS prevent_audit_log_update`);
      await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS prevent_audit_log_delete`);
      console.log("✅ SQLite 기존 트리거 해제 완료.");
    } else {
      await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_prevent_audit_log_update_delete ON audit_log;`);
      console.log("✅ PostgreSQL 기존 트리거 해제 완료.");
    }
  } catch (error) {
    console.warn("⚠️ 트리거 비활성화 중 경고:", error);
  }
}

async function applyTriggers() {
  console.log("🔒 감사로그 위변조 방지 트리거 및 RLS 설정 중...");
  try {
    const dbTypeResult = await prisma.$queryRawUnsafe<any[]>(`SELECT sqlite_version()`).catch(() => null);
    const isSQLite = !!dbTypeResult;
    
    if (isSQLite) {
      console.log("ℹ️ SQLite 데이터베이스 감지. SQLite 트리거 적용...");
      await prisma.$executeRawUnsafe(`
        CREATE TRIGGER IF NOT EXISTS prevent_audit_log_update
        BEFORE UPDATE ON audit_log
        BEGIN
          SELECT RAISE(FAIL, 'COMPLIANCE LOCKUP: Modification or deletion of audit_log records is strictly prohibited.');
        END;
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TRIGGER IF NOT EXISTS prevent_audit_log_delete
        BEFORE DELETE ON audit_log
        BEGIN
          SELECT RAISE(FAIL, 'COMPLIANCE LOCKUP: Modification or deletion of audit_log records is strictly prohibited.');
        END;
      `);
      console.log("✅ SQLite 트리거 적용 완료!");
    } else {
      console.log("ℹ️ PostgreSQL 데이터베이스 감지. PostgreSQL 트리거 및 RLS 적용...");
      
      // 1. 트리거 함수 생성
      await prisma.$executeRawUnsafe(`
        CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
        RETURNS TRIGGER AS $$
        BEGIN
          RAISE EXCEPTION 'COMPLIANCE LOCKUP: Modification or deletion of audit_log records is strictly prohibited.';
        END;
        $$ LANGUAGE plpgsql;
      `);
      
      // 2. 트리거 생성
      await prisma.$executeRawUnsafe(`
        DROP TRIGGER IF EXISTS trg_prevent_audit_log_update_delete ON audit_log;
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TRIGGER trg_prevent_audit_log_update_delete
        BEFORE UPDATE OR DELETE ON audit_log
        FOR EACH ROW
        EXECUTE FUNCTION prevent_audit_log_modification();
      `);
      
      // 3. RLS 활성화
      await prisma.$executeRawUnsafe(`
        ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
      `);
      
      // 4. RLS 정책 생성 (INSERT)
      await prisma.$executeRawUnsafe(`
        DROP POLICY IF EXISTS "Allow insert for authenticated users" ON audit_log;
      `);
      await prisma.$executeRawUnsafe(`
        CREATE POLICY "Allow insert for authenticated users" 
        ON audit_log 
        FOR INSERT TO authenticated 
        WITH CHECK (true);
      `);
      
      // 5. RLS 정책 생성 (SELECT - 동일 테넌트만)
      await prisma.$executeRawUnsafe(`
        DROP POLICY IF EXISTS "Allow select for users of the same tenant" ON audit_log;
      `);
      await prisma.$executeRawUnsafe(`
        CREATE POLICY "Allow select for users of the same tenant" 
        ON audit_log 
        FOR SELECT TO authenticated 
        USING (
          tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
        );
      `);
      console.log("✅ PostgreSQL 트리거 및 RLS 적용 완료!");
    }
  } catch (error) {
    console.error("❌ 트리거 설정 중 오류 발생:", error);
    throw error;
  }
}

async function main() {
  const isLocal = process.env.NODE_ENV !== 'production';

  if (isLocal) {
    console.log("🌱 로컬/테스트 환경 Seed 데이터 삽입 시작...");

    // 0. 기존 트리거 비활성화 (데이터 정리를 위해 선행)
    await disableTriggers();

    // 1. 기존 더미 데이터 정리 (멱등성 보장)
    console.log("🧹 기존 데이터 정리 중...");
    await prisma.auditDataEntry.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.consentRecord.deleteMany({});
    await prisma.bulkImportBatch.deleteMany({});
    await prisma.auditSession.deleteMany({});
    
    // 다대다 관계 테이블은 user 삭제 시 자동 정리됨
    await prisma.site.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.rbacRole.deleteMany({});
    await prisma.tenant.deleteMany({});

    // 2. 테넌트 생성
    console.log("🏢 테넌트(고객사) 생성 중...");
    const tenant = await prisma.tenant.create({
      data: { name: '미래정밀', status: 'ACTIVE' }
    });

    // 3. RBAC 역할 생성
    console.log("🔑 RBAC 역할 생성 중...");
    const adminRole = await prisma.rbacRole.create({
      data: { id: 'admin', description: 'System Administrator (관리자)' }
    });
    const userRole = await prisma.rbacRole.create({
      data: { id: 'user', description: 'Standard User / Inspector (현장 작업자)' }
    });

    // 4. 사용자 생성
    console.log("👤 테스트 사용자 생성 중...");
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@mirae.com',
        tenantId: tenant.id,
        roleId: adminRole.id,
        name: '미래정밀 관리자',
        isMfaEnabled: true
      }
    });

    const worker1 = await prisma.user.create({
      data: {
        email: 'worker1@mirae.com',
        tenantId: tenant.id,
        roleId: userRole.id,
        name: '홍길동 작업자'
      }
    });

    const worker2 = await prisma.user.create({
      data: {
        email: 'worker2@mirae.com',
        tenantId: tenant.id,
        roleId: userRole.id,
        name: '이순신 작업자'
      }
    });

    // 5. 현장(Site) 생성 및 다대다 관계 연결
    console.log("🏭 현장(Site) 생성 및 관계 설정 중...");
    const site = await prisma.site.create({
      data: {
        name: '안산 제1공장',
        description: '미래정밀 안산 조립 및 가공 센터',
        location: '경기도 안산시 단원구',
        tenantId: tenant.id,
        users: {
          connect: [{ id: adminUser.id }, { id: worker1.id }, { id: worker2.id }]
        }
      }
    });

    // 6. PIPA 수집 동의 이력 생성
    console.log("📝 PIPA 개인정보 수집 동의 내역 기록 중...");
    await prisma.consentRecord.create({
      data: {
        userId: worker1.id,
        consentType: 'PIPA_VOICE_COLLECTION',
        consentVersion: 'v1.0',
        identifierHash: '0000000000000000000000000000000000000000000000000000000000000000',
        isAgreed: true
      }
    });

    await prisma.consentRecord.create({
      data: {
        userId: worker2.id,
        consentType: 'PIPA_VOICE_COLLECTION',
        consentVersion: 'v1.0',
        identifierHash: '0000000000000000000000000000000000000000000000000000000000000000',
        isAgreed: true
      }
    });

    // 7. 가상 Audit 세션 생성
    console.log("🕒 가상 Audit 세션 및 데이터 적재 중...");
    
    // 완료된 세션 1
    const completedSession = await prisma.auditSession.create({
      data: {
        tenantId: tenant.id,
        userId: worker1.id,
        status: 'COMPLETED',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
        endTime: new Date(Date.now() - 23.5 * 60 * 60 * 1000)
      }
    });

    // 완료된 세션의 데이터 적재
    await prisma.auditDataEntry.create({
      data: {
        sessionId: completedSession.id,
        rawData: { text: "기어 조립 공정, 작업 수량 백 개, 스크래치 불량 두 개 발생" },
        mappedData: {
          productCode: "P-001",
          productName: "기어",
          process: "조립",
          totalQty: 100,
          defectQty: 2,
          defectType: "scratch"
        }
      }
    });

    // 진행 중인 세션 2
    const inProgressSession = await prisma.auditSession.create({
      data: {
        tenantId: tenant.id,
        userId: worker1.id,
        status: 'IN_PROGRESS',
        startTime: new Date()
      }
    });

    // 진행 중 세션용 샘플 발화문 적재
    const dummyUtterances = [
      "기어 조립 공정, 작업 수량 백 개, 스크래치 불량 두 개 발생",
      "샤프트 연마 끝났고 정상 수량 오십 개",
      "베어링 가공 중에 공구 파손으로 세 개 불량, 코드는 D-004",
      "실린더 도색 완료, 총 수량 이십 개 완료 확인",
      "밸브 조립 공정 대기중 수량 십오 개 적재 완료",
      "기어 가공 공정 불량 한 건 발생, 크랙 현상 의심",
      "샤프트 가공 공정 총 삼십 개 완료 및 측정 양호",
      "베어링 연마 작업 시작 대기 중",
      "실린더 검사 공정 진행 중, 누수 없음",
      "밸브 검사 결과 기밀성 테스트 전수 통과"
    ];

    for (const text of dummyUtterances) {
      await prisma.auditDataEntry.create({
        data: {
          sessionId: inProgressSession.id,
          rawData: { text },
          mappedData: {}
        }
      });
    }

    console.log("🌱 로컬/테스트 환경 Seed 데이터 삽입 완료!");

    // 8. 트리거 재부착 및 보안 정책 활성화
    await applyTriggers();

    // 9. 감사로그 트리거 작동 자가진단 (Self-test)
    console.log("🛡️ 감사로그 위변조 방지 트리거 자가진단 시작...");
    const testLog = await prisma.auditLog.create({
      data: {
        tableName: 'test_table',
        recordId: 'c4b1a1a1-0000-0000-0000-000000000001',
        action: 'INSERT',
        newData: { test: true }
      }
    });
    
    // 9.1. UPDATE 시도 및 예외 발생 확인
    let updateFailed = false;
    try {
      await prisma.auditLog.update({
        where: { id: testLog.id },
        data: { action: 'UPDATE' }
      });
    } catch (e: any) {
      updateFailed = true;
      console.log("✅ UPDATE 차단 자가진단 성공! (기대된 DB 예외 차단 성공)");
    }
    
    if (!updateFailed) {
      throw new Error("🚨 위변조 방지 실패: AuditLog UPDATE가 차단되지 않고 성공했습니다!");
    }
    
    // 9.2. DELETE 시도 및 예외 발생 확인
    let deleteFailed = false;
    try {
      await prisma.auditLog.delete({
        where: { id: testLog.id }
      });
    } catch (e: any) {
      deleteFailed = true;
      console.log("✅ DELETE 차단 자가진단 성공! (기대된 DB 예외 차단 성공)");
    }
    
    if (!deleteFailed) {
      throw new Error("🚨 위변조 방지 실패: AuditLog DELETE가 차단되지 않고 성공했습니다!");
    }
    
    console.log("🎉 감사로그 위변조 방지 트리거 자가진단 100% 통과!");
  } else {
    console.log("⚠️ 운영/스테이징 환경용 최소 기본 역할만 정의합니다.");
    
    await prisma.rbacRole.upsert({
      where: { id: 'admin' },
      update: {},
      create: { id: 'admin', description: 'System Administrator (관리자)' }
    });
    await prisma.rbacRole.upsert({
      where: { id: 'user' },
      update: {},
      create: { id: 'user', description: 'Standard User / Inspector (현장 작업자)' }
    });
    
    console.log("✅ 운영 환경 기본 역할 정의 완료.");
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed 에러 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
