import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { ServiceWrite } from './components/ServiceWrite';
import { ServiceEval } from './components/ServiceEval';
import { CompanyInfo } from './components/CompanyInfo';
import { TeamIntro } from './components/TeamIntro';
import { PricingPlans } from './components/PricingPlans';
import { SignUpPayment } from './components/SignUpPayment';
import { DashboardSuccess } from './components/DashboardSuccess';
import { Shield, Menu, X } from 'lucide-react';
import TubesCursor from './components/TubesCursor';

type PageType = 'home' | 'write' | 'eval' | 'company' | 'team' | 'pricing' | 'signup' | 'dashboard';

const hashToPage = (hash: string): PageType => {
  switch (hash) {
    case '#/write': return 'write';
    case '#/eval': return 'eval';
    case '#/company': return 'company';
    case '#/team': return 'team';
    case '#/pricing': return 'pricing';
    case '#/signup': return 'signup';
    case '#/dashboard': return 'dashboard';
    default: return 'home';
  }
};

const pageToHash = (page: PageType): string => {
  if (page === 'home') return '#/';
  return `#/${page}`;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    return hashToPage(window.location.hash);
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(hashToPage(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    window.location.hash = pageToHash(page as PageType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={navigateTo} />;
      case 'write':
        return <ServiceWrite onBackClick={() => navigateTo('home')} onNavigate={navigateTo} />;
      case 'eval':
        return <ServiceEval onBackClick={() => navigateTo('home')} onNavigate={navigateTo} />;
      case 'company':
        return <CompanyInfo onBackClick={() => navigateTo('home')} onNavigate={navigateTo} />;
      case 'team':
        return <TeamIntro onBackClick={() => navigateTo('home')} onNavigate={navigateTo} />;
      case 'pricing':
        return <PricingPlans onBackClick={() => navigateTo('home')} onNavigate={navigateTo} />;
      case 'signup':
        return <SignUpPayment onBackClick={() => navigateTo('pricing')} onNavigate={navigateTo} />;
      case 'dashboard':
        return <DashboardSuccess onNavigate={navigateTo} />;
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans flex flex-col justify-between selection:bg-primary/20 selection:text-ink">
      {/* Tubes Cursor WebGL Background */}
      <TubesCursor />

      {/* Row 1: Apple Pinned Global Nav (44px) */}
      <header className="fixed top-0 left-0 w-full h-11 bg-surface-black text-gray-400 z-50 text-[12px] font-normal border-b border-white/[0.08]">
        <div className="max-w-[1024px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-2 cursor-pointer text-white hover:text-gray-300 transition-colors"
          >
            <Shield size={15} className="text-white" />
            <span className="font-semibold tracking-wider text-[11px] uppercase">
              PRO ALI SMART
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigateTo('company')} 
              className={`hover:text-white transition-colors cursor-pointer ${currentPage === 'company' ? 'text-white font-medium' : ''}`}
            >
              회사 소개
            </button>
            <button 
              onClick={() => navigateTo('team')} 
              className={`hover:text-white transition-colors cursor-pointer ${currentPage === 'team' ? 'text-white font-medium' : ''}`}
            >
              팀 소개
            </button>
            <button 
              onClick={() => navigateTo('pricing')} 
              className={`hover:text-white transition-colors cursor-pointer ${currentPage === 'pricing' ? 'text-white font-medium' : ''}`}
            >
              구독 플랜
            </button>
          </nav>

          {/* CTA Link */}
          <div className="hidden md:block">
            <button 
              onClick={() => navigateTo('write')}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              무료 체험하기
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Row 2: Apple Sub Nav (52px, frosted-glass) */}
      <div className="fixed top-11 left-0 w-full h-[52px] apple-subnav-frosted border-b border-hairline z-45 text-[14px]">
        <div className="max-w-[1024px] mx-auto px-6 h-full flex items-center justify-between">
          <div 
            onClick={() => navigateTo('home')} 
            className="font-display font-semibold text-[20px] text-ink cursor-pointer tracking-tight"
          >
            PRO ALI SMART
          </div>

          <div className="flex items-center gap-5">
            <nav className="hidden sm:flex items-center gap-6 text-[12px] text-ink-muted-80 font-normal">
              <button 
                onClick={() => navigateTo('company')} 
                className="hover:text-primary transition-colors cursor-pointer"
              >
                개요
              </button>
              <button 
                onClick={() => navigateTo('team')} 
                className="hover:text-primary transition-colors cursor-pointer"
              >
                전문가진
              </button>
              <button 
                onClick={() => navigateTo('pricing')} 
                className="hover:text-primary transition-colors cursor-pointer"
              >
                플랜 정보
              </button>
            </nav>
            <button 
              onClick={() => navigateTo('write')}
              className="px-3.5 py-1.5 bg-primary text-white text-[12px] font-normal rounded-full hover:bg-primary-focus active:scale-95 transition-all apple-transition cursor-pointer shadow-none"
            >
              무료 체험
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Collapses below Global Nav) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-11 left-0 w-full bg-surface-black text-gray-300 z-48 py-6 px-6 space-y-4 border-b border-white/[0.08] apple-transition">
          <button 
            onClick={() => navigateTo('company')} 
            className="block w-full text-left font-normal hover:text-white text-[15px] py-2 border-b border-white/[0.04]"
          >
            회사 소개
          </button>
          <button 
            onClick={() => navigateTo('team')} 
            className="block w-full text-left font-normal hover:text-white text-[15px] py-2 border-b border-white/[0.04]"
          >
            팀 소개
          </button>
          <button 
            onClick={() => navigateTo('pricing')} 
            className="block w-full text-left font-normal hover:text-white text-[15px] py-2 border-b border-white/[0.04]"
          >
            구독 플랜
          </button>
          <button 
            onClick={() => navigateTo('write')}
            className="block w-full text-left font-normal hover:text-white text-[15px] py-2"
          >
            무료 체험하기
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow z-10 relative pt-[96px] bg-transparent">
        {renderContent()}
      </main>

      {/* Apple Parchment Footer */}
      <footer className="bg-canvas-parchment border-t border-hairline py-16 relative z-10 text-[12px] text-ink-muted-80 font-sans">
        <div className="max-w-[1024px] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12 border-b border-hairline pb-10">
            {/* Column 1 */}
            <div className="space-y-3">
              <h4 className="text-ink font-semibold uppercase tracking-wider text-[11px]">PRO ALI SMART</h4>
              <p className="text-ink-muted-48 leading-relaxed text-[11px]">
                반도체 소부장 SME 기업의 디지털 혁신과 완벽한 QMS 감사 대응을 돕는 글로벌 표준 협력 솔루션입니다.
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-ink font-semibold uppercase tracking-wider text-[11px] mb-3">서비스</h4>
              <ul className="space-y-1 text-ink-muted-80 leading-[2.2]">
                <li><button onClick={() => navigateTo('write')} className="hover:underline hover:text-primary transition-colors cursor-pointer text-left">Smart Audit 생성기</button></li>
                <li><button onClick={() => navigateTo('eval')} className="hover:underline hover:text-primary transition-colors cursor-pointer text-left">NC 시정 & COPQ 진단</button></li>
                <li><button onClick={() => navigateTo('pricing')} className="hover:underline hover:text-primary transition-colors cursor-pointer text-left">구독 플랜 안내</button></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-ink font-semibold uppercase tracking-wider text-[11px] mb-3">회사 소개</h4>
              <ul className="space-y-1 text-ink-muted-80 leading-[2.2]">
                <li><button onClick={() => navigateTo('company')} className="hover:underline hover:text-primary transition-colors cursor-pointer text-left">회사 비전 및 사명</button></li>
                <li><button onClick={() => navigateTo('team')} className="hover:underline hover:text-primary transition-colors cursor-pointer text-left">전문 컨설턴트 및 연구진</button></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-2">
              <h4 className="text-ink font-semibold uppercase tracking-wider text-[11px]">고객 지원</h4>
              <div className="text-ink-muted-48 leading-relaxed text-[11px]">
                대표번호: 02-1234-5678<br />
                이메일: support@proalismart.com<br />
                평일 09:00 ~ 18:00 (주말 및 공휴일 휴무)
              </div>
            </div>
          </div>

          {/* Legal Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-ink-muted-48 text-[11px]">
            <div>
              © 2026 PRO ALI SMART Inc. All rights reserved.
            </div>
            <div className="flex gap-6">
              <span className="hover:underline cursor-pointer">이용약관</span>
              <span className="hover:underline cursor-pointer">개인정보처리방침</span>
              <span className="hover:underline cursor-pointer">제조혁신바우처 안내</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
