---
description: Next.js + Prisma + Supabase + Gemini/Genkit — Antigravity rules
globs: ["**/*.{ts,tsx,js,jsx,mjs,cjs}", "**/prisma/**", "**/src/**", "package.json", "next.config.*"]
alwaysApply: false
---
# Technical stack

## Application
- **Next.js 15** App Router, **React 19**, **TypeScript**.
- **Server Actions / Route Handlers** — no separate Java/Node REST service layer.

## Data & Auth
- **Prisma** + **SQLite** (dev) / **Supabase Postgres** (prod) per SRS.
- **Insert-only audit** and **RBAC** patterns per SRS — design migrations accordingly.

## UI
- **Tailwind** + **shadcn/ui** conventions.

## AI
- **Genkit** + **Gemini** multimodal; reuse `src/ai` patterns.
- When changing AI outputs, consider **determinism, HitL, logging** requirements in SRS (`REQ-FUNC-AI-*`, `REQ-NF-029~033`).

## Deployment constraints
- **Vercel Hobby 60s** — streaming + client PDF patterns per **REQ-NF-001**.
- Large media: **Supabase Storage** direct upload when appropriate.
