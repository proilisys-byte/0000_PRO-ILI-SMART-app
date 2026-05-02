---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] TSK-COR-002: 무결성 제약 조건 (Insert-only) 로직 구현"
labels: 'database, backend, priority:high'
assignees: ''
---

## :dart: Summary
- 기능명: [TSK-COR-002] 감사 로그 및 무결성 제약 조건 (WORM) 구축
- 목적: 컴플라이언스(Compliance) 요건을 위해 생성된 기록(Audit/Submission Log)이 물리적으로 수정되거나 삭제되지 않도록 데이터베이스 및 ORM 레벨의 방어 로직을 적용한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev 단 Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: `Docs/05_SRS_v1.md` (2.4.1 Audit Log WORM)
- 아키텍처 스펙: `tasks/02_DEVELOPMENT_TASK_BREAKDOWN_v1.md#TSK-COR-002`

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `AUDIT_LOG` 및 `SUBMISSION_LOG` 테이블 Prisma 스키마 정의
- [ ] 로그 테이블에 대해 PostgreSQL RLS(Row Level Security) 트리거 작성 (Update/Delete 차단)
- [ ] Prisma Client의 Middleware/Extension을 활용한 애플리케이션 레벨의 방어 코드 작성
- [ ] 로그 조회용 읽기 전용(Read-only) 뷰 또는 쿼리 스키마 작성

## :test_tube: Acceptance Criteria (BDD/GWT)
Scenario 1: 로그 데이터의 비정상적 변경 시도 방어
- Given: `AUDIT_LOG` 테이블에 정상적으로 적재된 데이터가 주어짐
- When: 애플리케이션 또는 DB 클라이언트를 통해 해당 레코드에 대해 Update 또는 Delete 쿼리를 실행함
- Then: 트랜잭션이 실패하며 DB 제약조건 오류(Permission Denied 등)를 반환하고 데이터는 원형을 유지한다.

## :gear: Technical & Non-Functional Constraints
- 보안: DBA 권한이 아닌 한 시스템 상에서 WORM (Write-Once-Read-Many) 정책이 무조건 보장되어야 한다.
- 성능: 로그 적재 속도를 저하시키는 무거운 트리거 연산은 피해야 한다.

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 단위 테스트(Unit Test) 및 통합 테스트(Integration Test)가 추가되었고 통과하는가?
- [ ] SonarQube / Linter 등의 정적 분석 도구 경고가 없는가?
- [ ] API 명세서(Swagger 등)가 최신화되었는가? (해당없을 시 DB DDL 확인)

## :construction: Dependencies & Blockers
- Depends on: TSK-COR-001 (코어 DB 스키마 생성)
- Blocks: TSK-COR-005 (무결성 해시 모듈)
