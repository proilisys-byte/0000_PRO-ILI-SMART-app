const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'data', 'golden', 'vision');
const imagesDir = path.join(targetDir, 'images');

// Ensure directories exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 1x1 transparent WebP base64 content
const WEBP_BASE64 = 'UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
const webpBuffer = Buffer.from(WEBP_BASE64, 'base64');

const processes = ['P-EXT-01', 'P-ASM-02', 'P-PNT-03', 'P-GRN-04', 'P-INS-05'];
const expectedLists = {
  'P-EXT-01': ['표면조도', '외경치수', '압출직진성'],
  'P-ASM-02': ['커플러결합', '오링안착', '핀조립상태'],
  'P-PNT-03': ['도막두께', '도색균일성', '기포유무'],
  'P-GRN-04': ['연마조도', '수평도', '잔류칩제거'],
  'P-INS-05': ['바코드인식', '외관크랙', '치수확인']
};

const dataset = [];

for (let i = 1; i <= 50; i++) {
  const idStr = String(i).padStart(3, '0');
  const imageFileName = `vision_sample_${idStr}.webp`;
  const imagePath = path.join('data', 'golden', 'vision', 'images', imageFileName);
  
  // 1. Create placeholder WebP image file
  fs.writeFileSync(path.join(imagesDir, imageFileName), webpBuffer);

  // 2. Select process and items
  const proc = processes[i % processes.length];
  const expectedItems = expectedLists[proc];
  
  // 3. Determine lighting condition
  let lighting = 'normal'; // 1-30 (60%)
  if (i > 30 && i <= 42) {
    lighting = 'low'; // 31-42 (25%)
  } else if (i > 42) {
    lighting = 'backlight'; // 43-50 (15%)
  }

  // 50% of the non-low light samples contain defects
  const defectPresent = lighting !== 'low' && i % 2 === 0;

  const detected_items = [];
  
  // Add inspected check items
  expectedItems.forEach((label, idx) => {
    detected_items.push({
      item_type: 'work_status',
      label: label,
      location: idx === 0 ? '상단 중앙 영역' : idx === 1 ? '우측 결합부' : '전체 표면',
      severity: 'ok',
      confidence_score: 0.95
    });
  });

  let overall_result = 'pass';
  let needs_review = false;

  if (lighting === 'low') {
    // Under low light, the overall result must be needs_review to prevent hallucinating defects
    overall_result = 'needs_review';
    needs_review = true;
    detected_items.push({
      item_type: 'defect',
      label: '저조도 판정 불가',
      location: '전체 화면',
      severity: 'minor',
      confidence_score: 0.50 // Low confidence triggers needs_review
    });
  } else if (defectPresent) {
    overall_result = 'fail';
    detected_items.push({
      item_type: 'defect',
      label: '표면 미세 크랙 검출',
      location: '중앙 조인트 부근',
      severity: 'critical',
      confidence_score: 0.91
    });
  }

  dataset.push({
    id: `vision-${idStr}`,
    image_path: imagePath.replace(/\\/g, '/'),
    process_code: proc,
    expected_items: expectedItems,
    metadata: {
      lighting_condition: lighting,
      defect_present: defectPresent
    },
    expected: {
      analysis_type: 'visual_inspection',
      process_code: proc,
      detected_items: detected_items,
      overall_result: overall_result,
      needs_review: needs_review,
      raw_description: `공정코드 ${proc}에 대한 시각 검사 요약. 조도 조건: ${lighting}. 결과: ${overall_result}.`
    }
  });
}

// Write the dataset JSON
fs.writeFileSync(
  path.join(targetDir, 'vision_dataset.json'),
  JSON.stringify(dataset, null, 2)
);

console.log('✅ Vision AI Golden Dataset and 50 placeholder WebP images generated successfully!');
