# DEVELOPMENT TASK LIST (GitHub Project Compatible)

## 1. 개요 (Overview)
본 문서는 `SRS_v1.md` 명세서의 요구사항을 엄격히 준수하여, GitHub Projects 기반의 이슈 트래킹 및 스프린트 관리에 즉각 활용할 수 있도록 작성된 개발 태스크(Task) 리스트입니다.

### 1.1. 설계 원칙 (Design Principles)
1. **명세 준수 (Strict SRS Adherence)**: SRS에 명시되지 않은 임의의 추가 기능(예: 불필요한 서드파티 연동 등)은 일절 배제합니다.
2. **Contract-First**: 데이터 스키마와 API 명세를 선행하여, 프론트엔드와 백엔드의 강결합을 방지합니다.
3. **Dual-Track Agile**: 데이터/인프라 로직(Track 1)과 UI/UX 컴포넌트 생태계(Track 2)를 병렬 전개하여 실행 속도를 극대화합니다.
4. **추적성 (Traceability)**: 모든 태스크는 선행 의존성(Dependencies)과 완료 기준(AC)을 명확히 하여 순차적·병렬적 로드맵 수립의 근거가 됩니다.

---

## 2. GitHub Project 로드맵 (Milestone & Execution Plan)
순차적·병렬적 개발 계획을 수립하기 위한 3단계 마일스톤 가이드입니다. GitHub Projects의 View 필터로 활용할 수 있습니다.

* **Milestone 1 (Foundation)**: Track 1의 코어 스키마(TSK-COR-*)와 Track 2의 공통 컴포넌트(CMP-COM-*) 병렬 진행. (DB 및 Design System 동시 구축)
* **Milestone 2 (Feature Logic & Domain UI)**: Track 1의 도메인 API/비즈니스 로직(TSK-AUD, TSK-NCR 등)과 Track 2의 특화 컴포넌트(CMP-*) 병렬 진행.
* **Milestone 3 (Integration)**: 완료된 Track 1(API)과 Track 2(컴포넌트)를 결합하여 최종 페이지 템플릿(PG-*) 조립 및 E2E 테스트.

---

## Part A. Track 1: 백엔드/인프라 로직 (Data & API Contract)
`[DB] Schema -> [API] Contract -> [Logic] Business Logic` 파이프라인으로 구성됩니다.
GitHub Issue 등록 시 권장 라벨: `backend`, `database`, `api`, `infra`

### Epic 1: 코어 아키텍처 및 데이터 무결성
| ID | Title | Type | Labels | Dependencies | Acceptance Criteria (AC) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-COR-001** | 코어 DB 스키마 설계 | Schema | `database` | 없음 | `SITE`, `USER` 테이블의 Prisma 스키마 파일 작성 완료. |
| **TSK-COR-002** | 무결성 제약 조건 (Insert-only) | Schema | `database` | TSK-COR-001 | `AUDIT_LOG`, `SUBMISSION_LOG` 테이블 및 Update/Delete 방어 RLS 트리거 구축. |
| **TSK-COR-003** | 공통 DTO 및 Error 핸들링 | Contract | `api` | 없음 | 공통 API 응답 규격(성공/실패) 및 Zod 스키마 정의 완료. |
| **TSK-COR-004** | 인증(Auth) 및 RBAC 미들웨어 | Logic | `backend` | TSK-COR-003 | JWT 기반 토큰 검증 및 라우트별 권한 통제(Admin/User) 기능 정상 동작. |
| **TSK-COR-005** | 무결성 해시 데이터 로깅 서비스 | Logic | `backend` | TSK-COR-002 | 데이터 적재 시 이전 해시가 연결된 Merkle Tree 방식의 로그 생성 증빙. |

### Epic 2: Smart Audit 엔진
| ID | Title | Type | Labels | Dependencies | Acceptance Criteria (AC) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-AUD-001** | Audit 리포트/템플릿 스키마 | Schema | `database` | TSK-COR-001 | `AUDIT_SESSION`, `AUDIT_REPORT`, `TEMPLATE` 엔티티 정의. |
| **TSK-AUD-002** | Audit 도메인 API DTO 설계 | Contract | `api` | TSK-AUD-001 | 세션 생성/조회 및 템플릿 쿼리 API 스키마 확정. |
| **TSK-AUD-003** | LLM 기반 양식 매핑 로직 | Logic | `backend` | TSK-AUD-002 | Vercel AI SDK 연동하여 텍스트를 템플릿 JSON 구조로 자동 매핑 (정확도 확보). |
| **TSK-AUD-004** | PDF Export 포맷팅 파이프라인 | Logic | `backend` | TSK-AUD-003 | 클라이언트 전송용으로 정제된 JSON 페이로드 반환 보장. |

