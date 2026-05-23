import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const isLocal = process.env.NODE_ENV !== 'production';

  if (isLocal) {
    console.log("🌱 로컬/테스트 환경 Seed 데이터 삽입 시작...");

    // 0. 기존 더미 데이터 정리 (멱등성 보장)
    console.log("🧹 기존 데이터 정리 중...");
    await prisma.auditDataEntry.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.consentRecord.deleteMany({});
    await prisma.bulkImportBatch.deleteMany({});
    await prisma.auditSession.deleteMany({});
    
    // many-to-many relationship implicit join table is automatically cleaned when users are deleted.
    await prisma.site.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.rbacRole.deleteMany({});
    await prisma.tenant.deleteMany({});

    // 1. 테넌트 생성
    console.log("🏢 테넌트(고객사) 생성 중...");
    const tenant = await prisma.tenant.create({
      data: { name: '미래정밀', status: 'ACTIVE' }
    });

    // 2. RBAC 역할 생성
    console.log("🔑 RBAC 역할 생성 중...");
    const adminRole = await prisma.rbacRole.create({
      data: { id: 'admin', description: 'System Administrator (관리자)' }
    });
    const userRole = await prisma.rbacRole.create({
      data: { id: 'user', description: 'Standard User / Inspector (현장 작업자)' }
    });

    // 3. 사용자 생성
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

    // 4. 현장(Site) 생성 및 다대다 관계 연결
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

    // 5. PIPA 수집 동의 이력 생성
    console.log("📝 PIPA 개인정보 수집 동의 내역 기록 중...");
    await prisma.consentRecord.create({
      data: {
        userId: worker1.id,
        consentType: 'PIPA_VOICE_COLLECTION',
        isAgreed: true
      }
    });

    await prisma.consentRecord.create({
      data: {
        userId: worker2.id,
        consentType: 'PIPA_VOICE_COLLECTION',
        isAgreed: true
      }
    });

    // 6. 가상 Audit 세션 생성
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

    // 진행 중 세션용 샘플 발화문 적재 (20개 이상의 테스트용 세션 구성 목적)
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

    console.log("✅ 로컬/테스트 환경 Seed 데이터 삽입 완료!");
  } else {
    console.log("⚠️ 운영/스테이징 환경용 최소 기본 역할만 정의합니다.");
    
    // 운영 환경에서는 rbac 역할만 멱등성을 보장하며 생성
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
