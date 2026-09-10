import React, { useState } from "react";
import { useZio } from "@/zio/ZioContext";
import { ZioLogo } from "./ZioLogo";
import { cn } from "@/lib/utils";

/**
 * Modern Top Navigation Bar Zio CTA Button
 * - Clean transparent CTA without background/border
 * - Official Zio Logo
 * - Smooth hover transition
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
        "group relative hidden h-[30px] items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-nav-foreground/90 transition-colors duration-150 sm:flex cursor-pointer select-none hover:bg-white/10 hover:text-white",
        isOpen && "bg-white/10 text-white",
        className,
      )}
    >
      <div
        className={cn(
          "shrink-0 transform-gpu transition-transform duration-200",
          isHovered && "scale-110",
        )}
      >
        <ZioLogo className="h-[21px] w-[21px]" />
      </div>

      <span className="font-semibold text-nav-foreground/90 group-hover:text-white tracking-tight text-xs whitespace-nowrap">
        Zio
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

