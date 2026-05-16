// LandingLayout.tsx
/**
 * @file src/components/landing/LandingLayout.tsx
 * @description ?쒕뵫 ?섏씠吏 ?꾩껜瑜?媛먯떥???ㅻ퉬寃뚯씠???ㅻ뜑(Nav)? ?명꽣(Footer)瑜??쒓났?⑸땲??
 * 諛섏쓳??紐⑤컮??硫붾돱 ?숈옉???꾪빐 ?대씪?댁뼵???ъ씠???곹깭(useState)瑜?愿由ы빀?덈떎.
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Navigation links data
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { href: "/#problem", label: "?섏씤?ъ씤?? },
  { href: "/#workflow", label: "?뚰겕?뚮줈?? },
  { href: "/#capabilities", label: "?듭떖湲곕뒫" },
  { href: "/#security", label: "蹂댁븞" },
  { href: "/Trae_PROILISMART_landing", label: "Trae v0.4" },
] as const;

// ---------------------------------------------------------------------------
// Nav ??Client Component (requires useState for mobile menu)
// ---------------------------------------------------------------------------

export const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="text-slate-900 w-5 h-5 fill-current" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              PRO ALI SMART
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 text-slate-400 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="http://localhost:9003"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
            >
              Figma Prototype ??            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button
              size="sm"
              className={cn(
                "bg-cyan-600 hover:bg-cyan-500 text-white rounded-full",
                "font-semibold shadow-[0_0_15px_rgba(8,145,178,0.3)]"
              )}
            >
              ?꾩엯 而⑥꽕??            </Button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300"
              aria-label="硫붾돱 ?닿린"
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 flex flex-col space-y-4"
        >
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-slate-300 py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button className="bg-cyan-600 text-white rounded-xl font-semibold">
            臾대즺 ?꾩엯 而⑥꽕???좎껌
          </Button>
        </motion.div>
      )}
    </nav>
  );
};

// ---------------------------------------------------------------------------
// Footer ??Server-safe (no hooks), but kept in same file for layout grouping
// ---------------------------------------------------------------------------

const FOOTER_LINKS = [
  { href: "/Trae_PROILISMART_landing", label: "Trae v0.4" },
  { href: "#", label: "媛쒖씤?뺣낫泥섎━諛⑹묠" },
  { href: "#", label: "?댁슜?쎄?" },
  { href: "#", label: "臾몄쓽?섍린" },
] as const;

export const Footer = () => (
  <footer className="py-12 px-4 border-t border-slate-800">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <Zap className="text-cyan-500 w-5 h-5 fill-current" />
        <span className="text-white font-bold text-lg tracking-tight uppercase">
          PRO ALI SMART
        </span>
      </div>

      <div className="flex gap-8 text-sm text-slate-500">
        {FOOTER_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="hover:text-slate-300 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="text-sm text-slate-600">
        짤 2026 PRO ALI SMART. All rights reserved.
      </div>
    </div>
  </footer>
);
