---
name: setup-env-pro-ili
description: PRO ILI SMART 로컬 환경 변수·의존성·Prisma·Genkit 기동 점검
context: fork
---
# Environment setup — PRO ILI SMART

## 1) Install
```bash
pnpm install
```

## 2) Env files
- `.env` / `.env.local` 에 DB URL, Gemini/Supabase 관련 키를 배치 (예시는 코드베이스의 `README` 또는 `src` import를 따름).
- **절대** 키를 Git에 커밋하지 않는다.

## 3) Prisma
```bash
pnpm db:generate
```

## 4) Dev servers
- App: `pnpm dev` (port **9002** 기본)
- Genkit: `pnpm genkit:dev` 또는 `pnpm genkit:watch`

## 5) Smoke checks
```bash
pnpm lint
pnpm typecheck
```

## 6) REQ/SRS
환경 이슈가 기능 구현을 막으면, 관련 **REQ-*** 와 `Docs/05_SRS_v1.md` 절을 PR/이슈에 남긴다.
