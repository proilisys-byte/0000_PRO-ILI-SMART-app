"use client";
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onConsultationClick?: () => void;
  onLoginClick?: () => void;
}

export function Header({ onConsultationClick, onLoginClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/95 backdrop-blur-xl shadow-lg border-b border-slate-800' : 'bg-slate-950'}`}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/imports/그림2.png"
            alt="PRO-ALI Logo"
            className="h-10 w-auto"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              PRO ALI SMART
            </span>
            <span className="text-xs font-bold text-cyan-200 tracking-wide">
              Quality Innovation
            </span>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#capabilities" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
            핵심 기능
          </a>
          <a href="#outcomes" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
            기대 효과
          </a>
          <a href="#pricing" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
            요금제
          </a>
          <button
            onClick={onLoginClick}
            className="px-6 py-2 bg-slate-800/60 backdrop-blur-md border border-slate-600/50 text-slate-200 rounded-xl font-medium hover:bg-slate-700/80 hover:text-white transition-all duration-300"
          >
            로그인
          </button>
          <button
            onClick={onConsultationClick}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
          >
            도입 문의
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-800/80 backdrop-blur-xl border border-slate-600/50"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-slate-200" />
          ) : (
            <Menu className="w-6 h-6 text-slate-200" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 mx-6 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 shadow-lg shadow-slate-900/30">
          <div className="flex flex-col gap-3">
            <a
              href="#capabilities"
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              핵심 기능
            </a>
            <a
              href="#outcomes"
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              기대 효과
            </a>
            <a
              href="#pricing"
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              요금제
            </a>
            <button
              onClick={() => {
                onLoginClick?.();
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-6 py-2 bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-slate-200 rounded-xl font-medium hover:bg-slate-700/80 hover:text-white transition-all duration-300"
            >
              로그인
            </button>
            <button
              onClick={() => {
                onConsultationClick?.();
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300"
            >
              도입 문의
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
