import React from 'react';
import { ChevronLeft, ShieldCheck, Cpu, Award } from 'lucide-react';

interface TeamIntroProps {
  onBackClick: () => void;
  onNavigate: (page: string) => void;
}

export const TeamIntro: React.FC<TeamIntroProps> = ({ onBackClick, onNavigate }) => {
  const teamMembers = [
    {
      name: '박대표',
      role: 'CEO / 반도체 품질컨설팅 18년',
      desc: '삼성전자 및 SK하이닉스 1차 협력업체 40여 곳의 QMS 및 ISO 9001 실사 대응을 컨설팅한 도메인 마스터.',
      icon: <ShieldCheck className="text-primary" size={20} />
    },
    {
      name: '이석사',
      role: 'CTO / 음성 인식 & Edge AI 박사',
      desc: '제조 현장의 80dB 이상의 극심한 소음 환경에서도 92% 이상의 정확도로 음성 명령을 로깅하는 Hybrid STT 엔진 설계.',
      icon: <Cpu className="text-primary" size={20} />
    },
    {
      name: '김인증',
      role: 'QMS 수석 심사관 / ISO 12년',
      desc: '전 한국품질인증원 소속 수석 심사원으로, ISO 9001/14001/45001 규정 준수 여부를 정밀 매핑하는 알고리즘 검증 담당.',
      icon: <Award className="text-primary" size={20} />
    }
  ];

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
            팀 소개
          </h1>
          <p className="apple-body text-primary font-semibold">
            반도체 소부장 도메인 지식과 최첨단 Edge AI 기술이 융합된 전문가 그룹
          </p>
        </div>

        <div className="space-y-8">
          
          {/* Members Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-white p-6 rounded-[18px] border border-hairline flex flex-col justify-between h-[300px]">
                <div>
                  <div className="w-10 h-10 rounded-[8px] bg-canvas-parchment flex items-center justify-center border border-hairline mb-6">
                    {member.icon}
                  </div>
                  <h3 className="text-[19px] font-semibold text-ink mb-1">{member.name}</h3>
                  <p className="text-[12px] text-primary font-semibold mb-4">{member.role}</p>
                  <p className="text-ink-muted-80 text-[14px] leading-relaxed">{member.desc}</p>
                </div>
                <div className="text-[10px] text-ink-muted-48 uppercase tracking-wider font-semibold">Verified Specialist</div>
              </div>
            ))}
          </div>

          {/* Bottom Panel */}
          <div className="bg-canvas-parchment p-8 rounded-[18px] border border-hairline text-center mt-12">
            <h3 className="text-[17px] font-semibold text-ink mb-3">대기업 품질 실사 대비, 전문가와 함께 하세요</h3>
            <p className="text-[13px] text-ink-muted-80 max-w-2xl mx-auto mb-6 leading-relaxed">
              PRO ALI SMART는 단순한 프로그램 판매에 그치지 않고, 우리 협력사의 ISO 오딧 합격과 원청 거래선 유지를 위해 전문 엔지니어와 심사원이 밀착 관리해 드립니다.
            </p>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-8 py-3.5 bg-primary text-white hover:bg-primary-focus font-normal text-[14px] rounded-full hover:scale-[1.01] active:scale-95 transition-all apple-transition shadow-none"
            >
              전문가 밀착 컨설팅 받기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
