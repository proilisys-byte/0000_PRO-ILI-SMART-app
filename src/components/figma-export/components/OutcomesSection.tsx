import { TrendingUp, Target, CheckCircle2 } from 'lucide-react';

export function OutcomesSection() {
  const outcomes = [
    {
      metric: '8h → 10m',
      label: '품질 문서 처리 시간',
      description: '월간 품질 보고서 작성 시간을 98% 단축',
      icon: TrendingUp,
      color: 'from-cyan-600 to-blue-600'
    },
    {
      metric: '45%',
      label: 'COPQ 감소',
      description: '숨겨진 품질비용 실시간 가시화로 달성',
      icon: Target,
      color: 'from-blue-600 to-cyan-600'
    },
    {
      metric: '100%',
      label: '워크플로우 통합',
      description: '검사부터 CAPA까지 단일 플랫폼에서 관리',
      icon: CheckCircle2,
      color: 'from-emerald-600 to-cyan-600'
    }
  ];

  return (
    <section className="relative py-20 lg:py-24 px-6">
      {/* Background with dramatic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-100 to-blue-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 bg-clip-text text-transparent">
            기대 효과
          </h2>
          <p className="text-lg text-slate-700 font-medium">
            측정 가능한 품질 혁신 성과
          </p>
        </div>

        {/* Big numbers grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {outcomes.map((outcome, idx) => (
            <div
              key={idx}
              className="group relative p-10 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-2xl shadow-slate-900/20 hover:shadow-3xl hover:shadow-blue-600/40 hover:border-cyan-300/60 transition-all duration-500 hover:-translate-y-3 text-center flex flex-col h-full"
            >
              {/* Icon */}
              <div className="inline-flex w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-blue-600/50">
                <outcome.icon className="w-8 h-8 text-white" />
              </div>

              {/* Big metric */}
              <div className={`text-4xl font-bold mb-3 bg-gradient-to-r ${outcome.color} bg-clip-text text-transparent leading-tight tracking-tight whitespace-nowrap`}>
                {outcome.metric}
              </div>

              {/* Label */}
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {outcome.label}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-700 leading-relaxed flex-grow">
                {outcome.description}
              </p>

              {/* Progress indicator */}
              <div className="mt-auto pt-6 h-2 rounded-full bg-blue-100/50 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${outcome.color} rounded-full transition-all duration-1000`}
                  style={{ width: idx === 0 ? '98%' : idx === 1 ? '45%' : '100%' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Supporting statement */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center shadow-xl shadow-blue-500/30">
          <p className="text-xl font-semibold mb-2">
            실무적이고 단호한 B2B 품질 혁신
          </p>
          <p className="text-base opacity-90">
            PRO ALI SMART는 마케팅이 아닌, 측정 가능한 성과로 증명합니다
          </p>
        </div>
      </div>
    </section>
  );
}
