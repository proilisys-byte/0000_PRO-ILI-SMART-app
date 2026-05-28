import React, { useState } from 'react';
import { ChevronLeft, ShieldAlert, Cpu, Award, Download, TrendingDown, DollarSign } from 'lucide-react';

interface ServiceEvalProps {
  onBackClick: () => void;
  onNavigate: (page: string) => void;
}

export const ServiceEval: React.FC<ServiceEvalProps> = ({ onBackClick, onNavigate }) => {
  const [ncText, setNcText] = useState('2번 화학 세척 공정 수동 밸브 개폐 압력 측정치 기록 누락');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const mockAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setAnalysisResult({
        fiveWhys: [
          '왜 압력 기록이 누락되었는가? -> 현장 작업자가 바빠서 수기 기입을 생략함.',
          '왜 바쁜가? -> 세척 주기가 짧아져 2분마다 밸브를 돌려야 함.',
          '왜 밸브를 매번 수기로 체크해야 하는가? -> 기존 수동 QMS 기록판이 제어반과 떨어져 있음.',
          '왜 제어반 데이터가 자동 기록되지 않는가? -> 구형 아날로그 밸브 장비라 디지털 연동이 불가능함.',
          '왜 디지털 연동을 안 했는가? -> 스마트 팩토리 솔루션 도입 비용(약 5천만 원)이 너무 비싸서 보류함.'
        ],
        capa: {
          immediate: '오프라인-First Zero-UI 마이크 부착하여 현장 작업자 오반장의 "개방 완료" 음성 발화 즉시 로깅 자동화 적용.',
          longterm: '초경량 블루투스 압력 변환 센서 탑재 (초기 비용 약 30만 원) 후 PRO ALI SMART Edge 허브와 다이렉트 연동.'
        },
        copq: {
          defectCost: 4500000,
          idleCost: 2800000,
          reworkCost: 1100000,
          total: 8400000
        },
        roi: '월 840만 원의 히든 팩토리 비용(COPQ) 중 90% 이상을 30일 이내에 절감하여, 솔루션 연간 비용 즉시 회수 및 이익 전환 가능.'
      });
      setIsRunningState(false);
    }, 2000);
  };

  const setIsRunningState = (val: boolean) => {
    setIsAnalyzing(val);
  };

  return (
    <div className="w-full bg-canvas py-16 text-ink">
      <div className="max-w-[1024px] mx-auto px-6">
        
        {/* Back navigation */}
        <button 
          onClick={onBackClick}
          className="inline-flex items-center gap-1.5 text-primary hover:underline mb-8 text-[14px] group cursor-pointer"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          메인 화면으로 돌아가기
        </button>

        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="apple-headline-lg text-ink mb-4">
            NC 시정 & COPQ 손실 진단기
          </h1>
          <p className="apple-body text-ink-muted-80 max-w-xl mx-auto">
            원청 실사관으로부터 지적받은 부적합 사항(NC)을 입력하여 AI 원인 분석(5-Why)과 재발방지(CAPA) 대책 수립, 낭비 비용(COPQ)을 진단받아 보세요.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Input Form (2 cols) */}
          <div className="md:col-span-2 bg-white p-6 rounded-[18px] border border-hairline flex flex-col justify-between h-fit">
            <div className="space-y-4">
              <h3 className="text-[17px] font-semibold text-ink border-b border-hairline pb-3 flex items-center gap-2">
                <ShieldAlert className="text-primary" size={18} />
                지적 사항 입력
              </h3>
              
              <div>
                <label className="block text-[11px] font-bold text-ink-muted-48 mb-2 uppercase tracking-wider">원청 NC 내용 / 부적합 지적 항목</label>
                <textarea
                  value={ncText}
                  onChange={(e) => setNcText(e.target.value)}
                  disabled={isAnalyzing}
                  rows={6}
                  className="w-full bg-canvas-parchment border border-hairline text-ink rounded-[8px] p-3 text-[13px] focus:outline-none focus:border-primary font-mono resize-none disabled:opacity-50"
                  placeholder="예: 2번 에칭 설비의 온도 오정합에 따른 세척 불량 수동 대처 기록이 관리 대장에 누락됨."
                />
              </div>
            </div>

            <button
              onClick={mockAnalyze}
              disabled={isAnalyzing || !ncText.trim()}
              className="w-full mt-6 py-3 bg-primary text-white hover:bg-primary-focus disabled:bg-gray-300 disabled:text-gray-500 font-normal text-[14px] rounded-full active:scale-95 transition-all apple-transition flex items-center justify-center gap-2 cursor-pointer shadow-none"
            >
              <Cpu size={14} />
              {isAnalyzing ? 'AI 정밀 분석 중...' : '시정 조치 & COPQ 진단'}
            </button>
          </div>

          {/* Output Diagnostics (3 cols) */}
          <div className="md:col-span-3">
            {isAnalyzing && (
              <div className="bg-canvas-parchment p-12 rounded-[18px] border border-hairline flex flex-col items-center justify-center text-center h-[400px]">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                <h4 className="text-[17px] font-semibold text-ink mb-2">원인 및 손실 추적 중</h4>
                <p className="text-[13px] text-ink-muted-80 max-w-xs">
                  품질 관리 규정 데이터베이스 분석, 5-Why 원인 규명 및 히든 팩토리 낭비 비용(COPQ)을 계산하는 중입니다...
                </p>
              </div>
            )}

            {!isAnalyzing && !analysisResult && (
              <div className="bg-canvas-parchment p-12 rounded-[18px] border border-hairline flex flex-col items-center justify-center text-center h-[400px] text-ink-muted-48">
                <ShieldAlert size={40} className="mb-4 text-hairline" />
                <p className="text-[13px]">왼쪽 입력 폼에 지적 사항을 입력하고 분석을 진행해 주세요.</p>
              </div>
            )}

            {!isAnalyzing && analysisResult && (
              <div className="space-y-6">
                
                {/* 5-Why & CAPA */}
                <div className="bg-white p-6 rounded-[18px] border border-hairline">
                  <h4 className="text-[14px] font-semibold text-primary uppercase mb-4 flex items-center gap-1.5">
                    <Award size={16} />
                    AI 5-Why 원인 분석 결과
                  </h4>
                  
                  <div className="space-y-2.5 mb-6">
                    {analysisResult.fiveWhys.map((why: string, i: number) => (
                      <div key={i} className="text-[13px] text-ink-muted-80 flex items-start gap-2">
                        <span className="font-semibold text-primary">Why {i+1}:</span>
                        <span>{why.split('->')[1] || why}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-[14px] font-semibold text-ink mb-3">
                    💡 재발방지대책 (CAPA) 권고안
                  </h4>
                  <div className="space-y-3 bg-canvas-parchment p-4 rounded-xl text-[12px] border border-hairline text-ink-muted-80">
                    <div>
                      <span className="font-semibold text-ink block mb-1">단기 시정 조치:</span>
                      <span>{analysisResult.capa.immediate}</span>
                    </div>
                    <div className="pt-2.5 border-t border-hairline">
                      <span className="font-semibold text-ink block mb-1">근본 대책 (장기):</span>
                      <span>{analysisResult.capa.longterm}</span>
                    </div>
                  </div>
                </div>

                {/* COPQ Chart & ROI */}
                <div className="bg-white p-6 rounded-[18px] border border-hairline">
                  <h4 className="text-[14px] font-semibold text-ink mb-4 flex items-center gap-2">
                    <TrendingDown className="text-red-500" size={16} />
                    히든 팩토리 COPQ (낭비 비용) 진단
                  </h4>

                  <div className="space-y-3.5 mb-6">
                    {/* Defect Cost Bar */}
                    <div>
                      <div className="flex justify-between text-[12px] text-ink-muted-80 mb-1">
                        <span>불량 및 폐기 손실</span>
                        <span className="text-ink font-semibold">{analysisResult.copq.defectCost.toLocaleString()}원</span>
                      </div>
                      <div className="w-full bg-canvas-parchment rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '54%' }}></div>
                      </div>
                    </div>

                    {/* Idle Cost Bar */}
                    <div>
                      <div className="flex justify-between text-[12px] text-ink-muted-80 mb-1">
                        <span>대기 및 생산 지연</span>
                        <span className="text-ink font-semibold">{analysisResult.copq.idleCost.toLocaleString()}원</span>
                      </div>
                      <div className="w-full bg-canvas-parchment rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '33%' }}></div>
                      </div>
                    </div>

                    {/* Rework Cost Bar */}
                    <div>
                      <div className="flex justify-between text-[12px] text-ink-muted-80 mb-1">
                        <span>재작업 공수 낭비</span>
                        <span className="text-ink font-semibold">{analysisResult.copq.reworkCost.toLocaleString()}원</span>
                      </div>
                      <div className="w-full bg-canvas-parchment rounded-full h-2">
                        <div className="bg-gray-400 h-2 rounded-full" style={{ width: '13%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-[12px] flex items-start gap-3 mb-6">
                    <DollarSign className="text-primary flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <span className="font-semibold text-ink block mb-1">ROI 가치 분석결과</span>
                      <span className="text-ink-muted-80 leading-relaxed">{analysisResult.roi}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('pricing')}
                    className="w-full py-3 bg-primary hover:bg-primary-focus text-white font-normal text-[14px] rounded-full active:scale-95 transition-all apple-transition flex items-center justify-center gap-2 cursor-pointer shadow-none"
                  >
                    <Download size={14} />
                    전체 시정 조치 계획서 및 ROI 보고서 내보내기
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
