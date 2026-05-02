# UI-NFR_001_compliance_consent_form.md

## 1. 개요
개인정보보호법(PIPA) 준수를 위한 현장 작업자용 동의 폼 화면 UI 명세입니다. (`NFR-COMPLIANCE_v1.md`에서 추출)

## 2. 컴포넌트 세분화 구조 (Component-Driven Architecture)
UI의 가벼운 동작과 모듈화를 위해, 본 화면은 다음과 같이 상태(Container)와 뷰(Presenter)가 분리된 조립형 컴포넌트로 구성됩니다.

### 2.1 Container (상태 관리 로직)
- **`ComplianceConsentContainer`**: 
  - 역할: 사용자의 현재 동의 상태(토큰 또는 DB) 확인, 필수 동의 여부 판별, 동의 내역 제출 API 호출.
  - 특징: UI 렌더링에 직접 관여하지 않고 상태와 이벤트 핸들러만 Presenter에 전달.

### 2.2 Presenter (순수 UI 컴포넌트)
- **`ConsentDialog` (Template/Organism)**:
  - 역할: 화면 중앙에 뜨는 모달(Dialog) 껍데기. 내부에 `<ConsentForm>`을 조립.
- **`LanguageSelector` (Molecule)**:
  - 역할: `next-intl` 기반 다국어 5개 국어 전환용 드롭다운 UI.
- **`ConsentCheckboxGroup` (Molecule)**:
  - 역할: 여러 개의 `<Checkbox>`(Atom)와 `<Label>`(Atom)을 묶어 필수/선택 항목을 렌더링.
- **`SubmitConsentButton` (Atom)**:
  - 역할: 동의 완료 버튼. 필수 항목 누락 시 비활성화 로직 적용.

## 3. 화면 구성 요소 상세
- **수집 항목 목록**:
  - 음성 데이터 (필수): STT 변환 및 Smart Audit 매핑용
  - 위치 정보 (선택): 작업 수행 위치 검증 및 동선 최적화용
  - 작업 기록 (필수): 시스템 Audit Log 기록 및 이력 관리용
- **UI 컴포넌트 (shadcn/ui 기반)**:
  - `Dialog` 또는 `Sheet`: Edge 디바이스 최초 진입 시 강제로 노출되는 팝업.
  - `Checkbox`: 각 항목별 동의/거부 체크 박스.
  - `Button`: '동의 및 계속하기' 버튼. 필수 항목 미동의 시 비활성화(Disabled) 처리됨.

## 4. 다국어 지원 (i18n)
- **라이브러리**: `next-intl` (Next.js App Router Server Component 호환)
- **지원 언어**: 5개 국어 (한국어, 영어, 베트남어, 네팔어, 캄보디아어)를 지원하는 언어 선택 드롭다운 또는 토글 제공.

## 5. 동의 철회 및 관리 UI (설정 화면)
- **동의 철회**: 설정(Settings) 메뉴에 '동의 철회' 버튼 제공. (철회 시 기존 토큰 Claim 무효화 및 기능 차단)
- **권리 행사 패널**: 설정 또는 관리자 대시보드에 '정보주체 권리 행사' 관리 패널 구축 (열람, 정정, 삭제, 처리정지).
- **Fallback 시나리오**: `NEXT_PUBLIC_ENABLE_VOICE_FEATURE=false` 상태인 경우, 마이크 버튼이 일반 텍스트 입력창(수동 타이핑)으로 대체되어 렌더링되도록 UI 분기 처리.
