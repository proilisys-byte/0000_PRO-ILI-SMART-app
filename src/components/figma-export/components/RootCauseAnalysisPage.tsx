import { useState } from 'react';
import { ArrowLeft, Sparkles, AlertTriangle, CheckCircle2, GitBranch } from 'lucide-react';

interface RootCauseAnalysisPageProps {
  onBackClick?: () => void;
}

export function RootCauseAnalysisPage({ onBackClick }: RootCauseAnalysisPageProps) {
  const [activeTab, setActiveTab] = useState<'5why' | 'fishbone'>('5why');

  const whyLevels = [
    { level: 'Why 1', question: '왜 납땜 불량이 발생했나요?', answer: '납땜 온도가 부적절했습니다', aiSuggestion: true },
    { level: 'Why 2', question: '왜 납땜 온도가 부적절했나요?', answer: '온도 설정값이 잘못되었습니다', aiSuggestion: true },
    { level: 'Why 3', question: '왜 온도 설정값이 잘못되었나요?', answer: '작업 표준서가 업데이트 되지 않았습니다', aiSuggestion: false },
    { level: 'Why 4', question: '왜 작업 표준서가 업데이트 되지 않았나요?', answer: '', aiSuggestion: false },
    { level: 'Why 5', question: '근본 원인은 무엇인가요?', answer: '', aiSuggestion: false }
  ];

  const fishboneCategories = [
    {
      category: 'Man (인적요인)',
      causes: ['작업자 교육 부족', '작업 숙련도 부족', '피로도 증가'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: 'Machine (설비)',
      causes: ['납땜기 온도 편차', '설비 노후화', '정기점검 미실시'],
      color: 'from-cyan-500 to-emerald-500'
    },
    {
      category: 'Material (자재)',
      causes: ['플럭스 품질 저하', '납 성분 불량', '입고검사 누락'],
      color: 'from-emerald-500 to-blue-500'
    },
    {
      category: 'Method (방법)',
      causes: ['표준서 미업데이트', '작업 순서 미준수', '검증 절차 부재'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />

      <div className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={onBackClick}
              className="p-2 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-slate-200 hover:bg-slate-700/80 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                원인분석 (5Why/Fishbone)
              </h1>
              <p className="text-cyan-200/80">AI 도움으로 논리적 오류 없는 근본 원인 도출</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="mb-6 flex gap-3 p-2 rounded-2xl bg-slate-800/80 border-2 border-slate-700 max-w-md">
            <button
              onClick={() => setActiveTab('5why')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === '5why'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              5Why 분석
            </button>
            <button
              onClick={() => setActiveTab('fishbone')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'fishbone'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              Fishbone 다이어그램
            </button>
          </div>

          {activeTab === '5why' ? (
            /* 5Why Analysis */
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main 5Why Tree */}
              <div className="lg:col-span-2">
                <div className="p-8 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl shadow-slate-900/50">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">5Why 트리 분석</h2>
                    <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
                      <Sparkles className="w-4 h-4" />
                      AI 추천 받기
                    </button>
                  </div>

                  <div className="space-y-4">
                    {whyLevels.map((why, idx) => (
                      <div key={idx} className="relative">
                        {/* Connection Line */}
                        {idx > 0 && (
                          <div className="absolute -top-4 left-8 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-cyan-400" />
                        )}

                        <div className={`p-6 rounded-2xl border-2 transition-all ${
                          why.answer
                            ? 'bg-blue-50 border-blue-300 shadow-md'
                            : 'bg-white border-slate-200'
                        }`}>
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                              <span className="text-white font-bold text-sm">{why.level}</span>
                            </div>

                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-700 mb-2">{why.question}</p>

                              {why.answer ? (
                                <div className="flex items-start gap-2">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-slate-900">{why.answer}</p>
                                </div>
                              ) : (
                                <textarea
                                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none resize-none"
                                  rows={2}
                                  placeholder="원인을 입력하세요..."
                                />
                              )}

                              {why.aiSuggestion && (
                                <div className="mt-3 p-3 rounded-lg bg-cyan-50 border border-cyan-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-cyan-600" />
                                    <span className="text-xs font-semibold text-cyan-700">AI 추천</span>
                                  </div>
                                  <p className="text-sm text-slate-700">이 답변이 논리적으로 타당합니다</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Logic Check Panel */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-orange-200/60 shadow-3xl shadow-slate-900/50">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-slate-900">논리적 오류 검출</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                      <p className="text-sm font-semibold text-emerald-800 mb-1">✓ Why 1-2 인과관계 정상</p>
                      <p className="text-xs text-slate-600">온도 부적절 → 설정값 오류</p>
                    </div>

                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                      <p className="text-sm font-semibold text-orange-800 mb-1">⚠ Why 3 검증 필요</p>
                      <p className="text-xs text-slate-600">표준서 미업데이트가 직접적 원인인지 확인 필요</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-3xl">
                  <h3 className="text-lg font-bold text-white mb-3">근본 원인 도출 가이드</h3>
                  <p className="text-sm text-cyan-50 leading-relaxed">
                    Why 5까지 도달하면 프로세스 개선이나 시스템 변경이 필요한 근본 원인에 도달하게 됩니다.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Fishbone Diagram */
            <div className="p-8 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl shadow-slate-900/50">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Fishbone Diagram (4M 분석)</h2>

              {/* Fishbone Visualization */}
              <div className="relative p-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 min-h-[500px]">
                {/* Main Spine */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 transform -translate-y-1/2" />

                {/* Problem Box (Head) */}
                <div className="absolute top-1/2 right-8 transform -translate-y-1/2 p-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl">
                  <p className="font-bold">PCB 납땜 불량</p>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-2 gap-8 h-full">
                  {fishboneCategories.map((cat, idx) => (
                    <div key={idx} className={`${idx < 2 ? 'self-start' : 'self-end'}`}>
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${cat.color} text-white shadow-lg mb-3`}>
                        <p className="font-bold text-sm">{cat.category}</p>
                      </div>
                      <div className="space-y-2 pl-4">
                        {cat.causes.map((cause, cIdx) => (
                          <div key={cIdx} className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm text-sm">
                            {cause}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all">
                  PNG로 저장
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                  분석 완료 및 다음 단계
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
