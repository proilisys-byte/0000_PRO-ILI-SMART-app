# CLAUDE.md — PRO ALI SMART · Claude Code

## 반드시 먼저 읽기

1. **`AGENTS.md`** — 프로젝트 글로벌 규칙, Slice-1 REQ, C-TEC 스택, SRS 우선 순위.  
2. **`Docs/05_SRS_v1.md`** — 기술·REQ·NFR·API의 단일 권위.

## 이 저장소에서의 Claude 구성

| 종류 | 경로 |
|------|------|
| **Skills** (절차형 플레이북) | `.claude/skills/*/SKILL.md` |
| **Subagents** | `.claude/agents/*.md` |

구체적 절차(에러 처리, 환경 설정, 커밋/PR)는 Skills를 사용합니다. 장시간·격리 작업은 Subagents에 위임합니다.

## 코딩 시 준수

- **Next.js 15 App Router**, **Prisma**, **Tailwind + shadcn 패턴**, **Server Actions / Route Handlers**.
- **AI:** Genkit + `@genkit-ai/google-genai` / 멀티모달 파이프라인은 기존 `src/ai` 패턴을 따릅니다.
- **성능:** Vercel Hobby **60s** — Audit/리포트는 SRS **REQ-NF-001** (스트리밍·클라이언트 PDF 등)에 맞게 설계합니다.
- 작업 범위는 **Slice-1 REQ**에 맞추고, 범위 확장 시 **SRS Out-of-Scope**를 확인합니다.

## 교차 도구

- 스킬 본문은 `.cursor/skills` 와 공유됩니다 (`AGENTS.md` §5 참조).  
- Cursor 전용 globs 규칙은 `.cursor/rules/*.mdc` 에 있습니다.
