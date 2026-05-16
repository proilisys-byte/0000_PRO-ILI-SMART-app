// StaticSections.tsx
/**
 * @file src/components/landing/StaticSections.tsx
 * @description 랜딩 페이지 중 상태 관리(State)나 복잡한 애니메이션이 필요 없는 정적인 섹션들을 정의합니다.
 * React Server Component(RSC)로 동작하여 초기 JavaScript 번들 사이즈를 줄이고 렌더링 성능을 최적화합니다.
 */

import React from "react";
import { SectionHeader } from "./SectionHeader";
import { FeatureCard, SecurityCard, StatCard } from "./Cards";
import { ShieldCheck, Server } from "lucide-react";
import {
  problems,
  securityFeatures,
  outcomes,
} from "@/data/landing";

// ---------------------------------------------------------------------------
// ProblemSection – Server Component (static content, no animations needed)
// ---------------------------------------------------------------------------

/**
 * @component ProblemSection
 * @description 기존 품질 관리 방식의 한계점을 나열하는 페인포인트 섹션입니다.
 * data.ts의 problems 데이터를 매핑하여 FeatureCard들을 렌더링합니다.
 */
export const ProblemSection = () => (
  <section id="problem" className="py-24 px-4 bg-slate-900/50">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="품질 팀의 현실적 한계"
        subtitle="전통적인 방식으로는 더 이상 복잡해지는 품질 요구사항을 감당할 수 없습니다."
      />
      <div className="grid md:grid-cols-3 gap-6">
        {problems.map((item, i) => (
          <FeatureCard key={i} item={item} />
        ))}
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// SecuritySection – Server Component (rotating rings moved to client wrapper)
// ---------------------------------------------------------------------------

/**
 * @component SecuritySection
 * @description B2B 엔터프라이즈 레벨의 보안 및 무결성 기능 목록을 렌더링합니다.
 * 내부적으로 SecurityCard를 사용하여 개별 기능을 나열합니다.
 */
export const SecuritySection = () => (
  <section id="security" className="py-32 px-4 relative">
    <div className="max-w-7xl mx-auto">
      <div className="bg-slate-800/40 border border-slate-700 rounded-[40px] p-12 md:p-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-cyan-500/5 blur-[100px]" />
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
              <span className="font-bold tracking-wider uppercase text-sm">
                Enterprise Security
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">
              타협 없는 데이터 무결성 <br /> B2B 신뢰의 핵심입니다.
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {securityFeatures.map((item, i) => (
                <SecurityCard key={i} item={item} />
              ))}
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Static rings (animation moved to client) */}
              <div className="absolute inset-0 border-2 border-dashed border-slate-700 rounded-full" />
              <div className="absolute inset-8 border border-cyan-500/20 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-8 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl">
                  <Server className="w-16 h-16 text-cyan-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// OutcomesSection – Server Component (static content)
// ---------------------------------------------------------------------------

/**
 * @component OutcomesSection
 * @description 도입 전/후의 압도적인 성과 지표(ROI)를 보여주는 섹션입니다.
 * data.ts의 outcomes 데이터를 매핑하여 StatCard들을 렌더링합니다.
 */
export const OutcomesSection = () => (
  <section className="py-24 px-4 bg-[#0F172A]">
    <div className="max-w-7xl mx-auto text-center">
      <SectionHeader
        centered
        title="압도적인 도입 성과"
        subtitle="PRO ILI SMART는 숫자로 증명합니다."
      />
      <div className="grid md:grid-cols-3 gap-12 mt-16">
        {outcomes.map((item, i) => (
          <StatCard key={i} item={item} />
        ))}
      </div>
    </div>
  </section>
);
