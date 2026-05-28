import React, { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';

interface PricingPlansProps {
  onBackClick: () => void;
  onNavigate: (page: string) => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ onBackClick, onNavigate }) => {
  const [isYearly, setIsYearly] = useState(true);

  const calculatePrice = (monthlyBase: number) => {
    const discounted = isYearly ? monthlyBase * 0.8 : monthlyBase;
    return discounted.toLocaleString();
  };

  const calculateVoucherPrice = (monthlyBase: number) => {
    // 85% voucher support
    const base = isYearly ? monthlyBase * 0.8 : monthlyBase;
    const finalPrice = base * 0.15;
    return finalPrice.toLocaleString();
  };

  return (
    <div className="w-full bg-canvas-parchment py-16">
      <div className="max-w-[1024px] mx-auto px-6">
        
        {/* Back navigation */}
        <button 
          onClick={onBackClick}
          className="inline-flex items-center gap-1.5 text-primary hover:underline mb-8 text-[14px] group cursor-pointer"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          메인 화면으로 돌아가기
        </button>

        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="apple-headline-lg text-ink mb-4">
            구독 플랜 선택
          </h1>
          <p className="apple-body text-ink-muted-80 max-w-xl mx-auto">
            중소벤처기업부의 제조 혁신바우처를 연계하여, 85% 정부 지원 혜택을 받고 가장 합리적인 비용으로 스마트 공장을 시작하세요.
          </p>

          {/* Minimalist Apple Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-[14px] ${!isYearly ? 'text-ink font-semibold' : 'text-ink-muted-48'}`}>월간 결제</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-6 bg-gray-300 rounded-full p-0.5 relative transition-colors cursor-pointer focus:outline-none"
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${isYearly ? 'left-6.5' : 'left-0.5'}`} />
            </button>
            <span className={`text-[14px] ${isYearly ? 'text-ink font-semibold' : 'text-ink-muted-48'} flex items-center gap-1.5`}>
              연간 결제
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">20% 할인</span>
            </span>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          
          {/* Tier 1: Starter */}
          <div className="bg-white p-8 rounded-[18px] border border-hairline flex flex-col justify-between relative">
            <div>
              <h3 className="text-[20px] font-semibold text-ink mb-1">스타터 (Starter)</h3>
              <p className="text-[13px] text-ink-muted-48 mb-6">품질 진단 및 수기 탈출을 위한 진입 플랜</p>
              
              {/* Price Box */}
              <div className="mb-6 p-5 rounded-xl bg-canvas-parchment border border-hairline">
                <div className="text-[12px] text-ink-muted-48 line-through">정가 월 {calculatePrice(800000)}원</div>
                <div className="text-[21px] font-semibold text-ink mt-1">
                  실 구매가 <span className="text-[28px] font-bold text-primary">월 {calculateVoucherPrice(800000)}</span>원
                </div>
                <div className="text-[10px] text-primary font-semibold mt-1.5">※ 정부 바우처 85% 지원 적용 기준</div>
              </div>

              <ul className="space-y-3.5 text-[13px] text-ink-muted-80">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  ISO 9001 품질 표준 리포트 생성
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  현장 Zero-UI 수집 (음성 STT 연동)
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  가상 데이터 적재 최대 100건/월
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  기본 이메일 고객 기술 지원
                </li>
              </ul>
            </div>
            
            <button 
              onClick={() => onNavigate('signup')}
              className="w-full mt-8 py-3 bg-transparent border border-primary text-primary hover:bg-primary/5 text-[14px] font-normal rounded-full active:scale-95 transition-all apple-transition cursor-pointer"
            >
              스타터 플랜 신청
            </button>
          </div>

          {/* Tier 2: Pro */}
          <div className="bg-white p-8 rounded-[18px] border-2 border-primary flex flex-col justify-between relative transform md:scale-[1.02] shadow-none">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white font-normal rounded-full text-[10px]">
              추천 플랜
            </div>
            
            <div>
              <h3 className="text-[20px] font-semibold text-ink mb-1">프로 (Pro)</h3>
              <p className="text-[13px] text-primary font-semibold mb-6">글로벌 팹 공급망 실사 완벽 대응</p>
              
              {/* Price Box */}
              <div className="mb-6 p-5 rounded-xl bg-primary/5 border border-primary/20">
                <div className="text-[12px] text-ink-muted-48 line-through">정가 월 {calculatePrice(1800000)}원</div>
                <div className="text-[21px] font-semibold text-ink mt-1">
                  실 구매가 <span className="text-[28px] font-bold text-primary">월 {calculateVoucherPrice(1800000)}</span>원
                </div>
                <div className="text-[10px] text-primary font-semibold mt-1.5">※ 정부 바우처 85% 지원 적용 기준</div>
              </div>

              <ul className="space-y-3.5 text-[13px] text-ink-muted-80">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  ISO 9001 / 14001 / 45001 / IATF 16949 지원
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  Zero-UI 음성 STT + 비전 AI 수집기 패키지
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  원청별 커스텀 템플릿 자동 매핑 엔진
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  COPQ 낭비 분석 및 실시간 ROI 대시보드
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  품질 심사관 매칭 및 1:1 원격 컨설팅
                </li>
              </ul>
            </div>
            
            <button 
              onClick={() => onNavigate('signup')}
              className="w-full mt-8 py-3 bg-primary text-white hover:bg-primary-focus text-[14px] font-normal rounded-full active:scale-95 transition-all apple-transition cursor-pointer shadow-none"
            >
              프로 플랜 신청
            </button>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="bg-white p-8 rounded-[18px] border border-hairline flex flex-col justify-between relative">
            <div>
              <h3 className="text-[20px] font-semibold text-ink mb-1">엔터프라이즈</h3>
              <p className="text-[13px] text-ink-muted-48 mb-6">다중 사업장 및 온프레미스 망 구축</p>
              
              {/* Price Box */}
              <div className="mb-6 p-5 rounded-xl bg-canvas-parchment border border-hairline">
                <div className="text-[28px] font-bold text-ink mt-1">별도 문의</div>
                <div className="text-[10px] text-ink-muted-48 font-normal mt-1.5">커스텀 보안망 및 로컬 엣지 단독 구동</div>
              </div>

              <ul className="space-y-3.5 text-[13px] text-ink-muted-80">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  사내 폐쇄망(온프레미스) 로컬 단독 서버
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  글로벌 팹 전용 보안 게이트웨이 연동
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  공장 설비 PLC 연동 및 센서 IoT 전사 구축
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  연중무휴 24/7 전담 엔지니어 핫라인
                </li>
              </ul>
            </div>
            
            <button 
              onClick={() => onNavigate('signup')}
              className="w-full mt-8 py-3 bg-transparent border border-primary text-primary hover:bg-primary/5 text-[14px] font-normal rounded-full active:scale-95 transition-all apple-transition cursor-pointer"
            >
              본사 문의하기
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
