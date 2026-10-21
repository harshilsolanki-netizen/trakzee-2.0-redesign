import React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface AvoidServiceInterruptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AvoidServiceInterruptionModal({
  open,
  onOpenChange,
}: AvoidServiceInterruptionModalProps) {
  const navigate = useNavigate();

  const handleRechargeNow = () => {
    onOpenChange(false);
    navigate({ to: "/recharge" as any });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[92vw] max-w-[430px] p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 outline-none focus:outline-none focus-visible:outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60">
          <DialogTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Avoid Service Interruption
          </DialogTitle>
        </div>

        {/* Content Body */}
        <div className="px-6 pt-7 pb-6 flex flex-col items-center text-center">
          {/* Calendar Graphic with Warning Badge matching reference illustration */}
          <div className="relative mb-6 select-none">
            {/* Calendar SVG Illustration */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg
                viewBox="0 0 120 120"
                className="w-28 h-28 drop-shadow-md"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Calendar Card Body */}
                <rect
                  x="14"
                  y="20"
                  width="92"
                  height="86"
                  rx="18"
                  className="fill-sky-100 dark:fill-slate-800 stroke-sky-200 dark:stroke-slate-700"
                  strokeWidth="2.5"
                />
                {/* Folded Corner Bottom Left */}
                <path
                  d="M14 86 C 14 96, 24 106, 34 106 L 24 94 Z"
                  className="fill-sky-200 dark:fill-slate-700"
                />
                {/* Binder Tabs */}
                <rect x="32" y="12" width="10" height="14" rx="4" className="fill-sky-400 dark:fill-sky-500" />
                <rect x="78" y="12" width="10" height="14" rx="4" className="fill-sky-400 dark:fill-sky-500" />
                {/* Calendar Grid Dots / Days */}
                <rect x="28" y="44" width="10" height="10" rx="2.5" className="fill-sky-400/80 dark:fill-sky-400/60" />
                <rect x="46" y="44" width="10" height="10" rx="2.5" className="fill-sky-400/80 dark:fill-sky-400/60" />
                <rect x="64" y="44" width="10" height="10" rx="2.5" className="fill-sky-400/80 dark:fill-sky-400/60" />
                <rect x="82" y="44" width="10" height="10" rx="2.5" className="fill-sky-400/80 dark:fill-sky-400/60" />

                <rect x="28" y="60" width="10" height="10" rx="2.5" className="fill-sky-400/80 dark:fill-sky-400/60" />
                <rect x="46" y="60" width="10" height="10" rx="2.5" className="fill-sky-400/80 dark:fill-sky-400/60" />
                <rect x="64" y="60" width="10" height="10" rx="2.5" className="fill-sky-400/80 dark:fill-sky-400/60" />
                <rect x="82" y="60" width="10" height="10" rx="2.5" className="fill-sky-400/80 dark:fill-sky-400/60" />

                <rect x="28" y="76" width="10" height="10" rx="2.5" className="fill-sky-300/60 dark:fill-sky-500/40" />
                <rect x="46" y="76" width="10" height="10" rx="2.5" className="fill-sky-300/60 dark:fill-sky-500/40" />
              </svg>

              {/* Red Warning Alert Triangle Badge (overlapping bottom-right) */}
              <div className="absolute -bottom-1 -right-1 w-16 h-16 flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(220,38,38,0.35)] animate-in zoom-in-75 duration-300">
                <svg
                  viewBox="0 0 64 64"
                  className="w-16 h-16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Red Triangle */}
                  <path
                    d="M32 6 L58 52 C59.5 54.8 57.5 58 54.2 58 L9.8 58 C6.5 58 4.5 54.8 6 52 L32 6 Z"
                    className="fill-[#E11D48] dark:fill-[#DC2626]"
                  />
                  {/* Inner White Outline Border */}
                  <path
                    d="M32 11 L54 50 C54.7 51.3 53.8 53 52.3 53 L11.7 53 C10.2 53 9.3 51.3 10 50 L32 11 Z"
                    className="stroke-white"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* White Exclamation Mark */}
                  <rect x="30" y="24" width="4" height="14" rx="2" fill="white" />
                  <circle cx="32" cy="45" r="2.5" fill="white" />
                </svg>
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-[17px] font-bold text-slate-900 dark:text-slate-100 tracking-[-0.2px] mb-2">
            Avoid Service Interruption
          </h2>

          {/* Subtitle Message - exact text preserved */}
          <p className="text-[12.5px] leading-[18px] text-slate-500 dark:text-slate-400 max-w-[320px] mb-6">
            Your Some Objects are Expired and some are going to Expire Soon! Recharge now to continue uninterrupted Services
          </p>

          {/* Recharge Now CTA */}
          <button
            type="button"
            onClick={handleRechargeNow}
            className="h-9 px-6 rounded-lg bg-[#0089FF] hover:bg-[#0076DC] text-white font-semibold text-xs border-0 border-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 shadow-sm active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            Recharge Now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
