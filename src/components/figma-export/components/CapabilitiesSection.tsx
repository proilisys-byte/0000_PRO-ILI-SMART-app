import { Mic, FileText, BarChart3, Workflow, Zap, Shield } from 'lucide-react';

export function CapabilitiesSection() {
  const capabilities = [
    {
      icon: Mic,
      title: 'Zero-UI 수집기',
      description: '음성 인식으로 즉시 품질 데이터 기록',
      size: 'large',
      features: ['실시간 음성→텍스트', '자동 분류', '맥락 이해']
    },
    {
      icon: FileText,
      title: 'Smart Audit 엔진',
      description: 'AI 기반 자동 감사 문서 생성',
      size: 'medium',
      features: ['ISO 준수', '자동 리포트']
    },
    {
      icon: BarChart3,
      title: 'Lean COPQ 추적',
      description: '실시간 품질비용 가시화',
      size: 'medium',
      features: ['대시보드', '예측 분석']
    },
    {
      icon: Workflow,
      title: '통합 워크플로우',
      description: '부적합→CAPA→검증 자동 연결',
      size: 'large',
      features: ['자동 라우팅', '상태 추적', '알림']
    },
    {
      icon: Zap,
      title: '즉시 협업',
      description: '부서 간 실시간 이슈 공유',
      size: 'small',
      features: ['@멘션', '댓글']
    },
    {
      icon: Shield,
      title: '규제 대응',
      description: 'FDA/ISO 완벽 준수',
      size: 'small',
      features: ['감사 추적', '서명']
    }
  ];

  const getSizeClass = (size: string) => {
    switch(size) {
      case 'large': return 'sm:col-span-2';
      case 'medium': return 'sm:col-span-1';
      case 'small': return 'sm:col-span-1';
      default: return '';
    }
  };

  return (
    <section className="relative py-16 lg:py-20 px-6">
      {/* Enhanced background with depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-800 to-cyan-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-500/5" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-xl">
            핵심 역량
          </h2>
          <p className="text-lg text-cyan-50/80 font-medium">
            PRO ALI SMART가 제공하는 투명한 품질 혁신
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((capability, idx) => (
            <div
              key={idx}
              className={`group p-4 rounded-xl bg-white/95 backdrop-blur-2xl border border-cyan-200/40 shadow-2xl shadow-slate-900/40 hover:bg-white hover:shadow-3xl hover:shadow-cyan-500/50 hover:border-cyan-300/60 transition-all duration-500 flex flex-col h-full ${getSizeClass(capability.size)}`}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-blue-600/50">
                <capability.icon className="w-5 h-5 text-white" />
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-semibold mb-1 text-slate-900">
                {capability.title}
              </h3>
              <p className="text-xs text-slate-600 mb-2 flex-grow">
                {capability.description}
              </p>

              {/* Features badges */}
              <div className="flex flex-wrap gap-1">
                {capability.features.map((feature, fIdx) => (
                  <span
                    key={fIdx}
                    className="px-2 py-0.5 text-xs rounded-full bg-blue-100/60 backdrop-blur-sm text-blue-700 border border-blue-200/50"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Micro chart for large cards */}
              {capability.size === 'large' && (
                <div className="mt-3 h-12 rounded-lg bg-gradient-to-r from-blue-100/50 to-cyan-100/50 backdrop-blur-sm border border-white/50 flex items-end gap-1 p-1.5">
                  {[40, 60, 45, 75, 55, 85, 70, 90].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-sm opacity-70"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
