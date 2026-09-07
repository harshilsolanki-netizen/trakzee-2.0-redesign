import React, { useState } from "react";
import { useZio } from "@/zio/ZioContext";
import { ZioLogo } from "./ZioLogo";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modern Top Navigation Bar Ask Zio CTA Button
 * - Modern shimmering AI gradient pill
 * - Smooth hover scale and micro-interactions
 * - Clockwise logo spin on hover
 */
export function AskZioTopBarButton({ className }: { className?: string }) {
  const { openZio, isOpen } = useZio();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => openZio()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative hidden h-7.5 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-white transition-all duration-200 sm:flex cursor-pointer select-none",
        "bg-[#131d38] border border-violet-400/50 hover:border-violet-300 hover:bg-[#1e2c52] shadow-sm hover:shadow-violet-500/20 active:scale-95",
        isOpen &&
          "ring-2 ring-violet-400/80 ring-offset-1 ring-offset-nav border-violet-300 bg-[#1e2c52]",
        className,
      )}
    >
      <div
        className={cn(
          "shrink-0 transform-gpu transition-transform",
          isHovered && "spin-clockwise",
        )}
      >
        <ZioLogo size="sm" />
      </div>

      <span className="font-semibold text-white tracking-tight text-xs whitespace-nowrap">
        Ask zio
      </span>
    </button>
  );
}

export function AskZioCTA({ className }: { className?: string }) {
  const { openZio, isOpen } = useZio();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card p-2.5 transition-colors shadow-2xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => openZio()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "relative inline-flex items-center gap-2 rounded-md bg-[#111c38] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#1e2c52] cursor-pointer",
            isOpen && "ring-1.5 ring-primary",
          )}
        >
          <div
            className={cn(
              "shrink-0 transform-gpu",
              isHovered && "spin-clockwise",
            )}
          >
            <ZioLogo size="sm" />
          </div>
          <span className="font-semibold text-white text-xs">Ask zio</span>
        </button>

        <span className="text-[11px] text-muted-foreground text-right leading-tight font-medium">
          Instant AI Fleet &amp; Safety Insights
        </span>
      </div>
    </div>
  );
}
