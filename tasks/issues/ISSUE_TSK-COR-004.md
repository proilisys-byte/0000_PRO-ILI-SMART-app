---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] TSK-COR-004: 인증(Auth) 및 RBAC 라우팅 미들웨어"
labels: 'backend, security, priority:high'
assignees: ''
---

## :dart: Summary
- 기능명: [TSK-COR-004] JWT 인증 및 Role-Based Access Control 구축
- 목적: 시스템 엔드포인트를 보호하고, 일반 사용자(General User)와 관리자(Admin)의 역할을 구분하여 인가되지 않은 자원으로의 접근을 통제한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: `Docs/05_SRS_v1.md` (3.1 User Roles)
- 아키텍처 스펙: `tasks/02_DEVELOPMENT_TASK_BREAKDOWN_v1.md#TSK-COR-004`

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] JWT 생성 및 검증(Verify) 유틸리티 함수 로직 구현
- [ ] 사용자의 요청 헤더(Bearer Token)를 파싱하는 인증 미들웨어 작성
- [ ] 권한(Role) 레벨 기반 라우터 가드(RBAC 미들웨어) 생성
- [ ] 401 (Unauthorized) 및 403 (Forbidden) 에러에 대한 표준 응답 반환 로직 통합 (TSK-COR-003 연동)

## :test_tube: Acceptance Criteria (BDD/GWT)
Scenario 1: 권한이 부족한 사용자의 관리자 리소스 접근 시도
- Given: 권한이 `User`인 정상적인 JWT 토큰을 발급받은 클라이언트가 있음
- When: `Admin` 역할만이 접근 가능한 `/api/v1/admin/settings` API 엔드포인트를 호출함
- Then: 서버는 상태 코드 403 Forbidden을 반환하며 접근을 차단한다.

Scenario 2: 토큰 없이 보호된 리소스 접근
- Given: 인증 토큰이 없는 클라이언트가 주어짐
- When: 보호된 도메인 API를 호출함
- Then: 서버는 상태 코드 401 Unauthorized를 반환한다.

## :gear: Technical & Non-Functional Constraints
- 보안: JWT Secret Key는 환경변수(Env)로 관리되어야 하며 소스코드에 하드코딩되어서는 안 된다.
- 성능: 미들웨어 내에서 JWT 디코딩 시 DB 쿼리를 최소화하고, 토큰 페이로드(Payload)를 최대한 활용해야 한다.

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 단위 테스트(Unit Test) 및 통합 테스트(Integration Test)가 추가되었고 통과하는가?
- [ ] SonarQube / Linter 등의 정적 분석 도구 경고가 없는가?
- [ ] API 명세서(Swagger 등)가 최신화되었는가?

## :construction: Dependencies & Blockers
- Depends on: TSK-COR-001 (User 테이블), TSK-COR-003 (Error DTO)
- Blocks: 관리자 전용 API (TSK-LEN 등) 및 데이터 적재 API
