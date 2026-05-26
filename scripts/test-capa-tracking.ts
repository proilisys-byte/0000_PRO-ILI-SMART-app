import { Performance } from 'perf_hooks';

const performance = (global as any).performance || { now: () => Date.now() };

// ─── 1. CAPA 상태 기계 및 진행율 계산기 시뮬레이터 ───
interface CAPAItemSim {
  id: number;
  action: string;
  status: 'done' | 'ongoing' | 'pending';
}

class CAPATrackingSimulator {
  public items: CAPAItemSim[] = [];

  constructor() {}

  public setItems(items: CAPAItemSim[]) {
    this.items = items;
  }

  // 조치율 계산 공식 (T2-004 핵심 로직)
  // 완료(Done) = 100%, 진행중(Ongoing) = 50%, 대기(Pending) = 0%
  public calculateProgress(): number {
    if (this.items.length === 0) return 0; // 0건일 때 NaN 방어

    const totalScore = this.items.length * 100;
    const currentScore = this.items.reduce((sum, item) => {
      if (item.status === 'done') return sum + 100;
      if (item.status === 'ongoing') return sum + 50;
      return sum;
    }, 0);

    const progress = (currentScore / totalScore) * 100;

    // 0% ~ 100% 한계값 방어 및 소수점 반올림 처리
    return Math.min(100, Math.max(0, Math.round(progress)));
  }

  // 상태 전이 연산 수행
  public updateStatus(id: number, status: 'done' | 'ongoing' | 'pending'): number {
    const startTime = performance.now();
    this.items = this.items.map((item) => (item.id === id ? { ...item, status } : item));
    const elapsed = performance.now() - startTime;
    return elapsed; // 연산 레이턴시 반환
  }
}

// ─── 2. 시나리오 검증 테스트 런너 ──────────────────────────────────────────────
async function runTests() {
  console.log('🚀 Starting CAPA Progress Tracking State Machine Tests...');
  const simulator = new CAPATrackingSimulator();

  // ──── [TEST 1] 경계값 테스트: 빈 데이터셋 (TotalCount = 0) ────
  console.log('\n[TEST 1] Testing Boundary Value: Empty dataset...');
  simulator.setItems([]);
  const progressEmpty = simulator.calculateProgress();
  console.log(`- Progress on 0 items: ${progressEmpty}% (Expected: 0%)`);
  if (progressEmpty !== 0 || isNaN(progressEmpty)) {
    throw new Error(`FAIL: Empty dataset progress should be 0%, got ${progressEmpty}`);
  }
  console.log('✅ TEST 1 passed.');

  // ──── [TEST 2] 10회 연속 상태 전이(State Transition) 시나리오 검증 ────
  console.log('\n[TEST 2] Running 10 Sequential State Transitions & Latency Benchmarks...');
  
  // 초기 데이터 설정 (5개 항목)
  const initialItems: CAPAItemSim[] = [
    { id: 1, action: '작업 표준서 업데이트', status: 'pending' },
    { id: 2, action: '작업자 재교육 실시', status: 'pending' },
    { id: 3, action: '납땜기 온도 센서 교체', status: 'pending' },
    { id: 4, action: '설비 정기 점검 템플릿 변경', status: 'pending' },
    { id: 5, action: '현장 5S 청소 기준 강화', status: 'pending' },
  ];
  simulator.setItems(initialItems);

  // 10단계 상태 전이 셋업
  const transitions: Array<{ itemId: number; newStatus: 'done' | 'ongoing' | 'pending' }> = [
    { itemId: 1, newStatus: 'ongoing' }, // 1. 0% -> 10%
    { itemId: 2, newStatus: 'ongoing' }, // 2. 10% -> 20%
    { itemId: 1, newStatus: 'done' },    // 3. 20% -> 30%
    { itemId: 3, newStatus: 'ongoing' }, // 4. 30% -> 40%
    { itemId: 2, newStatus: 'done' },    // 5. 40% -> 50%
    { itemId: 4, newStatus: 'ongoing' }, // 6. 50% -> 60%
    { itemId: 3, newStatus: 'done' },    // 7. 60% -> 70%
    { itemId: 5, newStatus: 'ongoing' }, // 8. 70% -> 80%
    { itemId: 4, newStatus: 'done' },    // 9. 80% -> 90%
    { itemId: 5, newStatus: 'done' },    // 10. 90% -> 100%
  ];

  let step = 1;
  for (const trans of transitions) {
    const latency = simulator.updateStatus(trans.itemId, trans.newStatus);
    const progress = simulator.calculateProgress();

    console.log(
      `[Step ${String(step).padStart(2, '0')}] Item #${trans.itemId} ➔ ${trans.newStatus.toUpperCase()} | Progress: ${progress}% | Latency: ${latency.toFixed(4)}ms`
    );

    // 백분율 규격 검증
    if (progress < 0 || progress > 100 || isNaN(progress)) {
      throw new Error(`FAIL: Progress out of safe boundary: ${progress}%`);
    }
    // 렌더링 갱신 시간 검사 (SLA: 1초 = 1000ms)
    if (latency > 1000) {
      throw new Error(`FAIL: State transition latency exceeded 1s: ${latency}ms`);
    }

    step++;
  }

  // 최종 100% 도달 확인
  const finalProgress = simulator.calculateProgress();
  console.log(`- Final Progress: ${finalProgress}% (Expected: 100%)`);
  if (finalProgress !== 100) {
    throw new Error(`FAIL: Final progress should be 100%, got ${finalProgress}%`);
  }
  console.log('✅ TEST 2 passed.');

  // ──── [TEST 3] 대기 전환 시 조치율 하락 및 Boundary 안정성 ────
  console.log('\n[TEST 3] Testing Rollback to Pending & Negative Overflow defense...');
  // 모두 완료에서 하나를 대기로 전환
  simulator.updateStatus(1, 'pending');
  const rolledBackProgress = simulator.calculateProgress();
  console.log(`- Progress after rollback: ${rolledBackProgress}% (Expected: 80%)`);
  if (rolledBackProgress !== 80) {
    throw new Error(`FAIL: Expected 80% after rolling back one item to pending. Got ${rolledBackProgress}%`);
  }
  console.log('✅ TEST 3 passed.');

  console.log('\n🎉 All CAPA progress tracking logic and state transition tests passed successfully! (100% success rate, latency <= 1s, boundaries 0-100% strictly enforced)');
}

runTests().catch((err) => {
  console.error('\n❌ CAPA progress tracking logic verification failed!');
  console.error(err.message);
  process.exit(1);
});
