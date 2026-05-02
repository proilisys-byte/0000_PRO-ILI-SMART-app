---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] TSK-COR-001: 코어 DB 스키마 설계"
labels: 'database, priority:high'
assignees: ''
---

## :dart: Summary
- 기능명: [TSK-COR-001] 시스템 공통 및 코어 DB 스키마 설계
- 목적: PRO ILI SMART 시스템의 근간이 되는 `SITE` 및 `USER` 테이블을 구성하여, 향후 생성되는 도메인 데이터(Audit, NC 등)가 올바르게 참조될 수 있는 데이터베이스 기반을 마련한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: `Docs/05_SRS_v1.md` (System Architecture)
- 아키텍처 스펙: `tasks/02_DEVELOPMENT_TASK_BREAKDOWN_v1.md#TSK-COR-001`

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] Prisma ORM 설정 및 `schema.prisma` 초기화
- [ ] `USER` 모델 작성 (id, email, name, role, createdAt, updatedAt)
- [ ] `SITE` 모델 작성 (현장 메타데이터) 및 `USER`와의 관계 설정
- [ ] Phase 2의 Multi-tenancy 대응을 위한 `TENANT` (가이드) 참조용 외래키 뼈대 추가
- [ ] 초기 마이그레이션 스크립트 생성 (`prisma migrate dev`)

## :test_tube: Acceptance Criteria (BDD/GWT)
Scenario 1: 정상적인 DB 마이그레이션
- Given: 정의된 Prisma 스키마 코드가 주어짐
- When: 로컬 PostgreSQL 데이터베이스를 타겟으로 마이그레이션 커맨드를 실행함
- Then: DB에 오류 없이 테이블, 기본키(PK), 외래키(FK) 및 인덱스가 생성된다.

## :gear: Technical & Non-Functional Constraints
- 성능: `USER`의 email과 `SITE`의 ID 필드 등 조회 빈도가 높은 컬럼에 DB 인덱스를 필수적으로 추가한다.
- 데이터베이스 유형: Vercel 배포 환경과 호환되는 Supabase (PostgreSQL) 기준 문법을 적용한다.

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 단위 테스트(Unit Test) 및 통합 테스트(Integration Test)가 추가되었고 통과하는가?
- [ ] SonarQube / Linter 등의 정적 분석 도구 경고가 없는가?
- [ ] API 명세서(Swagger 등)가 최신화되었는가? (해당없을 시 Prisma Client 생성 확인)

## :construction: Dependencies & Blockers
- Depends on: 프로젝트 인프라 초기화 (DB 연결 정보 세팅)
- Blocks: TSK-COR-002, TSK-COR-004