### Epic 3: Zero-UI Edge 수집
| ID | Title | Type | Labels | Dependencies | Acceptance Criteria (AC) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-ZUI-001** | Edge Device 및 큐 스키마 | Schema | `database` | TSK-COR-001 | 오프라인 상태를 대비한 동기화 큐 구조(Queue) 엔티티 작성. |
| **TSK-ZUI-002** | Edge-Cloud 동기화 API | Contract | `api` | TSK-ZUI-001 | 멀티파트/JSON 동기화 엔드포인트 설계 및 무결성 해시 필수 파라미터화. |
| **TSK-ZUI-003** | 비정형 데이터 정형화 로직 | Logic | `backend` | TSK-ZUI-002 | 수집된 STT/Vision 데이터를 LLM을 통해 정형 JSON 구조로 파싱하는 서버 로직. |

### Epic 4: 긴급 NC 시정 패키지
| ID | Title | Type | Labels | Dependencies | Acceptance Criteria (AC) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-NCR-001** | NC 케이스 관리 스키마 | Schema | `database` | TSK-COR-001 | `NC_CASE`, `CORRECTIVE_ACTION` 관계 매핑 완료. |
| **TSK-NCR-002** | NC 상태 관리 API DTO | Contract | `api` | TSK-NCR-001 | NC 등록 및 상태 변경(PATCH) 파라미터 규격(Zod) 작성 완료. |
| **TSK-NCR-003** | AI 시정 조치 초안 생성 로직 | Logic | `backend` | TSK-NCR-002 | 과거 유사 사례 검색(RAG) 후 시정 계획안 텍스트 자동 반환. |
| **TSK-NCR-004** | 조치율 트래킹 및 에스컬레이션 | Logic | `backend` | TSK-NCR-002 | Critical NC 건에 대해 24시간 도과 시 타이머/플래그 업데이트 로직 동작. |

### Epic 5: Lean 진단 및 COPQ
| ID | Title | Type | Labels | Dependencies | Acceptance Criteria (AC) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-LEN-001** | Lean 진단 스키마 | Schema | `database` | TSK-COR-001 | `LEAN_DIAGNOSIS` 테이블 정의 (4대 낭비 계산 필드 포함). |
| **TSK-LEN-002** | Lean 진단 도메인 API | Contract | `api` | TSK-LEN-001 | 날짜별 기간 필터링을 포함한 진단 결과 요청/응답 스키마 정의. |
| **TSK-LEN-003** | COPQ 낭비 비용 환산 서비스 | Logic | `backend` | TSK-LEN-002 | 최근 최소 7일 이상의 품질 로그 데이터를 재무적 비용(COPQ)으로 환산하는 쿼리 작성. |

### Epic 6: 규제 준수 및 AI 거버넌스 (Non-Functional)
| ID | Title | Type | Labels | Dependencies | Acceptance Criteria (AC) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-NFR-001** | AI 품질 검증 거버넌스 스키마 | Schema | `database` | 없음 | `AI_MODEL_REGISTRY`, `GOLDEN_DATASET` 관리용 테이블 작성. |
| **TSK-NFR-002** | Vercel Timeout 방어(Fallback) | Logic | `infra` | 전체 | 60초 초과 API 트랜잭션 시 즉시 더미(Dummy) 반환 및 Background 큐 적재. |
| **TSK-NFR-003** | PIPA 암호학적 파기 엔진 | Logic | `backend` | TSK-COR-002 | 데이터 삭제 요청 시 완전 삭제(Delete)가 아닌 논리적 암호화(Erasure) 모듈 동작. |

---

## Part B. Track 2: Component-Driven 프론트엔드 (UI/UX)
백엔드 로직의 완성 여부와 무관하게 즉시(Mock Data 기반으로) 병렬 개발 가능한 독립적 뷰(View) 컴포넌트 리스트입니다.
GitHub Issue 등록 시 권장 라벨: `frontend`, `ui`, `component`, `design`

