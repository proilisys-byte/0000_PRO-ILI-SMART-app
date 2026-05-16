# AGENTS.md — PRO ALI SMART (글로벌 하네스)

이 파일은 Cursor, Claude Code, Antigravity/Gemini CLI 등 **여러 AI 도구가 공통으로 참조할 최상위 규칙**입니다.  
기술적 세부 결정과 REQ ID의 **단일 권위(Single Source of Truth)** 는 `Docs/05_SRS_v1.md` 입니다. 비즈니스 맥락·실험 설계는 `Docs/PRD_SMART_v0.1.md`, `Docs/00_PRD_v1.md` 를 참고합니다.

---

## 1) 제품 한 줄

반도체 소부장 SME를 위한 **Smart Audit / NC 시정 / Zero-UI 수집 / Lean(COPQ)** 플랫폼. 북극성: **Audit 리포트 생성 시간 120h → ≤10분(p95)**, 현장 데이터 정합성 **≥95%** (PRD 기준).

---

## 2) Sprint Slice-1 (문서 기준 “지금 구현할 것”)

`Docs/05_SRS_v1.md` §1.2.1 과 일치시킵니다.

| REQ ID | 기능 | 비고 |
|--------|------|------|
| REQ-FUNC-001 | Audit 리포트 PDF 일괄 생성 | 클라이언트 PDF 렌더링 전략 · REQ-NF-001 |
| REQ-FUNC-002 | 원청 양식 자동 매핑 엔진 | Golden Dataset · 매핑 정확도 |
| REQ-FUNC-011 | 음성 기반 불량 접수 (Online) | Gemini Multimodal / Genkit |
| REQ-FUNC-025 | Insert-only 감사 로그 | 설계·정책 준수 |
| REQ-FUNC-026 | RBAC UI (Admin/User) | SRS 2단계 단순화 |
| REQ-FUNC-030 | CSV/Excel Bulk Import | Phase 1 ERP 대체 |

**범위 밖(명시적):** Phase 2 Could (벤더 등록, XAI 뷰어), `Won't` 항목, SRS가 정의한 멀티테넌시 RLS(MVP 연기) 등. 불확실하면 먼저 SRS §7 Out-of-Scope 와 MoSCoW를 확인합니다.

---

## 3) 강제 기술 스택 (C-TEC / CON-01~04)

| ID | 내용 |
|----|------|
| C-TEC-001 | **Next.js App Router** 단일 풀스택 |
| C-TEC-002 | **Server Actions / Route Handlers** — 별도 REST 서버 금지 |
| C-TEC-003 | **Prisma** + 로컬 SQLite / 프로덕션 **Supabase PostgreSQL** |
| C-TEC-004 | **Tailwind + shadcn/ui** |
| C-TEC-005~006 | **Vercel AI SDK / Genkit + Google Gemini** 멀티모달 |
| C-TEC-007~008 | **Vercel 배포**, **Hobby 60s** 한계 — 긴 작업은 스트리밍·클라이언트 PDF 등으로 설계 |

코드 작성 시 **package.json 및 기존 디렉터리 구조**를 먼저 확인하고, Java/Spring/Kafka 등 레거시 스택 가이드를 제안하지 않습니다.

---

## 4) 작업 수행 규칙 (모든 에이전트 공통)

1. **추적성:** PR·커밋 메시지·이슈에 관련 **REQ-*** ID를 남깁니다 (가능하면 1 PR = 1 REQ 또는 명확한 하위 분해).
2. **SRS 우선:** 충돌 시 `Docs/05_SRS_v1.md` > PRD Markdown. PRD의 offline-first 등 **문구가 SRS와 다르면 SRS를 따릅니다** (예: SRS §1.2 online-only).
3. **보안:** 시크릿·고객 데이터·녹음/영상 샘플을 레포에 넣지 않습니다. `.env` 커밋 금지.
4. **무결성·개인정보:** 감사 로그 Insert-only, 민감정보·가명처리·목적 외 사용 금지 등 **SRS §4.2.10** 요구를 설계에 반영합니다 (미구현이면 TODO와 위험을 명시).
5. **최소 변경:** 요청 범위 밖 리팩터·문서 남발 금지. 사용자가 명시한 마크다운/README만 수정합니다.
6. **검증:** Slice-1 변경 후 `pnpm lint`, `pnpm typecheck`(및 프로젝트에 테스트가 있으면 해당 스크립트) 실행을 기본으로 합니다.

---

## 5) 저장소 내 하네스 맵 (도구별)

| 목적 | 위치 |
|------|------|
| Cursor Rules (globs / always-on) | `.cursor/rules/*.mdc` |
| 공통 Skills (`.agents/skills` → `.cursor/skills`) | `.cursor/skills/*/SKILL.md` |
| Cursor Subagents | `.cursor/agents/*.md` (예: **Slice-1 전담** `slice-1-owner.md`) |
| **Cursor Hooks** (lint/typecheck 자동) | `.cursor/hooks.json`, `.cursor/hooks/*.mjs` |
| Antigravity Rules | `.agents/rules/*.md` |
| Antigravity Workflows | `.agents/workflows/*.md` |
| Claude Code 진입 | `CLAUDE.md` (본 폴더) |
| Claude Skills / Agents | `.claude/skills/`, `.claude/agents/` |
| Gemini CLI Subagents | `.gemini/agents/*.md` |
| 가이드 (읽기 전용 레퍼런스) | `.gemini/README-*-harness.md` |

---

## 6) 핵심 문서 경로

- `Docs/PRD_SMART_v0.1.md` — 제품 목표·스토리·NFR(사업)
- `Docs/00_PRD_v1.md` — 품질 게이트·WBS 정합성
- `Docs/05_SRS_v1.md` — **REQ/NFR/컴플라이언스 SSOT**

**— End —**
