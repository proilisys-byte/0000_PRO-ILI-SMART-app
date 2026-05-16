// Sections.tsx
/**
 * @file src/components/landing/Sections.tsx
 * @description 랜딩 페이지 중 동적인 상호작용(State, Animation)이 필요한 섹션들을 정의합니다.
 * Framer Motion을 활용한 스크롤 애니메이션 및 호버 효과가 포함되어 있어 Client Component("use client")로 동작합니다.
 * Data Flow: data.ts 데이터 매핑 -> 내부 마이크로 컴포넌트(BentoCardVisual 등) 렌더링
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  heroContent,
  ctaContent,
  workflows,
  capabilities,
} from "@/data/landing";
import type { CapabilityCard } from "@/data/landing";
import { SectionHeader } from "./SectionHeader";
import { AbstractUIMockup } from "./Shared";

// ---------------------------------------------------------------------------
// HeroSection – Client Component (framer-motion entry animation)
// ---------------------------------------------------------------------------

/**
 * @component HeroSection
 * @description 랜딩 페이지 최상단의 첫 화면입니다. 서비스의 핵심 가치(Value Proposition)를
 * 강렬한 헤드라인과 애니메이션을 통해 전달하며, AbstractUIMockup 컴포넌트를 호출하여 시각적 몰입감을 줍니다.
 */
