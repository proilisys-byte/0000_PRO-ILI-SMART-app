# PRO ALI SMART — AI 에이전트 개발 워크플로우 자산화

본 디렉터리는 [makersround-backend `.ai-workflow-archiving`](https://github.com/wild-mental/makersround-backend/tree/main/.ai-workflow-archiving)
가이드를 PRO ALI SMART 프로젝트(스마트 제조 품질 혁신 플랫폼)에 적용한 실증 사례입니다.

## 1. 단계별 워크플로우 (본 프로젝트 적용)

| 단계 | 명칭 | 본 프로젝트 적용 | 산출물 |
|------|------|-----------------|--------|
| 1 | 환경 설정 / 룰 정의 | `.cursor/rules/`, `AGENTS.md`, `CLAUDE.md` 정합화. SRS 를 `Docs/05_SRS_v1.md` 로 이동 | [`Docs/05_SRS_v1.md`](../Docs/05_SRS_v1.md), [`AGENTS.md`](../AGENTS.md) |
| 2 | PM 자동화 / 이슈 관리 | `scripts/create_issues_*.ps1` 가 WBS 30개 태스크를 GitHub Project #2 로 자동 동기화 | [GitHub Project](https://github.com/users/proilisys-byte/projects/2/views/1) |
| 3 | 상세 설계 / 구현 | Prisma 스키마(ERD) → API Route Handler(CLD) → UI 페이지 순서 적용. NC, Drift, MFA, Streaming 모듈을 유틸 + 라우트 + 자가 검증 3-Tier 로 구성 | `src/lib/*`, `src/app/api/v1/*` |
| 4 | Git 라이프사이클 | `feat(<scope>): [Tx-xxx] 제목 (REQ-FUNC-yyy)` 컨벤션, PR 본문에 SRS 링크 | git log 참조 |
| 5 | 보안 / NFR | `.env.example`, `scripts/security-audit.mjs`, k6 부하 시드, Streaming 헬퍼 | [`scripts/k6/smoke.js`](../scripts/k6/smoke.js) |
| 6 | QA / Traceability | REQ-* ↔ 파일 매핑표 + GitHub Actions ai-quality 게이트 | [`tasks/03_TRACEABILITY_MATRIX_v1.md`](../tasks/03_TRACEABILITY_MATRIX_v1.md) |
| 7 | 자산화 / 교육 | 본 디렉터리 (`01~04`) | 파일 4종 |

## 2. 5대 핵심 전략 (Best Practices)

- **A. Rule-Based Autonomy** — `.cursor/rules/*.mdc`, `.cursor/skills/*/SKILL.md`, `.cursor/hooks.json` 으로 코딩 컨벤션·체크포인트 자동화.
- **B. Docs-Driven & CLI Control** — `gh` CLI 자동화 스크립트 7종(이슈/일자/라벨/배치 등). PM/PO 영역까지 Cursor 단일 워크스페이스에서 처리.
- **C. Design-First, Code-Later** — 본 자산화의 모든 신규 모듈은 ERD/CLD mermaid → 라우트 시그니처 → 구현 순서로 작성. 매핑 엔진/무결성/Drift 모두 SSOT 의 정량 기준을 우선 정의 후 코드 추가.
- **D. Shift-Left Security & NFR** — Phase 0 단계에서 PIPA 동의 게이트, MFA TOTP, k6 SLO 게이트, npm audit Critical/High 차단을 동시 수립.
- **E. Traceability Verification** — 모든 라우트가 `audit_log` 에 Insert-only 로 적재되며, REQ-* 매핑표는 코드 변경 시 함께 갱신됨.

## 3. 디렉터리 구성

```
.ai-workflow-archiving/
├── README.md                                # 본 문서
├── 01_task_to_issue_extract.md              # WBS → GitHub Issue 자동화 사례
├── 02_pre_filling_agentic_context.md        # AGENTS.md / SRS 컨텍스트 주입 패턴
├── 03_sorting_next_task.md                  # 의존성 / critical-path 기반 다음 작업 선정
└── 04_traceability_improvement.md           # REQ-* ↔ PR / Issue 추적 사례
```
