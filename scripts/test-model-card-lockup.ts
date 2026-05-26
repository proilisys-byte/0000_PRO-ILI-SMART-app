import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const sttCardPath = path.resolve(__dirname, '..', 'data', 'model-cards', 'stt-model-card.json');

async function runLockupTests() {
  console.log('🔍 [T3-004] AI Model Card 거버넌스 락업 & 배포 차단 통합 검증 시작...');

  if (!fs.existsSync(sttCardPath)) {
    console.error(`❌ stt-model-card.json 파일이 존재하지 않습니다: ${sttCardPath}`);
    process.exit(1);
  }

  // 백업
  const originalSttCardContent = fs.readFileSync(sttCardPath, 'utf8');
  const cardData = JSON.parse(originalSttCardContent);
  const correctVersion = cardData.version;

  try {
    // === [Test 1] 정상 상태 검증 ===
    console.log('\n✔️ [Test 1] 정상 버전(0.1.0) 하의 검증 및 임포트 테스트...');
    
    // 1-1. 정적 검증 스크립트 실행
    let normalValidationSuccess = false;
    try {
      execSync('npx tsx scripts/validate-model-cards.ts', { stdio: 'inherit' });
      normalValidationSuccess = true;
    } catch (e) {
      normalValidationSuccess = false;
    }
    if (!normalValidationSuccess) {
      throw new Error('정상 상태임에도 validate-model-cards 검증이 실패했습니다.');
    }

    // 1-2. 런타임 임포트 테스트
    let normalImportSuccess = false;
    try {
      // 락업 조건이 통과하여 에러 없이 임포트되어야 함
      require('../src/ai/lockup');
      normalImportSuccess = true;
    } catch (e: any) {
      console.error('정상 상태 임포트 실패 에러:', e.message);
      normalImportSuccess = false;
    }
    if (!normalImportSuccess) {
      throw new Error('정상 상태임에도 genkit 런타임 락업 가드에 의해 예외가 발생했습니다.');
    }
    console.log('✅ [Test 1 PASS] 정상 버전 시 정적 검증 통과 및 런타임 정상 가동 확인.');

    // === [Test 2] 버전 불일치 조작 및 정적 검사 실패(배포 차단) 검증 ===
    console.log('\n⚠️ [Test 2] 버전 불일치("9.9.9") 조작 후 정적 검증 실패(CI 배포 차단) 테스트...');
    
    // 조작
    cardData.version = '9.9.9';
    fs.writeFileSync(sttCardPath, JSON.stringify(cardData, null, 2), 'utf8');

    let invalidValidationFailed = false;
    try {
      // exit 1로 터져서 catch 블록으로 빠져야 정상
      execSync('npx tsx scripts/validate-model-cards.ts', { stdio: 'pipe' });
    } catch (e: any) {
      invalidValidationFailed = true;
    }
    if (!invalidValidationFailed) {
      throw new Error('버전 불일치를 유발하였으나 validate-model-cards가 에러 없이 성공했습니다 (배포 차단 실패).');
    }
    console.log('✅ [Test 2 PASS] 버전 불일치 시 validate-model-cards가 실패(exit 1)하여 CI 배포 차단 기능 검증 완료.');

    // === [Test 3] 버전 불일치 시 런타임 락업 가드 작동 검증 ===
    console.log('\n🚨 [Test 3] 버전 불일치 하의 런타임 시스템 락업(System Lockup) 예외 격발 테스트...');
    
    // 이전에 캐시된 require를 무효화하고 다시 로드하여 락업 검사 격발
    const lockupModulePath = require.resolve('../src/ai/lockup');
    delete require.cache[lockupModulePath];

    let lockupTriggered = false;
    try {
      // lockup 모듈 로드 시 verifyGovernanceLockup이 돌면서 throw 되어야 함
      require('../src/ai/lockup');
    } catch (e: any) {
      if (e.message.includes('AI Governance Lockup: Version mismatch')) {
        console.log(`   - 정상 격발된 락업 에러 메시지: "${e.message}"`);
        lockupTriggered = true;
      } else {
        console.error('   - 엉뚱한 예외 격발:', e.message);
      }
    }

    if (!lockupTriggered) {
      throw new Error('버전 불일치를 유발하였으나 lockup 모듈 로딩 시 런타임 시스템 락업이 작동하지 않았습니다.');
    }
    console.log('✅ [Test 3 PASS] 버전 불일치 시 AI 모듈 진입이 차단되며 시스템 락업이 무결하게 작동함.');

  } catch (error: any) {
    console.error('\n❌ 통합 테스트 실패:', error.message);
    process.exit(1);
  } finally {
    // === [복구] stt-model-card.json 원래 내용으로 복구 ===
    console.log('\n♻️  stt-model-card.json 메타데이터 원상 복구 중...');
    fs.writeFileSync(sttCardPath, originalSttCardContent, 'utf8');
    
    // 캐시 클린
    const lockupModulePath = require.resolve('../src/ai/lockup');
    delete require.cache[lockupModulePath];
    console.log('✅ 복구 완료.');
  }

  console.log('\n🎉 [SUCCESS] 모든 Model Card 거버넌스 검증 및 락업 통합 테스트가 100% 통과했습니다!');
  process.exit(0);
}

runLockupTests();
