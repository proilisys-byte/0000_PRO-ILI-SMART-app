import fs from 'fs';
import path from 'path';

// AI 거버넌스 런타임 락업 검증 (Model Card vs package.json 버전 일치성)
export function verifyGovernanceLockup() {
  try {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    if (!fs.existsSync(pkgPath)) return; // 빌드 환경 예외 방어

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const expectedVersion = pkg.version;

    const cardsDir = path.resolve(process.cwd(), 'data/model-cards');
    if (!fs.existsSync(cardsDir)) {
      throw new Error("AI Governance Lockup: model-cards directory is missing");
    }

    const files = fs.readdirSync(cardsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    if (jsonFiles.length === 0) {
      throw new Error("AI Governance Lockup: No model cards found");
    }

    for (const file of jsonFiles) {
      const cardPath = path.join(cardsDir, file);
      const card = JSON.parse(fs.readFileSync(cardPath, 'utf8'));

      if (card.version !== expectedVersion) {
        throw new Error(`AI Governance Lockup: Version mismatch in ${file}. Expected: ${expectedVersion}, Found: ${card.version}`);
      }
    }
    console.log("🛡️ AI Governance: Model Card verifications passed.");
  } catch (error: any) {
    console.error("🚨 SYSTEM LOCKUP:", error.message);
    throw error; // 에러를 상위로 전파하여 모듈 로드 실패 유도
  }
}

// 초기화 가드 즉시 격발 (import 되는 순간 즉시 검증하도록 설정)
verifyGovernanceLockup();
