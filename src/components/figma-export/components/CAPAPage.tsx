"use client";
import React, { useState } from 'react';
import { ArrowLeft, User, Calendar, CheckCircle2, Clock, AlertCircle, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CAPAPageProps {
  onBackClick?: () => void;
}

interface CAPAItem {
  id: number;
  action: string;
  assignee: string;
  dueDate: string;
  status: 'done' | 'ongoing' | 'pending';
}

export function CAPAPage({ onBackClick }: CAPAPageProps) {
  const [capaItems, setCapaItems] = useState<CAPAItem[]>([
    { id: 1, action: '작업 표준서 업데이트', assignee: '김품질', dueDate: '2026-05-15', status: 'done' },
    { id: 2, action: '작업자 재교육 실시', assignee: '이생산', dueDate: '2026-05-20', status: 'ongoing' },
    { id: 3, action: '납땜기 온도 센서 교체', assignee: '박설비', dueDate: '2026-05-25', status: 'pending' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAction, setNewAction] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // 조치율 계산 공식 (완료 100%, 진행중 50%, 대기 0%)
  const calculateProgress = () => {
    if (capaItems.length === 0) return 0;
    const totalScore = capaItems.length * 100;
    const currentScore = capaItems.reduce((sum, item) => {
      if (item.status === 'done') return sum + 100;
      if (item.status === 'ongoing') return sum + 50;
      return sum;
    }, 0);
    const progress = (currentScore / totalScore) * 100;
    
    // 0~100% 락업 및 NaN 방어 로직
    return Math.min(100, Math.max(0, Math.round(progress)));
  };

  const totalProgress = calculateProgress();

  const updateItemStatus = (id: number, status: 'done' | 'ongoing' | 'pending') => {
    const startTime = performance.now();
    setCapaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    const elapsed = performance.now() - startTime;
    if (elapsed > 1000) {
      console.warn(`SLA Warning: UI rendering update took ${elapsed.toFixed(1)}ms (target <= 1000ms)`);
    }
  };

  const deleteItem = (id: number) => {
    setCapaItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('시정조치 항목이 삭제되었습니다.');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim() || !newAssignee.trim() || !newDueDate.trim()) {
      toast.error('모든 필수 입력 필드를 채워주세요.');
      return;
    }

    const newItem: CAPAItem = {
      id: Date.now(),
      action: newAction.trim(),
      assignee: newAssignee.trim(),
      dueDate: newDueDate.trim(),
      status: 'pending',
    };

    setCapaItems((prev) => [...prev, newItem]);
    setNewAction('');
    setNewAssignee('');
    setNewDueDate('');
    setShowAddForm(false);
    toast.success('새로운 시정조치 항목이 성공적으로 추가되었습니다.');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-cyan-500/10" />

      <div className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <button 
              onClick={onBackClick} 
              className="p-2 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-slate-200 hover:bg-slate-700/80 transition-all"
              aria-label="뒤로 가기"
            >
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
            {/* CAPA Actions List (2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence initial={false}>
                {capaItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-2xl shadow-slate-900/40 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{item.action}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4 text-cyan-600" />
                            {item.assignee}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-cyan-600" />
                            {item.dueDate}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <select
                          value={item.status}
                          onChange={(e) => updateItemStatus(item.id, e.target.value as any)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border-2 border-slate-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                          aria-label="상태 변경"
                        >
                          <option value="pending">대기</option>
                          <option value="ongoing">진행중</option>
                          <option value="done">완료</option>
                        </select>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-all"
                          title="조치 제거"
                          aria-label="조치 제거"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                      <motion.div 
                        className={`h-full bg-gradient-to-r ${
                          item.status === 'done' ? 'from-emerald-500 to-emerald-600' :
                          item.status === 'ongoing' ? 'from-blue-500 to-cyan-500' :
                          'from-slate-400 to-slate-500'
                        }`}
                        animate={{ width: item.status === 'done' ? '100%' : item.status === 'ongoing' ? '50%' : '0%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add New Action Inlined Form */}
              {showAddForm ? (
                <motion.form 
                  onSubmit={handleAddItem}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-xl space-y-4"
                >
                  <h3 className="text-md font-bold text-slate-900">시정조치 추가</h3>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="시정조치 작업 내용 (예: 온도 센서 교체)"
                        value={newAction}
                        onChange={(e) => setNewAction(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="담당자 (예: 박설비)"
                        value={newAssignee}
                        onChange={(e) => setNewAssignee(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                        required
                      />
                      <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all"
                    >
                      취소
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-md transition-all"
                    >
                      저장
                    </button>
                  </div>
                </motion.form>
              ) : (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="w-full p-6 rounded-3xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-slate-600 hover:text-blue-600 font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  새로운 시정조치 추가
                </button>
              )}
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {/* Circular Gauge Progress Chart */}
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-2xl text-center">
                <h3 className="text-base font-bold text-slate-900 mb-6">시정조치 전체 이행율</h3>
                <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
                    {/* Background Circle */}
                    <circle
                      cx="72"
                      cy="72"
                      r="58"
                      className="text-slate-100"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {/* Foreground Glowing Gauge Circle */}
                    <motion.circle
                      cx="72"
                      cy="72"
                      r="58"
                      className="text-blue-600"
                      strokeWidth="10"
                      strokeDasharray={364} // 2 * pi * 58 ≈ 364.4
                      animate={{ strokeDashoffset: 364 - (364 * totalProgress) / 100 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">{totalProgress}%</span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">조치율</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-slate-100 rounded-2xl">
                    <span className="block text-slate-500 mb-1">대기</span>
                    <span className="font-extrabold text-slate-700">{capaItems.filter(i => i.status === 'pending').length}건</span>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-2xl">
                    <span className="block text-blue-500 mb-1">진행중</span>
                    <span className="font-extrabold text-blue-700">{capaItems.filter(i => i.status === 'ongoing').length}건</span>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-2xl">
                    <span className="block text-emerald-500 mb-1">완료</span>
                    <span className="font-extrabold text-emerald-700">{capaItems.filter(i => i.status === 'done').length}건</span>
                  </div>
                </div>
              </div>

              {/* ISO Standard Info */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-3xl text-white">
                <h3 className="text-lg font-bold text-white mb-3">ISO 표준 준수</h3>
                <p className="text-sm text-cyan-50 leading-relaxed mb-4">
                  ISO 9001/14001 규격에 맞는 시정조치 계획서가 자동으로 작성됩니다.
                </p>
                <button className="w-full px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/10">
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
