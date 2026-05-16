import { useState } from 'react';
import { ArrowLeft, User, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface CAPAPageProps {
  onBackClick?: () => void;
}

export function CAPAPage({ onBackClick }: CAPAPageProps) {
  const capaItems = [
    { id: 1, action: '작업 표준서 업데이트', assignee: '김품질', dueDate: '2026-05-15', status: 'done' },
    { id: 2, action: '작업자 재교육 실시', assignee: '이생산', dueDate: '2026-05-20', status: 'ongoing' },
    { id: 3, action: '납땜기 온도 센서 교체', assignee: '박설비', dueDate: '2026-05-25', status: 'pending' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />

      <div className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <button onClick={onBackClick} className="p-2 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-slate-200">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                CAPA (시정조치) 실행계획
              </h1>
              <p className="text-cyan-200/80">재발 방지 대책 수립 및 이행 상태 관리</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* CAPA Actions List */}
            <div className="lg:col-span-2 space-y-4">
              {capaItems.map((item) => (
                <div key={item.id} className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-2xl shadow-slate-900/40">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{item.action}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {item.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.dueDate}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'done' ? 'bg-emerald-500 text-white' :
                      item.status === 'ongoing' ? 'bg-blue-500 text-white' :
                      'bg-slate-300 text-slate-700'
                    }`}>
                      {item.status === 'done' ? '완료' : item.status === 'ongoing' ? '진행중' : '대기'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${
                      item.status === 'done' ? 'from-emerald-500 to-emerald-600' :
                      item.status === 'ongoing' ? 'from-blue-500 to-cyan-500' :
                      'from-slate-400 to-slate-500'
                    }`} style={{ width: item.status === 'done' ? '100%' : item.status === 'ongoing' ? '60%' : '0%' }} />
                  </div>
                </div>
              ))}

              {/* Add New Action */}
              <button className="w-full p-6 rounded-3xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-slate-600 hover:text-blue-600 font-semibold">
                + 새로운 시정조치 추가
              </button>
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {/* ISO Standard Info */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-3xl">
                <h3 className="text-lg font-bold text-white mb-3">ISO 표준 준수</h3>
                <p className="text-sm text-cyan-50 leading-relaxed mb-4">
                  ISO 9001/14001 규격에 맞는 시정조치 계획서가 자동으로 작성됩니다.
                </p>
                <button className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all">
                  ISO 계획서 다운로드
                </button>
              </div>

              {/* Effectiveness Evaluation */}
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-orange-200/60 shadow-2xl">
                <h3 className="text-lg font-bold text-slate-900 mb-4">효과성 평가 알림</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                    <p className="text-sm font-semibold text-orange-800 mb-1">2주 후 효과 확인</p>
                    <p className="text-xs text-slate-600">조치 완료 후 개선 효과 측정 예정</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
