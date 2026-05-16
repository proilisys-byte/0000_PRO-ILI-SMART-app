// Cards.tsx
/**
 * @file src/components/landing/Cards.tsx
 * @description 랜딩 페이지 내에서 반복적으로 사용되는 카드형 UI 컴포넌트들을 정의합니다.
 * 본 파일의 컴포넌트들은 주로 src/data/landing.ts에 정의된 배열 데이터를 map으로 순회하며 렌더링될 때 호출됩니다.
 * Data Flow: src/data/landing.ts -> Sections.tsx (또는 StaticSections.tsx) -> Cards.tsx
 */

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { ProblemItem, SecurityFeature, OutcomeMetric } from "@/data/landing";

// ---------------------------------------------------------------------------
// FeatureCard – Problem / Pain-point section cards
// ---------------------------------------------------------------------------

/**
 * @interface FeatureCardProps
 * @description FeatureCard 컴포넌트가 전달받는 Props 구조
 * @property {ProblemItem} item - src/data/landing.ts에 정의된 페인포인트/문제점 단일 객체 데이터
 */
interface FeatureCardProps {
  item: ProblemItem;
}

/**
 * @component FeatureCard
 * @description 품질 팀의 현실적 한계(Problem) 섹션에서 각 페인포인트를 시각적으로 표현하는 카드 컴포넌트입니다.
 * Tailwind의 마이크로 인터랙션(hover:scale, hover:shadow)을 적용하여 시각적 피드백을 제공합니다.
 * @param {FeatureCardProps} props - 렌더링에 필요한 아이콘, 텍스트 및 색상 클래스 정보
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({ item }) => {
  const Icon = item.icon;

  return (
    <div
      className={cn(
        "p-8 bg-slate-800/40 border border-slate-700/50 rounded-3xl",
        "transition-all duration-300 group cursor-pointer",
        "hover:scale-[1.02] hover:shadow-2xl hover:bg-slate-800/60 hover:shadow-black/50",
        item.hoverBorderClass
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
          "group-hover:scale-110 transition-transform duration-300",
          item.iconBgClass
        )}
      >
        <Icon className={cn("w-6 h-6", item.colorClass)} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-50 transition-colors">
        {item.title}
      </h3>
      <p className="text-sm font-medium text-slate-400 leading-relaxed">
        {item.description}
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SecurityCard – Trust & Security section items
// ---------------------------------------------------------------------------

/**
 * @interface SecurityCardProps
 * @description SecurityCard 컴포넌트가 전달받는 Props 구조
 * @property {SecurityFeature} item - src/data/landing.ts에 정의된 보안 기능 단일 객체 데이터
 */
interface SecurityCardProps {
  item: SecurityFeature;
}

/**
 * @component SecurityCard
 * @description 엔터프라이즈 보안 섹션에서 각 보안 기능(RBAC, ISO 준수 등)을 작은 단위로 렌더링하는 컴포넌트입니다.
 * @param {SecurityCardProps} props - 아이콘, 타이틀 및 세부 설명 텍스트 정보
 */
export const SecurityCard: React.FC<SecurityCardProps> = ({ item }) => {
  const Icon = item.icon;

  return (
    <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-800/50 hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
      <div className="mt-1">
        <Icon className="w-5 h-5 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
      </div>
      <div>
        <h4 className="text-white font-bold text-sm mb-1 group-hover:text-cyan-50 transition-colors">
          {item.title}
        </h4>
        <p className="text-slate-500 text-xs font-medium">
          {item.detail}
        </p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// StatCard – Outcomes / Metrics section cards
// ---------------------------------------------------------------------------

/**
 * @interface StatCardProps
 * @description StatCard 컴포넌트가 전달받는 Props 구조
 * @property {OutcomeMetric} item - src/data/landing.ts에 정의된 핵심 도입 성과 지표 데이터
 */
interface StatCardProps {
  item: OutcomeMetric;
}

/**
 * @component StatCard
 * @description 도입 성과 지표(Outcomes) 섹션에서 Before/After 변화량을 강조하여 보여주는 카드 컴포넌트입니다.
 * @param {StatCardProps} props - 아이콘, 이전 수치(from), 이후 수치(to) 및 지표 라벨 정보
 */
export const StatCard: React.FC<StatCardProps> = ({ item }) => {
  const Icon = item.icon;

  return (
    <div className="p-10 bg-slate-800/30 border border-slate-700/50 rounded-[2rem] hover:bg-slate-800/60 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-900/20 transition-all duration-300 group cursor-default">
      <div className="flex justify-center mb-6 text-slate-500 group-hover:text-cyan-400 transition-colors duration-300">
        <Icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
      </div>
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="text-2xl font-semibold text-slate-500 line-through font-mono opacity-60">
          {item.from}
        </span>
        <ArrowRight className="text-cyan-500 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        <span className="text-6xl font-black text-white group-hover:text-cyan-400 font-mono tracking-tighter transition-colors">
          {item.to}
        </span>
      </div>
      <p className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">
        {item.label}
      </p>
    </div>
  );
};
