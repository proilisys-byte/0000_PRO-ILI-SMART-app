---
name: 400-pro-ili-docs-traceability
description: PRO ILI SMART — PRD/SRS authority, Slice-1 REQ map, and traceability conventions for AI-assisted development.
---
# PRO ILI SMART — Documentation & traceability

## Read first
1. `AGENTS.md` (repo root of this app).
2. `Docs/05_SRS_v1.md` — **technical SSOT** (REQ/NFR/API/compliance).
3. `Docs/PRD_SMART_v0.1.md` — business stories, KPIs, risks.
4. `Docs/00_PRD_v1.md` — quality gate / WBS alignment.

## Conflict rule
If PRD narrative differs from SRS (e.g. offline Edge queue vs SRS online-only MVP), **SRS wins** for implementation.

## Slice-1 focus (from SRS §1.2.1)
Map work to these REQ IDs when possible:
`REQ-FUNC-001`, `REQ-FUNC-002`, `REQ-FUNC-011`, `REQ-FUNC-025`, `REQ-FUNC-026`, `REQ-FUNC-030`.

## Traceability outputs
When proposing tasks or PRs, include:
- **REQ-*** IDs touched
- **NFR** or measurement protocol (e.g. Appendix A.x) if relevant
- **Out-of-scope** check against SRS §1.2.2 / PRD §7
