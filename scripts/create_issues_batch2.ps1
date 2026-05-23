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
    if ($result -match "https://") {
        $issueUrl = $result.Trim()
        gh project item-add $project --owner $owner --url $issueUrl
        Write-Host "  Added to project #$project"
    }
    Start-Sleep -Milliseconds 1500
    return $result
}

# ===== T1-008 =====
Create-Issue "[T1-008] Smart Audit 템플릿 매핑 엔진 설계" @"
## Task ID: T1-008
**Sprint:** 1 | **유형:** AI/API | **선행조건:** T1-006 | **병렬:** 가능

## 작업 설명
ISO 9001 템플릿의 필수 필드를 STT 결과와 정확히 매핑하는 엔진을 설계한다.

## 완료 기준
- **[정량]** ISO 9001 템플릿 필수 필드 매핑 정확도 >= 99%
- **[실패]** 필수 항목 누락(Null) 1건 이상 발생 시 리포트 생성 실패
- **[검증]** 테스트 케이스 50건 대상 누락률 0% 검증 스크립트

## 일정 (AI 가속 적용)
- **시작:** 2026-05-21
- **종료:** 2026-05-23
- **소요:** 3일

## 의존성
- 선행: T1-006
- 후행: T1-009, T2-003, T3-006, T4-004
"@ @("Sprint 1", "AI/API", "critical-path")

# ===== T1-009 =====
Create-Issue "[T1-009] Audit PDF 클라이언트 생성 적용" @"
## Task ID: T1-009
**Sprint:** 1 | **유형:** UI | **선행조건:** T1-008 | **병렬:** 불가

## 작업 설명
Audit 리포트를 PDF로 변환하여 클라이언트에서 다운로드 가능하게 한다.

## 완료 기준
- **[정량]** PDF 변환 및 다운로드 완료 소요 시간 <= 3초
- **[실패]** html2pdf 렌더링 시 레이아웃 깨짐 1건 이상 발생
- **[검증]** Playwright 활용 브라우저별 해상도 렌더링 캡처 검증

## 일정 (AI 가속 적용)
- **시작:** 2026-05-23
- **종료:** 2026-05-25
- **소요:** 2일

## 의존성
- 선행: T1-008
"@ @("Sprint 1", "UI/FE")

# ===== T1-010 =====
Create-Issue "[T1-010] Golden Dataset 정의 및 샘플 구축" @"
## Task ID: T1-010 (신규)
**Sprint:** 1 | **유형:** AI/QA | **선행조건:** 없음 | **병렬:** 가능

## 작업 설명
AI 정확도 측정을 위한 정답지(Golden Dataset)를 구축한다. STT 100건, Audit 매핑 50건의 검증용 정답지를 확보한다.

## 완료 기준
- **[정량]** STT 100건, Audit 매핑 50건의 검증용 정답지 확보
- **[실패]** 메타데이터(방언, 소음환경 등) 누락 시 데이터셋 승인 반려
- **[검증]** DVC 연동 및 데이터셋 JSON 스키마 유효성 100% 통과

## 일정 (AI 가속 적용)
- **시작:** 2026-05-19
- **종료:** 2026-05-22
- **소요:** 3일

## 의존성
- 후행: T1-011
"@ @("Sprint 1", "AI/API", "QA")

# ===== T1-011 =====
Create-Issue "[T1-011] AI 품질 검증 자동화 파이프라인" @"
## Task ID: T1-011 (신규)
**Sprint:** 1 | **유형:** AI/QA | **선행조건:** T1-010 | **병렬:** 불가

## 작업 설명
정답지 대비 AI F1-Score를 자동으로 산출하는 검증 파이프라인을 GitHub Actions CI에 연동한다.

## 완료 기준
- **[정량]** 정답지 대비 AI F1-Score 산출 스크립트 작동률 100%
- **[실패]** 평가 파이프라인 실행 시 OOM 발생 또는 5분 초과 시 실패
- **[검증]** GitHub Actions CI 파이프라인 연동 확인

## 일정 (AI 가속 적용)
- **시작:** 2026-05-22
- **종료:** 2026-05-23
- **소요:** 2일

## 의존성
- 선행: T1-010
"@ @("Sprint 1", "AI/API", "QA")

# ===== T1-012 =====
Create-Issue "[T1-012] Observability 로그 스키마 및 KPI 수집" @"
## Task ID: T1-012 (신규)
**Sprint:** 1 | **유형:** Infra/BE | **선행조건:** T1-001 | **병렬:** 가능

## 작업 설명
Audit 생성 시간, STT Fallback율 등 비즈니스 KPI를 측정하기 위한 로그 스키마를 정의하고 수집 시스템을 구축한다.

## 완료 기준
- **[정량]** Audit 생성 시간, STT Fallback 로그 적재 누락률 0%
- **[실패]** 로그 페이로드에 Session ID 또는 타임스탬프 누락 시 실패
- **[검증]** 초당 50건 API 에러 강제 주입 후 CloudWatch 적재 100% 확인

## 일정 (AI 가속 적용)
- **시작:** 2026-05-21
- **종료:** 2026-05-22
- **소요:** 2일

## 의존성
- 선행: T1-001
"@ @("Sprint 1", "Infra/DB")

# ===== T1-013 =====
Create-Issue "[T1-013] STT 실패 대응 (Fallback UX) 구현" @"
## Task ID: T1-013 (신규)
**Sprint:** 1 | **유형:** UI/API | **선행조건:** T1-007 | **병렬:** 가능

## 작업 설명
STT 인식 실패 시 사용자가 수동 입력으로 전환할 수 있는 Fallback UX를 구현한다.

## 완료 기준
- **[정량]** STT 인식 실패 판정 후 수동 입력 창 전환 속도 <= 500ms
- **[실패]** 타임아웃 발생 시 화면 정지로 인한 유저 이탈율 10% 초과
- **[검증]** 네트워크 단절 환경 시뮬레이션 하 Fallback 전환 100% 확인

## 일정 (AI 가속 적용)
- **시작:** 2026-05-21
- **종료:** 2026-05-22
- **소요:** 2일

## 의존성
- 선행: T1-007
"@ @("Sprint 1", "UI/FE")

# ===== T1-014 =====
Create-Issue "[T1-014] 데이터 수집 동의 이력 로그 DB 체계화" @"
## Task ID: T1-014 (신규)
**Sprint:** 1 | **유형:** DB/Security | **선행조건:** T1-001 | **병렬:** 불가

## 작업 설명
PIPA 수집 동의 내역을 변경 불가능한 DB에 영구 기록하는 체계를 구축한다.

## 완료 기준
- **[정량]** PIPA 수집 동의 내역의 암호화 DB 적재율 100%
- **[실패]** 동의 버전 및 식별자 해시 누락 시 릴리즈 즉시 락업
- **[검증]** 회원가입 API 주입 시 동의 파라미터 무결성 테스트

## 일정 (AI 가속 적용)
- **시작:** 2026-05-21
- **종료:** 2026-05-22
- **소요:** 2일

## 의존성
- 선행: T1-001
- 후행: T4-002
"@ @("Sprint 1", "Infra/DB", "Security")

Write-Host "`n=== Batch 2 Complete (T1-008 ~ T1-014) ==="
