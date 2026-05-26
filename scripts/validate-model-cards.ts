import fs from 'fs';
import path from 'path';
import { ModelCardSchema } from '../src/lib/schemas/model-card';

async function validateModelCards() {
  console.log('🔍 [T3-004] AI Model Card 메타데이터 검증 파이프라인 가동...');

  try {
    const pkgPath = path.resolve(__dirname, '..', 'package.json');
    if (!fs.existsSync(pkgPath)) {
      throw new Error(`package.json 파일을 찾을 수 없습니다: ${pkgPath}`);
    }
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const expectedVersion = pkg.version;
    console.log(`📦 기준 시스템 버전 (package.json): ${expectedVersion}`);

    const cardsDir = path.resolve(__dirname, '..', 'data', 'model-cards');
    if (!fs.existsSync(cardsDir)) {
      throw new Error(`model-cards 디렉토리가 존재하지 않습니다: ${cardsDir}`);
    }

    const files = fs.readdirSync(cardsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    if (jsonFiles.length === 0) {
      throw new Error("model-cards 디렉토리에 검증할 모델 카드 JSON 파일이 존재하지 않습니다.");
    }

    let validationFailed = false;

    for (const file of jsonFiles) {
      console.log(`\n📋 파일 분석 중: ${file}`);
      const filePath = path.join(cardsDir, file);
      const rawData = fs.readFileSync(filePath, 'utf8');
      
      let parsedJson: any;
      try {
        parsedJson = JSON.parse(rawData);
      } catch (e: any) {
        console.error(`❌ JSON 파싱 에러 in ${file}: ${e.message}`);
        validationFailed = true;
        continue;
      }

      // 1. Zod 스키마 검증
      const parsedResult = ModelCardSchema.safeParse(parsedJson);
      if (!parsedResult.success) {
        console.error(`❌ Zod 스키마 검증 실패 in ${file}:`);
        console.error(JSON.stringify(parsedResult.error.format(), null, 2));
        validationFailed = true;
        continue;
      }

      const modelCard = parsedResult.data;
      console.log(`   - 모델 명: ${modelCard.model_name}`);
      console.log(`   - 식별 ID: ${modelCard.model_id}`);
      console.log(`   - 지표 (STT): ${(modelCard.performance_metrics.stt_accuracy * 100).toFixed(1)}%`);
      console.log(`   - 지표 (Mapping F1): ${(modelCard.performance_metrics.mapping_f1_score * 100).toFixed(1)}%`);

      // 2. 버전 불일치 검증
      if (modelCard.version !== expectedVersion) {
        console.error(`❌ 버전 불일치 감지! Expected: ${expectedVersion}, Found: ${modelCard.version}`);
        validationFailed = true;
        continue;
      }

      console.log(`   ✅ ${file} 검증 완료 (버전 및 스키마 정합성 일치).`);
    }

    if (validationFailed) {
      throw new Error("일부 AI Model Card 메타데이터 검증에 실패했습니다. 배포를 차단합니다.");
    }

    console.log('\n🎉 [SUCCESS] 모든 AI Model Card 메타데이터가 정상적이며 기준 규격을 충족합니다.');
    process.exit(0);

  } catch (error: any) {
    console.error('\n🚨 [FATAL] AI Model Card 검증 프로세스 실패:', error.message);
    process.exit(1);
  }
}

validateModelCards();
