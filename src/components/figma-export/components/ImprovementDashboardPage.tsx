"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingDown, AlertCircle, Target, X, Calculator, HelpCircle, AlertTriangle } from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ImprovementDashboardPageProps {
  onBackClick?: () => void;
  initialDataDays?: number;
  initialIsModalOpen?: boolean;
}

export function ImprovementDashboardPage({ 
  onBackClick,
  initialDataDays = 7,
  initialIsModalOpen = false
}: ImprovementDashboardPageProps) {
  const [dataDays, setDataDays] = useState<number>(initialDataDays);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(initialIsModalOpen);

  // 3일 / 7일 실적 및 누적 ROI 시뮬레이션 데이터
  const chartData3Days = [
    { day: '1일차', score: 62, roi: 120 },
    { day: '2일차', score: 68, roi: 210 },
    { day: '3일차', score: 71, roi: 350 },
  ];

  const chartData7Days = [
    { day: '1일차', score: 62, roi: 120 },
    { day: '2일차', score: 68, roi: 210 },
    { day: '3일차', score: 71, roi: 350 },
    { day: '4일차', score: 75, roi: 510 },
    { day: '5일차', score: 81, roi: 720 },
    { day: '6일차', score: 86, roi: 960 },
    { day: '7일차', score: 94, roi: 1250 },
  ];

  const currentChartData = dataDays === 7 ? chartData7Days : chartData3Days;

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

  // Lean 7대 낭비 요소 및 ROI 산출 공식 매핑 데이터
  const leanWasteData = [
    {
      category: "과잉생산 (Overproduction)",
      desc: "필요한 수량 이상 또는 조기에 생산하여 자재 및 재고가 낭비되는 상태",
      formula: "초과 제작 수량 × (원자재 단가 + 공정 공수 임율)",
      roiImpact: "품질 비용 25% 절감"
    },
    {
      category: "대기 (Waiting)",
      desc: "설비 고장, 자재 불량, 정보 지연 등으로 작업이 일시 중단되는 상태",
      formula: "대기 시간(시간) × 작업자 평균 시급 × 투입 작업자 수",
      roiImpact: "리드타임 30% 개선"
    },
    {
      category: "운반 (Transportation)",
      desc: "공정 간 거리가 멀어 자재나 반제품을 불필요하게 이동시키는 상태",
      formula: "운반 횟수 × 운반 평균 소요 시간 × 물류 인건비",
      roiImpact: "물류 비용 15% 감축"
    },
    {
      category: "과잉가공 (Over-processing)",
      desc: "원청 사양이 요구하지 않는 과도한 정밀도나 불필요한 공정을 거치는 상태",
      formula: "불필요 가공 시간(분) × 가공 설비 시간당 전력/소모품 비",
      roiImpact: "공정 단가 10% 감소"
    },
    {
      category: "재고 (Inventory)",
      desc: "창고에 쌓인 원자재, 재공품, 완제품이 적기에 소진되지 않는 상태",
      formula: "적재 면적(평) × 평당 보관 단가 + 재고 금융 이자 비용",
      roiImpact: "재고 회전율 45% 향상"
    },
    {
      category: "동작 (Motion)",
      desc: "비효율적인 작업대 배치나 공구 미비 등으로 불필요한 몸짓이 발생하는 상태",
      formula: "작업당 낭비 동작 초(s) × 반복 횟수 × 초당 작업 인건비",
      roiImpact: "작업 피로도 & 생산성 20% 향상"
    },
    {
      category: "결함 (Defect)",
      desc: "불량품 발생으로 인한 폐기 및 재작업 공수가 지속 발생하는 상태",
      formula: "불량 폐기 수량 × 자재 단가 + 재작업 시간 × 재작업 임율",
      roiImpact: "폐기 비용 50% 절감"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] animate-pulse delay-1000" />

      <div className="relative z-10 px-6 py-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                id="back-btn"
                onClick={onBackClick} 
                className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                  Lean 진단 및 ROI 대시보드
                </h1>
                <p className="text-cyan-200/80 text-sm">공정 낭비 요인과 재무적 개선 ROI 시각화</p>
              </div>
            </div>

            {/* Filter controls & Buttons */}
            <div className="flex items-center gap-3">
              {/* ROI detail formula toggle button */}
              <button
                id="open-modal-btn"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Calculator className="w-4 h-4" />
                ROI 상세 산출식 보기
              </button>

              {/* Data validity simulation toggler */}
              <div className="flex rounded-xl bg-slate-900/90 border border-slate-700/50 p-1">
                <button
                  id="toggle-3days-btn"
                  onClick={() => setDataDays(3)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    dataDays === 3 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  3일 실적
                </button>
                <button
                  id="toggle-7days-btn"
                  onClick={() => setDataDays(7)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    dataDays === 7 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  7일 실적 (기준선)
                </button>
              </div>
            </div>
          </div>

          {/* Data Validity Warning Banner */}
          <AnimatePresence>
            {dataDays < 7 && (
              <motion.div
                id="warning-banner"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 flex items-start gap-3 text-amber-200 shadow-xl shadow-amber-950/20"
              >
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-100 text-sm">데이터 유효성 기준 미달 알림</p>
                  <p className="text-xs text-amber-200/90 mt-1">
                    수집된 품질 실적 데이터가 단 <strong>{dataDays}일분</strong>에 불과합니다. 신뢰성 있는 ROI 분석 및 트렌드 예측을 위해서는 최소 7일 이상의 데이터 축적이 강제 준수되어야 합니다.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top KPI row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Quality Cost ROI */}
            <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="w-6 h-6 text-blue-400" />
                <h2 className="text-base font-bold text-slate-200">누적 실패비용 절감액 (ROI)</h2>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                ₩{dataDays === 7 ? '1,250K' : '350K'}
              </div>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                ↑ 전월 대비 {dataDays === 7 ? '18%' : '5%'} 이행 개선 달성
              </p>
              <div className="mt-6 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">대기 시간 손실 회수</span>
                  <span className="font-semibold text-slate-200">₩{dataDays === 7 ? '650K' : '200K'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">재작업 비용 보전</span>
                  <span className="font-semibold text-slate-200">₩{dataDays === 7 ? '400K' : '110K'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">자재 폐기 예방</span>
                  <span className="font-semibold text-slate-200">₩{dataDays === 7 ? '200K' : '40K'}</span>
                </div>
              </div>
            </div>

            {/* Improvement Progress */}
            <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-cyan-400" />
                <h2 className="text-base font-bold text-slate-200">종합 Lean 개선 진도</h2>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent mb-2">
                {dataDays === 7 ? '94%' : '71%'}
              </div>
              <p className="text-xs text-slate-400">7일 이동 평균 기준 낭비 요인 제거 점수</p>
              <div className="mt-6 space-y-4">
                {projects.map((project, idx) => {
                  const simulatedProgress = dataDays === 7 
                    ? project.progress 
                    : Math.max(20, Math.floor(project.progress * 0.7));
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">{project.name}</span>
                        <span className="font-semibold text-slate-200">{simulatedProgress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            project.status === 'completed' && dataDays === 7 ? 'bg-emerald-500' : 'bg-blue-500'
                          }`} 
                          style={{ width: `${simulatedProgress}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lean Warnings */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden group text-white">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-400" />
                <h2 className="text-base font-bold text-slate-200">Lean 낭비 모니터링 경보</h2>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <p className="font-semibold text-sm mb-1 text-slate-200">검사 공정 대기(Waiting) 임계 초과</p>
                  <p className="text-xs text-slate-400">대기 리드타임 120분 (허용 한계치: 90분)</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <p className="font-semibold text-sm mb-1 text-slate-200">자재 불량 폐기(Defect) 누적 상승</p>
                  <p className="text-xs text-slate-400">불량 점유율 35% (전월 대비 +5%p 증가)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lean Diagnostics & ROI Composed Chart */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-200">Lean 진단 효율 및 누적 ROI 추이</h2>
                  <p className="text-xs text-slate-400 mt-1">막대(Lean 효율 점수)와 선(누적 ROI 가치)의 복합 분석</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-sm" />
                    <span className="text-slate-300">진단 효율 (점수)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 bg-emerald-400" />
                    <span className="text-slate-300">누적 ROI (만원)</span>
                  </div>
                </div>
              </div>

              <div id="composed-chart-container" className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={currentChartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="composedBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="day" stroke="#64748B" style={{ fontSize: '11px' }} tickLine={false} />
                    <YAxis 
                      yAxisId="left" 
                      stroke="#64748B" 
                      style={{ fontSize: '11px' }} 
                      domain={[0, 100]}
                      tickLine={false}
                      label={{ value: '진단 효율 (점)', angle: -90, position: 'insideLeft', fill: '#64748B', style: { textAnchor: 'middle', fontSize: '10px' } }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      stroke="#64748B" 
                      style={{ fontSize: '11px' }} 
                      domain={[0, 1500]}
                      tickLine={false}
                      label={{ value: '누적 ROI (만원)', angle: 90, position: 'insideRight', fill: '#64748B', style: { textAnchor: 'middle', fontSize: '10px' } }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#F8FAFC',
                        fontSize: '12px'
                      }}
                    />
                    <Bar yAxisId="left" dataKey="score" fill="url(#composedBarGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                    <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Defect causes chart */}
            <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 shadow-2xl">
              <h2 className="text-lg font-bold text-slate-200 mb-6">불량 원인 Pareto 분석</h2>
              <div id="pie-chart-container" className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={defectCauses}
                      cx="50%"
                      cy="48%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {defectCauses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#F8FAFC',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI calculation formula modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="modal-container">
            {/* Backdrop */}
            <motion.div
              id="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              id="roi-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative z-10 w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 overflow-hidden"
            >
              {/* Close Button */}
              <button
                id="close-modal-btn"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">ROI 상세 산출식 및 Lean 진단 가이드</h3>
                  <p className="text-xs text-slate-400">제조 낭비 제거에 의거한 재무적 ROI 연산 기준</p>
                </div>
              </div>

              {/* Scrollable Formula Content */}
              <div className="max-h-[420px] overflow-y-auto pr-2 space-y-4 text-sm scrollbar-thin scrollbar-thumb-slate-800">
                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                  <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    재무적 ROI 산출 로직 개요
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    본 시스템은 ISO 9001 요건에 부합하는 부적합 사항(NC) 조치와 린(Lean) 낭비 제거 이행 결과를 바탕으로 실제 비용 회수율을 보수적으로 산출합니다.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2.5 font-bold">낭비 유형</th>
                        <th className="py-2.5 font-bold">진단 점수 기준</th>
                        <th className="py-2.5 font-bold">ROI 환산 공식</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {leanWasteData.map((waste, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 font-semibold text-slate-200">{waste.category}</td>
                          <td className="py-3 text-slate-400 pr-4">{waste.desc}</td>
                          <td className="py-3 text-cyan-300 font-mono">{waste.formula}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-xs text-emerald-400 font-semibold mb-1">💡 품질 관리자 가이드</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    공정 중 대기 시간을 90분 이하로 단축하거나 자재 폐기율을 10% 미만으로 개선 시, 절감된 간접 공수 및 원가가 ROI 지표에 실시간 누적 반영됩니다.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
                >
                  확인 및 닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
