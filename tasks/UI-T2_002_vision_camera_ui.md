# UI-T2_002_vision_camera_ui.md

## 1. 개요
Vision AI 분석을 위한 현장 카메라 촬영 브라우저 UI 명세입니다. (`T2-001_VISION_AI_SPEC.md`에서 추출)

## 2. 컴포넌트 세분화 구조 (Component-Driven Architecture)
UI의 가벼운 동작과 모바일 기기에서의 성능 최적화를 위해, 본 화면은 다음과 같이 상태(Container)와 뷰(Presenter)가 분리된 컴포넌트로 조립됩니다.

### 2.1 Container (상태 관리 로직)
- **`VisionCameraContainer`**: 
  - 역할: WebRTC 권한 요청, 미디어 스트림 관리, 캡처된 이미지 데이터 상태 보존, API 전송 및 응답(Rate Limit 에러 포함) 관리.
  - 특징: 화면 렌더링보다는 카메라 장치 제어 및 네트워크 로직에 집중.

### 2.2 Presenter (순수 UI 컴포넌트)
- **`CameraStreamOverlay` (Organism)**:
  - 역할: 비디오 스트림(`video` 태그) 및 그 위에 십자선 가이드라인 투명 박스를 겹쳐서(Overlay) 그리는 역할.
- **`CaptureButton` (Atom)**:
  - 역할: 사용자가 촬영할 수 있는 동그란 형태의 플로팅 액션 버튼(FAB).
- **`ImagePreviewDialog` (Organism)**:
  - 역할: 캡처된 정지 화면을 보여주고 하단에 `[재촬영]`, `[분석 전송]` 액션 버튼을 렌더링.
- **`CameraFallbackForm` (Organism - 🌟 Lazy Loading 대상)**:
  - 역할: 429 에러 발생 시 동적으로 로드되어, 분석 대신 사용자가 텍스트로 결과를 직접 입력할 수 있는 수동 폼 렌더링.

## 3. 브라우저 API 및 UI 흐름
- **WebRTC API**: `navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })`를 활용하여 디바이스 후면 카메라 호출.
- **오버레이 가이드**:
  - 화면 중앙 십자선(Crosshair) 및 투명 가이드 박스 표출.
  - 조도 센서 또는 ImageCapture API 데이터를 이용해 노출 부족 시 "플래시를 켜거나 밝은 곳으로 이동하세요" 경고 토스트 렌더링.
- **플로우**: 
  1. `실시간 스트림 뷰` 표시
  2. `[촬영 버튼]` 클릭
  3. `정지된 화면 미리보기(Preview)` 표시
  4. `[재촬영]` 또는 `[분석 전송]` 액션 선택

## 4. Fallback UI (에러 대응)
- HTTP 429 반복 발생 시(3회 이상 Rate Limit 도달 시), 로딩 스피너를 중단하고 다음 메시지와 입력 폼 노출:
  - "현재 분석 서버가 혼잡합니다. 사진은 안전하게 저장되었으니 검사 결과를 수동으로 입력해 주세요."
  - 수동 입력을 위한 텍스트 폼 노출.
- **낙관적 UI(Optimistic UI)**: 목표 응답 시간(2초) 초과 시 체감 지연 완화를 위한 처리.
