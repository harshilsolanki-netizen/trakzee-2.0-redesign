import React, { useState, useEffect } from "react";
import { useZio } from "@/zio/ZioContext";
import { ZioLogo, ZioIcon } from "./ZioLogo";
import { cn } from "@/lib/utils";

/**
 * Modern Top Navigation Bar Zio CTA Button
 * - Clean transparent CTA without background/border
 * - Official Zio Logo
 * - Smooth hover transition
 */
export function AskZioTopBarButton({ className }: { className?: string }) {
  const { openZio, isOpen } = useZio();

  return (
    <div
      className={cn(
        "relative hidden sm:inline-flex items-center shrink-0 select-none",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Zio"
        onClick={() => openZio()}
        className={cn(
          "relative flex h-[28px] items-center gap-1.5 rounded-full bg-[#070D1E] px-3 text-white border border-white/20 transition-all hover:bg-[#0c162e] cursor-pointer active:scale-95",
          isOpen && "ring-1.5 ring-[#0089FF]",
        )}
      >
        <ZioIcon className="h-3.5 w-3.5 text-[#0089FF] shrink-0" fill="currentColor" />
        <span className="text-xs font-semibold tracking-tight text-white leading-none">
          Zio
        </span>
      </button>
    </div>
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
              isHovered && "scale-110",
            )}
          >
            <ZioLogo className="h-5 w-5" />
          </div>
          <span className="font-semibold text-white text-xs">Zio</span>
        </button>

        <span className="text-[11px] text-muted-foreground text-right leading-tight font-medium">
          Instant AI Fleet &amp; Safety Insights
        </span>
      </div>
    </div>
  );
}

