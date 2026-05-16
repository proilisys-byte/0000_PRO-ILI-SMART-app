// StaticSections.tsx
/**
 * @file src/components/landing/StaticSections.tsx
 * @description ?쒕뵫 ?섏씠吏 以??곹깭 愿由?State)??蹂듭옟???좊땲硫붿씠?섏씠 ?꾩슂 ?녿뒗 ?뺤쟻???뱀뀡?ㅼ쓣 ?뺤쓽?⑸땲??
 * React Server Component(RSC)濡??숈옉?섏뿬 珥덇린 JavaScript 踰덈뱾 ?ъ씠利덈? 以꾩씠怨??뚮뜑留??깅뒫??理쒖쟻?뷀빀?덈떎.
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
// ProblemSection ??Server Component (static content, no animations needed)
// ---------------------------------------------------------------------------

/**
 * @component ProblemSection
 * @description 湲곗〈 ?덉쭏 愿由?諛⑹떇???쒓퀎?먯쓣 ?섏뿴?섎뒗 ?섏씤?ъ씤???뱀뀡?낅땲??
 * data.ts??problems ?곗씠?곕? 留ㅽ븨?섏뿬 FeatureCard?ㅼ쓣 ?뚮뜑留곹빀?덈떎.
 */
export const ProblemSection = () => (
  <section id="problem" className="py-24 px-4 bg-slate-900/50">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="?덉쭏 ????꾩떎???쒓퀎"
        subtitle="?꾪넻?곸씤 諛⑹떇?쇰줈?????댁긽 蹂듭옟?댁????덉쭏 ?붽뎄?ы빆??媛먮떦?????놁뒿?덈떎."
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
// SecuritySection ??Server Component (rotating rings moved to client wrapper)
// ---------------------------------------------------------------------------

/**
 * @component SecuritySection
 * @description B2B ?뷀꽣?꾨씪?댁쫰 ?덈꺼??蹂댁븞 諛?臾닿껐??湲곕뒫 紐⑸줉???뚮뜑留곹빀?덈떎.
 * ?대??곸쑝濡?SecurityCard瑜??ъ슜?섏뿬 媛쒕퀎 湲곕뒫???섏뿴?⑸땲??
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
              ????녿뒗 ?곗씠??臾닿껐??<br /> B2B ?좊ː???듭떖?낅땲??
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
// OutcomesSection ??Server Component (static content)
// ---------------------------------------------------------------------------

/**
 * @component OutcomesSection
 * @description ?꾩엯 ???꾩쓽 ?뺣룄?곸씤 ?깃낵 吏??ROI)瑜?蹂댁뿬二쇰뒗 ?뱀뀡?낅땲??
 * data.ts??outcomes ?곗씠?곕? 留ㅽ븨?섏뿬 StatCard?ㅼ쓣 ?뚮뜑留곹빀?덈떎.
 */
export const OutcomesSection = () => (
  <section className="py-24 px-4 bg-[#0F172A]">
    <div className="max-w-7xl mx-auto text-center">
      <SectionHeader
        centered
        title="?뺣룄?곸씤 ?꾩엯 ?깃낵"
        subtitle="PRO ALI SMART???レ옄濡?利앸챸?⑸땲??"
      />
      <div className="grid md:grid-cols-3 gap-12 mt-16">
        {outcomes.map((item, i) => (
          <StatCard key={i} item={item} />
        ))}
      </div>
    </div>
  </section>
);
