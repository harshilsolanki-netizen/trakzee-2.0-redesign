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
        "group relative hidden h-[30px] items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-nav-foreground transition-colors duration-150 sm:flex cursor-pointer select-none",
        "bg-white/10 border border-white/15 hover:bg-white/15 hover:border-white/30 shadow-2xs",
        isOpen &&
          "ring-1.5 ring-white/40 border-white/40 bg-white/20",
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

      <span className="font-semibold text-nav-foreground tracking-tight text-xs whitespace-nowrap">
        Ask Zio
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
