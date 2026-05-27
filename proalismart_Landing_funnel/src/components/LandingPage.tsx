import React from 'react';
import { Shield, Zap, FileText, ChevronRight, Users, TrendingUp, CheckCircle, Star } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-canvas text-ink">
      
      {/* 1. Hero Section (White full-bleed tile) */}
      <section className="relative bg-canvas pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden border-b border-hairline">
        <div className="max-w-[1024px] mx-auto px-6 text-center relative z-10">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-canvas-parchment text-ink text-[12px] font-normal border border-hairline mb-8">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
            반도체 소부장 SME 전용 QMS DX 플랫폼
          </div>
          
          <h1 className="apple-headline-hero text-ink mb-6 max-w-4xl mx-auto leading-tight text-[36px] sm:text-[48px] md:text-[56px]">
            원청 실사관 현장 도착 <span className="text-primary">10분 전</span>,<br />
            단 한번의 클릭으로 완성하는 ISO 감사 리포트
          </h1>
          
          <p className="apple-body-large text-ink-muted-80 max-w-3xl mx-auto mb-10 text-[18px] md:text-[21px]">
            120시간 이상 걸리던 수기 문서 작업은 끝났습니다. 현장의 Zero-UI 데이터 수집과 
            실시간 NC(부적합) 시정 관리로 완벽한 디지털 증빙을 완성하세요.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button 
              onClick={() => onNavigate('write')}
              className="w-full sm:w-auto px-7 py-3.5 bg-primary text-white text-[15px] font-normal rounded-full hover:bg-primary-focus active:scale-95 transition-all apple-transition cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText size={16} />
              10분 Audit 체험하기
              <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => onNavigate('eval')}
              className="w-full sm:w-auto px-7 py-3.5 bg-transparent border border-primary text-primary text-[15px] font-normal rounded-full hover:bg-primary/5 active:scale-95 transition-all apple-transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Shield size={16} />
              긴급 NC 시정 진단받기
            </button>
          </div>

          {/* Premium Product Mockup (Museum pedestal render with shadow) */}
          <div className="max-w-[840px] mx-auto relative px-4">
            <div className="bg-surface-tile-1 text-left rounded-[18px] overflow-hidden apple-product-shadow border border-white/10 apple-transition">
              {/* Mockup Header bar */}
              <div className="h-10 bg-surface-black border-b border-white/[0.08] px-4 flex items-center justify-between text-gray-500 text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                  <span className="ml-2 text-gray-400">PRO ALI SMART Audit Engine</span>
                </div>
                <div className="bg-white/5 px-2 py-0.5 rounded text-gray-400">Secured</div>
              </div>
              {/* Mockup Content */}
              <div className="p-6 md:p-8 space-y-6 text-gray-300 font-sans">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-primary-on-dark font-semibold">Active Document</div>
                    <h3 className="text-lg font-semibold text-white">ISO 9001:2015 Audit Report</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] rounded font-medium">
                    정합성 검증 완료 98.2%
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-[10px] text-gray-500 font-medium">대응 조항 수</div>
                    <div className="text-xl font-bold text-white mt-1">14개 조항</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-[10px] text-gray-500 font-medium">매핑 정밀도</div>
                    <div className="text-xl font-bold text-primary-on-dark mt-1">99.1%</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-[10px] text-gray-500 font-medium">소요 시간</div>
                    <div className="text-xl font-bold text-white mt-1">8분 42초</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-[10px] text-gray-500 font-medium">원청 양식</div>
                    <div className="text-xl font-bold text-white mt-1">SK Hynix</div>
                  </div>
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between text-gray-500 border-b border-white/5 pb-1">
                    <span>처리 항목</span>
                    <span>상태</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">조항 8.5.1 [생산 및 서비스 제공 통제]</span>
                    <span className="text-green-400">● 연결됨</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">조항 7.1.5 [모니터링 및 측정 자원]</span>
                    <span className="text-green-400">● 연결됨</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>수기 데이터 가공 로그 108건 병합 완료...</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Pain Points Section (Near-Black full-bleed tile) */}
      <section className="py-24 bg-surface-tile-1 text-white border-b border-surface-black">
        <div className="max-w-[1024px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="apple-headline-lg text-white mb-4">
              수기 서류 지옥과 가짜 혁신에 갇힌 소부장의 현실
            </h2>
            <p className="apple-body text-gray-400 max-w-2xl mx-auto">
              기존의 무거운 MES, QMS 패키지는 현장에 녹아들지 못하고 결국 이중 수작업과 데이터 누락을 유발합니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Pain 1 */}
            <div className="bg-surface-tile-2 p-8 rounded-[18px] border border-white/[0.04] flex flex-col justify-between h-[320px]">
              <div>
                <div className="w-10 h-10 rounded-[8px] bg-red-500/10 flex items-center justify-center text-red-400 mb-6">
                  <Zap size={20} />
                </div>
                <h3 className="text-[19px] font-semibold text-white mb-3">2주간의 야근, 문서 지옥</h3>
                <p className="text-[14px] text-gray-400 leading-relaxed mb-4">
                  원청 대기업 실사가 통보되면 품질관리 부서는 평균 <strong>120시간</strong> 동안 수기 엑셀과 작업 일지를 뒤지며 밤새 서류 작업을 진행합니다.
                </p>
              </div>
              <div className="text-[12px] font-semibold text-red-400">품질팀 번아웃 위험 극대화</div>
            </div>
            
            {/* Pain 2 */}
            <div className="bg-surface-tile-2 p-8 rounded-[18px] border border-white/[0.04] flex flex-col justify-between h-[320px]">
              <div>
                <div className="w-10 h-10 rounded-[8px] bg-red-500/10 flex items-center justify-center text-red-400 mb-6">
                  <Shield size={20} />
                </div>
                <h3 className="text-[19px] font-semibold text-white mb-3">NC(부적합) 통보와 계약 파기</h3>
                <p className="text-[14px] text-gray-400 leading-relaxed mb-4">
                  원청에서 지적 사항(NC)을 수신하면 90일 내에 완벽한 시정 조치 계획서를 제출해야 합니다. 실패 시 거래가 종료될 확률이 무려 <strong>40%</strong>에 달합니다.
                </p>
              </div>
              <div className="text-[12px] font-semibold text-red-400">SME 원청 거래선 탈락 위기</div>
            </div>
            
            {/* Pain 3 */}
            <div className="bg-surface-tile-2 p-8 rounded-[18px] border border-white/[0.04] flex flex-col justify-between h-[320px]">
              <div>
                <div className="w-10 h-10 rounded-[8px] bg-red-500/10 flex items-center justify-center text-red-400 mb-6">
                  <Users size={20} />
                </div>
                <h3 className="text-[19px] font-semibold text-white mb-3">현장의 장갑 낀 입력 저항</h3>
                <p className="text-[14px] text-gray-400 leading-relaxed mb-4">
                  장갑과 기름으로 범벅된 현장 작업자들에게 정밀 터치 입력을 강요하면 데이터 누락 및 입력 거부율이 <strong>80%</strong>까지 도달합니다.
                </p>
              </div>
              <div className="text-[12px] font-semibold text-red-400">현장 데이터 정합성 20% 미만 추락</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Value Proposition & Comparison (Parchment full-bleed tile) */}
      <section className="py-24 bg-canvas-parchment text-ink border-b border-hairline">
        <div className="max-w-[1024px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-ink text-[11px] font-semibold border border-hairline mb-4">
                차별화된 강점
              </div>
              <h2 className="apple-headline-lg text-ink mb-8 leading-tight">
                무거운 구축은 가라,<br />
                현장 밀착형 초고속 혁신 엔진
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                    <CheckCircle size={15} />
                  </div>
                  <div>
                    <h4 className="text-[17px] font-semibold text-ink mb-1">Zero-UI 기반 오프라인-First 수집</h4>
                    <p className="text-ink-muted-80 text-[14px] leading-relaxed">
                      현장 오반장은 장갑을 벗지 않고 무전기로 말하거나(음성), 휴대폰으로 한 장 툭 찍는(비전) 것만으로 안전하고 완벽한 이력을 수집합니다. 네트워크 단절 시 로컬 보관 후 자동 동기화됩니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                    <CheckCircle size={15} />
                  </div>
                  <div>
                    <h4 className="text-[17px] font-semibold text-ink mb-1">원청별 ISO 9001/IATF 16949 자동 매핑</h4>
                    <p className="text-ink-muted-80 text-[14px] leading-relaxed">
                      삼성, SK, TSMC 등 각 원청 대기업의 상이한 감사 양식과 규격 조항에 데이터를 AI 엔진이 99% 정확도로 매핑해 줍니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                    <CheckCircle size={15} />
                  </div>
                  <div>
                    <h4 className="text-[17px] font-semibold text-ink mb-1">Lean 진단 대시보드 통한 COPQ 가시화</h4>
                    <p className="text-ink-muted-80 text-[14px] leading-relaxed">
                      현장의 가려진 불량/대기 비용(Hidden Factory Cost)을 자동 감지하고, 이 솔루션 도입 후 절감액과 투자 대비 효과(ROI)를 30일 이내에 숫자로 입증합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual Comparison Table styled as a clean store card */}
            <div className="bg-white p-8 rounded-[18px] border border-hairline relative">
              <div className="absolute -top-3 right-6 px-3 py-0.5 bg-primary text-white font-normal rounded-full text-[11px] shadow-none">
                강력 추천
              </div>
              <h3 className="text-[19px] font-semibold text-ink mb-6 flex items-center gap-2">
                <TrendingUp className="text-primary animate-pulse" size={18} />
                솔루션 비교 벤치마크
              </h3>
              
              <div className="space-y-4 text-[13px]">
                <div className="grid grid-cols-3 gap-2 pb-2.5 border-b border-hairline text-[11px] font-semibold text-ink-muted-48 uppercase">
                  <div>비교 항목</div>
                  <div>기존 MES/QMS</div>
                  <div className="text-primary font-bold">PRO ALI SMART</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pb-2.5 border-b border-hairline text-ink-muted-80">
                  <div className="font-semibold text-ink">도입 비용</div>
                  <div>수천만~수억 원</div>
                  <div className="text-primary font-semibold">월 12만 원 <span className="text-[9px] text-ink-muted-48 block">(바우처 85% 적용)</span></div>
                </div>

                <div className="grid grid-cols-3 gap-2 pb-2.5 border-b border-hairline text-ink-muted-80">
                  <div className="font-semibold text-ink">서류 준비 시간</div>
                  <div>평균 120시간</div>
                  <div className="text-primary font-semibold">10분 미만</div>
                </div>

                <div className="grid grid-cols-3 gap-2 pb-2.5 border-b border-hairline text-ink-muted-80">
                  <div className="font-semibold text-ink">현장 입력 저항</div>
                  <div>80% 입력 거부</div>
                  <div className="text-primary font-semibold">5% 미만 <span className="text-[9px] text-ink-muted-48 block">(Zero-UI 음성/비전)</span></div>
                </div>

                <div className="grid grid-cols-3 gap-2 pb-2.5 border-b border-hairline text-ink-muted-80">
                  <div className="font-semibold text-ink">ROI 검증 기한</div>
                  <div>평가 불가</div>
                  <div className="text-primary font-semibold">30일 이내</div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-ink-muted-80">
                  <div className="font-semibold text-ink">데이터 정합성</div>
                  <div>20% 수준</div>
                  <div className="text-primary font-semibold">95% 이상</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Social Proof Section (White full-bleed tile) */}
      <section className="py-24 bg-canvas text-ink border-b border-hairline">
        <div className="max-w-[1024px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="apple-headline-lg text-ink mb-4">
              이미 국내외 소부장 강소기업이 입증했습니다
            </h2>
            <p className="apple-body text-ink-muted-80 max-w-2xl mx-auto">
              실제 현장에 도입한 지 30일 만에 가치를 확인한 고객들의 후기입니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-surface-pearl p-8 rounded-[18px] border border-hairline flex flex-col justify-between h-[320px]">
              <div>
                <div className="flex items-center gap-0.5 text-orange-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                </div>
                <p className="text-ink-muted-80 text-[14px] leading-relaxed mb-4">
                  "대기업 실사 전에 서류 꾸미느라 매번 품질팀 전원이 야근했었는데, 도입 후 태블릿 하나로 현장에서 모든 이력이 수집되더니 실사 당일 보고서가 10분 만에 깔끔하게 나와서 실사관도 감탄했습니다."
                </p>
              </div>
              <div className="border-t border-hairline pt-4">
                <div className="text-[14px] font-semibold text-ink">김대성 대표</div>
                <div className="text-[11px] text-ink-muted-48">정밀 화학 에칭 장비 전문 S사</div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-pearl p-8 rounded-[18px] border border-hairline flex flex-col justify-between h-[320px]">
              <div>
                <div className="flex items-center gap-0.5 text-orange-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                </div>
                <p className="text-ink-muted-80 text-[14px] leading-relaxed mb-4">
                  "원청으로부터 NC 통보를 받고 폐업 위기까지 갔습니다. PRO ALI SMART로 긴급 시정 조치 계획서를 AI로 생성하고 피드백 리포트를 받아 3일 만에 대응해 거래선 유지를 이뤄냈습니다."
                </p>
              </div>
              <div className="border-t border-hairline pt-4">
                <div className="text-[14px] font-semibold text-ink">정성훈 품질이사</div>
                <div className="text-[11px] text-ink-muted-48">반도체 리드프레임 가공 H테크</div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-pearl p-8 rounded-[18px] border border-hairline flex flex-col justify-between h-[320px]">
              <div>
                <div className="flex items-center gap-0.5 text-orange-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                </div>
                <p className="text-ink-muted-80 text-[14px] leading-relaxed mb-4">
                  "오프라인 현장에서 오반장님이 마이크폰에 몇 번 말하는 것만으로 QMS 데이터 정합성이 98%까지 올라갔습니다. 수치화된 COPQ 대시보드를 매일 보고 현장 낭비 비용을 24% 절감했습니다."
                </p>
              </div>
              <div className="border-t border-hairline pt-4">
                <div className="text-[14px] font-semibold text-ink">박성진 공장장</div>
                <div className="text-[11px] text-ink-muted-48">반도체 패키징용 와이어 W솔루션</div>
              </div>
            </div>
          </div>
          
          {/* Trust badges */}
          <div className="mt-20 pt-10 border-t border-hairline flex flex-wrap justify-center items-center gap-8 md:gap-12 text-[13px] text-ink-muted-48 font-semibold">
            <span>ISO 9001 인증 지원</span>
            <span className="w-1.5 h-1.5 rounded-full bg-hairline hidden md:inline"></span>
            <span>IATF 16949 대응</span>
            <span className="w-1.5 h-1.5 rounded-full bg-hairline hidden md:inline"></span>
            <span>반도체소부장 협회 추천</span>
            <span className="w-1.5 h-1.5 rounded-full bg-hairline hidden md:inline"></span>
            <span>중소벤처기업부 바우처 지원</span>
          </div>
        </div>
      </section>

      {/* 5. CTA section (Near-Black full-bleed tile) */}
      <section className="py-28 bg-surface-tile-3 text-white text-center">
        <div className="max-w-[720px] mx-auto px-6">
          <h2 className="apple-headline-lg text-white mb-6">
            더 이상 문서 작업에 낭비할 시간이 없습니다
          </h2>
          <p className="apple-body text-gray-400 mb-10">
            10분 만에 오딧 증빙 리포트를 구축하고, 정부 혁신 바우처 85% 혜택을 받아 가장 저렴하게 제조 현장의 디지털 전환을 달성하세요.
          </p>
          <button 
            onClick={() => onNavigate('pricing')}
            className="px-8 py-4 bg-primary text-white text-[16px] font-normal rounded-full hover:bg-primary-focus active:scale-95 transition-all apple-transition cursor-pointer inline-flex items-center gap-2"
          >
            정부 바우처 지원 혜택 알아보기
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};
