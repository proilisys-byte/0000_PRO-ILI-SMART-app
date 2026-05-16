"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-lg flex items-center justify-center">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PRO ALI <span className="text-cyan-400">SMART</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#problem" className="hover:text-cyan-400 transition-colors">?덉쭏 ?꾩븞</a>
          <a href="#workflow" className="hover:text-cyan-400 transition-colors">?뚰겕?뚮줈??/a>
          <a href="#features" className="hover:text-cyan-400 transition-colors">?듭떖 湲곕뒫</a>
          <a href="#outcomes" className="hover:text-cyan-400 transition-colors">?꾩엯 ?④낵</a>
          <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">濡쒓렇??/Button>
          <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">臾대즺 而⑥꽕???좎껌</Button>
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
              <a href="#problem" onClick={() => setIsMobileMenuOpen(false)}>?덉쭏 ?꾩븞</a>
              <a href="#workflow" onClick={() => setIsMobileMenuOpen(false)}>?뚰겕?뚮줈??/a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>?듭떖 湲곕뒫</a>
              <a href="#outcomes" onClick={() => setIsMobileMenuOpen(false)}>?꾩엯 ?④낵</a>
              <hr className="border-white/5" />
              <Button className="bg-cyan-600 hover:bg-cyan-500 text-white w-full">臾대즺 而⑥꽕???좎껌</Button>
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
              ?덉쭏 ?댁쁺???섎굹??<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                ?곌껐???뚰겕?뚮줈??              </span>濡??꾪솚.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
              ?꾩옣 ?곗씠???섏쭛遺???먯껌 Audit 利앸튃, 湲닿툒 NC ?쒖젙源뚯?. 
              ?쒖“ ?덉쭏????꾪븳 ?⑥씪 ?뚮옯?쇱쑝濡??덉쭏 鍮꾩슜(COPQ)???곸떊?곸쑝濡??덇컧?섏떗?쒖삤.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 h-14 text-lg shadow-[0_0_20px_rgba(8,145,178,0.3)]">
                臾대즺 ?꾩엯 而⑥꽕???좎껌
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white px-8 h-14 text-lg">
                ?뚰겕?뚮줈??蹂닿린
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
      title: "醫낆씠 湲곕줉???쒓퀎",
      description: "?꾩옣 ?묒뾽?먯쓽 ?섍린 湲곕줉? 遺꾩떎 ?꾪뿕???ш퀬, 利됯컖?곸씤 ?곗씠???쒖슜??遺덇??ν빀?덈떎.",
      tag: "Data Loss"
    },
    {
      icon: <History className="w-6 h-6 text-orange-400" />,
      title: "?섏옉??留ㅽ븨 120?쒓컙",
      description: "?먯껌 Audit???꾪빐 ?섏쿇 ?μ쓽 ?깆쟻?쒕? ?쇱씪??留ㅽ븨?섎뒗 ??留ㅻ떖 ?꾩껌??怨듭닔媛 ?뚯슂?⑸땲??",
      tag: "Inefficiency"
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-orange-400" />,
      title: "NC 異붿쟻 遺덇?",
      description: "遺?곹빀 ?ы빆(NC) 諛쒖깮 ???먯씤 遺꾩꽍怨??쒖젙 議곗튂 ?대젰???뚰렪?붾릺????묒씠 ??뼱吏묐땲??",
      tag: "Risk"
    },
    {
      icon: <Search className="w-6 h-6 text-orange-400" />,
      title: "?곗씠???ъ씪濡??꾩긽",
      description: "遺?쒕퀎濡??ㅻⅨ ?묒? ?묒떇???ъ슜?섏뿬 ?꾩궗 ?덉쭏 吏?쒕? ?듯빀 愿由ы븯湲??대졄?듬땲??",
      tag: "Disconnected"
    }
  ];

  return (
    <section id="problem" className="py-24 bg-[#0F172A]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ?덉쭏 ????뚯떊??<br />
            <span className="text-orange-400">鍮꾪슚?⑥쟻??臾몄꽌 ?묒뾽</span>??留ㅻぐ?섍퀬 ?덉????딆뒿?덇퉴?
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            ?쒖“ ?꾩옣???덉쭏 愿由щ뒗 媛덉닔濡?怨좊룄?붾릺吏留? ?대? 愿由ы븯???쒖뒪?쒖? ?ъ쟾???꾨궇濡쒓렇??癒몃Ъ???덉뒿?덈떎. 
            ?꾩떎?곸씤 怨좏넻???곗씠?곕줈 ?닿껐?댁빞 ?⑸땲??
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
      title: "Zero-UI ?꾩옣 ?섏쭛",
      desc: "?뚯꽦 ?몄떇(STT)怨??ㅻ쭏???쒕툝由우쑝濡??묒뾽 諛⑺빐 ?놁씠 ?ㅼ떆媛??곗씠???낅젰",
      icon: <Mic className="w-5 h-5" />,
      color: "bg-cyan-500"
    },
    {
      title: "?먮룞 臾몄꽌??諛?寃利?,
      desc: "?섏쭛???곗씠?곕? ?쒖? ?깆쟻???묒떇?쇰줈 ?먮룞 蹂??諛??댁긽移?利됯컖 ?먯?",
      icon: <Workflow className="w-5 h-5" />,
      color: "bg-blue-500"
    },
    {
      title: "?ㅼ떆媛?NC Management",
      desc: "遺?곹빀 諛쒖깮 ??愿??遺???먮룞 ?뚮┝ 諛?CAPA ?뚰겕?뚮줈???ㅽ뻾",
      icon: <AlertCircle className="w-5 h-5" />,
      color: "bg-indigo-500"
    },
    {
      title: "Audit & ROI 遺꾩꽍",
      desc: "?먯껌 Audit ???由ы룷???먰겢由??앹꽦 諛??덉쭏 鍮꾩슜 ?덇컧 異붿씠 ??쒕낫??,
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-emerald-500"
    }
  ];

  return (
    <section id="workflow" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -z-10" />
      
      <div className="container mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">?섎굹???뚯씠?꾨씪?몄쑝濡??곌껐???닿껐梨?/h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          ?⑥닚??湲곕뒫???섏뿴???꾨떃?덈떎. ?꾩옣?먯꽌 寃쎌쁺吏꾧퉴吏 ?곗씠?곌? 臾??먮Ⅴ???먮Ⅴ??
          PRO ALI SMART留뚯쓽 ?덉쭏 ?댁쁺 ?꾨줈?몄뒪瑜?寃쏀뿕?섏꽭??
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">4? ?듭떖 湲곗닠 ??웾</h2>
            <p className="text-slate-400">?⑥닚???뚰봽?몄썾?대? ?섏뼱, ?쒖“ ?꾩옣???몄뼱瑜??댄빐?섎뒗 ?ㅻ쭏???붿쭊?낅땲??</p>
          </div>
          <Button variant="link" className="text-cyan-400 p-0 h-auto gap-2 group">
            ?꾩껜 湲곗닠 ?ㅽ럺 蹂닿린 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          {/* Big Item 1 */}
          <div className="md:col-span-2 md:row-span-2 bg-[#1E293B]/40 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-auto">
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 mb-4">Innovation</Badge>
                <h3 className="text-2xl font-bold text-white mb-4">Zero-UI ?섏쭛湲? ?뚯꽦 & ?쇱꽌 ?섏씠釉뚮━??/h3>
                <p className="text-slate-400 max-w-md">
                  ?꾩옣 ?묒뾽?먭? ???먯쓣 ?먯쑀濡?쾶 ?ъ슜?????덈룄濡? ?뚯꽦 ?몄떇怨?釉붾（?ъ뒪 怨꾩륫湲??곕룞???듯빐 
                  ?곗씠???낅젰 ?꾨씫??諛⑹??섍퀬 ?묒뾽 ?⑥쑉??40% ?댁긽 媛쒖꽑?⑸땲??
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
                  <div className="mt-2 text-[10px] text-cyan-400/70 font-mono italic">"?먭퍡 12.5mm 痢≪젙 ?꾨즺, 怨듭감 踰붿쐞 ?대궡"</div>
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
            <h3 className="text-lg font-bold text-white mb-2">Smart Audit ?붿쭊</h3>
            <p className="text-slate-400 text-sm">?먯껌??蹂듭옟??泥댄겕由ъ뒪?몄? 洹쒓꺽??AI媛 ?먮룞 留ㅽ븨?섏뿬 利앸튃 以鍮??쒓컙??99% ?⑥텞?⑸땲??</p>
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
            <p className="text-slate-400 text-sm">遺?곹빀 諛쒖깮遺???쒖젙議곗튂 ?꾨즺源뚯? 紐⑤뱺 ?덉뒪?좊━瑜???꾨씪??湲곕컲?쇰줈 異붿쟻 愿由ы빀?덈떎.</p>
            <div className="absolute -bottom-4 -right-4 flex gap-1 transform rotate-12 opacity-20">
              <div className="w-12 h-1 bg-red-500 rounded-full" />
              <div className="w-12 h-1 bg-red-500 rounded-full" />
            </div>
          </div>

          {/* Medium Item 1 */}
          <div className="md:col-span-3 bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-4">Lean COPQ / ROI ??쒕낫??/h3>
              <p className="text-slate-400">
                ?덉쭏 愿由щ줈 ?명빐 ?덇컧??鍮꾩슜???ㅼ떆媛꾩쑝濡??뷀룓 媛移섎줈 ?섏궛?섏뿬 蹂댁뿬以띾땲?? 
                寃쎌쁺吏꾩쓣 ?꾪븳 理쒖쟻???덉쭏 ?꾨왂 ?섎┰??吏?먰빀?덈떎.
              </p>
              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs text-slate-400">?덈갑 鍮꾩슜</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400">?ㅽ뙣 鍮꾩슜 ?덇컧</span>
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
                臾닿껐?깃낵 蹂댁븞, <br />??묓븯吏 ?딅뒗 湲곗?.
              </h2>
              <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                ?곗씠?곕뒗 ?쒖“ 湲곗뾽???먯궛?낅땲?? PRO ALI SMART??湲濡쒕쾶 蹂댁븞 ?쒖???以?섑븯硫?
                ?대뼡 ?곹솴?먯꽌???곗씠???좎떎怨?蹂議곕? ?먯쿇 李⑤떒?⑸땲??
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: "ISO 9001 ???, desc: "援?젣 ?덉쭏 ?쒖? ?꾨줈?몄뒪 ?꾨꼍 以?? },
                  { title: "RBAC 沅뚰븳 愿由?, desc: "?ъ슜?먮퀎 泥좎????묎렐 ?듭젣" },
                  { title: "Insert-only DB", desc: "媛먯궗 濡쒓렇瑜??꾪븳 遺덈????곗씠??援ъ“" },
                  { title: "?곗씠???좎떎瑜?0%", desc: "?ㅼ떆媛??대씪?곕뱶 ?댁쨷??諛깆뾽" }
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
    { value: "120h ??10m", label: "蹂닿퀬??以鍮??쒓컙 99% ?⑥텞", icon: <Clock className="w-6 h-6" /> },
    { value: "$0", label: "珥덇린 ?명봽???꾩엯 鍮꾩슜", icon: <DollarSign className="w-6 h-6" /> },
    { value: "1 Sprint", label: "?됯퇏 ?쒖뒪???곸슜 湲곌컙", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  return (
    <section id="outcomes" className="py-24 bg-[#0F172A]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">?뺣룄?곸씤 ?꾩엯 ?깃낵</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            ?レ옄??嫄곗쭞留먯쓣 ?섏? ?딆뒿?덈떎. ?꾩옣??蹂?붾? ?곗씠?곕줈 利앸챸?⑸땲??
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
            ?뱀떊???덉쭏 鍮꾩슜(COPQ)??<br />
            吏湲?諛붾줈 ?곸뾽 ?댁씡?쇰줈 ?꾪솚?섏꽭??
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            ?꾨Ц 而⑥꽕?댄듃媛 洹?ъ쓽 ?덉쭏 愿由??꾨줈?몄뒪瑜?遺꾩꽍?섍퀬, 
            媛??鍮좊Ⅴ怨??④낵?곸씤 ?붿????꾪솚 濡쒕뱶留듭쓣 ?쒖븞???쒕┰?덈떎.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="?뚯궗 ?대찓?쇱쓣 ?낅젰?섏꽭?? 
              className="h-14 bg-[#0F172A] border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:ring-cyan-500"
            />
            <Button size="lg" className="h-14 bg-cyan-600 hover:bg-cyan-500 text-white px-8 rounded-xl shrink-0 w-full sm:w-auto">
              而⑥꽕???좎껌
            </Button>
          </div>
          
          <p className="mt-6 text-slate-500 text-sm">
            ?좎껌 利됱떆 24?쒓컙 ?대궡???대떦?먭? ?곕씫???쒕┰?덈떎.
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
            <span className="text-lg font-bold tracking-tight text-white">PRO ALI <span className="text-cyan-400">SMART</span></span>
          </div>
          
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-cyan-400">媛쒖씤?뺣낫泥섎━諛⑹묠</a>
            <a href="#" className="hover:text-cyan-400">?댁슜?쎄?</a>
            <a href="#" className="hover:text-cyan-400">臾몄쓽?섍린</a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <p className="text-slate-600 text-xs">
            짤 2026 PRO ALI SMART. All rights reserved. (二??꾨줈?쇰━ | ?ㅻ쭏???덉쭏 ?곸떊??由щ뜑
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
export default function TraePROILISMARTLanding() {
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
