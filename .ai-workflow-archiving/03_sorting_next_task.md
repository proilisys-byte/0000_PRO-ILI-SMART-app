# 03. 다음 작업(Next Task) 자동 선정

## 알고리즘
1. **OPEN 이슈** 만 후보로 선택 (`gh issue list --state open`).
2. 본문에서 `**선행조건:**` 라인을 추출, 모든 선행 태스크가 Closed 인지 확인.
3. `critical-path` 라벨이 있으면 우선 (NorthStar KPI 직접 영향).
4. 같은 우선순위 내에서는 `start date` 가 오늘에 가까운 항목.
5. 의존성 다이어그램(`tasks/06_TASK_DEPENDENCY_DIAGRAM_v2.md`)에서 부모 노드의 자식이 다수일수록 큐 상단으로.

## 본 프로젝트 적용 결과 (2026-05-27 시점)

OPEN → 후보 정렬:
1. **T2-005** (선행 T2-003 done, critical-path) → ✅ 1순위 (Phase 1-2 에서 구현)
2. **T3-001** (선행 T1-004 done) → 코드는 이미 머지(`72fa78f`); 보드 In Progress 상태만 정리하면 됨
3. **T3-003** (선행 T3-002 done) → Phase 2-1 에서 COPQ 대시보드와 묶어 처리
4. **T3-005** (선행 T3-004 done) → Phase 2-2
5. **T3-006** (선행 T1-008 done) → Phase 2-3
6. **T4-002 / T4-003 / T4-004** (선행 T1-014 / T1-003 / T1-008 done) → Phase 3
7. **T4-001** (선행 "전체") → Phase 3 후반
8. **T4-005** (선행 T4-001~004) → Phase 3 마지막

## 핵심 학습
- "남은 OPEN 만 처리" 가 아니라 **Closed 라도 산출물이 미연결인 태스크는 보강** 해야 진짜 동작.
- 본 프로젝트는 Phase 0 (Foundation Gap Fix) 를 신설하여 dashboard 라우트, 실제 Auth, PIPA 게이트, AI CI 를 동시 보강 → 잔여 태스크가 즉시 검증 가능한 상태로 진입.
