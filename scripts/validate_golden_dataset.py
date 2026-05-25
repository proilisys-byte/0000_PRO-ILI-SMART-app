import os
import json
import sys
from jsonschema import validate, ValidationError

# Force sys.stdout to use UTF-8 encoding on Windows to prevent UnicodeEncodeError
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# 파일 경로 정의
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STT_SCHEMA_PATH = os.path.join(BASE_DIR, 'data', 'golden', 'stt', 'stt_schema.json')
STT_DATASET_PATH = os.path.join(BASE_DIR, 'data', 'golden', 'stt', 'stt_dataset.json')
MAPPING_SCHEMA_PATH = os.path.join(BASE_DIR, 'data', 'golden', 'mapping', 'mapping_schema.json')
MAPPING_DATASET_PATH = os.path.join(BASE_DIR, 'data', 'golden', 'mapping', 'mapping_dataset.json')

def load_json(file_path):
    if not os.path.exists(file_path):
        print(f"[FAIL] 파일이 존재하지 않습니다 - {file_path}")
        sys.exit(1)
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def run_validation():
    print("[INFO] Golden Dataset 유효성 검사 시작...")
    
    # 1. 스키마 및 데이터셋 로드
    stt_schema = load_json(STT_SCHEMA_PATH)
    stt_dataset = load_json(STT_DATASET_PATH)
    mapping_schema = load_json(MAPPING_SCHEMA_PATH)
    mapping_dataset = load_json(MAPPING_DATASET_PATH)

    # 2. JSON Schema 검증
    print("\n--- [1] JSON Schema 유효성 검증 ---")
    try:
        validate(instance=stt_dataset, schema=stt_schema)
        print("[PASS] STT 데이터셋 JSON Schema 검증 통과 (100% 규격 일치)")
    except ValidationError as e:
        print(f"[FAIL] STT 데이터셋 Schema 검증 실패: {e.message}")
        sys.exit(1)

    try:
        validate(instance=mapping_dataset, schema=mapping_schema)
        print("[PASS] Audit 매핑 데이터셋 JSON Schema 검증 통과 (100% 규격 일치)")
    except ValidationError as e:
        print(f"[FAIL] Audit 매핑 데이터셋 Schema 검증 실패: {e.message}")
        sys.exit(1)

    # 3. 데이터셋 정량 수량 검증
    print("\n--- [2] 정량적 수량 검증 ---")
    stt_count = len(stt_dataset)
    mapping_count = len(mapping_dataset)
    print(f"- STT 샘플 개수: {stt_count} (목표: 100건)")
    print(f"- Audit 매핑 샘플 개수: {mapping_count} (목표: 50건)")
    
    if stt_count < 100:
        print(f"[FAIL] STT 샘플 개수가 부족합니다 ({stt_count}/100)")
        sys.exit(1)
    if mapping_count < 50:
        print(f"[FAIL] Audit 매핑 샘플 개수가 부족합니다 ({mapping_count}/50)")
        sys.exit(1)
    print("[PASS] 정량적 수량 기준 충족 완료!")

    # 4. STT 메타데이터 분포 검증 (방언, 소음환경, 화자 분포 등)
    print("\n--- [3] STT 메타데이터 분포 및 다양성 검증 ---")
    
    dialects = {}
    noise_levels = {}
    genders = {}
    speakers = set()
    missing_metadata = 0
    audio_existence_failed = 0

    for sample in stt_dataset:
        metadata = sample.get('metadata', {})
        
        # 메타데이터 누락 체크 (완료 기준 실패 대응)
        required_meta_fields = ["dialect", "noise_level", "gender", "age_group", "speaker_id", "transcript"]
        for field in required_meta_fields:
            if field not in metadata or not metadata[field]:
                print(f"[FAIL] 샘플 {sample.get('id')}에 필수 메타데이터 '{field}'가 누락되었습니다.")
                missing_metadata += 1
        
        # 오디오 실제 경로 존재 검사
        audio_rel_path = sample.get('audio_path')
        audio_abs_path = os.path.join(BASE_DIR, audio_rel_path)
        if not os.path.exists(audio_abs_path):
            print(f"[FAIL] 실제 오디오 파일이 존재하지 않습니다 - {audio_rel_path}")
            audio_existence_failed += 1

        # 통계 누적
        dial = metadata.get('dialect')
        dialects[dial] = dialects.get(dial, 0) + 1
        
        nl = metadata.get('noise_level')
        noise_levels[nl] = noise_levels.get(nl, 0) + 1
        
        gen = metadata.get('gender')
        genders[gen] = genders.get(gen, 0) + 1
        
        spk = metadata.get('speaker_id')
        speakers.add(spk)

    if missing_metadata > 0:
        print(f"[FAIL] 메타데이터 누락 {missing_metadata}건 감지. 승인 반려.")
        sys.exit(1)
        
    if audio_existence_failed > 0:
        print(f"[FAIL] {audio_existence_failed}개의 오디오 파일 누락 감지. 승인 반려.")
        sys.exit(1)

    print(f"- 고유 화자 수: {len(speakers)}명 (기준: 최소 20명)")
    if len(speakers) < 20:
        print("[FAIL] 화자 수가 20명 미만입니다.")
        sys.exit(1)

    # 성별 균형 검증 (50% 대 50%)
    male_pct = (genders.get('M', 0) / stt_count) * 100
    female_pct = (genders.get('F', 0) / stt_count) * 100
    print(f"- 성별 분포: 남성 {male_pct}%, 여성 {female_pct}% (기준: 50% 균형)")
    if male_pct != 50.0 or female_pct != 50.0:
        print("[FAIL] 성별 분포가 불균형합니다.")
        sys.exit(1)

    # 방언 분포 검증 (표준어 50%, 경상/전라/충청 각 15~20%)
    print("- 방언 분포 통계:")
    for dialect, count in dialects.items():
        pct = (count / stt_count) * 100
        print(f"  * {dialect}: {count}건 ({pct}%)")
        if dialect == 'standard' and pct != 50.0:
            print("[FAIL] 표준어 비율이 50%가 아닙니다.")
            sys.exit(1)
        elif dialect in ['gyeongsang', 'jeolla', 'chungcheong'] and not (15.0 <= pct <= 20.0):
            print(f"[FAIL] {dialect} 방언 비율이 15~20% 범위를 벗어났습니다 ({pct}%)")
            sys.exit(1)

    # 소음 레벨 분포 검증 (각각 약 33-34%)
    print("- 소음 레벨 분포 통계:")
    for nl, count in noise_levels.items():
        pct = (count / stt_count) * 100
        print(f"  * {nl}: {count}건 ({pct:.1f}%)")
        if not (30.0 <= pct <= 40.0):
            print(f"[FAIL] 소음 레벨 {nl} 분포가 치우쳐져 있습니다 ({pct:.1f}%)")
            sys.exit(1)

    # 5. Audit 매핑 데이터셋 원청 다양성 및 복잡도 검증
    print("\n--- [4] Audit 매핑 메타데이터 및 복잡도 검증 ---")
    orgs = {}
    complexities = {}
    for sample in mapping_dataset:
        meta = sample.get('metadata', {})
        org = meta.get('org_name')
        orgs[org] = orgs.get(org, 0) + 1
        
        comp = meta.get('complexity')
        complexities[comp] = complexities.get(comp, 0) + 1

    print(f"- 원청 다양성 수: {len(orgs)}개 원청사 (Samsung, SK, Hyundai, LG, Standard)")
    if len(orgs) < 5:
        print("[FAIL] 원청 다양성이 부족합니다. 최소 5개 원청 양식을 커버해야 합니다.")
        sys.exit(1)
        
    print("- 복잡도 분포 통계:")
    for comp, count in complexities.items():
        print(f"  * {comp}: {count}건")

    print("\n[SUCCESS] 모든 Golden Dataset 검증 성공! 유효성 100% 통과! [SUCCESS]")
    return True

if __name__ == '__main__':
    run_validation()
