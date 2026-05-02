---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] CMP-COM-004: 동적 상태 배지 (Badges)"
labels: 'frontend, ui, component, priority:low'
assignees: ''
---

## :dart: Summary
- 기능명: [CMP-COM-004] 도메인 상태 직관화 칩/배지 (Badges) 컴포넌트
- 목적: 부적합(NC) 심각도 및 Audit 진행 상태 등의 텍스트 값을 시각적으로 뚜렷하게 구별되는 색상의 배지(칩) 모양으로 렌더링한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 아키텍처 스펙: `tasks/02_DEVELOPMENT_TASK_BREAKDOWN_v1.md#CMP-COM-004`

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `shadcn/ui` Badge 컴포넌트를 상속하여 래퍼(Wrapper) 컴포넌트 작성
- [ ] 텍스트(Value) 입력값 기반의 색상 매핑 딕셔너리 작성 (예: Critical=Red, Open=Yellow, Resolved=Green 등)
- [ ] Tailwind `variants`를 활용한 둥근 모서리(Pill/Rounded) 및 텍스트 폰트 두께 조절

## :test_tube: Acceptance Criteria (BDD/GWT)
Scenario 1: 상태값 주입에 따른 동적 색상 변경
- Given: 상태 배지 컴포넌트가 주어짐
- When: Props로 `status="Critical"` 값이 주입되어 컴포넌트가 마운트됨
- Then: 배경이 진한 빨간색(Red 계열)이고 텍스트가 흰색인 배지가 화면에 렌더링된다.

## :gear: Technical & Non-Functional Constraints
- 확장성: 새로운 상태값이 추가되더라도, 내부 매핑 테이블(Record 객체)만 수정하면 동작하도록 확장성 높게 구성한다.

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 기본 정의된 상태값 5종 이상에 대해 색상 테마가 모두 적용되었는가?

## :construction: Dependencies & Blockers
- Depends on: 없음 (독립적 컴포넌트)
- Blocks: CMP-COM-003 (데이터그리드 내 상태 셀), CMP-NCR-001 (칸반 카드 내 배지)