export const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-6 tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            {heroContent.badgeText}
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            {heroContent.headlinePre}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              {heroContent.headlineHighlight}
            </span>
            {heroContent.headlinePost}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-xl whitespace-pre-line">
            {heroContent.subtitle}
          </p>

          {/* CTA Buttons – using shadcn/ui Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className={cn(
                "relative group px-8 py-4 h-auto bg-cyan-600 text-white rounded-xl",
                "font-bold text-lg hover:bg-cyan-500",
                "shadow-[0_0_20px_rgba(8,145,178,0.4)] overflow-hidden"
              )}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {heroContent.ctaPrimary}
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={cn(
                "px-8 py-4 h-auto bg-slate-800 hover:bg-slate-700 text-white",
                "rounded-xl font-bold text-lg border-slate-700"
              )}
            >
              <Link href="/Trae_PROALISMART_landing">
                Trae v0.4 버전 보기
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="relative">{mounted && <AbstractUIMockup />}</div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// WorkflowSection – Client Component (framer-motion scroll animations)
// ---------------------------------------------------------------------------

/**
 * @component WorkflowSection
 * @description 제품의 전체 파이프라인(수집 -> 문서화 -> 추적 -> 분석)을 타임라인 형태로 보여줍니다.
 * 스크롤에 따라 순차적으로 항목들이 좌우에서 나타나는 애니메이션(whileInView)이 적용되어 있습니다.
 */
export const WorkflowSection = () => (
  <section id="workflow" className="py-32 px-4 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 blur-[120px] -z-10" />
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        centered
        title="단절 없는 품질 파이프라인"
        subtitle="현장 수집부터 분석까지, 모든 데이터가 하나의 흐름으로 이어집니다."
      />
      <div className="relative mt-20">
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-800 hidden md:block" />
        <div className="space-y-24">
          {workflows.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: item.align === "left" ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={cn(
                "flex flex-col md:flex-row items-center gap-8 md:gap-0",
                item.align === "right" && "md:flex-row-reverse"
              )}
            >
              <div className="flex-1 text-center md:text-left px-8">
                <div
                  className={cn(
                    "flex flex-col",
                    item.align === "right"
                      ? "md:items-end"
                      : "md:items-start"
                  )}
                >
                  <span className="text-cyan-500 font-mono font-bold text-lg mb-2">
                    {item.step}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 max-w-sm">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-center">
                <div className="w-16 h-16 bg-slate-900 border-4 border-slate-800 rounded-full flex items-center justify-center">
                  <motion.div
                    whileInView={{ backgroundColor: "#06b6d4" }}
                    transition={{ delay: 0.2 }}
                    className="w-4 h-4 bg-slate-700 rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// BentoCardVisual – Capability card micro-UI renderers
// ---------------------------------------------------------------------------

/**
 * @component BentoCardVisual
 * @description CapabilitiesSection(Bento UI) 내에서 시각적인 마이크로 UI 요소(차트, 파형, 뱃지 등)를
 * 타입에 따라 조건부 렌더링하는 내부 컴포넌트입니다.
 * @param {object} props - visualType ("waveform" | "progress" | "badge" | "chart")
 */
const BentoCardVisual = React.memo(
  ({ type }: { type: CapabilityCard["visualType"] }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    switch (type) {
      case "waveform":
        return (
          <div className="absolute bottom-0 right-0 w-1/2 h-32 flex items-end gap-1 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
            {mounted &&
              Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cyan-500 rounded-t-full"
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
          </div>
        );
      case "progress":
        return (
          <div className="mt-8 flex gap-2">
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "85%" }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>
        );
      case "badge":
        return (
          <div className="mt-6 flex items-center gap-2 text-[10px] font-mono">
            <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
              CRITICAL
            </span>
            <span className="text-slate-500">ID: NC-2026-0501</span>
          </div>
        );
      case "chart":
        return (
          <div className="absolute bottom-4 right-8 flex items-end gap-3 h-24">
            {[40, 65, 45, 90, 70, 100].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                className="w-4 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm"
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  }
);
BentoCardVisual.displayName = "BentoCardVisual";

// ---------------------------------------------------------------------------
// CapabilitiesSection – Client Component (framer-motion hover effects)
// ---------------------------------------------------------------------------

/**
 * @component CapabilitiesSection
 * @description 4대 핵심 역량을 Bento 그리드 UI 형태로 보여주는 섹션입니다.
 * BentoCardVisual 컴포넌트를 활용하여 각 카드 내부에 생동감 있는 그래픽을 함께 표시합니다.
 */
export const CapabilitiesSection = () => (
  <section id="capabilities" className="py-24 px-4 bg-slate-900/50">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="핵심 역량"
        subtitle="제조 현장의 품질 혁신을 위한 4대 핵심 엔진"
      />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
        {capabilities.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={cn(
                card.colSpan,
                "bg-slate-800/40 border border-slate-700 rounded-3xl p-8",
                "overflow-hidden relative group"
              )}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Icon className={cn("w-6 h-6", card.iconColor)} />
                  <h3 className="text-2xl font-bold text-white">
                    {card.title}
                  </h3>
                </div>
                <p className="text-slate-400 max-w-md">{card.description}</p>
              </div>
              <BentoCardVisual type={card.visualType} />
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// CtaSection – Client Component (framer-motion + form interaction)
// ---------------------------------------------------------------------------

/**
 * @component CtaSection
 * @description 랜딩 페이지 하단에서 잠재 고객의 전환(Conversion)을 유도하는 폼(Form) 섹션입니다.
 * data.ts의 ctaContent.fields를 순회하여 입력 폼을 동적으로 생성합니다.
 */
export const CtaSection = () => (
  <section className="py-32 px-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/5" />
    <div className="max-w-4xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 md:p-16 rounded-[40px] text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight whitespace-pre-line">
          {ctaContent.headline}
        </h2>
        <p className="text-slate-400 mb-12 text-lg">{ctaContent.subtitle}</p>

        <form className="max-w-md mx-auto space-y-4">
          {/* First two fields side by side */}
          <div className="grid grid-cols-2 gap-4">
            {ctaContent.fields.slice(0, 2).map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.name} className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    className={cn(
                      "bg-slate-900 border-slate-700 rounded-xl py-6 pl-12 pr-4",
                      "text-white focus:ring-cyan-500/50"
                    )}
                  />
                </div>
              );
            })}
          </div>

          {/* Remaining fields full width */}
          {ctaContent.fields.slice(2).map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.name} className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  className={cn(
                    "bg-slate-900 border-slate-700 rounded-xl py-6 pl-12 pr-4",
                    "text-white focus:ring-cyan-500/50"
                  )}
                />
              </div>
            );
          })}

          <Button
            type="submit"
            size="lg"
            className={cn(
              "w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold",
              "py-6 h-auto rounded-xl text-lg shadow-lg shadow-cyan-900/20"
            )}
          >
            {ctaContent.submitLabel}
          </Button>

          <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-mono">
            {ctaContent.disclaimer}
          </p>
        </form>
      </motion.div>
    </div>
  </section>
);
