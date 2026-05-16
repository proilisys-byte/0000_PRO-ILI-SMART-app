"use client";
import { ArrowRight, Building2, Mail, Phone, User, Briefcase, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface ConsultationPageProps {
  onBackClick?: () => void;
}

export function ConsultationPage({ onBackClick }: ConsultationPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    position: '',
    employeeCount: '',
    industry: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const benefits = [
    { icon: CheckCircle2, text: '현재 품질 프로세스 무료 진단' },
    { icon: CheckCircle2, text: '맞춤형 ROI 시뮬레이션 제공' },
    { icon: CheckCircle2, text: '업종별 최적화 방안 제시' },
    { icon: CheckCircle2, text: '30분 온라인 컨설팅 세션' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/10 to-cyan-500/10" />

      {/* Stronger animated aurora blurs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-cyan-400/25 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Back navigation */}
        <button
          onClick={onBackClick}
          className="mb-8 px-4 py-2 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-slate-200 hover:bg-slate-700/80 hover:text-white transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          홈으로 돌아가기
        </button>

        {/* Main container */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Marketing content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-xl border border-cyan-300/50 shadow-xl shadow-cyan-500/50">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-semibold">무료 도입 컨설팅</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-2xl">
                품질 관리의 미래를<br />직접 경험하세요
              </span>
            </h1>

            <p className="text-xl text-cyan-50/90 leading-relaxed drop-shadow-lg">
              PRO ALI SMART 전문가가 귀사의 품질 워크플로우를 분석하고,<br />
              측정 가능한 개선 방안을 제시합니다.
            </p>

            {/* 3D Glass cubes decoration */}
            <div className="relative h-64 my-12">
              {/* Main cube */}
              <div className="absolute top-0 left-0 w-40 h-40 rounded-3xl bg-white/90 backdrop-blur-2xl border border-cyan-200/60 shadow-2xl shadow-slate-900/40 transform rotate-12 hover:rotate-6 transition-transform duration-500">
                <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-blue-500/40 to-cyan-500/40" />
              </div>

              {/* Secondary cube */}
              <div className="absolute top-16 left-32 w-32 h-32 rounded-2xl bg-white/95 backdrop-blur-2xl border border-blue-200/60 shadow-xl shadow-slate-900/30 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-3 rounded-xl bg-gradient-to-br from-cyan-500/40 to-blue-500/40" />
              </div>

              {/* Accent cube */}
              <div className="absolute bottom-0 left-20 w-24 h-24 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-lg shadow-slate-900/30 transform rotate-3 hover:rotate-12 transition-transform duration-500">
                <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-blue-600/50 to-cyan-400/50" />
              </div>

              {/* Floating arrow */}
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-bounce">
                  <ArrowRight className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            {/* Benefits list */}
            <div className="space-y-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/40">
                    <benefit.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-semibold">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="pt-8 space-y-3">
              <p className="text-sm text-cyan-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                영업일 기준 24시간 내 연락 드립니다
              </p>
              <p className="text-sm text-cyan-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                귀사의 정보는 안전하게 보호됩니다
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="relative">
            <form onSubmit={handleSubmit} className="p-10 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-3xl shadow-slate-900/50 space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 bg-clip-text text-transparent mb-2">
                  컨설팅 신청
                </h2>
                <p className="text-slate-700 font-medium">
                  아래 정보를 입력해주시면 전문가가 연락드립니다
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  담당자명 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 rounded-xl bg-white border-2 transition-all duration-300 outline-none ${
                    focusedField === 'name'
                      ? 'border-blue-500 shadow-xl shadow-blue-500/40 ring-4 ring-blue-500/20'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                  placeholder="홍길동"
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  회사명 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  onFocus={() => setFocusedField('company')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 rounded-xl bg-white border-2 transition-all duration-300 outline-none ${
                    focusedField === 'company'
                      ? 'border-blue-500 shadow-xl shadow-blue-500/40 ring-4 ring-blue-500/20'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                  placeholder="(주)스마트제조"
                />
              </div>

              {/* Email and Phone - Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    이메일 *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 rounded-xl bg-white border-2 transition-all duration-300 outline-none ${
                      focusedField === 'email'
                        ? 'border-blue-500 shadow-xl shadow-blue-500/40 ring-4 ring-blue-500/20'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                    placeholder="example@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 rounded-xl bg-white border-2 transition-all duration-300 outline-none ${
                      focusedField === 'phone'
                        ? 'border-blue-500 shadow-xl shadow-blue-500/40 ring-4 ring-blue-500/20'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              {/* Position and Employee Count - Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    직책
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    onFocus={() => setFocusedField('position')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 rounded-xl bg-white border-2 transition-all duration-300 outline-none ${
                      focusedField === 'position'
                        ? 'border-blue-500 shadow-xl shadow-blue-500/40 ring-4 ring-blue-500/20'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                    placeholder="품질관리 팀장"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    직원 수
                  </label>
                  <select
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                    onFocus={() => setFocusedField('employeeCount')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 rounded-xl bg-white border-2 transition-all duration-300 outline-none ${
                      focusedField === 'employeeCount'
                        ? 'border-blue-500 shadow-xl shadow-blue-500/40 ring-4 ring-blue-500/20'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <option value="">선택하세요</option>
                    <option value="1-50">1-50명</option>
                    <option value="51-200">51-200명</option>
                    <option value="201-500">201-500명</option>
                    <option value="501+">501명 이상</option>
                  </select>
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  업종
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  onFocus={() => setFocusedField('industry')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 rounded-xl bg-white border-2 transition-all duration-300 outline-none ${
                    focusedField === 'industry'
                      ? 'border-blue-500 shadow-xl shadow-blue-500/40 ring-4 ring-blue-500/20'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <option value="">선택하세요</option>
                  <option value="electronics">전자/반도체</option>
                  <option value="automotive">자동차/부품</option>
                  <option value="pharma">제약/바이오</option>
                  <option value="food">식품/음료</option>
                  <option value="chemical">화학/소재</option>
                  <option value="other">기타</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  문의 사항 (선택)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl bg-white border-2 transition-all duration-300 outline-none resize-none ${
                    focusedField === 'message'
                      ? 'border-blue-500 shadow-xl shadow-blue-500/40 ring-4 ring-blue-500/20'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                  placeholder="현재 품질 관리에서 겪고 있는 주요 과제나 궁금한 점을 자유롭게 작성해주세요."
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-medium shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                무료 컨설팅 신청하기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-xs text-center text-gray-600">
                신청하시면 개인정보 처리방침에 동의하는 것으로 간주됩니다
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
