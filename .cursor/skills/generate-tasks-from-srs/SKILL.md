---
name: generate-tasks-from-srs
description: SRS(`Docs/05_SRS_v1.md`) 기반으로 PRO ILI SMART 개발 Task를 추출하고 이슈 템플릿을 생성합니다. Next.js/Prisma/Server Actions 구조에 맞게 분해합니다.
disable-model-invocation: true
---
## Authoritative SRS path
- **Primary:** `Docs/05_SRS_v1.md`
- **Context PRD:** `Docs/PRD_SMART_v0.1.md`, `Docs/00_PRD_v1.md`
- **Global harness:** `AGENTS.md`

## Issue template (concise)

```markdown
### Summary
- 기능: [한 줄]
- REQ: [REQ-FUNC-xxx / REQ-NF-xxx]

### Description
- SRS: Docs/05_SRS_v1.md §[섹션]
- Sequence: §4.3.x (해당 시)
- Data: Appendix §6.2 (해당 테이블)

### Acceptance Criteria (GWT)
- Given:
- When:
- Then: [측정 가능 수치 포함]

### Non-Functional / Compliance
- Performance: [p95, REQ-NF-*** ]
- Security/Privacy: [REQ-NF-PRIV-*** or audit]

### Labels
- `feature`, `slice-1`, `priority:…`
```

## SRS → Task 체크리스트

| 단계 | 해야 할 일 | 산출물 |
| --- | --- | --- |
| 1 | SRS REQ ID 전수 목록화 | REQ 리스트 |
| 2 | 행위 단위로 분해 (입력/처리/출력/예외/설정/테스트) | Task tree |
| 3 | AC → DoD 변환 | 체크리스트 |
| 4 | 인터페이스를 코드 단위로 분해 | **Route Handlers / Server Actions / UI routes / Prisma 모델 / Zod 스키마** |
| 5 | 데이터 모델 → 마이그레이션 | `prisma/schema.prisma` + 마이그레이션 |
| 6 | NFR → 테스트·모니터링 | 부하/보안/ops 태스크 (k6, Dependabot, 로그 알림 등) |

## Next.js 구현 분해 (SRS §3.3 패턴)
API 표가 `/api/v1/...` 형태로 적혀 있어도, **구현은 Server Actions / `app/api/**/route.ts`** 로 매핑합니다. “Controller/Service” 대신:
- **UI:** `app/(routes)/...`, **components/**
- **서버:** `app/actions/*.ts`, **`app/api/**/route.ts`**
- **데이터:** **Prisma** 클라이언트, **`src/lib/**`** 유틸
- **AI:** **`src/ai/**` Genkit 플로우**

## 산출물 경로 예시 (팀 표준에 맞게 조정)
| 단계 | 산출물 | 예시 경로 |
| ---- | ------ | --------- |
| 1 | REQ 목록 | `Docs/_derived/req-backlog.md` (필요 시) |
| 2 | Task tree | 이슈 에픽/서브태스크 |
| 4 | 구현 스케치 | PR 설명, Tech Notes |

> **Slice-1 우선:** `Docs/05_SRS_v1.md` §1.2.1 의 REQ-FUNC-001,002,011,025,026,030 을 먼저 계획합니다.
