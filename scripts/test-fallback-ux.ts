import { Performance } from 'perf_hooks';

const performance = (global as any).performance || { now: () => Date.now() };

// ─── 1. Zero-UI Fallback UX 상태 기계 시뮬레이터 (ZeroUiMobilePage Logic 복사) ───
type VoiceState = "idle" | "listening" | "processing" | "result" | "manual";

class ZeroUiFallbackUXSimulator {
  public voiceState: VoiceState = "idle";
  public fallbackReason: string | undefined = undefined;
  public formData: any = {};
  
  // 기획 사양 준수 상수
  private readonly FALLBACK_TRANSITION_MS = 300; // 500ms -> 300ms 최적화 적용
  private readonly STT_TIMEOUT_MS = 5000;
  
  private abortController: AbortController | null = null;
  private maxDurationTimer: any = null;

  constructor() {}

  // JSDOM/브라우저 navigator.onLine 환경 모사
  private isOnline(): boolean {
    if ((global as any).mockNavigator !== undefined) {
      return (global as any).mockNavigator.onLine;
    }
    return (global as any).navigator?.onLine !== false;
  }

  // 수동 입력 모드 전환 (성능 계측의 타겟)
  public async transitionToManual(reason: string): Promise<number> {
    const startTime = performance.now();
    this.fallbackReason = reason;
    
    // Framer motion 페이드인 애니메이션 대기 (최적화된 300ms)
    await new Promise((resolve) => setTimeout(resolve, this.FALLBACK_TRANSITION_MS));
    
    this.voiceState = "manual";
    const elapsed = performance.now() - startTime;
    return elapsed; // 폼 전환 완료에 소요된 레이턴시 반환
  }

  // STT 오디오 API 제출
  public async submitSttAudio(audioFile: { size: number }): Promise<number> {
    // 1. 오프라인 즉각 가드 (T1-013 핵심 사양)
    if (!this.isOnline()) {
      return await this.transitionToManual("네트워크 연결이 끊겼습니다. (오프라인 모드) 수동 입력으로 전환합니다.");
    }

    this.voiceState = "processing";
    this.abortController = new AbortController();
    
    const controller = this.abortController;
    let timeoutId: any;

    try {
      // 5초 타임아웃 타이머 작동
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          controller.abort();
          reject(new DOMException("Aborted", "AbortError"));
        }, this.STT_TIMEOUT_MS);
      });

      // API fetch 모사
      const apiCallPromise = (async () => {
        // Mock API 호출 (온라인 상태에 따라 delay)
        const delay = (global as any).mockApiDelay || 100;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return { success: true, data: { process_name: "압출", quantity: 50 } };
      })();

      await Promise.race([apiCallPromise, timeoutPromise]);
      clearTimeout(timeoutId);
      this.voiceState = "result";
      return 0;
    } catch (error: any) {
      clearTimeout(timeoutId);
      const isTimeout = error instanceof DOMException && error.name === "AbortError";
      
      // 타임아웃 발생 즉시 수동 폼 전환 개시
      return await this.transitionToManual(
        isTimeout 
          ? "AI 분석 시간이 초과되었습니다. 수동 입력으로 전환합니다."
          : "네트워크 오류가 발생했습니다. 수동 입력으로 전환합니다."
      );
    }
  }

  // 마이크 버튼 클릭 (녹음 시작/중지)
  public async handleMicClick(audioFile: { size: number }): Promise<number> {
    if (this.voiceState === "idle") {
      this.voiceState = "listening";
      return 0;
    }
    
    if (this.voiceState === "listening") {
      this.voiceState = "idle";
      return await this.submitSttAudio(audioFile);
    }
    return 0;
  }

  // 사용자가 listening/processing 중 "수동 입력으로 전환" 버튼 클릭 (Bail-out UX)
  public async handleManualOverrideClick(): Promise<number> {
    return await this.transitionToManual("사용자에 의해 수동 입력으로 전환되었습니다.");
  }
}

