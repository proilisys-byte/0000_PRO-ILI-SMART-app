# UI-063_smart_audit_operations_dashboard.md

## 1. 개요
Smart Audit(F1) 라인의 상태, 병목 현상, 보안/권한 위반 등을 모니터링하기 위한 통합 대시보드의 화면 UI 구조 명세입니다. (`ADM-063_smart_audit_operations_dashboard.md`에서 추출)

## 2. 컴포넌트 세분화 구조 (Component-Driven Architecture)
운영 관제 대시보드는 여러 개의 독립적인 모니터링 패널이 모인 복합 화면이므로, 성능을 위해 각각의 위젯 단위로 Container와 Presenter가 분리 조립됩니다.

### 2.1 Container (상태 관리 로직)
- **`SmartAuditDashboardContainer`**: 
  - 역할: 대시보드 전체의 실시간 KPI 지표 Fetch 및 Supabase Realtime을 통한 세션 상태 업데이트 수신 관리.
  - 특징: UI 렌더링에 관여하지 않으며, 각 패널/차트 Presenter 컴포넌트에 필요한 데이터를 분류해 전달함.

### 2.2 Presenter (순수 UI 컴포넌트)
- **`DashboardGlobalHeader` (Organism)**:
  - 역할: 상단의 Tenant/Site 및 시간대 필터, Active Alerts 경고 바 렌더링.
- **`MetricSummaryCard` (Molecule)**:
  - 역할: KPI 요약 정보(숫자, 아이콘, 긍정/부정 색상)만 표시하는 가벼운 컴포넌트 껍데기.
- **`AuditPipelineFunnelChart` / `StatusStackedBarChart` (Organism - 🌟 Lazy Loading 대상)**:
  - 역할: 무거운 차트 라이브러리를 동적으로 로딩하여 렌더링하는 순수 뷰어.
- **`ExceptionSessionDataTable` (Organism - 🌟 Lazy Loading 대상)**:
  - 역할: 지연(Stuck) 및 오류 세션 목록을 표시하는 데이터 그리드 표.

## 3. 화면 구조 개요 (4개 주요 영역)
1. **Global Control & Alert Header**: 
   - Tenant/Site 필터, 시간대 필터
   - 최상단 Active Alerts 표시 영역 (Critical/High 알림 등 실시간 연동 노출)
2. **KPI Summary Cards**: 
   - Total Active Sessions (진행중 세션 수)
   - Report Generating Time (평균 생성시간, 10분 초과 시 Warning 색상)
   - Failed Reports (실패 건수, 0 초과 시 Danger 색상)
   - Security/Auth Blocks (403 에러 등 보안 차단 건수, 0 초과 시 Danger 색상)
3. **Session & Report Distribution**: 
   - 상태 전이 병목 확인을 위한 파이프라인(Funnel) 차트 (`Draft` -> `Submitted` -> `Generating` -> `Generated` -> `Finalized`).
   - 상태별 누적 현황 (Stacked Bar Chart).
4. **Exception & Drill-down List**: 
   - 지연(Stuck), 에러, 권한 오류가 발생한 세션 리스트 표출.
   - 15분 초과 정체 상태 및 에러 발생 세션이 리스트 최상단에 강조 표시.

## 4. 세션 / 리포트 리스트 UI 및 드릴다운 (Drill-down)
- **리스트 컬럼 구성**: Session ID, Tenant/Site, Session Status, Report Status, Time in Status, Trace ID.
- **Session ID 클릭**: `UI-010_audit_workspace_page` 상세 화면으로 컨텍스트 유지하며 전환.
- **Trace ID 컴포넌트**: 디버깅을 위해 쉽게 복사할 수 있는 버튼 컴포넌트 제공.
- **상태 강조(Highlight)**: Report 상태가 에러 시 아이콘 강조 및 툴팁 제공, Time in Status가 15분 이상 시 빨간색 강조.
- **Superseded (과거 이력본) 숨김 처리**: 리스트에서는 기본적으로 숨김 처리. 특정 Session ID 검색 시 트리 구조로 하위 모든 이력 표시.

## 5. 권한 기반 UI 데이터 렌더링 격리(Isolation)
- **System Admin 뷰**: 전체 테넌트 리스트 조회 가능. 그러나 Audit Report 본문 및 결과(민감정보)는 접근 불가(버튼 비활성/마스킹). View Log Details 딥링크 기능 활성화.
- **Tenant Admin 뷰**: 소속 테넌트 세션만 조회. 권한 소유 시 Workspace 진입 가능.
