import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Award, MessageSquare } from 'lucide-react';

interface DashboardSuccessProps {
  onNavigate: (page: string) => void;
}

export const DashboardSuccess: React.FC<DashboardSuccessProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-canvas py-16 text-ink">
      <div className="max-w-[1024px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mb-6 border border-green-500/20">
            <ShieldCheck size={28} />
          </div>
          
          <h1 className="apple-headline-lg text-ink mb-4">
            구독 가입 완료!
          </h1>
          <p className="apple-body text-primary font-semibold">
            PRO ALI SMART의 프리미엄 가치 동반자가 되신 것을 환영합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-[18px] border border-hairline flex flex-col justify-between h-fit">
            <div>
              <h3 className="text-[12px] font-bold text-ink-muted-48 uppercase tracking-wider mb-4 border-b border-hairline pb-2">회사 프로필</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-ink-muted-48 font-bold uppercase">가입 기업</div>
                  <div className="text-[14px] text-ink font-semibold mt-0.5">에스피반도체 (SME)</div>
                </div>
                <div>
                  <div className="text-[10px] text-ink-muted-48 font-bold uppercase">사용 요금제</div>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-semibold rounded-lg border border-primary/20 inline-block mt-1">
                    PRO 라이선스
                  </span>
                </div>
                <div>
                  <div className="text-[10px] text-ink-muted-48 font-bold uppercase">정부 지원 연동</div>
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-[11px] font-semibold rounded-lg border border-green-500/20 inline-block mt-1">
                    혁신바우처 85% 매핑 완료
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-ink-muted-48 font-mono mt-8">계정 상태: 활성 (ACTIVE)</div>
          </div>

          {/* Live Alerts & Updates (Retention Step) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[18px] border border-hairline">
              <h3 className="text-[16px] font-semibold text-ink mb-5 flex items-center gap-2">
                <Sparkles className="text-primary" size={16} />
                실시간 품질 알림 및 업데이트 현황
              </h3>

              <div className="space-y-4">
                {/* Alert 1 */}
                <div className="p-4 rounded-xl bg-canvas-parchment border border-hairline text-[12px] flex gap-3">
                  <Award className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="font-semibold text-ink block mb-0.5">글로벌 팹 벤더 규격 갱신 알림</span>
                    <span className="text-ink-muted-80 leading-relaxed">TSMC 2026 하반기 공정 감사 지침(QMS v3.1) 요건이 감지되었습니다. 템플릿 매핑 엔진 업데이트가 패치되었습니다.</span>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="p-4 rounded-xl bg-canvas-parchment border border-hairline text-[12px] flex gap-3">
                  <MessageSquare className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="font-semibold text-ink block mb-0.5">1:1 품질 심사관 배정 완료</span>
                    <span className="text-ink-muted-80 leading-relaxed">귀사에 김인증 수석 심사관이 밀착 대응 역량 파트너로 배정되었습니다. 첫 온라인 사전 진단 미팅을 예약하세요.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action to Main App */}
            <div className="p-6 bg-canvas-parchment rounded-[18px] border border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <h4 className="text-[14px] font-semibold text-ink mb-1">PRO ALI SMART 본 앱 시작</h4>
                <p className="text-[12px] text-ink-muted-80">감사 로그, Zero-UI 음성 연동 및 PDF 일괄 출력을 관리하는 작업 공간으로 이동합니다.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a 
                  href="/dashboard"
                  className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white font-semibold text-[13px] rounded-full hover:bg-primary-focus active:scale-95 transition-all apple-transition flex items-center justify-center gap-1.5 whitespace-nowrap text-center shadow-none"
                >
                  본 앱 대시보드로 이동
                  <ArrowRight size={14} />
                </a>
                <button 
                  onClick={() => onNavigate('home')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white border border-primary text-primary hover:bg-primary/5 font-semibold text-[13px] rounded-full active:scale-95 transition-all apple-transition flex items-center justify-center gap-1.5 whitespace-nowrap text-center cursor-pointer"
                >
                  처음 화면으로
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
