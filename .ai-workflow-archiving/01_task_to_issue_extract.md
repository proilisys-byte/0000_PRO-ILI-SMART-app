# 01. WBS → GitHub Issue 자동 추출

## 입력
- `tasks/01_TASK_LIST_v2.md` — Sprint 1~4 30개 태스크의 정량 DoD/의존성/병렬성 표
- `tasks/06_TASK_DEPENDENCY_DIAGRAM_v2.md` — 의존성 그래프
- `tasks/issues/*.md` — 일부 태스크 사전 정의된 이슈 본문 템플릿

## 산출
- `proilisys-byte/0000_PRO-ILI-SMART-app` 의 GitHub Issue #1~#30 (스프린트 작업)
- GitHub Project #2 (`PRO-ALI-SMART-v1-Roadmap`) 보드 등록 + start/target date

## 자동화 스크립트
| 파일 | 역할 |
|------|------|
| `scripts/create_issues_batch1.ps1` | Sprint 1 #1~#7 |
| `scripts/create_issues_batch2.ps1` | Sprint 1 #8~#14 |
| `scripts/create_issues_batch3.ps1` | Sprint 2~4 #15~#30 |
| `scripts/create_issues_from_json.ps1` | `issues.json` 기반 일괄 생성 |
| `scripts/apply_dates.js` / `apply_project_dates.ps1` | 시작/종료일 동기화 |
| `scripts/fix_issues_encoding.js` | UTF-8 인코딩 보정 |
| `scripts/sync_issues.js` | 본문/라벨 갱신 |

## 핵심 패턴
1. **HEREDOC 기반 본문 주입** — `gh issue create --body-file <tmp>` 로 한국어/마크다운/표를 깨지지 않게 전달.
2. **프로젝트 자동 등록** — 이슈 생성 직후 `gh project item-add` 로 보드 동기화.
3. **레이블 분리 전략** — `Sprint N` + `유형(Infra/DB|UI|AI/API|QA|Security)` + `critical-path` 3축.
4. **레이트리밋 회피** — 1500ms 지연으로 GitHub API 보호.

## 추적성 연결
- 이슈 본문 끝에 `## 의존성` 섹션이 SRS REQ-ID 매핑을 그대로 인용.
- PR 머지 시 `Closes #N` 키워드로 보드 상태 자동 Done 전환.
