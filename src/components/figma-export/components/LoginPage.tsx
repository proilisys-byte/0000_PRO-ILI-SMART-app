import { useState } from 'react';
import { Mail, Lock, Building2, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onBackClick?: () => void;
}

export function LoginPage({ onBackClick }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* Light Refraction Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-cyan-50" />

      {/* Scattered light effects - Multiple layers */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-300/15 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500" />

      {/* Prism light rays */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent blur-sm" />
      <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-300/15 to-transparent blur-sm delay-300" />

      {/* Back button */}
      {onBackClick && (
        <button
          onClick={onBackClick}
          className="absolute top-6 left-6 z-20 px-4 py-2 rounded-xl bg-white/40 backdrop-blur-xl border border-white/50 text-gray-700 hover:bg-white/60 transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          홈으로
        </button>
      )}

      {/* Main Card - Extra Large Glass */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="p-12 md:p-16 rounded-[3rem] bg-white/40 backdrop-blur-3xl border border-white/60 shadow-2xl shadow-blue-200/50">
          {/* Brand & Tagline */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <img
                src="/imports/그림2.png"
                alt="PRO-ILI Logo"
                className="h-20 w-auto"
              />
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">
                  PRO ALI SMART
                </h1>
                <p className="text-sm text-gray-600">Quality Innovation Platform</p>
              </div>
            </div>

            <div className="inline-block px-6 py-3 rounded-full bg-white/50 backdrop-blur-xl border border-white/60 shadow-lg shadow-blue-100/50 mb-8">
              <p className="text-lg font-medium bg-gradient-to-r from-blue-800 to-cyan-600 bg-clip-text text-transparent">
                스마트 제조의 새로운 표준
              </p>
            </div>
          </div>

          {/* Tab Switcher - Enhanced visibility */}
          <div className="flex gap-3 p-2 rounded-2xl bg-slate-100 border-2 border-slate-200 mb-10 max-w-lg mx-auto shadow-lg">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/40 scale-105'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/40 scale-105'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* Forms Container */}
          <div className="max-w-2xl mx-auto">
            {activeTab === 'login' ? (
              /* Login Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    이메일
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 transition-all duration-300 outline-none focus:border-blue-500 focus:shadow-xl focus:shadow-blue-500/20 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="example@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    비밀번호
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 transition-all duration-300 outline-none focus:border-blue-500 focus:shadow-xl focus:shadow-blue-500/20 focus:ring-4 focus:ring-blue-500/10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-gray-700">로그인 상태 유지</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    비밀번호 찾기
                  </a>
                </div>

                <button
                  type="submit"
                  className="group w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-semibold shadow-2xl shadow-blue-500/40 hover:shadow-3xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
                >
                  로그인
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-center text-sm text-gray-600 mt-4">
                  계정이 없으신가요?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    회원가입하기
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/60 backdrop-blur-sm text-gray-600 rounded-full">
                      또는 간편 로그인
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 flex items-center justify-center gap-3 group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">Google</span>
                  </button>

                  <button
                    type="button"
                    className="px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 flex items-center justify-center gap-3 group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00A4EF">
                      <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">Microsoft</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      담당자명
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 transition-all duration-300 outline-none focus:border-blue-500 focus:shadow-xl focus:shadow-blue-500/20 focus:ring-4 focus:ring-blue-500/10"
                      placeholder="홍길동"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      회사명
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 transition-all duration-300 outline-none focus:border-blue-500 focus:shadow-xl focus:shadow-blue-500/20 focus:ring-4 focus:ring-blue-500/10"
                      placeholder="(주)스마트제조"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    기업 이메일
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 transition-all duration-300 outline-none focus:border-blue-500 focus:shadow-xl focus:shadow-blue-500/20 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="example@company.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      비밀번호
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 transition-all duration-300 outline-none focus:border-blue-500 focus:shadow-xl focus:shadow-blue-500/20 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      비밀번호 확인
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 transition-all duration-300 outline-none focus:border-blue-500 focus:shadow-xl focus:shadow-blue-500/20 focus:ring-4 focus:ring-blue-500/10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 backdrop-blur-sm border border-blue-100/50">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required className="w-5 h-5 rounded border-gray-300 mt-0.5" />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">이용약관</a> 및{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">개인정보처리방침</a>에 동의합니다
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="group w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-semibold shadow-2xl shadow-blue-500/40 hover:shadow-3xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
                >
                  기업 계정 생성하기
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-center text-sm text-gray-600 mt-4">
                  이미 계정이 있으신가요?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    로그인하기
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/60 backdrop-blur-sm text-gray-600 rounded-full">
                      또는 간편 가입
                    </span>
                  </div>
                </div>

                {/* Social Signup */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 flex items-center justify-center gap-3 group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">Google</span>
                  </button>

                  <button
                    type="button"
                    className="px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 flex items-center justify-center gap-3 group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00A4EF">
                      <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">Microsoft</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer text */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              계정 보안은 엔터프라이즈급 암호화로 보호됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
