---
name: gitflow-commit-pr
description: PRO ILI 저장소에서 안전하게 커밋·PR 준비 — 사용자 명시 시에만 커밋, REQ ID·검증 명시
context: fork
---
# Git commit & PR hygiene (PRO ILI)

## Preconditions
- 사용자가 **명시적으로 커밋/PR을 요청**한 경우에만 `git commit` / `gh pr` 실행.
- `.env`, 자격증명, 실데이터 샘플 커밋 금지.

## Before commit
- `pnpm lint`, `pnpm typecheck`
- 변경이 Slice-1/REQ와 연결되는지 확인 → 커밋 본문에 **REQ-*** 참조

## Commit message style
- 한글/영문 혼용 가능, **왜(why)** 를 1~2문장으로.
- 예: `feat(audit): add template registry read path (REQ-FUNC-002)`

## PR body checklist
- Summary / Test plan
- SRS § 또는 REQ ID
- 스크린샷( UI )

## 리포 루트
본 앱의 Git 기준 경로는 `0000_PRO-ILI-SMART-app` 이다 (모노레포 상위와 혼동 주의).
