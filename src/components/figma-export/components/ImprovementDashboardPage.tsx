import { ArrowLeft, TrendingDown, AlertCircle, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ImprovementDashboardPageProps {
  onBackClick?: () => void;
}

export function ImprovementDashboardPage({ onBackClick }: ImprovementDashboardPageProps) {
  const bottleneckData = [
    { process: '검사', leadTime: 120 },
    { process: '조립', leadTime: 95 },
    { process: '포장', leadTime: 85 },
    { process: '입고', leadTime: 70 },
    { process: '출하', leadTime: 60 }
  ];

  const defectCauses = [
    { name: '자재 불량', value: 35, color: '#0066FF' },
    { name: '공정 이상', value: 28, color: '#00D1FF' },
    { name: '설비 문제', value: 22, color: '#10B981' },
    { name: '작업 실수', value: 15, color: '#F59E0B' }
  ];

  const projects = [
    { name: 'PCB 납땜 개선', progress: 85, status: 'ongoing' },
    { name: '검사 자동화', progress: 60, status: 'ongoing' },
    { name: '자재 입고 프로세스 개선', progress: 100, status: 'completed' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />

      <div className="relative z-10 px-6 py-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <button onClick={onBackClick} className="p-2 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-slate-200">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                개선과제 관리 대시보드
              </h1>
              <p className="text-cyan-200/80">공정 병목과 품질 지표 한눈에 파악</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quality Cost */}
            <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">품질 실패 비용</h2>
              </div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                ₩125M
              </div>
              <p className="text-sm text-emerald-600 font-semibold">↓ 전월 대비 18% 감소</p>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">불량 손실</span>
                  <span className="font-semibold">₩75M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">재작업 비용</span>
                  <span className="font-semibold">₩35M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">검사 추가비용</span>
                  <span className="font-semibold">₩15M</span>
                </div>
              </div>
            </div>

            {/* Improvement Progress */}
            <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-bold text-slate-900">개선 진행률</h2>
              </div>
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                82%
              </div>
              <p className="text-sm text-slate-600">전사 개선과제 평균 완료율</p>
              <div className="mt-6 space-y-4">
                {projects.map((project, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 font-medium">{project.name}</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${
                        project.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`} style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 shadow-3xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6" />
                <h2 className="text-xl font-bold">주의 필요 항목</h2>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                  <p className="font-semibold mb-1">검사 공정 병목 발생</p>
                  <p className="text-sm opacity-90">리드타임 120분 (목표: 90분)</p>
                </div>
                <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                  <p className="font-semibold mb-1">자재 불량률 증가</p>
                  <p className="text-sm opacity-90">35% 점유율 (전월 대비 +5%p)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* Bottleneck Analysis */}
            <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl">
              <h2 className="text-xl font-bold text-slate-900 mb-6">공정 병목 분석 (Top 5)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bottleneckData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0066FF" />
                      <stop offset="100%" stopColor="#00D1FF" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#E0E7FF" opacity={0.3} />
                  <XAxis key="xaxis" dataKey="process" stroke="#94A3B8" style={{ fontSize: '12px' }} />
                  <YAxis key="yaxis" stroke="#94A3B8" style={{ fontSize: '12px' }} />
                  <Tooltip key="tooltip" />
                  <Bar key="leadTime-bar" dataKey="leadTime" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Defect Pareto */}
            <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl">
              <h2 className="text-xl font-bold text-slate-900 mb-6">불량 원인 Pareto 차트</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    key="defect-causes-pie"
                    data={defectCauses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {defectCauses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip key="tooltip" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
