"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, Zap } from "lucide-react";

// ---------------------------------------------------------------------------
// AbstractUIMockup – Client Component (requires framer-motion animations)
// ---------------------------------------------------------------------------

export const AbstractUIMockup = React.memo(() => (
  <div className="relative w-full aspect-square max-w-lg mx-auto">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full" />

    {/* STT Waveform Area */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute top-0 right-0 w-2/3 p-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl z-10"
    >
      <div className="flex items-center gap-2 mb-3">
        <Mic className="w-4 h-4 text-cyan-400" />
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
          Live STT Stream
        </span>
      </div>
      <div className="flex items-end gap-[2px] h-12">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [8, Math.random() * 40 + 10, 8] }}
            transition={{
              repeat: Infinity,
              duration: 1 + Math.random(),
              ease: "easeInOut",
            }}
            className="w-1 bg-cyan-500/60 rounded-full"
          />
        ))}
      </div>
    </motion.div>

    {/* Cloud Processing */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.8, type: "spring" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
    >
      <div className="p-4 bg-cyan-500 rounded-full shadow-[0_0_40px_rgba(6,182,212,0.5)]">
        <Zap className="w-8 h-8 text-slate-900 fill-current" />
      </div>
    </motion.div>

    {/* Report Dashboard Mockup */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
      className="absolute bottom-0 left-0 w-3/4 p-5 bg-slate-800/80 backdrop-blur-2xl border border-slate-700 rounded-3xl shadow-2xl z-10"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] text-slate-400 font-mono">
          AUDIT_REPORT_#2941
        </span>
        <div className="h-4 w-12 bg-emerald-500/20 text-emerald-400 text-[10px] px-2 flex items-center justify-center rounded-full font-bold">
          PASSED
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="h-12 w-1/2 bg-slate-700/50 rounded-xl overflow-hidden relative flex flex-col justify-center px-3">
            <span className="text-[8px] text-slate-500 uppercase">
              Yield Rate
            </span>
            <span className="text-sm font-bold text-white">99.8%</span>
            <motion.div
              animate={{ x: ["0%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent pointer-events-none"
            />
          </div>
          <div className="h-12 w-1/2 bg-slate-700/50 rounded-xl flex flex-col justify-center px-3">
            <span className="text-[8px] text-slate-500 uppercase">
              NC Count
            </span>
            <span className="text-sm font-bold text-white">0</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-slate-400">Compliance Status</span>
          <span className="text-[9px] text-emerald-400 font-bold">OK</span>
        </div>
        <div className="h-[1px] w-full bg-slate-700" />
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-slate-400">Data Integrity</span>
          <span className="text-[9px] text-cyan-400 font-bold">
            100% Verified
          </span>
        </div>
      </div>
    </motion.div>

    {/* Connecting Lines */}
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 400 400"
    >
      <motion.path
        d="M300 100 Q 200 200 200 200"
        stroke="url(#mockupGradient1)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      />
      <motion.path
        d="M200 200 Q 150 300 100 300"
        stroke="url(#mockupGradient2)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      />
      <defs>
        <linearGradient
          id="mockupGradient1"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient
          id="mockupGradient2"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
));

AbstractUIMockup.displayName = "AbstractUIMockup";
