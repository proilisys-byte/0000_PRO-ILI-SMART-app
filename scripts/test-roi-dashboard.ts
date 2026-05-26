import React from 'react';
import ReactDOMServer from 'react-dom/server';

// 1. Recharts 및 ResponsiveContainer 에러 방지를 위해 가상 브라우저 환경 최소 변수 모사 (ReactDOMServer 내부용)
Object.defineProperty(global, 'window', {
  value: {
    location: { href: 'http://localhost' },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    matchMedia: () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    })
  },
  writable: true,
  configurable: true
});

Object.defineProperty(global, 'document', {
  value: {
    documentElement: { style: {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  },
  writable: true,
  configurable: true
});

Object.defineProperty(global, 'navigator', {
  value: { userAgent: 'node' },
  writable: true,
  configurable: true
});

// 2. 컴포넌트 임포트
(global as any).React = React;
import { ImprovementDashboardPage } from '../src/components/figma-export/components/ImprovementDashboardPage';

async function runRoiDashboardTests() {
  console.log('🔍 [T3-002] Lean 진단 및 ROI 대시보드 UI 정적 렌더링 검증 시작...');

  try {
    // === [Test 1] 렌더링 성능 벤치마크 (LCP 모사) ===
    console.log('⚡ 1. 렌더링 성능 (LCP 모사) 벤치마크 수행 중...');
    const startBench = performance.now();
    
    // 정적 HTML 렌더링을 20회 반복하여 평균 소요 시간 계측
    const BENCH_COUNT = 20;
    let htmlOutput = '';
    for (let i = 0; i < BENCH_COUNT; i++) {
      htmlOutput = ReactDOMServer.renderToString(
        React.createElement(ImprovementDashboardPage)
      );
    }
    const endBench = performance.now();
    const avgRenderTime = (endBench - startBench) / BENCH_COUNT;
    console.log(`   - 평균 정적 렌더링 소요 시간: ${avgRenderTime.toFixed(2)}ms (기준치: <= 100ms)`);
    
    if (avgRenderTime > 100) {
      throw new Error(`정적 렌더링 소요 시간 초과: ${avgRenderTime.toFixed(2)}ms`);
    }
    console.log('   ✅ 성능 벤치마크 통과! LCP 효율 극대화 완료.');

    // === [Test 2] 기준선(7일 실적) 하의 경고 배너 은닉 검증 ===
    console.log('📊 2. 기준선(7일 실적) 하의 경고 배너 은닉 정합성 검증...');
    const initialHtml = ReactDOMServer.renderToString(
      React.createElement(ImprovementDashboardPage, { initialDataDays: 7 })
    );

    if (initialHtml.includes('warning-banner') || initialHtml.includes('데이터 유효성 기준 미달')) {
      throw new Error('초기 상태(7일 기준선)에서는 경고 배너가 표시되지 않아야 합니다.');
    }
    console.log('   ✅ 7일 기준선 검증 통과 (배너 노출 없음).');

    // === [Test 3] 3일 데이터 설정 시 경고 배너 노출 검증 ===
    console.log('⚠️ 3. 3일 데이터 설정 시 유효성 경고 배너 표출 검증...');
    const warningHtml = ReactDOMServer.renderToString(
      React.createElement(ImprovementDashboardPage, { initialDataDays: 3 })
    );

    if (!warningHtml.includes('warning-banner') && !warningHtml.includes('데이터 유효성 기준 미달')) {
      throw new Error('3일 미만의 데이터가 설정되었으나 유효성 미달 경고 배너가 렌더링되지 않았습니다.');
    }
    if (!warningHtml.includes('3') || !warningHtml.includes('일분') || !warningHtml.includes('최소 7일 이상의 데이터')) {
      throw new Error('경고 배너 내의 필수 경고 문구가 누락되었거나 일치하지 않습니다.');
    }
    console.log('   ✅ 3일 전환 경고 배너 활성화 정합성 확인 완료.');

    // === [Test 4] ComposedChart 및 PieChart 렌더링 검증 ===
    console.log('📈 4. Recharts 복합 차트(ComposedChart) 요소 존재 검증...');
    // 차트의 컨테이너 ID 및 Recharts 마크업 요소 탐색
    if (!initialHtml.includes('composed-chart-container') || !initialHtml.includes('pie-chart-container')) {
      throw new Error('대시보드 내에 ComposedChart 또는 PieChart 컨테이너가 누락되었습니다.');
    }
    console.log('   ✅ Recharts 차트 컨테이너 레이아웃 확인 완료.');

    // === [Test 5] ROI 모달 렌더링 검증 ===
    console.log('💬 5. ROI 상세 산출식 모달 오픈 시 렌더링 검증...');
    
    // 모달이 닫힌 상태 (기본값)
    const closedModalHtml = ReactDOMServer.renderToString(
      React.createElement(ImprovementDashboardPage, { initialIsModalOpen: false })
    );
    if (closedModalHtml.includes('roi-modal') || closedModalHtml.includes('ROI 상세 산출식 및 Lean 진단 가이드')) {
      throw new Error('모달이 닫혀있는 상태이나 모달 내용이 DOM에 렌더링되어 있습니다.');
    }

    // 모달이 열린 상태
    const openedModalHtml = ReactDOMServer.renderToString(
      React.createElement(ImprovementDashboardPage, { initialIsModalOpen: true })
    );
    if (!openedModalHtml.includes('roi-modal') || !openedModalHtml.includes('ROI 상세 산출식 및 Lean 진단 가이드')) {
      throw new Error('모달이 열린 상태이나 모달 내용이 DOM에 렌더링되지 않았습니다.');
    }

    // 모달 내부 7대 낭비 및 ROI 공식 포함 여부 검증
    if (
      !openedModalHtml.includes('과잉생산') || 
      !openedModalHtml.includes('대기') || 
      !openedModalHtml.includes('결함') || 
      !openedModalHtml.includes('ROI 환산 공식')
    ) {
      throw new Error('모달 내부 필수 Lean 진단 지표 및 환산 공식이 누락되었습니다.');
    }
    console.log('   ✅ 모달 열기/닫기 상태에 따른 HTML 렌더링 정합성 확인 완료.');

    console.log('\n🎉 [SUCCESS] 모든 ROI 대시보드 및 모달 렌더링 정합성 테스트 통과 완료!');
    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ 테스트 중 오류 발생:', error.message);
    process.exit(1);
  }
}

runRoiDashboardTests();
