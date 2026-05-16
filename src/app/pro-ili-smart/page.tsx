"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  FileText, 
  AlertCircle, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X,
  AlertTriangle,
  FileWarning,
  History,
  Workflow,
  Cpu,
  Database,
  Search,
  Lock,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  LayoutDashboard,
  ClipboardCheck,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// --- Components ---

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-[#0F172A]/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-lg flex items-center justify-center">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PRO ILI <span className="text-cyan-400">SMART</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#problem" className="hover:text-cyan-400 transition-colors">품질 현안</a>
          <a href="#workflow" className="hover:text-cyan-400 transition-colors">워크플로우</a>
          <a href="#features" className="hover:text-cyan-400 transition-colors">핵심 기능</a>
          <a href="#outcomes" className="hover:text-cyan-400 transition-colors">도입 효과</a>
          <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">로그인</Button>
          <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">무료 컨설팅 신청</Button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0F172A] border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4 text-slate-300">
              <a href="#problem" onClick={() => setIsMobileMenuOpen(false)}>품질 현안</a>
              <a href="#workflow" onClick={() => setIsMobileMenuOpen(false)}>워크플로우</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>핵심 기능</a>
              <a href="#outcomes" onClick={() => setIsMobileMenuOpen(false)}>도입 효과</a>
              <hr className="border-white/5" />
              <Button className="bg-cyan-600 hover:bg-cyan-500 text-white w-full">무료 컨설팅 신청</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Hero Section ---
const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-3 py-1 text-sm">
              Next-Gen Quality Operation Platform
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              품질 운영을 하나의 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                연결된 워크플로우
              </span>로 전환.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
              현장 데이터 수집부터 원청 Audit 증빙, 긴급 NC 시정까지. 
              제조 품질팀을 위한 단일 플랫폼으로 품질 비용(COPQ)을 혁신적으로 절감하십시오.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 h-14 text-lg shadow-[0_0_20px_rgba(8,145,178,0.3)]">
                무료 도입 컨설팅 신청
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white px-8 h-14 text-lg">
                워크플로우 보기
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-6 grayscale opacity-50">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Trusted by Industry Leaders</div>
              {/* Fake partner logos */}
              <div className="flex gap-4 items-center">
                <div className="h-4 w-20 bg-slate-700 rounded-sm" />
                <div className="h-4 w-16 bg-slate-700 rounded-sm" />
                <div className="h-4 w-24 bg-slate-700 rounded-sm" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Abstract UI Mockup */}
            <div className="relative z-10 bg-[#1E293B]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden aspect-[4/3]">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="ml-4 h-5 w-40 bg-white/5 rounded-md" />
              </div>
              
              <div className="grid grid-cols-12 gap-4 h-full">
                <div className="col-span-3 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-3 w-full bg-white/5 rounded" />
                  ))}
                </div>
                <div className="col-span-9 space-y-4">
                  <div className="h-32 w-full bg-cyan-500/5 border border-cyan-500/20 rounded-xl relative flex items-center justify-center overflow-hidden">
                    {/* STT Waveform Animation */}
                    <div className="flex items-end gap-1 h-12">
                      {[...Array(20)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: [8, 32, 12, 24, 8] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.05 }}
                          className="w-1 bg-cyan-400/60 rounded-full"
                        />
                      ))}
                    </div>
                    <div className="absolute top-2 left-3 flex items-center gap-2">
                      <Mic className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] text-cyan-400 font-medium">Real-time STT Input...</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-3 h-3 text-emerald-400" />
                        <div className="h-2 w-16 bg-emerald-400/20 rounded" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-1.5 w-full bg-white/10 rounded" />
                        <div className="h-1.5 w-3/4 bg-white/10 rounded" />
                        <div className="h-1.5 w-5/6 bg-white/10 rounded" />
                      </div>
                    </div>
                    <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-3 h-3 text-cyan-400" />
                        <div className="h-2 w-16 bg-cyan-400/20 rounded" />
                      </div>
                      <div className="flex items-end gap-1 h-10 mt-2">
                        {[40, 70, 45, 90, 60].map((h, i) => (
                          <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-cyan-500/30 rounded-t-sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute bottom-10 right-10 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 p-3 rounded-lg shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">Audit Ready</div>
                    <div className="text-[8px] text-slate-300">Compliance score 99.8%</div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Problem Section ---
const ProblemSection = () => {
  const problems = [
    {
      icon: <FileWarning className="w-6 h-6 text-orange-400" />,
      title: "종이 기록의 한계",
      description: "현장 작업자의 수기 기록은 분실 위험이 크고, 즉각적인 데이터 활용이 불가능합니다.",
      tag: "Data Loss"
    },
    {
      icon: <History className="w-6 h-6 text-orange-400" />,
      title: "수작업 매핑 120시간",
      description: "원청 Audit을 위해 수천 장의 성적서를 일일이 매핑하는 데 매달 엄청난 공수가 소요됩니다.",
      tag: "Inefficiency"
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-orange-400" />,
      title: "NC 추적 불가",
      description: "부적합 사항(NC) 발생 시 원인 분석과 시정 조치 이력이 파편화되어 대응이 늦어집니다.",
      tag: "Risk"
    },
    {
      icon: <Search className="w-6 h-6 text-orange-400" />,
      title: "데이터 사일로 현상",
      description: "부서별로 다른 엑셀 양식을 사용하여 전사 품질 지표를 통합 관리하기 어렵습니다.",
      tag: "Disconnected"
    }
  ];

  return (
    <section id="problem" className="py-24 bg-[#0F172A]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            품질 팀의 헌신이 <br />
            <span className="text-orange-400">비효율적인 문서 작업</span>에 매몰되고 있지는 않습니까?
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            제조 현장의 품질 관리는 갈수록 고도화되지만, 이를 관리하는 시스템은 여전히 아날로그에 머물러 있습니다. 
            현실적인 고통을 데이터로 해결해야 합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/30 group-hover:bg-orange-500 transition-colors" />
              <div className="mb-4 bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center">
                {item.icon}
              </div>
              <div className="text-xs font-bold text-orange-400 uppercase mb-2 tracking-wider">{item.tag}</div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Workflow Section ---
const WorkflowSection = () => {
  const steps = [
    {
      title: "Zero-UI 현장 수집",
      desc: "음성 인식(STT)과 스마트 태블릿으로 작업 방해 없이 실시간 데이터 입력",
      icon: <Mic className="w-5 h-5" />,
      color: "bg-cyan-500"
    },
    {
      title: "자동 문서화 및 검증",
      desc: "수집된 데이터를 표준 성적서 양식으로 자동 변환 및 이상치 즉각 탐지",
      icon: <Workflow className="w-5 h-5" />,
      color: "bg-blue-500"
    },
    {
      title: "실시간 NC Management",
      desc: "부적합 발생 시 관련 부서 자동 알림 및 CAPA 워크플로우 실행",
      icon: <AlertCircle className="w-5 h-5" />,
      color: "bg-indigo-500"
    },
    {
      title: "Audit & ROI 분석",
      desc: "원청 Audit 대응 리포트 원클릭 생성 및 품질 비용 절감 추이 대시보드",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-emerald-500"
    }
  ];

  return (
    <section id="workflow" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -z-10" />
      
      <div className="container mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">하나의 파이프라인으로 연결된 해결책</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          단순한 기능의 나열이 아닙니다. 현장에서 경영진까지 데이터가 물 흐르듯 흐르는 
          PRO ILI SMART만의 품질 운영 프로세스를 경험하세요.
        </p>
      </div>

      <div className="container mx-auto px-6">
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-slate-800 -z-10">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500"
            />
          </div>
          
          {/* Connector Line (Mobile) */}
          <div className="lg:hidden absolute left-10 top-0 bottom-0 w-0.5 bg-slate-800 -z-10">
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full bg-gradient-to-b from-cyan-500 via-blue-500 to-emerald-500"
            />
          </div>

          <div className="grid lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-row lg:flex-col items-start gap-6 lg:gap-0 text-left"
              >
                <div className={`shrink-0 w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center text-white shadow-lg lg:mb-6 relative`}>
                  {step.icon}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#0F172A] border-2 border-slate-800 flex items-center justify-center text-xs font-bold">
                    0{i+1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Bento Grid Features ---
const CapabilitiesSection = () => {
  return (
    <section id="features" className="py-24 bg-[#0F172A]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">4대 핵심 기술 역량</h2>
            <p className="text-slate-400">단순한 소프트웨어를 넘어, 제조 현장의 언어를 이해하는 스마트 엔진입니다.</p>
          </div>
          <Button variant="link" className="text-cyan-400 p-0 h-auto gap-2 group">
            전체 기술 스펙 보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          {/* Big Item 1 */}
          <div className="md:col-span-2 md:row-span-2 bg-[#1E293B]/40 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-auto">
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 mb-4">Innovation</Badge>
                <h3 className="text-2xl font-bold text-white mb-4">Zero-UI 수집기: 음성 & 센서 하이브리드</h3>
                <p className="text-slate-400 max-w-md">
                  현장 작업자가 두 손을 자유롭게 사용할 수 있도록, 음성 인식과 블루투스 계측기 연동을 통해 
                  데이터 입력 누락을 방지하고 작업 효율을 40% 이상 개선합니다.
                </p>
              </div>
              
              {/* Micro UI Mockup */}
              <div className="mt-8 bg-[#0F172A]/80 border border-white/5 rounded-xl p-4 flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1 font-mono uppercase tracking-tighter">Real-time processing</div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ["0%", "100%", "30%"] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="h-full bg-cyan-500" 
                    />
                  </div>
                  <div className="mt-2 text-[10px] text-cyan-400/70 font-mono italic">"두께 12.5mm 측정 완료, 공차 범위 이내"</div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-0 group-hover:bg-cyan-500/10 transition-colors" />
          </div>

          {/* Small Item 1 */}
          <div className="bg-[#1E293B]/40 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <ClipboardCheck className="text-emerald-400 w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Audit 엔진</h3>
            <p className="text-slate-400 text-sm">원청의 복잡한 체크리스트와 규격을 AI가 자동 매핑하여 증빙 준비 시간을 99% 단축합니다.</p>
            <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle2 className="w-24 h-24 text-white" />
            </div>
          </div>

          {/* Small Item 2 */}
          <div className="bg-[#1E293B]/40 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="bg-red-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-red-400 w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">NC Management</h3>
            <p className="text-slate-400 text-sm">부적합 발생부터 시정조치 완료까지 모든 히스토리를 타임라인 기반으로 추적 관리합니다.</p>
            <div className="absolute -bottom-4 -right-4 flex gap-1 transform rotate-12 opacity-20">
              <div className="w-12 h-1 bg-red-500 rounded-full" />
              <div className="w-12 h-1 bg-red-500 rounded-full" />
            </div>
          </div>

          {/* Medium Item 1 */}
          <div className="md:col-span-3 bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-4">Lean COPQ / ROI 대시보드</h3>
              <p className="text-slate-400">
                품질 관리로 인해 절감된 비용을 실시간으로 화폐 가치로 환산하여 보여줍니다. 
                경영진을 위한 최적의 품질 전략 수립을 지원합니다.
              </p>
              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs text-slate-400">예방 비용</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400">실패 비용 절감</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-40 bg-[#0F172A] rounded-xl border border-white/5 p-4 relative">
              <div className="flex items-end gap-2 h-full pb-2">
                {[30, 45, 25, 60, 80, 50, 90, 70, 85, 95].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    className="flex-1 bg-gradient-to-t from-cyan-600/20 to-cyan-400 rounded-t-sm" 
                  />
                ))}
              </div>
              <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">
                ROI +240%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Trust & Security Section ---
const SecuritySection = () => {
  return (
    <section className="py-24 bg-[#0F172A] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="bg-slate-900/50 border border-white/10 rounded-[3rem] p-12 lg:p-20 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold mb-8">
                <ShieldCheck className="w-4 h-4" />
                B2B Enterprise Grade Security
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                무결성과 보안, <br />타협하지 않는 기준.
              </h2>
              <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                데이터는 제조 기업의 자산입니다. PRO ILI SMART는 글로벌 보안 표준을 준수하며 
                어떤 상황에서도 데이터 유실과 변조를 원천 차단합니다.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: "ISO 9001 대응", desc: "국제 품질 표준 프로세스 완벽 준수" },
                  { title: "RBAC 권한 관리", desc: "사용자별 철저한 접근 통제" },
                  { title: "Insert-only DB", desc: "감사 로그를 위한 불변의 데이터 구조" },
                  { title: "데이터 유실률 0%", desc: "실시간 클라우드 이중화 백업" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                    <div>
                      <div className="text-white font-bold mb-1">{item.title}</div>
                      <div className="text-slate-500 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                {/* Abstract Shield/Server Motif */}
                <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-3xl" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full"
                />
                <div className="absolute inset-4 border border-white/10 rounded-full" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-cyan-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(8,145,178,0.3)] z-10 relative">
                      <Lock className="w-14 h-14 text-white" />
                    </div>
                    {/* Floating nodes */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          x: Math.cos(i * 60 * Math.PI / 180) * 140,
                          y: Math.sin(i * 60 * Math.PI / 180) * 140,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ repeat: Infinity, duration: 4, delay: i * 0.5 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 border border-white/10 rounded-xl flex items-center justify-center shadow-xl"
                      >
                        <Database className="w-5 h-5 text-cyan-400" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Outcomes Section ---
const OutcomesSection = () => {
  const metrics = [
    { value: "120h → 10m", label: "보고서 준비 시간 99% 단축", icon: <Clock className="w-6 h-6" /> },
    { value: "$0", label: "초기 인프라 도입 비용", icon: <DollarSign className="w-6 h-6" /> },
    { value: "1 Sprint", label: "평균 시스템 적용 기간", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  return (
    <section id="outcomes" className="py-24 bg-[#0F172A]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">압도적인 도입 성과</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            숫자는 거짓말을 하지 않습니다. 현장의 변화를 데이터로 증명합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {metrics.map((metric, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 mb-8 group-hover:scale-110 transition-transform">
                {metric.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4 tracking-tighter">
                {metric.value}
              </div>
              <div className="text-slate-300 text-lg font-medium">{metric.label}</div>
              <div className="mt-4 h-1 w-12 bg-slate-800 mx-auto rounded-full group-hover:w-24 group-hover:bg-cyan-500/50 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- CTA Section ---
const CtaSection = () => {
  return (
    <section className="py-24 bg-[#0F172A]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-cyan-600/20 to-emerald-600/10 border border-cyan-500/20 rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -z-10" />

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            당신의 품질 비용(COPQ)을 <br />
            지금 바로 영업 이익으로 전환하세요.
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            전문 컨설턴트가 귀사의 품질 관리 프로세스를 분석하고, 
            가장 빠르고 효과적인 디지털 전환 로드맵을 제안해 드립니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="회사 이메일을 입력하세요" 
              className="h-14 bg-[#0F172A] border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:ring-cyan-500"
            />
            <Button size="lg" className="h-14 bg-cyan-600 hover:bg-cyan-500 text-white px-8 rounded-xl shrink-0 w-full sm:w-auto">
              컨설팅 신청
            </Button>
          </div>
          
          <p className="mt-6 text-slate-500 text-sm">
            신청 즉시 24시간 이내에 담당자가 연락을 드립니다.
          </p>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---
const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5 bg-[#0F172A]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded flex items-center justify-center">
              <Activity className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">PRO ILI <span className="text-cyan-400">SMART</span></span>
          </div>
          
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-cyan-400">개인정보처리방침</a>
            <a href="#" className="hover:text-cyan-400">이용약관</a>
            <a href="#" className="hover:text-cyan-400">문의하기</a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <p className="text-slate-600 text-xs">
            © 2026 PRO ILI SMART. All rights reserved. (주)프로일리 | 스마트 품질 혁신의 리더
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholder */}
            <div className="w-5 h-5 bg-slate-800 rounded-full" />
            <div className="w-5 h-5 bg-slate-800 rounded-full" />
            <div className="w-5 h-5 bg-slate-800 rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page Component ---
export default function ProIliSmartLanding() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      <Nav />
      <main>
        <HeroSection />
        <ProblemSection />
        <WorkflowSection />
        <CapabilitiesSection />
        <SecuritySection />
        <OutcomesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
