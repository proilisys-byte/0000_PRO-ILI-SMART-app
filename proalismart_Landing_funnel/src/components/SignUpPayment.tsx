import React, { useState } from 'react';
import { ChevronLeft, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SignUpPaymentProps {
  onBackClick: () => void;
  onNavigate: (page: string) => void;
}

export const SignUpPayment: React.FC<SignUpPaymentProps> = ({ onBackClick, onNavigate }) => {
  const [step, setStep] = useState(1); // 1: SignUp, 2: Payment
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment transaction
    setTimeout(() => {
      setIsProcessing(false);
      // Trigger canvas-confetti explosion
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      onNavigate('dashboard');
    }, 2000);
  };

  return (
    <div className="w-full bg-canvas-parchment py-16 text-ink">
      <div className="max-w-[440px] mx-auto px-6">
        
        {/* Back navigation */}
        <button 
          onClick={() => {
            if (step === 2) {
              setStep(1);
            } else {
              onBackClick();
            }
          }}
          className="inline-flex items-center gap-1.5 text-primary hover:underline mb-8 text-[14px] group cursor-pointer"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          {step === 2 ? '이전 단계로 가기' : '플랜 선택으로 가기'}
        </button>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-[18px] border border-hairline relative">
          
          {/* Step Indicator */}
          <div className="flex gap-2 mb-8 justify-center">
            <div className={`h-1 rounded-full flex-grow transition-all ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`h-1 rounded-full flex-grow transition-all ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
          </div>

          {step === 1 ? (
            /* Step 1: Sign Up */
            <form onSubmit={handleNextStep} className="space-y-6">
              <div>
                <h2 className="text-[20px] font-semibold text-ink mb-1">계정 생성</h2>
                <p className="text-ink-muted-48 text-[12px]">PRO ALI SMART 서비스를 이용할 관리자 계정을 생성합니다.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-ink-muted-48 mb-1.5 uppercase">회사명 (SME 기업)</label>
                  <input 
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="예: 에스피반도체"
                    className="w-full bg-canvas-parchment border border-hairline text-ink rounded-[8px] p-2.5 text-[14px] focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink-muted-48 mb-1.5 uppercase">이메일 주소</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@company.com"
                    className="w-full bg-canvas-parchment border border-hairline text-ink rounded-[8px] p-2.5 text-[14px] focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink-muted-48 mb-1.5 uppercase">비밀번호</label>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-canvas-parchment border border-hairline text-ink rounded-[8px] p-2.5 text-[14px] focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white hover:bg-primary-focus font-semibold text-[14px] rounded-full active:scale-95 transition-all apple-transition flex items-center justify-center gap-2 cursor-pointer shadow-none"
              >
                계속하기
                <ArrowRight size={15} />
              </button>
            </form>
          ) : (
            /* Step 2: Payment */
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <h2 className="text-[20px] font-semibold text-ink mb-1">결제 정보 입력</h2>
                <p className="text-primary text-[12px] font-semibold flex items-center gap-1">
                  <Lock size={12} />
                  제조 혁신바우처 매핑 보안 인증 완료
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-ink-muted-48 mb-1.5 uppercase">신용카드 번호</label>
                  <input 
                    type="text"
                    required
                    value={cardNum}
                    onChange={(e) => setCardNum(e.target.value)}
                    placeholder="4518 - •••• - •••• - ••••"
                    className="w-full bg-canvas-parchment border border-hairline text-ink rounded-[8px] p-2.5 text-[14px] focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-ink-muted-48 mb-1.5 uppercase">유효 기간 (MM/YY)</label>
                    <input 
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-canvas-parchment border border-hairline text-ink rounded-[8px] p-2.5 text-[14px] focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-ink-muted-48 mb-1.5 uppercase">CVC (3자리)</label>
                    <input 
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full bg-canvas-parchment border border-hairline text-ink rounded-[8px] p-2.5 text-[14px] focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Summary Panel */}
              <div className="bg-canvas-parchment p-4 rounded-xl border border-hairline space-y-2.5 text-[12px] text-ink-muted-80">
                <div className="flex justify-between">
                  <span>선택한 플랜</span>
                  <span className="text-ink font-semibold">프로 플랜 (Pro)</span>
                </div>
                <div className="flex justify-between">
                  <span>정부 바우처 지원율</span>
                  <span className="text-primary font-bold">-85%</span>
                </div>
                <div className="flex justify-between border-t border-hairline pt-2.5 font-semibold text-[13px]">
                  <span className="text-ink">실제 청구 예정 금액</span>
                  <span className="text-primary font-bold">월 216,000원 <span className="text-[10px] text-ink-muted-48 font-normal">(부가세 포함)</span></span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-primary text-white hover:bg-primary-focus disabled:bg-gray-300 disabled:text-gray-500 font-semibold text-[14px] rounded-full active:scale-95 transition-all apple-transition flex items-center justify-center gap-2 cursor-pointer shadow-none"
              >
                <ShieldCheck size={15} />
                {isProcessing ? '결제 요청 처리 중...' : '안전 결제 완료'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
