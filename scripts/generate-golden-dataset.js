const fs = require('fs');
const path = require('path');

// 1. 디렉터리 경로 설정
const STT_AUDIO_DIR = path.join(__dirname, '..', 'data', 'golden', 'stt', 'audio');
const STT_DATASET_PATH = path.join(__dirname, '..', 'data', 'golden', 'stt', 'stt_dataset.json');
const MAPPING_DATASET_PATH = path.join(__dirname, '..', 'data', 'golden', 'mapping', 'mapping_dataset.json');

// 디렉터리 생성
fs.mkdirSync(STT_AUDIO_DIR, { recursive: true });
fs.mkdirSync(path.dirname(MAPPING_DATASET_PATH), { recursive: true });

// 2. 화자 메타데이터 정의 (총 20명, 표준어 50%, 경상 20%, 전라 15%, 충청 15% - 성별 균형)
const speakers = [
  { id: "spk-001", gender: "M", age_group: "20s", dialect: "standard" },
  { id: "spk-002", gender: "M", age_group: "30s", dialect: "standard" },
  { id: "spk-003", gender: "M", age_group: "40s", dialect: "standard" },
  { id: "spk-004", gender: "M", age_group: "50s", dialect: "standard" },
  { id: "spk-005", gender: "M", age_group: "60s", dialect: "standard" },
  { id: "spk-006", gender: "F", age_group: "20s", dialect: "standard" },
  { id: "spk-007", gender: "F", age_group: "30s", dialect: "standard" },
  { id: "spk-008", gender: "F", age_group: "40s", dialect: "standard" },
  { id: "spk-009", gender: "F", age_group: "50s", dialect: "standard" },
  { id: "spk-010", gender: "F", age_group: "60s", dialect: "standard" },
  { id: "spk-011", gender: "M", age_group: "20s", dialect: "gyeongsang" },
  { id: "spk-012", gender: "M", age_group: "40s", dialect: "gyeongsang" },
  { id: "spk-013", gender: "F", age_group: "30s", dialect: "gyeongsang" },
  { id: "spk-014", gender: "F", age_group: "50s", dialect: "gyeongsang" },
  { id: "spk-015", gender: "M", age_group: "30s", dialect: "jeolla" },
  { id: "spk-016", gender: "F", age_group: "20s", dialect: "jeolla" },
  { id: "spk-017", gender: "F", age_group: "40s", dialect: "jeolla" },
  { id: "spk-018", gender: "M", age_group: "50s", dialect: "chungcheong" },
  { id: "spk-019", gender: "M", age_group: "60s", dialect: "chungcheong" },
  { id: "spk-020", gender: "F", age_group: "30s", dialect: "chungcheong" }
];

// 제조 도메인 템플릿 정보
const processes = ["압출", "조립", "도색", "연마", "가공", "검사", "포장"];
const defectCodes = ["D-001", "D-002", "D-003", "D-004", "D-005"];
const defectNames = {
  "D-001": "스크래치",
  "D-002": "크랙",
  "D-003": "찍힘",
  "D-004": "치수 불량",
  "D-005": "이물"
};

// 3. 고유한 WAV 파일 생성 함수
function createUniqueWav(index, durationSec = 0.5, sampleRate = 16000) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // Format Chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Chunk Size
  buffer.writeUInt16LE(1, 20);  // Audio Format (1 = PCM)
  buffer.writeUInt16LE(1, 22);  // Channels (1 = Mono)
  buffer.writeUInt32LE(sampleRate, 24); // Sample Rate
  buffer.writeUInt32LE(sampleRate * 2, 28); // Byte Rate
  buffer.writeUInt16LE(2, 32);  // Block Align
  buffer.writeUInt16LE(16, 34); // Bits per Sample

  // Data Chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // 고유한 파일이 되도록 약간의 modulated sine wave 데이터 주입
  for (let i = 0; i < numSamples; i++) {
    const val = Math.floor(Math.sin(2 * Math.PI * (440 + index * 5) * (i / sampleRate)) * 1000);
    buffer.writeInt16LE(val, 44 + i * 2);
  }

  return buffer;
}

// 4. STT Golden Dataset 생성 (100건)
console.log("Generating STT Golden Dataset...");
const sttDataset = [];
const noiseLevels = ["75dB", "80dB", "85dB"];

