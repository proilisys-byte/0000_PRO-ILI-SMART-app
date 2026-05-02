# UI-064_bulk_import_upload_modal.md

## 1. 개요
대량 데이터(CSV/Excel) 업로드를 위한 관리자용 업로드 모달/화면 컴포넌트 UI 명세입니다. (`ADM-BULK_v1.md`에서 추출)

## 2. 컴포넌트 세분화 구조 (Component-Driven Architecture)
UI의 가벼운 동작과 독립적인 테스트를 위해, 본 화면은 다음과 같이 상태(Container)와 뷰(Presenter)가 분리된 원자적(Atomic) 컴포넌트로 조립됩니다.

### 2.1 Container (상태 관리 로직)
- **`BulkImportModalContainer`**: 
  - 역할: 모달의 열림/닫힘 상태 관리, 마스터 유형 선택 상태 유지, 업로드 진행률 Polling, API 에러 상태 관리.
  - 특징: 화면에 UI를 직접 그리지 않고 Presenter 컴포넌트들을 조합하여 데이터를 주입함.

### 2.2 Presenter (순수 UI 컴포넌트)
- **`UploadModalDialog` (Template/Organism)**:
  - 역할: `shadcn/ui`의 `Dialog` 또는 `Sheet`를 감싸는 껍데기. 내부에 다른 컴포넌트들을 `children`으로 받음 (합성 패턴).
- **`MasterTypeSelector` (Molecule)**:
  - 역할: 탭(Tab) 또는 드롭다운 UI만 렌더링. 선택 변경 이벤트(`onChange`)만 부모로 전달.
- **`TemplateDownloadButton` (Atom)**:
  - 역할: 우측 상단의 단순한 템플릿 다운로드 버튼.
- **`CSVUploadDropzone` (Organism)**:
  - 역할: 파일 Drag&Drop 액션 처리 및 `.csv` 확장자 클라이언트 유효성 검사. 파일 객체만 부모로 전달.
- **`UploadProgressBar` (Molecule)**:
  - 역할: 부모로부터 `progress`(0~100) 값을 받아 막대기(Progress Bar)를 그리는 순수 UI.
- **`ErrorDataTable` (Organism - 🌟 Lazy Loading 대상)**:
  - 역할: `error_count > 0`일 때 동적으로 로드(Dynamic Import)되어 렌더링되는 에러 내역 그리드. 행/컬럼/사유 데이터만 받아 표시.

## 3. 화면 컴포넌트 구성 상세
1. **마스터 선택**: 탭(Tab) 또는 드롭다운으로 업로드할 마스터 유형(제품, 공정, BOM 등) 선택.
2. **템플릿 다운로드**: 우측 상단 'CSV 템플릿 다운로드' 버튼 제공.
3. **DropZone (shadcn/ui 기반)**: 파일을 끌어다 놓거나 클릭하여 탐색기 오픈 (오직 .csv 확장자만 허용).
4. **상태 모니터링**:
   - 파일 첨부 후 '업로드 시작' 클릭.
   - 프로그레스 바(Progress Bar) 표시 및 Polling 방식으로 1~3초 주기로 업로드 진행률 조회.
5. **에러 테이블 노출**: 업로드 완료 후 `error_count > 0`일 때, 하단에 Data Table로 행번호/컬럼/사유 표시.

## 4. 에러 피드백 화면 완료 기준 (상태 분기)
업로드 작업 종료 후 UI는 다음 3가지 상태로 분기하여 사용자 경험을 완료합니다.

1. **전체 성공 (Success)**:
   - 화면: "총 N건의 데이터가 성공적으로 등록되었습니다." 요약 모달 표시.
   - 액션: 리스트 새로고침.
2. **부분 오류 (Partial Success)**:
   - 화면: "M건 등록 완료. E건 오류 발생." 알림 표시.
   - 액션: Data Table 옆에 **[오류 데이터만 CSV 다운로드]** 버튼 노출. 사용자가 수정한 후 해당 파일만 다시 업로드할 수 있도록 유도.
3. **전체 실패 (Fatal Error)**:
   - 화면: "파일 인코딩 오류 또는 지원하지 않는 형식입니다." 경고 모달 표시.
   - 액션: 표준 템플릿 재다운로드 버튼 활성화.
