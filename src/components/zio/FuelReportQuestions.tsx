import React from "react";
import { Check, ChevronRight, Fuel, Sparkles, Truck, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useZio } from "@/zio/ZioContext";

// ── Question 1: Which fuel report do you need? ──
export function FuelQuestion1Card() {
  const { sendMessage } = useZio();

  const options = [
    {
      title: "Fill-Drain report",
      recommended: true,
      description: "Fills, drains, consumption and mileage together",
    },
    {
      title: "Fuel consumption report",
      recommended: false,
      description: "Running, idling and total fuel per vehicle",
    },
    {
      title: "Fuel cost report",
      recommended: false,
      description: "Fuel cost per vehicle",
    },
  ];

  return (
    <div className="my-2 space-y-2.5 max-w-xl animate-in fade-in duration-200">
      {/* 1. Zio Acknowledgment Card (matching reference image 2) */}
      <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#0089FF]" />
          <span>Zio</span>
        </div>
        <div className="space-y-1 text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Understood: fuel report, relative range of 15 days</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Matched 3 fuel reports and 9 vehicles in your account</span>
          </div>
        </div>
      </div>

      {/* 2. Question 1 Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Question 1 of 3
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Which fuel report do you need?
          </h4>
          <p className="text-xs text-slate-500 leading-normal">
            Trakzee has several fuel reports and each has different fields and totals.
          </p>
        </div>

        {/* Options list */}
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.title}
              type="button"
              onClick={() => sendMessage(opt.title)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer group shadow-2xs",
                opt.recommended
                  ? "border-[#0089FF]/40 bg-sky-50/30 hover:border-[#0089FF] hover:bg-sky-50/60 dark:bg-sky-950/20 dark:border-sky-900/50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40"
              )}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 group-hover:text-[#0089FF] dark:text-white transition-colors">
                    {opt.title}
                  </span>
                  {opt.recommended && (
                    <span className="rounded-full bg-sky-100 text-[#0089FF] px-2 py-0.5 text-[10px] font-bold border border-sky-200/80 dark:bg-sky-950 dark:border-sky-800 dark:text-sky-300">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">{opt.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0089FF] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>

        {/* Skip button */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => sendMessage("Skip questions and use recommended answers")}
            className="text-xs font-semibold text-[#0089FF] hover:underline cursor-pointer transition-colors"
          >
            Skip questions and use recommended answers
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Question 2: Which vehicles should I include? ──
export function FuelQuestion2Card() {
  const { sendMessage } = useZio();

  const options = [
    {
      title: "All 9 vehicles",
      recommended: true,
      description: "Every vehicle you can access",
    },
    {
      title: "Indonesia branch",
      recommended: false,
      description: "2 vehicles",
    },
    {
      title: "Thailand branch",
      recommended: false,
      description: "4 vehicles",
    },
    {
      title: "Valsad branch",
      recommended: false,
      description: "2 vehicles",
    },
  ];

  return (
    <div className="my-2 max-w-xl animate-in fade-in duration-200">
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Question 2 of 3
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Which vehicles should I include?
          </h4>
          <p className="text-xs text-slate-500 leading-normal">
            Large accounts can have hundreds of vehicles, which makes the report slow and noisy.
          </p>
        </div>

        {/* Options list */}
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.title}
              type="button"
              onClick={() => sendMessage(opt.title)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer group shadow-2xs",
                opt.recommended
                  ? "border-[#0089FF]/40 bg-sky-50/30 hover:border-[#0089FF] hover:bg-sky-50/60 dark:bg-sky-950/20 dark:border-sky-900/50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40"
              )}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 group-hover:text-[#0089FF] dark:text-white transition-colors">
                    {opt.title}
                  </span>
                  {opt.recommended && (
                    <span className="rounded-full bg-sky-100 text-[#0089FF] px-2 py-0.5 text-[10px] font-bold border border-sky-200/80 dark:bg-sky-950 dark:border-sky-800 dark:text-sky-300">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">{opt.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0089FF] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Question 3: Last 15 days: should today be included? ──
export function FuelQuestion3Card() {
  const { sendMessage } = useZio();

  const options = [
    {
      title: "28 Sep to 12 Oct, today included",
      recommended: true,
      description: "Today counts until 4:37 PM",
    },
    {
      title: "27 Sep to 11 Oct, full days only",
      recommended: false,
      description: "Excludes today",
    },
    {
      title: "1 Oct to 12 Oct",
      recommended: false,
      description: "This month so far",
    },
  ];

  return (
    <div className="my-2 max-w-xl animate-in fade-in duration-200">
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Question 3 of 3
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Last 15 days: should today be included?
          </h4>
          <p className="text-xs text-slate-500 leading-normal">
            Today is only a partial day, so it can distort totals and averages.
          </p>
        </div>

        {/* Options list */}
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.title}
              type="button"
              onClick={() => sendMessage(opt.title)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer group shadow-2xs",
                opt.recommended
                  ? "border-[#0089FF]/40 bg-sky-50/30 hover:border-[#0089FF] hover:bg-sky-50/60 dark:bg-sky-950/20 dark:border-sky-900/50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40"
              )}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 group-hover:text-[#0089FF] dark:text-white transition-colors">
                    {opt.title}
                  </span>
                  {opt.recommended && (
                    <span className="rounded-full bg-sky-100 text-[#0089FF] px-2 py-0.5 text-[10px] font-bold border border-sky-200/80 dark:bg-sky-950 dark:border-sky-800 dark:text-sky-300">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">{opt.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0089FF] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
