"use client";
import { TrendingDown, Activity, AlertCircle, CheckCircle2, Zap, Radio, BarChart3, Users, Clock, Target, FileText, GitBranch, ListChecks, BookOpen, TrendingUp, Database, Mic } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardPageProps {
  onBackClick?: () => void;
  onNavigate?: (page: string) => void;
}

export function DashboardPage({ onBackClick, onNavigate }: DashboardPageProps) {

  const quickAccess = [
    { id: 'ncr', title: 'NCR 등록', icon: FileText, color: 'from-blue-600 to-cyan-500', description: '부적합 보고서' },
    { id: 'rootcause', title: '원인분석', icon: GitBranch, color: 'from-cyan-600 to-blue-600', description: '5Why/Fishbone' },
    { id: 'capa', title: 'CAPA', icon: CheckCircle2, color: 'from-emerald-600 to-cyan-600', description: '시정조치 계획' },
    { id: 'eightd', title: '8D Report', icon: FileText, color: 'from-orange-600 to-red-600', description: '대기업 보고서' },
    { id: 'audit', title: 'Audit 체크', icon: ListChecks, color: 'from-purple-600 to-blue-600', description: '심사 대응' },
    { id: 'improvement', title: '개선과제', icon: TrendingUp, color: 'from-blue-600 to-emerald-600', description: '과제 관리' },
    { id: 'training', title: '교육 이력', icon: BookOpen, color: 'from-cyan-600 to-purple-600', description: '교육 관리' },
    { id: 'bulk-import', title: '기준정보 업로드', icon: Database, color: 'from-purple-600 to-indigo-500', description: '대량 마스터 등록' },
    { id: 'zero-ui-mobile', title: 'Zero-UI 모바일', icon: Mic, color: 'from-cyan-500 to-blue-500', description: '현장 음성 입력' }
  ];
  // Mock data for charts
  const copqData = [
    { month: '1월', value: 100, target: 100 },
    { month: '2월', value: 92, target: 90 },
    { month: '3월', value: 78, target: 80 },
    { month: '4월', value: 71, target: 70 },
    { month: '5월', value: 58, target: 60 },
    { month: '6월', value: 55, target: 50 }
  ];

  const defectRateData = [
    { time: '00:00', rate: 2.4 },
    { time: '04:00', rate: 1.8 },
    { time: '08:00', rate: 2.1 },
    { time: '12:00', rate: 1.5 },
    { time: '16:00', rate: 1.2 },
    { time: '20:00', rate: 0.9 },
    { time: '24:00', rate: 1.1 }
  ];

  const activeIssues = [
    {
      id: 'NCR-2024-157',
      title: 'PCB 납땜 불량 발생',
      type: '공정 이상',
      severity: 'critical',
      status: 'ongoing',
      assignee: '김품질',
      dueDate: '2026-05-05',
      progress: 65
    },
    {
      id: 'NCR-2024-156',
      title: '원자재 입고 검사 이탈',
      type: '자재 불량',
      severity: 'major',
      status: 'pending',
      assignee: '이자재',
      dueDate: '2026-05-08',
      progress: 30
    },
    {
      id: 'NCR-2024-155',
      title: '리플로우 온도 편차 초과',
      type: '설비 문제',
      severity: 'major',
      status: 'ongoing',
      assignee: '박설비',
      dueDate: '2026-05-06',
      progress: 80
    },
    {
      id: 'NCR-2024-154',
      title: '포장재 치수 불량',
      type: '자재 불량',
      severity: 'minor',
      status: 'review',
      assignee: '최포장',
      dueDate: '2026-05-10',
      progress: 95
    }
  ];

  const realtimeActivities = [
    { id: 1, type: 'voice', message: '라인 3 검사 결과 수집 완료', time: '방금 전', status: 'success' },
    { id: 2, type: 'analysis', message: 'AI 품질 분석 완료 - 패턴 이상 감지', time: '2분 전', status: 'warning' },
    { id: 3, type: 'capa', message: 'CAPA-2024-156 자동 생성됨', time: '5분 전', status: 'info' },
    { id: 4, type: 'approval', message: '부적합 보고서 #1247 승인됨', time: '12분 전', status: 'success' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-cyan-500/10" />

      {/* Stronger ambient light effects */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-cyan-400/25 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10 px-6 py-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Top bar with glass effect */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-800/80 backdrop-blur-2xl border border-slate-600/50 shadow-xl shadow-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackClick}
                className="p-2 rounded-xl bg-slate-700/80 backdrop-blur-xl border border-slate-500/50 text-slate-200 hover:bg-slate-600/80 hover:text-white transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-xl">
                  실시간 품질 혁신 대시보드
                </h1>
                <p className="text-sm text-cyan-200/80">마지막 업데이트: 방금 전</p>
              </div>
            </div>

            {/* AI Status indicator */}
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-xl border border-cyan-300/50 shadow-xl shadow-cyan-500/50">
              <div className="relative">
                <Radio className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI 수집 엔진</p>
                <p className="text-xs text-cyan-100">실시간 가동 중</p>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid - Bento Layout */}
          <div className="grid grid-cols-12 gap-4 auto-rows-[140px]">
            {/* Big metric - COPQ Reduction */}
            <div className="col-span-12 md:col-span-4 row-span-2 p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-cyan-200/50 shadow-2xl shadow-slate-900/50 hover:shadow-3xl hover:shadow-cyan-500/50 transition-all duration-500 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-blue-600/50">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-xs text-white font-semibold border border-emerald-400 shadow-lg shadow-emerald-500/30">
                  -45% ↓
                </span>
              </div>

              <h3 className="text-sm text-slate-700 mb-2 font-semibold">COPQ (품질비용)</h3>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6">
                ₩55M
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">지난달 대비</span>
                  <span className="font-bold text-emerald-600">-₩12M</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full w-[55%] bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full shadow-inner" />
                </div>
              </div>
            </div>

            {/* Defect Rate */}
            <div className="col-span-12 md:col-span-4 row-span-2 p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-cyan-200/50 shadow-2xl shadow-slate-900/50 hover:shadow-3xl hover:shadow-cyan-500/50 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-slate-700 flex items-center gap-2 font-semibold">
                  <Activity className="w-4 h-4 text-cyan-600" />
                  실시간 불량률
                </h3>
                <span className="px-2 py-1 rounded-lg bg-cyan-500 text-xs text-white font-semibold shadow-lg shadow-cyan-500/30">Live</span>
              </div>

              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
                0.9%
              </div>

              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={defectRateData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D1FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    key="defect-rate-area"
                    type="monotone"
                    dataKey="rate"
                    stroke="#00D1FF"
                    strokeWidth={3}
                    fill="url(#colorRate)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* COPQ Trend Chart */}
            <div className="col-span-12 md:col-span-4 row-span-2 p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl shadow-slate-900/50 hover:shadow-3xl hover:shadow-blue-600/40 transition-all duration-500">
              <div className="mb-4">
                <h3 className="text-sm font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 bg-clip-text text-transparent mb-1">COPQ 감소 추이</h3>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600 font-medium">최근 6개월</p>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/50" />
                      <span className="text-xs text-slate-700 font-semibold">실제</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-slate-400 shadow-md" />
                      <span className="text-xs text-slate-700 font-semibold">목표</span>
                    </div>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={copqData}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0066FF" />
                      <stop offset="100%" stopColor="#00D1FF" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#E0E7FF" opacity={0.3} />
                  <XAxis key="xaxis" dataKey="month" stroke="#94A3B8" style={{ fontSize: '10px' }} />
                  <YAxis key="yaxis" stroke="#94A3B8" style={{ fontSize: '10px' }} />
                  <Tooltip
                    key="tooltip"
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 102, 255, 0.1)'
                    }}
                  />
                  <Line
                    key="value-line"
                    type="monotone"
                    dataKey="value"
                    stroke="url(#lineGradient)"
                    strokeWidth={2}
                    dot={{ fill: '#0066FF', r: 3 }}
                    activeDot={{ r: 5, fill: '#00D1FF' }}
                  />
                  <Line
                    key="target-line"
                    type="monotone"
                    dataKey="target"
                    stroke="#CBD5E1"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Active Issues */}
            <div className="col-span-12 md:col-span-7 row-span-4 p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl shadow-slate-900/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    진행 중인 이슈
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">현재 처리 중인 NCR 및 품질 문제</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">긴급 1</span>
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">중요 2</span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">일반 1</span>
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
                {activeIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{issue.id}</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            issue.severity === 'critical' ? 'bg-red-500 text-white' :
                            issue.severity === 'major' ? 'bg-orange-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {issue.severity === 'critical' ? 'Critical' : issue.severity === 'major' ? 'Major' : 'Minor'}
                          </span>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{issue.type}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-2">{issue.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold">
                              {issue.assignee.charAt(0)}
                            </div>
                            {issue.assignee}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            마감: {issue.dueDate}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${
                            issue.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                            issue.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {issue.status === 'ongoing' ? '진행중' : issue.status === 'pending' ? '대기' : '검토중'}
                          </span>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-all">
                        상세보기
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 font-medium">진행률</span>
                        <span className="font-bold text-slate-900">{issue.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            issue.progress >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                            issue.progress >= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                            'bg-gradient-to-r from-orange-500 to-orange-600'
                          }`}
                          style={{ width: `${issue.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                <p className="text-sm text-slate-600">총 <strong className="text-slate-900">{activeIssues.length}건</strong>의 이슈 진행 중</p>
                <button
                  onClick={() => onNavigate?.('ncr')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                >
                  + 새 이슈 등록
                </button>
              </div>
            </div>

            {/* Real-time Activity Feed */}
            <div className="col-span-12 md:col-span-5 row-span-4 p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl shadow-slate-900/50 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 bg-clip-text text-transparent flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-600" />
                  실시간 활동
                </h3>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50" />
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[440px] pr-2">
                {realtimeActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 rounded-xl bg-white border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md ${
                        activity.status === 'success' ? 'bg-emerald-500' :
                        activity.status === 'warning' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}>
                        {activity.status === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : activity.status === 'warning' ? (
                          <AlertCircle className="w-4 h-4 text-white" />
                        ) : (
                          <Activity className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 font-medium mb-1">{activity.message}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Menu */}
            <div className="col-span-12 row-span-2 p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl shadow-slate-900/50">
              <h3 className="text-xl font-bold text-slate-900 mb-6">빠른 실행</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {quickAccess.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate?.(item.id)}
                    className="group p-4 rounded-2xl bg-gradient-to-br hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
                    style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-slate-600">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="col-span-6 md:col-span-3 row-span-1 p-4 rounded-2xl bg-white/95 backdrop-blur-2xl border border-blue-200/60 shadow-xl shadow-slate-900/40 hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300">
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-xs text-slate-600 mb-1 font-semibold">처리 시간</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    10분
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="col-span-6 md:col-span-3 row-span-1 p-4 rounded-2xl bg-white/95 backdrop-blur-2xl border border-cyan-200/60 shadow-xl shadow-slate-900/40 hover:shadow-2xl hover:shadow-cyan-600/40 transition-all duration-300">
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-xs text-slate-600 mb-1 font-semibold">활성 사용자</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    47명
                  </p>
                </div>
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <div className="col-span-6 md:col-span-3 row-span-1 p-4 rounded-2xl bg-white/95 backdrop-blur-2xl border border-emerald-200/60 shadow-xl shadow-slate-900/40 hover:shadow-2xl hover:shadow-emerald-600/40 transition-all duration-300">
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-xs text-slate-600 mb-1 font-semibold">완료된 CAPA</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    156
                  </p>
                </div>
                <Target className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            <div className="col-span-6 md:col-span-3 row-span-1 p-4 rounded-2xl bg-white/95 backdrop-blur-2xl border border-blue-200/60 shadow-xl shadow-slate-900/40 hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300">
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-xs text-slate-600 mb-1 font-semibold">목표 달성률</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    98%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
