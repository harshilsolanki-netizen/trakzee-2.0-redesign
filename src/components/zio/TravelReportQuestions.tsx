import React from "react";
import { Check, ChevronRight, MapPin, Sparkles, Truck, Calendar, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useZio } from "@/zio/ZioContext";

// ── Question 1: Which travel report do you need? ──
export function TravelQuestion1Card() {
  const { sendMessage } = useZio();

  const options = [
    {
      title: "Travel Summary report",
      recommended: true,
      description: "Fleet totals, distance, running v/s stop, working hours, and speed metrics",
    },
    {
      title: "Travel History report",
      recommended: false,
      description: "Segment-by-segment trip log with start/end locations, timestamps, and map playback",
    },
    {
      title: "Driver Activity & Work Hours",
      recommended: false,
      description: "Driver working days, maximum stoppage duration, and shifts",
    },
  ];

  return (
    <div className="my-2 space-y-2.5 max-w-xl animate-in fade-in duration-200">
      {/* 1. Zio Acknowledgment Card */}
      <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#0089FF]" />
          <span>Zio</span>
        </div>
        <div className="space-y-1 text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Understood: travel report request for your active fleet</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Matched 2 travel reports and 13 operational vehicles across 3 branches</span>
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
            Which travel report do you need?
          </h4>
          <p className="text-xs text-slate-500 leading-normal">
            Choose between fleet-wide operational summary or segment-by-segment trip history.
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
            onClick={() => sendMessage("Skip questions and show Travel Summary")}
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
export function TravelQuestion2Card({ preferredReport }: { preferredReport?: "summary" | "history" }) {
  const { sendMessage } = useZio();

  const options = [
    {
      title: "All 13 vehicles",
      recommended: true,
      description: "Full active fleet across Thailand, Valsad, and Indonesia",
    },
    {
      title: "Thailand branch (4 vehicles)",
      recommended: false,
      description: "4 vehicles (SOC-130002, BUS-130003, RPM-130004, Temp-130005)",
    },
    {
      title: "Valsad branch (2 vehicles)",
      recommended: false,
      description: "2 heavy commercial haulers (Tire Management-12394, Fuel-12303)",
    },
    {
      title: "Indonesia branch (3 vehicles)",
      recommended: false,
      description: "3 logistics assets (Fuel-1001, Mercedes GLE-1003, Scania-1004)",
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
            Filter down to specific operational hubs or generate telemetry for all fleet assets.
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
            onClick={() => sendMessage("Skip questions and show Travel Summary")}
            className="text-xs font-semibold text-[#0089FF] hover:underline cursor-pointer transition-colors"
          >
            Skip questions and use recommended answers
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Question 3: Time Range / Today Included ──
export function TravelQuestion3Card() {
  const { sendMessage } = useZio();

  const options = [
    {
      title: "Today [13-10-2026 12:00 AM - Now]",
      recommended: true,
      description: "Real-time travel from midnight to current timestamp (matching active dispatch)",
    },
    {
      title: "Yesterday (Full 24 hours)",
      recommended: false,
      description: "12-10-2026 12:00 AM to 11:59 PM completed trip logs",
    },
    {
      title: "Last 7 days weekly overview",
      recommended: false,
      description: "Multi-day aggregated travel trends and fleet utilization",
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
            Which time range should I analyze?
          </h4>
          <p className="text-xs text-slate-500 leading-normal">
            Choose whether to review today's in-progress shifts or historical completed days.
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
            onClick={() => sendMessage("Skip questions and show Travel Summary")}
            className="text-xs font-semibold text-[#0089FF] hover:underline cursor-pointer transition-colors"
          >
            Skip questions and use recommended answers
          </button>
        </div>
      </div>
    </div>
  );
}
