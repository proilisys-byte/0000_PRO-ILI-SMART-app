import { ArrowRight, Calendar, Mail, Play } from 'lucide-react';
import { useEffect } from 'react';

interface CTASectionProps {
  onConsultationClick?: () => void;
}

export function CTASection({ onConsultationClick }: CTASectionProps) {
  // Prefetch Figma domain for faster loading
  useEffect(() => {
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'dns-prefetch';
    prefetchLink.href = 'https://www.figma.com';
    document.head.appendChild(prefetchLink);

    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://www.figma.com';
    document.head.appendChild(preconnectLink);

    return () => {
      document.head.removeChild(prefetchLink);
      document.head.removeChild(preconnectLink);
    };
  }, []);

  const handlePrototypeClick = () => {
    window.open('https://www.figma.com/make/MKf2o17tFJF48xoJOQuT8m/proilismart_prototype_v0.1?p=f&fullscreen=1', '_blank', 'noopener');
  };

  return (
    <section className="relative py-20 lg:py-24 px-6">
      {/* Dramatic dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-600/10" />

      {/* Stronger animated blurs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="p-12 rounded-2xl bg-white/95 backdrop-blur-2xl border border-cyan-200/50 shadow-3xl shadow-slate-900/50 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 bg-clip-text text-transparent">
            품질 혁신을 시작하세요
          </h2>

          <p className="text-lg text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            PRO ALI SMART 전문가와 함께<br />
            귀사의 품질 워크플로우를 진단하고 최적화 방안을 제시합니다
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onConsultationClick}
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-base shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              무료 도입 컨설팅 신청
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handlePrototypeClick}
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-500 text-white rounded-xl font-semibold text-base shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              인터랙티브 프로토타입 체험
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="w-full sm:w-auto px-8 py-4 bg-white/40 backdrop-blur-2xl border border-white/50 text-blue-900 rounded-xl font-semibold text-base shadow-xl shadow-blue-100/50 hover:bg-white/60 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              제품 데모 요청
            </button>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { title: '무료 진단', desc: '현재 품질 프로세스 분석' },
              { title: 'ROI 계산', desc: '기대 효과 시뮬레이션' },
              { title: '맞춤 제안', desc: '업종별 최적화 방안' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
