---
name: fix-error
description: PRO ILI SMART — 에러/예외 발생 시 7단계 구조화된 진단·수정 프로세스
context: fork
---
# Error fixing process

대상: 사용자가 제공한 **에러 메시지, 스택 트레이스, 재현 단계**

## Steps
1. **현상 정의** — 증상·재현·원문 로그.
2. **맥락 탐색** — 관련 파일·호출 경로 (`Read`/`Grep`/`Glob`).
3. **근인 특정** — 가설과 증거; 여러 가설 시 반증까지.
4. **중급 개발자 요약** — 한 문단으로 “무엇이 왜 잘못됐는지”.
5. **수정 포인트** — 파일:라인과 이유.
6. **코드 수정** — 한 가지 문제에 집중·불필요한 리팩터 금지.
7. **후속 제안** — 테스트/로깅 등은 **별도 작업**으로만 제안.

## Stack reminders
- Next.js 15 / TS / Prisma / Genkit. 레거시 Java 스택 가정 금지.
- 수정 후 `pnpm lint` + `pnpm typecheck` 권장.
