---
name: generate-tasks-from-srs
description: SRS(Docs/05_SRS_v1.md)를 기반으로 PRO ILI SMART 개발 Task를 추출하는 Antigravity 워크플로우. Next.js/Prisma/Server Actions 기준으로 분해한다.
---

## 권위 문서
- **SRS:** `Docs/05_SRS_v1.md`
- **PRD:** `Docs/PRD_SMART_v0.1.md`, `Docs/00_PRD_v1.md`
- **글로벌 규칙:** `AGENTS.md`

## 이슈 템플릿

```markdown
### Summary
- 기능:
- REQ: [REQ-FUNC-xxx / REQ-NF-xxx]

### Description
- SRS: Docs/05_SRS_v1.md §…
- 시퀀스 / ERD: §4.3 / §6.2

### Acceptance Criteria (GWT)
- Given / When / Then (수치 포함)

### NFR / 컴플라이언스
- Performance / Privacy / Audit (해당 REQ)

### Labels
- slice-1, feature, …
```

## 6단계 절차 (요약)
1. REQ ID 수집
2. 입력·처리·출력·예외·설정·테스트로 분해
3. AC → DoD
4. **Server Actions / route handlers / UI / Prisma / Zod** 단위로 매핑 (Spring 용어 사용 금지)
5. 스키마·마이그레이션 작업으로 연결
6. NFR·보안·운영 태스크화

## Slice-1
`Docs/05_SRS_v1.md` §1.2.1 — REQ-FUNC-001,002,011,025,026,030 부터 Backlog에 올린다.
