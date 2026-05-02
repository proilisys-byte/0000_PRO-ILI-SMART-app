---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] CMP-COM-006: 비동기 로딩 스켈레톤 UI"
labels: 'frontend, ui, component, priority:medium'
assignees: ''
---

## :dart: Summary
- 기능명: [CMP-COM-006] 공통 비동기 로딩 스켈레톤(Skeleton) 피드백 컴포넌트
- 목적: AI 매핑, LLM 추론, 데이터 조회(API 호출) 등으로 대기 시간이 발생할 때, 사용자가 지루함을 느끼지 않고 컨텍스트를 유지할 수 있도록 점진적인 모양의 스켈레톤 펄스(Pulse) 애니메이션을 제공한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 아키텍처 스펙: `tasks/02_DEVELOPMENT_TASK_BREAKDOWN_v1.md#CMP-COM-006`

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `shadcn/ui` Skeleton 베이스 컴포넌트 삽입
- [ ] `variant="list"` (테이블 로우 모양) 및 `variant="card"` (박스 모양) 등 레이아웃 프리셋 구축
- [ ] 컴포넌트의 높이, 너비, 반복 횟수를 Props로 동적으로 받을 수 있도록 인터페이스 개방
- [ ] 부드러운 Pulse 애니메이션 커스텀 (Tailwind `animate-pulse` 확장)

## :test_tube: Acceptance Criteria (BDD/GWT)
Scenario 1: API 데이터 지연 시 로더 렌더링
- Given: 데이터를 기다리는 상태(`isLoading=true`)인 뷰가 렌더링 됨
- When: 컴포넌트 내부에 테이블 또는 카드가 마운트됨
- Then: 실제 화면과 유사한 회색 막대(Skeleton)가 부드럽게 반짝이는 애니메이션과 함께 노출되며 화면의 레이아웃이 무너지지 않는다.

## :gear: Technical & Non-Functional Constraints
- 성능: 무거운 자바스크립트 연산을 피하고 오직 순수 CSS(Tailwind Utility)를 통해서만 애니메이션을 제어한다.
- 호환성: 다크 모드(Dark mode)에서 스켈레톤 색상이 이질적이지 않고 자연스러운 Muted 색상으로 반전되어야 한다.

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] Props로 사이즈 조절이 가능하여 재사용성이 보장되는가?

## :construction: Dependencies & Blockers
- Depends on: 없음
- Blocks: 거의 모든 통합 페이지 및 컴포넌트의 로딩 상태 표시