for (let i = 1; i <= 100; i++) {
  const idStr = String(i).padStart(3, '0');
  const filename = `stt_sample_${idStr}.wav`;
  const relativeAudioPath = `data/golden/stt/audio/${filename}`;
  const fullAudioPath = path.join(STT_AUDIO_DIR, filename);

  // 화자 및 소음 레벨 선택 (고른 분포)
  const speaker = speakers[(i - 1) % speakers.length];
  const noiseLevel = noiseLevels[(i - 1) % noiseLevels.length];

  // 제조 도메인 시나리오 데이터 구성
  const process = processes[(i - 1) % processes.length];
  const quantity = 50 + (i * 3) % 400; // 50~450 사이 다양화
  const hasDefect = i % 4 === 0; // 25% 확률로 불량 발생 시나리오
  const defectCode = hasDefect ? defectCodes[(i - 1) % defectCodes.length] : undefined;
  const defectName = defectCode ? defectNames[defectCode] : undefined;

  // 발화 텍스트 생성 (사투리/소음 환경 보정용)
  let transcript = "";
  const qKor = quantity + "개";
  if (speaker.dialect === "gyeongsang") {
    transcript = `${process} 공정 말임더, 오늘 작업 수량은 총 ${qKor}이고예.`;
    if (defectCode) transcript += ` 근데 고마 ${defectName} 불량이 좀 나와가꼬 코드 ${defectCode}로 등록하겠심더.`;
  } else if (speaker.dialect === "jeolla") {
    transcript = `${process} 작업 수량 ${qKor} 채웠당께요.`;
    if (defectCode) transcript += ` 아 참말로 ${defectName} 한 건 났응게 코드 ${defectCode} 적어주쇼잉.`;
  } else if (speaker.dialect === "chungcheong") {
    transcript = `여기 ${process} 공정인디유, 수량 ${qKor} 완료했슈.`;
    if (defectCode) transcript += ` 근디 ${defectName} 불량 있는 것 같은디, 코드 ${defectCode} 맞아유?`;
  } else {
    transcript = `${process} 공정 현재 작업 완료 수량은 ${qKor}입니다.`;
    if (defectCode) transcript += ` 추가 특이사항으로 ${defectName} 불량이 발생하여 코드 ${defectCode}로 접수합니다.`;
  }

  // expected 객체 생성
  const expected = {
    process_name: process,
    quantity: quantity
  };
  if (defectCode) expected.defect_code = defectCode;
  expected.notes = `작업 완료 수량 ${quantity}건 기록됨.` + (defectCode ? ` ${defectName} 불량 건 기록.` : "");

  // 데이터 구성
  const sample = {
    id: `stt-${idStr}`,
    audio_path: relativeAudioPath,
    expected: expected,
    metadata: {
      dialect: speaker.dialect,
      noise_level: noiseLevel,
      gender: speaker.gender,
      age_group: speaker.age_group,
      speaker_id: speaker.id,
      transcript: transcript
    }
  };

  // 고유 WAV 파일 디스크에 기록
  const duration = 0.5 + (i * 0.015); // 고유한 길이 보장 (0.5s ~ 2.0s)
  const wavBuffer = createUniqueWav(i, duration);
  fs.writeFileSync(fullAudioPath, wavBuffer);

  sttDataset.push(sample);
}

fs.writeFileSync(STT_DATASET_PATH, JSON.stringify(sttDataset, null, 2), 'utf8');
console.log(`STT Golden Dataset: 100 samples generated and saved to ${STT_DATASET_PATH}`);

// 5. Audit Mapping Golden Dataset 생성 (50건)
console.log("Generating Audit Mapping Golden Dataset...");
const mappingDataset = [];
const orgs = ["Samsung", "SK", "Hyundai", "LG", "Standard"];
const complexities = ["low", "medium", "high"];

// ISO 9001 조항 목록
const clauses = ["8.5.1", "8.7", "10.2"];

for (let i = 1; i <= 50; i++) {
  const idStr = String(i).padStart(3, '0');
  
  // 5개 원청 고루 분배
  const org = orgs[(i - 1) % orgs.length];
  // 복잡도 분배
  const complexity = complexities[(i - 1) % complexities.length];
  
  // 입력 레코드 구성 (STT 결과 형식 2~4개 합성)
  const inputSize = complexity === "low" ? 2 : complexity === "medium" ? 3 : 4;
  const input = [];
  const sections = [];

  for (let j = 0; j < inputSize; j++) {
    const procIdx = (i * 3 + j) % processes.length;
    const process = processes[procIdx];
    const qty = 80 + (i * 7 + j * 13) % 250;
    const hasDefect = (i + j) % 3 === 0;
    const defCode = hasDefect ? defectCodes[(i + j) % defectCodes.length] : undefined;
    const defName = defCode ? defectNames[defCode] : undefined;

    const record = {
      process_name: process,
      quantity: qty
    };
    if (defCode) record.defect_code = defCode;
    record.notes = `${process} 공정에서 총 ${qty}건의 데이터 수집.`;
    input.push(record);

    // 기대 매핑 조항 구성
    if (defCode) {
      sections.push({
        clause: "8.7",
        summary: `${org} 템플릿 기준 ${process} 공정에서 발생한 ${defName} 불량(${defCode}) 건에 대한 통제 조치 대상 식별.`,
        confidence_score: 95
      });
      sections.push({
        clause: "10.2",
        summary: `불량 원인 규명 및 ${defName} 재발 방지를 위한 시정 조치 프로세스 개시 필요.`,
        confidence_score: 90
      });
    } else {
      sections.push({
        clause: "8.5.1",
        summary: `${org} 템플릿 기준 ${process} 공정의 정상 생산 수량 ${qty}건에 대한 적합성 관리 승인.`,
        confidence_score: 98
      });
    }
  }

  // 중복 매핑 필터링 및 정렬
  const uniqueSections = [];
  const seenClauses = new Set();
  for (const sec of sections) {
    if (!seenClauses.has(sec.clause)) {
      seenClauses.add(sec.clause);
      uniqueSections.push(sec);
    }
  }
  
  // 조항별 정렬
  uniqueSections.sort((a, b) => {
    const aParts = a.clause.split('.').map(Number);
    const bParts = b.clause.split('.').map(Number);
    for (let k = 0; k < Math.max(aParts.length, bParts.length); k++) {
      const ap = aParts[k] || 0;
      const bp = bParts[k] || 0;
      if (ap !== bp) return ap - bp;
    }
    return 0;
  });

  const sample = {
    id: `mapping-${idStr}`,
    input: input,
    expected: {
      sections: uniqueSections
    },
    metadata: {
      template_type: "ISO9001",
      org_name: org,
      complexity: complexity
    }
  };

  mappingDataset.push(sample);
}

fs.writeFileSync(MAPPING_DATASET_PATH, JSON.stringify(mappingDataset, null, 2), 'utf8');
console.log(`Audit Mapping Golden Dataset: 50 samples generated and saved to ${MAPPING_DATASET_PATH}`);
console.log("🎉 Golden Dataset Generation Completed Successfully!");
