import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onConsultationClick?: () => void;
  onDashboardClick?: () => void;
}

export function HeroSection({ onConsultationClick, onDashboardClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced gradient background with stronger contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-cyan-500/10" />

      {/* Stronger animated aurora blur effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-cyan-400/30 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Main heading */}
        <div className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-xl border border-cyan-300/50 shadow-xl shadow-cyan-500/50">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-xs font-semibold text-white">Smart Manufacturing Quality Platform</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent leading-tight drop-shadow-2xl">
          품질 운영을 하나의<br />
          연결된 워크플로우로 전환
        </h1>

        <p className="text-lg md:text-xl text-cyan-50/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
          제조 품질팀을 위한 단일 플랫폼.<br />
          투명한 워크플로우로 스마트 제조의 품질혁신을 실현합니다.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
          <button
            onClick={onConsultationClick}
            className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-base shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            무료 도입 컨설팅 신청
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onDashboardClick}
            className="w-full sm:w-auto px-8 py-4 bg-white/40 backdrop-blur-2xl border border-white/50 text-blue-900 rounded-xl font-semibold text-base shadow-xl shadow-blue-100/50 hover:bg-white/60 transition-all duration-300 hover:scale-105"
          >
            대시보드 미리보기
          </button>
        </div>

        {/* Stats preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { label: '처리 시간 단축', value: '8h → 10m' },
            { label: 'COPQ 감소', value: '45%' },
            { label: '워크플로우 통합', value: '100%' }
          ].map((stat, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/95 backdrop-blur-2xl border border-cyan-200/50 shadow-2xl shadow-blue-900/40 hover:shadow-3xl hover:shadow-cyan-500/50 transition-all duration-300 hover:-translate-y-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-700 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
