import React from 'react';
import { ChevronLeft, Award, Globe, Target, ArrowRight } from 'lucide-react';

interface CompanyInfoProps {
  onBackClick: () => void;
  onNavigate: (page: string) => void;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({ onBackClick, onNavigate }) => {
  return (
    <div className="w-full bg-canvas py-16 text-ink">
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
            회사 소개
          </h1>
          <p className="apple-body text-primary font-semibold">
            수기 서류에 갇힌 반도체 소부장 SME의 디지털 주권을 회복합니다.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Mission Card */}
          <div className="bg-white p-8 rounded-[18px] border border-hairline relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-10 h-10 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Target size={20} />
              </div>
              <div>
                <h3 className="text-[19px] font-semibold text-ink mb-3">우리의 Mission & Vision</h3>
                <p className="text-ink-muted-80 leading-relaxed text-[15px]">
                  대한민국 반도체 생태계의 뼈대를 이루는 소부장(소재·부품·장비) 중소기업들은 대기업 원청의 까다로운 ISO 오딧(실사) 요구에 맞춰 
                  매번 막대한 공수를 낭비하고 있습니다. 우리는 복잡한 ERP나 무거운 MES 대신, 현장 작업자가 사용하기 쉽고 
                  10분 만에 오딧 증빙서류를 자동 렌더링하는 클라우드 & AI 경량 솔루션을 보급하여 SME의 디지털 혁신과 비즈니스 안전망을 제공합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Focus Areas Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded-[18px] border border-hairline">
              <div className="w-10 h-10 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Award size={20} />
              </div>
              <h4 className="text-[17px] font-semibold text-ink mb-2">품질 경영의 디지털화</h4>
              <p className="text-ink-muted-80 text-[14px] leading-relaxed">
                수기로 관리하던 계측 데이터, 수동 밸브 개폐 이력, 작업 표준 지침 준수 여부 등을 Zero-UI(음성 및 이미지)로 가공하여 
                정합성 95% 이상의 완전한 무결성 품질 데이터를 확보합니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-[18px] border border-hairline">
              <div className="w-10 h-10 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Globe size={20} />
              </div>
              <h4 className="text-[17px] font-semibold text-ink mb-2">글로벌 팹 공급망 진입 장벽 제거</h4>
              <p className="text-ink-muted-80 text-[14px] leading-relaxed">
                TSMC, 인텔, 삼성전자, SK하이닉스 등 글로벌 반도체 제조사들이 요구하는 벤더 등록 기준과 IATF 16949 자동차 반도체 인증 요건에 
                빠르게 충족할 수 있도록 상시 대응 시스템을 지원합니다.
              </p>
            </div>
          </div>

          {/* Vision CTA */}
          <div className="text-center py-8">
            <h3 className="text-[19px] font-semibold text-ink mb-6">소부장 DX 혁신을 지금 바로 시작하세요</h3>
            <button
              onClick={() => onNavigate('pricing')}
              className="inline-flex items-center gap-1.5 px-8 py-3.5 bg-primary text-white hover:bg-primary-focus font-normal text-[15px] rounded-full active:scale-95 transition-all apple-transition cursor-pointer shadow-none"
            >
              DX 여정 시작하기
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