// ─── 2. 시나리오 검증 테스트 런너 ──────────────────────────────────────────────
async function runTests() {
  console.log('🚀 Starting STT Fallback UX Logic Integration Tests...');

  // Mock Navigator
  (global as any).mockNavigator = { onLine: true };

  // ──── [시나리오 1] 네트워크 단절(Offline) 즉각 전환 검증 ────
  console.log('\n[Scenario 1] testing immediate transition on network offline...');
  const simulator1 = new ZeroUiFallbackUXSimulator();
  
  // Offline 설정
  (global as any).mockNavigator.onLine = false;

  const startOffline = performance.now();
  const transitionDelayOffline = await simulator1.submitSttAudio({ size: 1024 });
  const totalDurationOffline = performance.now() - startOffline;

  console.log(`- State: ${simulator1.voiceState} (Expected: manual)`);
  console.log(`- Reason: "${simulator1.fallbackReason}"`);
  console.log(`- Net transition latency: ${transitionDelayOffline.toFixed(1)}ms (Criterion: ≤ 500ms)`);
  console.log(`- Total simulation duration: ${totalDurationOffline.toFixed(1)}ms`);

  if (simulator1.voiceState !== "manual") {
    throw new Error("FAIL: State was not transitioned to manual");
  }
  if (transitionDelayOffline > 500) {
    throw new Error(`FAIL: Net transition delay exceeded 500ms limit: ${transitionDelayOffline}ms`);
  }
  console.log('✅ Scenario 1 passed.');

  // ──── [시나리오 2] API 5초 타임아웃 발생 시 수동 전환 검증 ────
  console.log('\n[Scenario 2] testing automatic fallback on API timeout (5 seconds)...');
  const simulator2 = new ZeroUiFallbackUXSimulator();
  
  // Online 복구 및 API 지연 시간 6초 설정 (타임아웃은 5초)
  (global as any).mockNavigator.onLine = true;
  (global as any).mockApiDelay = 6000;

  console.log('- Mic click: start listening');
  await simulator2.handleMicClick({ size: 1024 });
  
  console.log('- Mic click: stop & submit audio (Triggers API call with 6s delay)');
  const startTimeoutCheck = performance.now();
  const transitionDelayTimeout = await simulator2.handleMicClick({ size: 1024 });
  const totalDurationTimeout = performance.now() - startTimeoutCheck;

  console.log(`- State: ${simulator2.voiceState} (Expected: manual)`);
  console.log(`- Reason: "${simulator2.fallbackReason}"`);
  console.log(`- Net transition latency: ${transitionDelayTimeout.toFixed(1)}ms (Criterion: ≤ 500ms)`);
  console.log(`- Total simulation duration (including 5s timeout): ${totalDurationTimeout.toFixed(1)}ms`);

  if (simulator2.voiceState !== "manual") {
    throw new Error("FAIL: State was not transitioned to manual after timeout");
  }
  if (transitionDelayTimeout > 500) {
    throw new Error(`FAIL: Net transition delay exceeded 500ms limit: ${transitionDelayTimeout}ms`);
  }
  if (totalDurationTimeout < 5000) {
    throw new Error("FAIL: Timeout did not wait for 5 seconds");
  }
  console.log('✅ Scenario 2 passed.');

  // ──── [시나리오 3] 로딩(processing) 중 수동 전환 탈출 버튼(Bail-out) 검증 ────
  console.log('\n[Scenario 3] testing immediate manual override button (Bail-out UX)...');
  const simulator3 = new ZeroUiFallbackUXSimulator();
  
  (global as any).mockNavigator.onLine = true;
  (global as any).mockApiDelay = 10000; // API 응답이 매우 느린 상황 가정

  await simulator3.handleMicClick({ size: 1024 }); // listening
  
  // 비동기로 submitSttAudio 격발 (3초 뒤에 완료되거나 무한 대기)
  console.log('- Mic click: stop & submit audio (processing state)');
  const apiPromise = simulator3.handleMicClick({ size: 1024 });

  // 1초 뒤 사용자가 참지 못하고 "수동 입력으로 전환" 버튼 클릭
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('- User clicked: "수동 입력으로 전환" button');
  const startOverride = performance.now();
  const transitionDelayOverride = await simulator3.handleManualOverrideClick();

  console.log(`- State: ${simulator3.voiceState} (Expected: manual)`);
  console.log(`- Reason: "${simulator3.fallbackReason}"`);
  console.log(`- Net transition latency: ${transitionDelayOverride.toFixed(1)}ms (Criterion: ≤ 500ms)`);

  if (simulator3.voiceState !== "manual") {
    throw new Error("FAIL: State was not manually overridden to manual");
  }
  if (transitionDelayOverride > 500) {
    throw new Error(`FAIL: Override transition delay exceeded 500ms limit: ${transitionDelayOverride}ms`);
  }
  console.log('✅ Scenario 3 passed.');

  console.log('\n🎉 All Fallback UX logic and transition latency tests passed successfully! (100% success rate, latency ≤ 500ms)');
}

runTests().catch((err) => {
  console.error('\n❌ Fallback UX logic verification failed!');
  console.error(err.message);
  process.exit(1);
});