### Epic 7: 공통 UI 및 디자인 시스템 (Atoms & Molecules)
| ID | Title | Type | Labels | Dependencies | Acceptance Criteria (AC) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CMP-COM-001** | 글로벌 네비게이션 및 셸 | Organism | `ui` | 없음 | 반응형 GNB 및 사이드바 렌더링. 테마(Dark/Light) 토글 정상 작동. |
| **CMP-COM-002** | 데이터 무결성 알림 배너 | Molecule | `ui` | 없음 | 에러/경고 텍스트를 props로 받아 화면 상단 토스트/배너 노출. |
| **CMP-COM-003** | 서버사이드 페이징 데이터 그리드 | Organism | `ui` | 없음 | Mock 배열 데이터를 받아 페이징 번호 및 컬럼 정렬 UI 동작 확인. |
| **CMP-COM-004** | 동적 상태 배지 (Badges) | Atom | `ui` | 없음 | 상태값(Critical, Open 등)별 직관적 색상 및 라벨 출력. |
| **CMP-COM-005** | PDF 익스포트 버튼 및 액션 | Molecule | `ui` | 없음 | 클릭 시 로딩 스피너 작동 및 html2pdf 렌더링 트리거 동작. |
| **CMP-COM-006** | 비동기 로딩 스켈레톤 UI | Molecule | `ui` | 없음 | AI 매핑 등 대기 시간에 표시되는 점진적 형태의 스켈레톤 피드백 표출. |

### Epic 8: 도메인 특화 컴포넌트 (Smart Audit / Zero-UI / NC / Lean)
| ID | Title | Type | Labels | Dependencies | Acceptance Criteria (AC) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CMP-AUD-001** | 템플릿 선택기 및 미리보기 | Molecule | `ui` | 없음 | 양식 드롭다운 동작 및 선택된 템플릿의 간략한 미리보기 UI. |
| **CMP-AUD-002** | AI 누락 필드 경고 패널 | Molecule | `ui` | 없음 | AI 매핑 완료 후 누락된 필수 속성(Missing Fields) 하이라이트 표시. |
| **CMP-ZUI-001** | Edge 카메라 수집 컨테이너 | Organism | `ui` | 없음 | 브라우저 권한 획득 후 비디오 프리뷰 렌더링. 화면 해상도 맞춤. |
| **CMP-ZUI-002** | STT 피드백 맥박(Pulse) 링 | Molecule | `ui` | 없음 | 볼륨 입력에 따른 반응형 CSS 애니메이션 맥박 링 동작. |
| **CMP-ZUI-003** | 수동 Fallback 텍스트 폼 | Organism | `ui` | 없음 | 음성/비전 실패 시 즉시 전환되는 모바일 최적화 수동 입력 폼. |
| **CMP-NCR-001** | NC 진행률 트래킹 칸반 보드 | Organism | `ui` | 없음 | 상태별 컬럼 구성 및 카드의 드래그/클릭 이동 상태 반영. |
| **CMP-NCR-002** | 시정 조치 타임라인 리스트 | Organism | `ui` | 없음 | 조치 이력 수직 타임라인 렌더링 및 24시간 카운트다운 게이지 표시. |
| **CMP-NCR-003** | 무결성 전/후 비교(Diff) 리포트 | Molecule | `ui` | 없음 | 변경 전후 텍스트 비교 시 차이점을 명확히 하이라이트하는 Diff UI. |
| **CMP-LEN-001** | COPQ 4대 낭비 파이/바 차트 | Organism | `ui` | 없음 | Recharts 활용하여 배열 데이터를 시각적 파이/바 차트로 렌더링. 툴팁 제공. |
| **CMP-LEN-002** | ROI 손익분기 트렌드 라인 차트 | Organism | `ui` | 없음 | 월별 추이 꺾은선 차트 및 Break-even 기준점 하이라이트 적용. |
| **CMP-NFR-001** | 다국어 PIPA 동의 락업(Lock-up) | Organism | `ui` | 없음 | 시스템 진입 시 배경 블러 처리 후 강제 동의 다이얼로그 모달 노출. |

### Epic 9: 최종 통합 (Page Integration)
| ID | Title | Type | Labels | Dependencies | Acceptance Criteria (AC) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PG-001** | Smart Audit 워크스페이스 통합 | Page | `frontend` | CMP-AUD-*, CMP-COM-*, TSK-AUD-002 | 실제 도메인 API 연동, 양식 매핑 및 PDF 다운로드(E2E 테스트). |
| **PG-002** | Zero-UI Edge 데이터 수집기 | Page | `frontend` | CMP-ZUI-*, TSK-ZUI-002 | 수집된 데이터의 큐잉 및 Edge-Cloud 동기화 상태 화면 반영(E2E 테스트). |
| **PG-003** | 긴급 NC 시정 패키지 대시보드 | Page | `frontend` | CMP-NCR-*, TSK-NCR-002 | 상태 변경 액션 후 API 갱신, 타임라인 및 칸반 UI 리렌더링 유효성 검증. |
| **PG-004** | Lean 경영진 대시보드 통합 | Page | `frontend` | CMP-LEN-*, TSK-LEN-002 | 날짜 필터 조작 시 차트 갱신, 데이터 부족 시 경고 배너 표출 검증. |
