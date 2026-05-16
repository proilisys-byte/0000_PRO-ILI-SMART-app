---
name: 401-nextjs-slice-implementation
description: Implement PRO ILI Slice-1 using Next.js App Router, Prisma, Server Actions, Tailwind/shadcn, and Gemini/Genkit patterns.
---
# Next.js Slice-1 implementation playbook

## Stack guardrails (from SRS C-TEC)
- **Next.js 15** App Router, **Server Actions / Route Handlers** only (no new Spring/Express).
- **Prisma** + SQLite dev / Supabase Postgres prod — keep schema compatible with both.
- **Tailwind + shadcn/ui** for UI.
- **Genkit + Gemini** under `src/ai` patterns.

## Feature mapping (Slice-1)
| Area | REQ (examples) | Implementation notes |
|------|----------------|----------------------|
| Audit PDF | FUNC-001, 002 | Avoid >60s server PDF; prefer streamed generation + **client PDF** per **REQ-NF-001** |
| Voice intake | FUNC-011 | Multimodal pipeline; deterministic validation / fallbacks per SRS |
| RBAC | FUNC-026 | Admin/User matrix from SRS §4.2.4.2 |
| Audit log | FUNC-025 | Insert-only DB patterns; hashes where SRS demands |
| Bulk import | FUNC-030 | CSV/XLSX validation, dry-run, error report |

## Performance & uploads
- **Vercel 60s** ceiling: streaming for LLM-heavy steps; chunk work across requests if needed.
- Large audio/image: **Supabase Storage** direct-from-client when approaching server body limits (SRS §3.6.2).

## Done checklist
- `pnpm lint` + `pnpm typecheck`
- REQ IDs noted in PR description
- No secrets / `.env` committed
