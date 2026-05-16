import { ArrowLeft, Users, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';

interface TrainingManagementPageProps {
  onBackClick?: () => void;
}

export function TrainingManagementPage({ onBackClick }: TrainingManagementPageProps) {
  const employees = [
    { name: '김품질', dept: '품질관리팀', lastTraining: '2026-03-15', nextTraining: '2026-06-15', status: 'completed' },
    { name: '이생산', dept: '생산1팀', lastTraining: '2026-02-20', nextTraining: '2026-05-20', status: 'upcoming' },
    { name: '박설비', dept: '설비팀', lastTraining: '2025-12-10', nextTraining: '2026-05-10', status: 'overdue' }
  ];

  const upcomingTrainings = [
    { title: 'ISO 9001 내부 심사 교육', date: '2026-05-15', participants: 12 },
    { title: '품질 개선 기법 (6 Sigma)', date: '2026-05-22', participants: 8 },
    { title: '작업 표준서 작성 실무', date: '2026-06-05', participants: 15 }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />

      <div className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBackClick} className="p-2 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-slate-200">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                  교육 이력 관리
                </h1>
                <p className="text-cyan-200/80">ISO 심사 필수 증빙 자료 자동화 관리</p>
              </div>
            </div>

            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg">
              <FileText className="w-5 h-5" />
              심사 대응 리포트 출력
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Employee Training Status */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">사원별 교육 현황</h2>
              {employees.map((emp, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{emp.name}</h3>
                      <p className="text-sm text-slate-600">{emp.dept}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      emp.status === 'completed' ? 'bg-emerald-500 text-white' :
                      emp.status === 'upcoming' ? 'bg-blue-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {emp.status === 'completed' ? '이수 완료' : emp.status === 'upcoming' ? '예정' : '기한 초과'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 mb-1">최근 교육</p>
                      <p className="font-semibold text-slate-900">{emp.lastTraining}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">다음 교육</p>
                      <p className="font-semibold text-slate-900">{emp.nextTraining}</p>
                    </div>
                  </div>

                  <button className="mt-4 w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all">
                    교육 이력 상세보기
                  </button>
                </div>
              ))}
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {/* Training Calendar */}
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-cyan-200/60 shadow-3xl">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                  <h2 className="text-lg font-bold text-slate-900">예정된 교육</h2>
                </div>

                <div className="space-y-3">
                  {upcomingTrainings.map((training, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-cyan-50 border border-cyan-200">
                      <p className="font-semibold text-slate-900 mb-1">{training.title}</p>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {training.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {training.participants}명
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-3xl text-white">
                <h3 className="text-lg font-bold mb-4">교육 통계</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>전체 이수율</span>
                    <span className="text-2xl font-bold">92%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '92%' }} />
                  </div>
                  <div className="pt-3 border-t border-white/30 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>이수 완료</span>
                      <span className="font-semibold">46명</span>
                    </div>
                    <div className="flex justify-between">
                      <span>교육 예정</span>
                      <span className="font-semibold">3명</span>
                    </div>
                    <div className="flex justify-between">
                      <span>기한 초과</span>
                      <span className="font-semibold text-orange-200">1명</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence Storage */}
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl">
                <h3 className="text-lg font-bold text-slate-900 mb-4">증빙 자료 보관</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
                    <span className="text-slate-700">교육 사진</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
                    <span className="text-slate-700">서명부</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
                    <span className="text-slate-700">교육 자료</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
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
