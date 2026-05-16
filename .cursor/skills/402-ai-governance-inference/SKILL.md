---
name: 402-ai-governance-inference
description: AI/ML governance for PRO ILI — inference logging, model policy, HitL, privacy, and SRS measurement hooks (REQ-FUNC-AI-*, REQ-NF-029~033).
---
# AI governance & inference (PRO ILI)

## When this applies
Any change to multimodal ingestion, LLM mapping (Audit/NC/Lean prompts), evaluation hooks, or model configuration.

## Non-negotiables (from SRS)
- **VMP / hallucination controls:** `REQ-NF-029` — deterministic validation rules + **HitL** on critical outputs where SRS requires it.
- **Model registry discipline:** `REQ-NF-031` — centralize approved model IDs/versions; no “shadow” endpoints.
- **Inference completeness:** `REQ-NF-032` — `AI_INFERENCE_LOG` pattern (input hash, output hash, model version, confidence).
- **Rollback SLA mindset:** `REQ-NF-033` — plan for quick revert of bad model/config changes.
- **Privacy:** `REQ-NF-PRIV-*` — consent flows, masking, purpose limitation for voice/vision payloads.

## Practical implementation order
1. Identify affected **REQ-FUNC-AI-*** and matching **Appendix A** measurement owner.
2. Add/adjust logging **without** leaking PII — prefer hashes + redacted snippets.
3. Wire **review queues** where SRS demands HitL (`REQ-FUNC-AI-005/006`).
4. Document model/prompt version in commit/PR for traceability.

## Edge cases
- If full registry/log tables are not built yet, stub with clear TODO + minimal structured logging **rather than silent inference**.
