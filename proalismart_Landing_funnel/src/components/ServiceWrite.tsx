import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Play, Download, Terminal, CheckCircle2 } from 'lucide-react';

interface ServiceWriteProps {
  onBackClick: () => void;
  onNavigate: (page: string) => void;
}

export const ServiceWrite: React.FC<ServiceWriteProps> = ({ onBackClick, onNavigate }) => {
  const [auditType, setAuditType] = useState<string>('ISO9001');
  const [processType, setProcessType] = useState<string>('chemical_etching');
  const [dataCount, setDataCount] = useState<number>(50);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const logDatabase = [
    `[INFO] 오딧 빌더 엔진 기동 완료 (규격: ${auditType}, 공정: ${processType})`,
    `[INFO] 로컬 Edge STT 무전기 음성 데이터 동기화 확인 (수집 이력: 12건)...`,
    `[INFO] Edge Vision 설비 상태 판독 이미지 스캔 중 (수집 이력: 8건)...`,
    `[PROCESS] 수집 데이터 정합성 자체 검정 시작...`,
    `[SUCCESS] 데이터 누락 검사 통과: 정합성 97.4% 확보 (임계값 95% 통과)`,
    `[PROCESS] ISO 규격 조항 매핑 엔진 구동...`,
    `[MAP] 조항 8.5.1 [생산 및 서비스 제공 통제] -> 설비 자동 기록 매핑 성공`,
    `[MAP] 조항 7.1.5 [모니터링 및 측정 자원] -> 세척조 센서 캘리브레이션 이력 매핑 성공`,
    `[MAP] 조항 8.7 [부적합 출하물 통제] -> 현장 오반장 검사 불합격 음성 로그 매핑 성공`,
    `[PROCESS] 대기업 원청 템플릿 스타일 시트 병합 중...`,
    `[PDF] 가상 PDF 렌더링 엔진 호출...`,
    `[SUCCESS] 38페이지 분량의 ISO 오딧 대응 리포트 파일 생성 완료!`
  ];

  useEffect(() => {
    if (isRunning && currentStep < logDatabase.length) {
      const delay = currentStep === 0 ? 500 : Math.random() * 600 + 300;
      const timer = setTimeout(() => {
        setLogs((prev: string[]) => [...prev, logDatabase[currentStep]]);
        setCurrentStep((prev: number) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else if (isRunning && currentStep >= logDatabase.length) {
      setIsCompleted(true);
      setIsRunning(false);
    }
  }, [isRunning, currentStep]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleStartBuild = () => {
    setLogs([]);
    setCurrentStep(0);
    setIsCompleted(false);
    setIsRunning(true);
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
            Smart Audit 리포트 빌더
          </h1>
          <p className="apple-body text-ink-muted-80 max-w-xl mx-auto">
            현장의 실제 Raw-Data가 어떻게 원청 대기업 제출용 ISO 인증 실사 보고서로 10분 만에 매핑되는지 가상으로 체험해보세요.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Left Setting options panel (2 columns) */}
          <div className="md:col-span-2 bg-white p-6 rounded-[18px] border border-hairline flex flex-col justify-between h-fit">
            <div className="space-y-6">
              <h3 className="text-[17px] font-semibold text-ink border-b border-hairline pb-3">
                설정 옵션
              </h3>
              
              {/* Field 1 */}
              <div>
                <label className="block text-[11px] font-bold text-ink-muted-48 mb-2 uppercase tracking-wider">감사 적용 규격</label>
                <select 
                  value={auditType}
                  onChange={(e) => setAuditType(e.target.value)}
                  disabled={isRunning}
                  className="w-full bg-canvas-parchment border border-hairline text-ink rounded-[8px] p-2.5 text-[14px] focus:outline-none focus:border-primary cursor-pointer disabled:opacity-50"
                >
                  <option value="ISO9001">ISO 9001 (품질 경영)</option>
                  <option value="ISO14001">ISO 14001 (환경 경영)</option>
                  <option value="ISO45001">ISO 45001 (안전 보건)</option>
                  <option value="IATF16949">IATF 16949 (자동차 품질)</option>
                </select>
              </div>

              {/* Field 2 */}
              <div>
                <label className="block text-[11px] font-bold text-ink-muted-48 mb-2 uppercase tracking-wider">실사 대상 핵심 공정</label>
                <select 
                  value={processType}
                  onChange={(e) => setProcessType(e.target.value)}
                  disabled={isRunning}
                  className="w-full bg-canvas-parchment border border-hairline text-ink rounded-[8px] p-2.5 text-[14px] focus:outline-none focus:border-primary cursor-pointer disabled:opacity-50"
                >
                  <option value="chemical_etching">화학 에칭 세척 라인</option>
                  <option value="photo_lithography">포토 리소그래피 노광</option>
                  <option value="die_bonding">다이 본딩 및 와이어</option>
                  <option value="packaging">진공 밀봉 패키징</option>
                </select>
              </div>

              {/* Field 3 */}
              <div>
                <label className="block text-[11px] font-bold text-ink-muted-48 mb-2 uppercase tracking-wider flex justify-between">
                  <span>가상 적재 데이터 건수</span>
                  <span className="text-primary font-semibold">{dataCount}건</span>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  value={dataCount}
                  onChange={(e) => setDataCount(Number(e.target.value))}
                  disabled={isRunning}
                  className="w-full accent-primary h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
                <span className="text-[10px] text-ink-muted-48 mt-1.5 block">데이터가 많을수록 보고서 정밀도가 상승합니다.</span>
              </div>
            </div>

            <button
              onClick={handleStartBuild}
              disabled={isRunning}
              className="w-full mt-8 py-3 bg-primary text-white hover:bg-primary-focus disabled:bg-gray-300 disabled:text-gray-500 font-normal text-[14px] rounded-full active:scale-95 transition-all apple-transition flex items-center justify-center gap-2 cursor-pointer shadow-none"
            >
              <Play size={14} fill="currentColor" />
              {isRunning ? '리포트 생성 중...' : '체험 보고서 빌드 시작'}
            </button>
          </div>

          {/* Right Output panel (3 columns) */}
          <div className="md:col-span-3 flex flex-col gap-6">
            
            {/* Output Logs / Terminal */}
            <div className="bg-surface-tile-1 p-5 rounded-[18px] border border-white/10 flex-grow font-mono text-[12px] flex flex-col h-[280px] text-gray-300">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3 text-gray-500">
                <Terminal size={14} className="text-primary-on-dark" />
                <span>PRO ALI SMART Mapping Engine Terminal v0.1</span>
              </div>
              
              <div className="flex-grow overflow-y-auto no-scrollbar space-y-2">
                {logs.length === 0 && !isRunning && (
                  <div className="text-gray-500 italic">옵션을 설정한 후 왼쪽 빌드 버튼을 클릭하세요...</div>
                )}
                {logs.map((log: string, index: number) => {
                  let colorClass = 'text-gray-400';
                  if (log.includes('[SUCCESS]')) colorClass = 'text-green-400 font-semibold';
                  if (log.includes('[PROCESS]')) colorClass = 'text-primary-on-dark';
                  if (log.includes('[MAP]')) colorClass = 'text-orange-400';
                  if (log.includes('[PDF]')) colorClass = 'text-purple-400';
                  
                  return (
                    <div key={index} className={colorClass}>
                      {log}
                    </div>
                  );
                })}
                {isRunning && (
                  <div className="text-primary-on-dark w-1.5 h-3.5 bg-primary-on-dark inline-block ml-0.5 animate-pulse"></div>
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>

            {/* Success Preview Result */}
            {isCompleted && (
              <div className="bg-canvas-parchment p-6 rounded-[18px] border border-green-500/20 apple-transition">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-semibold text-ink">ISO 오딧 제출용 리포트 완성!</h4>
                    <p className="text-[11px] text-ink-muted-48">데이터 소스 해시(SHA-256) 및 타임스탬프 아카이빙 완료</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-hairline text-[12px] space-y-2 text-ink-muted-80 mb-5">
                  <div className="flex justify-between border-b border-hairline pb-2 font-semibold">
                    <span className="text-ink">📄 리포트 명세</span>
                    <span className="text-primary font-bold">PREVIEW ONLY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>감사 조항 대응 수</span>
                    <span className="text-ink font-semibold">14개 조항 완벽 대응</span>
                  </div>
                  <div className="flex justify-between">
                    <span>원청 템플릿</span>
                    <span className="text-ink font-semibold">SK하이닉스 실사 기준 최적화</span>
                  </div>
                  <div className="flex justify-between">
                    <span>문서 정합성 스코어</span>
                    <span className="text-green-600 font-semibold">98.2% (이상치 배제 완료)</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('pricing')}
                  className="w-full py-3 bg-primary hover:bg-primary-focus text-white font-normal text-[14px] rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-none"
                >
                  <Download size={14} />
                  PDF 다운로드 및 원본 내려받기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
