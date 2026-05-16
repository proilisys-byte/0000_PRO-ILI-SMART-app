import React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// SectionHeader – Pure Server Component (no "use client" needed)
// ---------------------------------------------------------------------------

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  centered = false,
}) => (
  <div className={cn("mb-12", centered && "text-center")}>
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
      {title}
    </h2>
    {subtitle && (
      <p
        className={cn(
          "text-slate-400 text-lg max-w-2xl",
          centered ? "mx-auto" : "md:mx-0"
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);
