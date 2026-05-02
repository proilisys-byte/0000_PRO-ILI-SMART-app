# UI-062_bulk_import_operations_dashboard.md

## 1. 개요
Bulk Import 운영 관제 대시보드(Operations Dashboard)의 화면 UI 명세입니다. 관리자가 즉각적인 인지와 액션을 취할 수 있는 조종석(Cockpit) 역할을 합니다. (`ADM-062_bulk_import_operations_dashboard.md`에서 추출)

## 2. 컴포넌트 세분화 구조 (Component-Driven Architecture)
운영 관제 대시보드는 여러 개의 독립적인 모니터링 패널이 모인 복합 화면이므로, 성능을 위해 각각의 위젯 단위로 Container와 Presenter가 분리 조립됩니다.

### 2.1 Container (상태 관리 로직)
- **`BulkDashboardContainer`**: 
  - 역할: 대시보드 전체의 실시간 KPI 지표 Fetch 및 Supabase Realtime을 통한 주기적 업데이트(Polling/Subscribe) 관리.
  - 특징: 화면을 여러 구역으로 나누어 하위 위젯들에 상태 데이터를 분배함.

### 2.2 Presenter (순수 UI 컴포넌트)
- **`DashboardLayout` (Template)**:
  - 역할: CSS Grid를 이용한 최상단, 상단, 좌/우측 분할 레이아웃 껍데기.
- **`StatusStatusBar` (Organism)**:
  - 역할: 시스템 전체 상태 신호등 렌더링.
- **`KPICard` (Organism)**:
  - 역할: 공통 KPI 카드 위젯 껍데기. (아이콘, 타이틀, 수치, 트렌드 표시)
  - 조합 구성: `<CardHeader />`, `<CardContent>`, `<CardFooter>` (shadcn/ui Card 재사용)
- **`StatusIndicator` (Atom)**:
  - 역할: 상태(Healthy/Warning/Critical) 문자열을 입력받아 녹색/황색/적색 테마 배지 또는 점멸 효과만 반환.
- **`AlertList` / `TrendList` / `AuditTimeline` (Organism - 🌟 Lazy Loading 대상)**:
  - 역할: 뷰포트에 들어올 때 로드되거나 무거운 데이터를 리스트/타임라인 형태로 보여주는 독립 위젯.

## 3. 화면 구조 및 레이아웃
1. **최상단 (Status Bar)**: 전체 시스템 상태(녹색/황색/적색 신호등), 미조치 알림 수 표시.
2. **상단 (KPI Cards)**: 
   - 핵심 지표 요약 패널 (Failed Rate, Partial Success, Pending Queue, Auth Denials, Total Processed).
   - 카드 클릭 시 필터링된 Job 목록(Drill-down)으로 라우팅.
3. **좌측 중단 (Alerts)**: 현재 발동 중인 알림 리스트 (P1~P4 우선순위, 에러 내용, 발생 시각 표시).
4. **우측 중단 (Trends)**: 재처리 대기 중인 Job 목록 Top 5 등 부분 성공/실패 추세 또는 적체 리스트. 강제 재처리 및 원본 다운로드 액션 제공.
5. **하단 (Security/Audit)**: 최근 403 에러 유발 타임라인 등 비정상 권한 위반 로그 퀵 뷰.

## 4. 핵심 KPI 카드 UI 세부 정의
- **Failed Rate (실패율)**: 5% 이상 시 적색 점멸 처리. 상태가 `FAILED`인 Job 리스트 뷰어 연결.
- **Partial Success (부분성공)**: 지속 증가 시 황색 경고 배지 표출. 상태가 `PARTIAL_SUCCESS`인 미처리 Job 리스트 연결.
- **Pending Queue (적체 큐)**: 0 초과 시 황색/적색 경고 렌더링. 10분 이상 지연된 Job 목록 연결.
- **Auth Denials (권한 차단)**: 보안 최우선 순위로 적색 처리. Audit Log 이벤트 연결.
- **Total Processed (처리량)**: 정상 처리 완료 건수 일반 텍스트 테마.

## 5. 시각화 및 상태 표현 규칙
- **정상 (Healthy)**: 녹색(Green) 테마, 체크(✓) 아이콘.
- **주의 (Warning)**: 황색(Amber) 테마, 느낌표(!) 아이콘.
- **위험 (Critical)**: 적색(Red) 테마, X표시 아이콘, 카드 테두리 점멸 효과.
- **비활성/해제**: 회색(Gray) 텍스트, 투명도 50%.

## 6. UI 액션 컨트롤
- **상세 원인 보기**: 실패한 Job 목록 내 `trace_id` 아이콘 클릭을 통한 로그 트래커 시스템 이동.
- **재처리 독려(알림)**: 부분 성공 리스트 내 'Notify' 버튼 (사용자 핑).
- **Job 강제 취소**: 대기 지연 리스트 내 'Cancel' 아이콘.
- **계정 임시 정지**: 권한 위반 리스트 내 'Revoke' 메뉴.
