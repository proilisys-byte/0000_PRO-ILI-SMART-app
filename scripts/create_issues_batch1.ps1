$repo = "proilisys-byte/0000_PRO-ILI-SMART-app"
$project = 2
$owner = "proilisys-byte"

function Create-Issue {
    param($title, $body, $labels)
    $labelArgs = ($labels | ForEach-Object { "--label `"$_`"" }) -join " "
    $bodyFile = [System.IO.Path]::GetTempFileName()
    $body | Out-File -FilePath $bodyFile -Encoding utf8
    $cmd = "gh issue create --repo $repo --title `"$title`" --body-file `"$bodyFile`" $labelArgs"
    $result = Invoke-Expression $cmd
    Remove-Item $bodyFile -Force
    Write-Host "Created: $title -> $result"
    # Extract issue URL and add to project
    if ($result -match "https://") {
        $issueUrl = $result.Trim()
        gh project item-add $project --owner $owner --url $issueUrl
        Write-Host "  Added to project #$project"
    }
    Start-Sleep -Milliseconds 1500
    return $result
}

# ===== T1-001 =====
Create-Issue "[T1-001] 프로젝트 인프라 및 DB 스키마 설계" @"
## Task ID: T1-001
**Sprint:** 1 | **유형:** Infra/DB | **선행조건:** 없음 | **병렬:** 불가

## 작업 설명
프로젝트의 기반이 되는 DB 스키마를 Prisma 기반으로 설계하고 마이그레이션 스크립트를 구현한다.

## 산출물
- DB 스키마 (Prisma)

## 완료 기준
- **[정량]** 마이그레이션 스크립트 실행 성공률 100%
- **[실패]** 외래키 제약조건 위반 또는 스크립트 10초 초과 시 실패
- **[검증]** CI 환경에서 빈 DB 대상 ``prisma db push`` 자동화 확인

## 일정 (AI 가속 적용)
- **시작:** 2026-05-19
- **종료:** 2026-05-20
- **소요:** 2일

## 의존성
- 후행: T1-002, T1-003, T1-012, T1-014
"@ @("Sprint 1", "Infra/DB")

# ===== T1-002 =====
Create-Issue "[T1-002] Insert-only Audit Log 정책 적용" @"
## Task ID: T1-002
**Sprint:** 1 | **유형:** DB/Security | **선행조건:** T1-001 | **병렬:** 불가

## 작업 설명
Audit Log의 무결성을 보장하기 위해 Insert-only 정책(RLS)을 적용한다.

## 산출물
- RLS 정책 코드

## 완료 기준
- **[정량]** 관리자 우회 Update/Delete 쿼리 실패율 100%
- **[실패]** 어떠한 수단으로든 Audit Log 레코드 조작 시 치명적 실패
- **[검증]** pgTAP을 통한 강제 Update 시도 시 HTTP 403 반환 테스트

## 일정 (AI 가속 적용)
- **시작:** 2026-05-21
- **종료:** 2026-05-22
- **소요:** 2일

## 의존성
- 선행: T1-001
- 후행: T1-004
"@ @("Sprint 1", "Infra/DB", "Security")

# ===== T1-003 =====
Create-Issue "[T1-003] Auth 및 2단계 RBAC 라우트 보호 구현" @"
## Task ID: T1-003
**Sprint:** 1 | **유형:** API/UI | **선행조건:** T1-001 | **병렬:** 가능

## 작업 설명
인증 및 역할 기반 접근 제어(RBAC)를 구현하여 비인가 접근을 차단한다.

## 산출물
- 권한 제어 모듈

## 완료 기준
- **[정량]** 비인가 라우트 접근 차단율 100%
- **[실패]** User 권한으로 Admin API 호출 시 200 OK 반환 시 실패
- **[검증]** Cypress 기반 역할별 접근 제어 E2E 테스트 통과

## 일정 (AI 가속 적용)
- **시작:** 2026-05-21
- **종료:** 2026-05-22
- **소요:** 2일

## 의존성
- 선행: T1-001
- 후행: T4-003
"@ @("Sprint 1", "Security")

# ===== T1-004 =====
Create-Issue "[T1-004] 기준정보 Bulk Import 로직 설계 및 구현" @"
## Task ID: T1-004
**Sprint:** 1 | **유형:** API | **선행조건:** T1-002 | **병렬:** 가능

## 작업 설명
CSV 기반 기준정보 일괄 업로드를 위한 파서 및 적재 API를 설계/구현한다.

## 산출물
- 파서 및 적재 API

## 완료 기준
- **[정량]** 1,000건 CSV 업로드 소요 시간 p95 <= 3초
- **[실패]** 스키마 불일치 시 롤백 미작동 시 실패
- **[검증]** 이상치 주입된 CSV 대상 예외 반환 100% 테스트

## 일정 (AI 가속 적용)
- **시작:** 2026-05-22
- **종료:** 2026-05-23
- **소요:** 2일

## 의존성
- 선행: T1-002
- 후행: T3-001
"@ @("Sprint 1", "Infra/DB")

# ===== T1-005 =====
Create-Issue "[T1-005] Bulk Import 에러 피드백 UI" @"
## Task ID: T1-005
**Sprint:** 1 | **유형:** UI | **선행조건:** 없음 | **병렬:** 가능

## 작업 설명
Bulk Import 시 에러 발생 시 사용자에게 명확한 피드백을 제공하는 UI 컴포넌트를 구현한다.

## 산출물
- 화면 컴포넌트

## 완료 기준
- **[정량]** 에러 발생 후 피드백 모달 렌더링 <= 200ms
- **[실패]** 사용자에게 원인 불명의 에러 노출(500 에러) 시 실패
- **[검증]** 렌더링 성능 측정 및 컴포넌트 단위 테스트

## 일정 (AI 가속 적용)
- **시작:** 2026-05-19
- **종료:** 2026-05-20
- **소요:** 2일

## 의존성
- 없음 (독립 진행)
"@ @("Sprint 1", "UI/FE")

# ===== T1-006 =====
Create-Issue "[T1-006] Zero-UI STT 프롬프트 연동" @"
## Task ID: T1-006
**Sprint:** 1 | **유형:** AI/API | **선행조건:** 없음 | **병렬:** 가능

## 작업 설명
음성 인식(STT) 기반 Zero-UI 인터페이스의 프롬프트 매핑 모듈을 구현한다.

## 산출물
- STT 매핑 모듈

## 완료 기준
- **[정량]** STT Word Error Rate (WER) <= 8%
- **[실패]** 인식 시간 p95 > 3초 지연 시 Fallback 처리 불가 시 실패
- **[검증]** Golden Dataset 대상 자동 WER 측정 스크립트 구동

## 일정 (AI 가속 적용)
- **시작:** 2026-05-19
- **종료:** 2026-05-20
- **소요:** 2일

## 의존성
- 후행: T1-008, T2-001, T3-004
"@ @("Sprint 1", "AI/API", "critical-path")

# ===== T1-007 =====
Create-Issue "[T1-007] Zero-UI 모바일 입력 화면 (Edge)" @"
## Task ID: T1-007
**Sprint:** 1 | **유형:** UI | **선행조건:** 없음 | **병렬:** 가능

## 작업 설명
모바일 환경에서 마이크 기반 Zero-UI 입력 화면을 구현한다.

## 산출물
- 모바일 화면 UI

## 완료 기준
- **[정량]** 마이크 활성화 대기 시간 <= 500ms
- **[실패]** 오염/소음 환경 하드웨어 권한 획득 실패 시 앱 크래시
- **[검증]** 브라우저 오디오 권한 제어 E2E 테스트

## 일정 (AI 가속 적용)
- **시작:** 2026-05-19
- **종료:** 2026-05-20
- **소요:** 2일

## 의존성
- 후행: T1-013
"@ @("Sprint 1", "UI/FE")

Write-Host "`n=== Batch 1 Complete (T1-001 ~ T1-007) ==="
