# UI-T3_001_erp_integration_display.md

## 1. 개요
ERP 연동 및 외부 API(혁신바우처 등) 상태를 표시하기 위한 UI 컴포넌트 명세입니다. (`T3-001_ERP_INTEGRATION_v1.md`에서 추출)

## 2. 컴포넌트 세분화 구조 (Component-Driven Architecture)
UI의 가벼운 동작과 독립성을 위해, 본 화면 요소들은 상태(Container)와 뷰(Presenter)가 분리된 원자적(Atomic) 컴포넌트로 조립됩니다.

### 2.1 Container (상태 관리 로직)
- **`ERPIntegrationContainer` / `VoucherStatusContainer`**: 
  - 역할: SWR/React-Query로 외부 ERP API 또는 혁신바우처 잔액 API 연동, 에러 폴백 처리.
  - 특징: UI 렌더링에 관여하지 않으며, API 상태(`isLoading`, `isError`, `data`)를 Presenter에 전달.

### 2.2 Presenter (순수 UI 컴포넌트)
- **`InnovationVoucherBanner` (Molecule)**:
  - 역할: `is_eligible` 상태와 `available_limit` 금액을 받아 화면 상단 배너로 렌더링하는 순수 UI 컴포넌트.
- **`CSVErrorHighlightRow` (Molecule)**:
  - 역할: 에러 데이터 그리드 내에서 특정 행(Row)을 붉은색 등으로 하이라이트하는 Table Row 조각.
- **`UploadSubmitButton` (Atom)**:
  - 역할: 업로드 실행 버튼. `hasError` 상태를 props로 받아 비활성화(`disabled`) 여부를 스스로 결정함.

## 3. 혁신바우처 API 연동 상태 배너 UI
- **위치**: Admin 대시보드 메인 상단 배너 영역 및 설정(Settings) > '결제 및 구독' 페이지 내부.
- **렌더링 방식 및 조건**:
  - `is_eligible` 데이터 값이 `true`일 경우 활성화.
  - "🎉 혁신바우처 지원 대상 기업입니다 (잔여 한도: ₩XX,XXX)" 형태의 강조된 알림 배너로 노출.
  - `available_limit`(사용 가능 한도액) 포맷팅하여 동적으로 표시.

## 4. CSV 데이터 마이그레이션 업로드 피드백 (연계 참고)
- ERP 데이터(BOM, 제품, 공정 마스터)를 CSV로 Bulk Import 시, 데이터 포맷 오류(`VAL_400`)가 발생하면 해당 에러 라인을 **화면에 하이라이트**하여 표시. 
- 오류가 있는 상태에서는 에러 무시 후 '강제 업로드'를 할 수 없도록 업로드 버튼 비활성화 원칙 적용.
