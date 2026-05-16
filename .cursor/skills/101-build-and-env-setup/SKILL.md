---
name: 101-build-and-env-setup
description: Build, environment variables, and local dev setup for pro-ili-smart-app (Next.js + Prisma + Genkit + Gemini).
---
# Build & environment — PRO ILI SMART

## Prerequisites
- Node.js **20+** recommended (match team standard).
- **pnpm** preferred; repo scripts work with `pnpm` from the app root.

## Install & dev
```bash
pnpm install
pnpm dev
```
Default dev server (from `package.json`): **port 9002**.

## Prisma
```bash
pnpm db:generate
```
Apply migrations per team workflow (`prisma migrate` / `db push`) — do not commit secrets.

## Genkit / AI local
```bash
pnpm genkit:dev
# or watch
pnpm genkit:watch
```

## Required env (illustrative — verify against code)
- `DATABASE_URL` — SQLite file or Supabase Postgres URL
- Gemini / Google GenAI keys as used by Genkit (**never** commit)
- Supabase URL/keys when enabling storage/auth features

## Quality gates
```bash
pnpm lint
pnpm typecheck
```

## Structure snapshot (read-only)
Use repo tree when explaining layout; ignore `node_modules`, `.git`, `.next`.
