import { AlertCircle, FileQuestion, Clock, TrendingDown } from 'lucide-react';

export function ProblemSection() {
  const problems = [
    {
      icon: FileQuestion,
      title: '분산된 품질 데이터',
      description: '검사 기록, 부적합 보고서, 감사 결과가 각각 다른 시스템에 산재되어 있습니다.'
    },
    {
      icon: Clock,
      title: '비효율적인 수작업',
      description: '품질 문서 작성과 추적에 과도한 시간이 소요되어 실질적인 개선 활동에 집중할 수 없습니다.'
    },
    {
      icon: TrendingDown,
      title: '보이지 않는 COPQ',
      description: '숨겨진 품질비용을 실시간으로 파악하기 어려워 전략적 의사결정이 지연됩니다.'
    },
    {
      icon: AlertCircle,
      title: '단절된 협업',
      description: '부서 간 품질 이슈 공유와 해결 프로세스가 비체계적이고 추적이 불가능합니다.'
    }
  ];

  return (
    <section className="relative py-20 lg:py-24 px-6">
      {/* Background with stronger gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-100/30 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 bg-clip-text text-transparent">
            품질 운영의 현실
          </h2>
          <p className="text-lg text-slate-700 font-medium">
            제조 품질팀이 직면한 핵심 과제
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-white/90 backdrop-blur-2xl border border-slate-200/60 shadow-xl shadow-slate-900/10 hover:bg-white hover:shadow-2xl hover:shadow-blue-600/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/30">
                <problem.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-semibold mb-3 text-slate-900">
                {problem.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
