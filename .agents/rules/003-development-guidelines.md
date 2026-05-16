---
description: Workflow and quality — Antigravity rules
globs: ["**/*"]
alwaysApply: false
---
# Development guidelines

## Verification
- Run **`pnpm lint`** and **`pnpm typecheck`** before declaring done.
- Prisma schema changes → **`pnpm db:generate`**.

## Scope & compliance
- Stay within **Slice-1** unless user expands scope; check SRS **Out-of-Scope** table.
- **Privacy / labor**: respect SRS **§4.2.10** (PIPA, labor law notes) — flag legal uncertainty instead of inventing shortcuts.

## Docs
- Update `Docs/` only when requested.

## Git / secrets
- No `.env` or credentials in commits unless user explicitly asks to commit (still avoid secrets).
