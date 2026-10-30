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
  const [step, setStep] = useState<"help" | "ask">("help");
  const [isHovered, setIsHovered] = useState(false);

  // Loop continuously: Start with "Need help?", then transition to "Ask zio", and repeat
  useEffect(() => {
    if (isHovered) return; // Keep current state while hovered
    const timer = setInterval(() => {
      setStep((prev) => (prev === "help" ? "ask" : "help"));
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative hidden sm:inline-flex items-center shrink-0 select-none group",
        className,
      )}
    >
      {/* Speech bubble beak/pointer tail (subtly fades in/out with "help" state) */}
      <svg
        className={cn(
          "absolute -bottom-[5px] right-[18px] w-[10px] h-[6px] pointer-events-none z-10 transition-opacity duration-300 ease-in-out",
          step === "help" ? "opacity-100" : "opacity-0",
        )}
        viewBox="0 0 10 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark fill to seamlessly merge with the bubble interior */}
        <path d="M0 0 L10 0 L7 5.5 Z" fill="#070D1E" />
        {/* Erase 1px of parent border where the tail joins */}
        <rect x="0.5" y="-1" width="9" height="1.8" fill="#070D1E" />
        {/* Crisp tail border continuing parent border */}
        <path
          d="M0.5 0 L7 5.5 L9.5 0"
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Main Button Shell */}
      <button
        type="button"
        aria-label={step === "help" ? "Need help?" : "Ask zio"}
        onClick={() => openZio()}
        className={cn(
          "relative flex h-[29px] min-w-[98px] items-center justify-center rounded-full p-[1.5px] overflow-hidden cursor-pointer",
          "transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]",
        )}
      >
        {/* 1. Rotating Rainbow Conic Gradient Border (smoothly fades in during "ask" state) */}
        <span
          className={cn(
            "absolute -inset-[200%] animate-border-rotate pointer-events-none transition-opacity duration-500 ease-in-out",
            step === "ask" ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, #0089FF 0deg, #10B981 72deg, #F59E0B 144deg, #EF4444 216deg, #A855F7 288deg, #0089FF 360deg)",
          }}
        />

        {/* 2. Crisp White/Light Border (smoothly fades in during "help" state) */}
        <span
          className={cn(
            "absolute inset-0 rounded-full border border-white/70 pointer-events-none transition-opacity duration-500 ease-in-out",
            step === "help" ? "opacity-100" : "opacity-0",
          )}
        />

        {/* 3. Solid Dark Background Canvas */}
        <div
          className={cn(
            "relative flex h-full w-full items-center justify-center rounded-full bg-[#070D1E] px-3.5 transition-colors duration-150",
            "hover:bg-[#0c162e] text-white",
            isOpen && "bg-[#0c162e]",
          )}
        >
          {/* 4. Professional, Clean Micro-Crossfade */}
          <div className="relative h-[18px] w-full flex items-center justify-center">
            {/* State A: "Need help?" */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-out",
                step === "help"
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1.5 pointer-events-none",
              )}
            >
              <span className="text-[13px] font-medium text-white tracking-tight leading-none">
                Need help?
              </span>
            </div>

            {/* State B: "Ask zio" */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-300 ease-out",
                step === "ask"
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-1.5 pointer-events-none",
              )}
            >
              <ZioIcon className="h-3.5 w-3.5 text-white shrink-0" fill="currentColor" />
              <span className="text-[13px] font-medium text-white tracking-tight leading-none">
                Ask zio
              </span>
            </div>
          </div>
        </div>
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

