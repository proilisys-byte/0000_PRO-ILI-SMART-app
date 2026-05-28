# 04. Issue/PR 추적성 검증 개선

## 추적성 매트릭스 운영 방식

1. **단일 SSOT** — `Docs/05_SRS_v1.md` 의 REQ-* 만이 정합 기준.
2. **양방향 매핑** — `tasks/03_TRACEABILITY_MATRIX_v1.md` 에 REQ ↔ 구현 파일 ↔ 검증 자산 3 컬럼 표 유지.
3. **PR 강제** — 모든 PR 본문 첫 줄에 REQ-FUNC-xxx 또는 REQ-NF-xxx 명시 (PR 자동 생성 헤더 정의).
4. **CI 게이트** — `.github/workflows/ai-quality.yml` 가 매핑 엔진 + 무결성 + Drift + TOTP 자가 검증을 PR마다 실행.
5. **이슈 Close 자동 동기화** — PR 머지 시 `Closes #N` 또는 `Fixes #N` 키워드로 GitHub Project Done 전이.

## 본 프로젝트의 정량 결과

| 지표 | 측정값 |
|------|--------|
| REQ-* ↔ 코드 매핑된 항목 | 14 (TRACEABILITY_MATRIX 기준) |
| 자가 검증 스크립트 | `test:mapping`, `test:integrity`, `test:totp`, `test:drift`, `test:copq`, `test:observability`, `test:bulk-import`, `security:audit`, `k6:smoke` (총 9종) |
| GitHub Project 자동 동기 이슈 | #1~#30 (30개 작업 태스크) |
| Insert-only audit_log 적재 라우트 | 12개 (전 보호 라우트) |

## 개선 포인트
- **잔여 자동화**: 현재 traceability matrix 는 수동 갱신. 차후 `scripts/build-traceability.ts` 로 코드 주석 + git log 분석을 통해 자동 생성.
- **Cypress E2E**: RBAC 권한별 라우트 차단 시나리오 자동화 (현재는 미들웨어 단위 검증).
- **Supabase Auth 전환**: production 진입 전 mock-cookie → Supabase JWT 교체 필요 (`src/middleware.ts` TODO 참조).

## 본 워크플로우의 외부 적용 시 체크리스트

- [ ] WBS 문서가 정량 DoD/실패 조건/검증 방법 3축을 가지는가?
- [ ] `scripts/create_issues_*` 가 GitHub Project 자동 등록까지 일괄 수행하는가?
- [ ] `Docs/TRACEABILITY_MATRIX.md` 가 PR 머지마다 갱신되는가?
- [ ] AI 품질 게이트(F1-Score, 무결성, Drift, MFA) 가 CI 에서 빌드 차단하는가?
- [ ] `audit_log` Insert-only 정책이 모든 변경 경로에 적용되는가?
