"use client";
import { useState } from 'react';
import { UserCircle, ShieldCheck, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

type PersonaKey = 'startup' | 'manager' | 'executive';

export function PersonaSolutionSection() {
  const [activePersona, setActivePersona] = useState<PersonaKey>('startup');

  const personas = [
    {
      id: 'startup',
      icon: UserCircle,
      title: '초기 제조 스타트업 대표',
      painPoint: '비용 부담과 전문 인력 부족으로 품질 시스템 도입이 막막합니다.',
      solutions: [
        { title: 'SaaS 클라우드 즉시 도입', desc: '초기 구축 비용 없이 즉시 사용 가능한 환경 제공' },
        { title: '직관적인 UI/UX', desc: '전문 지식 없이도 바로 적응할 수 있는 쉬운 인터페이스' },
        { title: '단계별 도입 플랜', desc: '비즈니스 성장에 맞춘 유연한 요금제로 부담 제로' }
      ],
      imageGradient: 'from-blue-500 to-cyan-400'
    },
    {
      id: 'manager',
      icon: ShieldCheck,
      title: '현장 품질 책임자',
      painPoint: '수기 문서 작업과 데이터 누락, 부서 간 소통 단절로 지쳐있습니다.',
      solutions: [
        { title: '100% 디지털 문서화', desc: '모바일/태블릿을 활용한 페이퍼리스 검사 시스템' },
        { title: '부적합(NCR) 자동화', desc: '이슈 발생 즉시 관련 부서 알림 및 워크플로우 연동' },
        { title: '실시간 협업 및 추적', desc: '진행 상태를 실시간으로 공유하고 투명하게 추적' }
      ],
      imageGradient: 'from-cyan-500 to-teal-400'
    },
    {
      id: 'executive',
      icon: BarChart3,
      title: '공장장 / 경영진',
      painPoint: '숨겨진 품질 비용(COPQ)을 파악하기 어렵고 의사결정이 지연됩니다.',
      solutions: [
        { title: '통합 대시보드', desc: '공장 전체의 품질 현황을 한눈에 모니터링' },
        { title: '품질 비용 자동 집계', desc: 'COPQ 및 주요 품질 지표(KPI) 실시간 분석' },
        { title: '데이터 기반 의사결정', desc: '정확한 데이터를 바탕으로 선제적이고 전략적인 대응' }
      ],
      imageGradient: 'from-blue-600 to-indigo-500'
    }
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 bg-clip-text text-transparent">
            누구를 위한 플랫폼인가요?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            PRO ALI SMART는 제조 현장의 다양한 역할이 겪는 고충을 깊이 이해하고,<br className="hidden sm:block" />
            각자의 위치에서 최고의 성과를 낼 수 있도록 맞춤형 솔루션을 제공합니다.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Persona Selector (Left Side) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {personas.map((persona) => {
              const isActive = activePersona === persona.id;
              const Icon = persona.icon;
              return (
                <button
                  key={persona.id}
                  onClick={() => setActivePersona(persona.id as PersonaKey)}
                  className={`relative p-6 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden ${
                    isActive 
                      ? 'bg-white border-blue-500 shadow-xl shadow-blue-500/20 scale-105 z-10' 
                      : 'bg-slate-50 border-transparent hover:bg-white hover:border-blue-200 hover:shadow-md text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-cyan-500" />
                  )}
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`p-3 rounded-xl transition-colors duration-300 ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className={`text-xl font-bold transition-colors ${isActive ? 'text-slate-900' : ''}`}>
                      {persona.title}
                    </h3>
                  </div>
                  <p className={`text-sm mt-3 leading-relaxed transition-all duration-300 ${isActive ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
                    &quot;{persona.painPoint}&quot;
                  </p>
                </button>
              );
            })}
          </div>

          {/* Persona Solution Display (Right Side) */}
          <div className="w-full lg:w-2/3">
            <div className="relative h-full min-h-[400px] rounded-3xl bg-slate-900 p-8 md:p-12 overflow-hidden shadow-2xl">
              {/* Abstract Glass shapes */}
              {personas.map((persona) => (
                <div 
                  key={`bg-${persona.id}`}
                  className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] transition-opacity duration-700 bg-gradient-to-br ${persona.imageGradient} ${activePersona === persona.id ? 'opacity-30' : 'opacity-0'}`} 
                />
              ))}

              <div className="relative z-10 flex flex-col h-full justify-center">
                {personas.map((persona) => {
                  const isActive = activePersona === persona.id;
                  return (
                    <div 
                      key={`content-${persona.id}`}
                      className={`transition-all duration-500 absolute inset-8 md:inset-12 flex flex-col justify-center ${
                        isActive ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-12 pointer-events-none'
                      }`}
                    >
                      <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold mb-6 w-max">
                        Step-by-Step Solution
                      </div>
                      
                      <h4 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-snug">
                        {persona.title}의 성공을 위한<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                          맞춤형 워크플로우
                        </span>
                      </h4>

                      <div className="space-y-6">
                        {persona.solutions.map((sol, idx) => (
                          <div key={idx} className="flex gap-4 items-start group">
                            <div className="flex-shrink-0 mt-1">
                              <CheckCircle2 className="w-6 h-6 text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-transform" />
                            </div>
                            <div>
                              <h5 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-white transition-colors">{sol.title}</h5>
                              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{sol.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-10 pt-8 border-t border-slate-700/50">
                        <button className="flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition-colors group">
                          자세히 알아보기
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
