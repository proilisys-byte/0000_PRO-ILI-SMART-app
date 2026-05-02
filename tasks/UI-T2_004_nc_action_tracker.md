# UI-T2_004_nc_action_tracker.md

## 1. 개요
NC(부적합) 진행 추적을 위한 Kanban 보드 형태의 UI 컴포넌트 명세입니다. (`T2-003_NC_ACTION_SPEC.md`에서 추출)

## 2. 컴포넌트 세분화 구조 (Component-Driven Architecture)
UI의 가벼운 동작과 모듈화를 위해, 본 화면은 다음과 같이 상태(Container)와 뷰(Presenter)가 분리된 조립형 컴포넌트로 구성됩니다.

### 2.1 Container (상태 관리 로직)
- **`NCBoardContainer`**: 
  - 역할: SWR/React-Query로 NC 티켓 목록 Fetch, Supabase Realtime 구독을 통한 실시간 상태 동기화, Drag & Drop(DnD) 액션에 따른 상태 전이 API 호출.
  - 특징: UI 렌더링을 직접 하지 않고 데이터를 분류하여 Presenter에 주입.

### 2.2 Presenter (순수 UI 컴포넌트)
- **`KanbanBoard` (Template/Organism)**:
  - 역할: 6개의 컬럼(단계)을 가로로 배치하는 레이아웃 껍데기.
- **`KanbanColumn` (Molecule)**:
  - 역할: 단일 단계의 세로 리스트 역할. 티켓 데이터를 받아 내부 목록 렌더링.
- **`NCCard` (Organism)**:
  - 역할: 개별 NC 티켓 카드. 조립형 패턴 적용.
  - 조합 구성: `<NCCardHeader />`, `<NCCardBody />`, `<NCCardFooter />`
- **`SeverityBadge` / `DDayCounter` (Atom)**:
  - 역할: 심각도(CRITICAL/MAJOR/MINOR)에 따른 색상 렌더링 및 남은 기한 표시 배지. 순수 UI.

## 3. 화면 컴포넌트 구성 상세
- **Kanban 보드 구성**: 화면 가로 영역에 6개 단계 컬럼을 배치 (DnD 기반 상태 이동 가능 여부 판단 필요, 기본 시각화).
- **카드 컴포넌트**: 
  - `NC 번호`
  - `원청명`
  - `심각도 배지` (CRITICAL, MAJOR, MINOR 색상 구분)
  - `D-Day 카운터` 표시
- **기한 임박 경고**: 기한이 3일 이내일 경우 카드 배경색을 경고 톤(`bg-red-50`)으로 변경하여 시각적 강조.
- **상태 변경 알림**: 보드 조작 또는 API 전이 발생 시, `Supabase Realtime` 채널을 통해 접속 중인 담당자에게 즉각 토스트(Toast) 알림 송출.
