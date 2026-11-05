import React, { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, X } from "lucide-react";
import { type FleetObject } from "@/data/fleet";
import { cn } from "@/lib/utils";

export interface AIPriorityAlert {
  id: string;
  title: string;
  stats: string;
  affectedVehicles: string;
}

const REFERENCE_ALERTS: AIPriorityAlert[] = [
  {
    id: "alert-1",
    title: "3 vehicles showing continuous overspeed in active hour",
    stats: "42 alerts/ 40 min · Max 102 km/h",
    affectedVehicles: "MH12AB2345, GJ05XY9987,DD01VC1122",
  },
  {
    id: "alert-2",
    title: "Cluster of harsh braking events on NH 48 corridor",
    stats: "18 alerts/ 15 min · Decel > 0.45g",
    affectedVehicles: "GJ01AB1234, MH14CD5678",
  },
  {
    id: "alert-3",
    title: "1 vehicle exited permitted zone without scheduled trip",
    stats: "Zone Exit: Pune Industrial Zone · 04:12 PM",
    affectedVehicles: "GJ03EF9012",
  },
];

interface AIPriorityFeedProps {
  vehicles?: FleetObject[];
  onSelectVehicle?: (id: string) => void;
  onTraceVehicle?: (vehicle: FleetObject) => void;
  onOpenDashcam?: (vehicle: FleetObject) => void;
  isTelemetryDrawerOpen?: boolean;
  isHealthTelemetryOnly?: boolean;
}

export function AIPriorityFeed({
  isTelemetryDrawerOpen = false,
  isHealthTelemetryOnly = false,
}: AIPriorityFeedProps) {
  const [expandedAlertIds, setExpandedAlertIds] = useState<string[]>(["alert-1"]);
  const [isClosed, setIsClosed] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedAlertIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const rightOffset = isTelemetryDrawerOpen
    ? isHealthTelemetryOnly
      ? "right-[420px]"
      : "right-[260px]"
    : "right-14";

  if (isClosed) {
    return (
      <div
        className={cn(
          "absolute bottom-5 z-25 transition-all duration-300 pointer-events-auto",
          rightOffset
        )}
      >
        <div className="relative">
          {/* Soft smooth background glow on pill */}
          <div className="pointer-events-none absolute -inset-1 rounded-full bg-red-600/25 blur-md animate-overlay-smooth-glow" />
          <button
            type="button"
            onClick={() => setIsClosed(false)}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CC0000] text-white font-bold text-xs shadow-xl hover:bg-[#B71C1C] transition-all cursor-pointer animate-in fade-in"
            title="Open AI Priority feed"
          >
            <AIIcon className="h-3.5 w-3.5 text-white" />
            <span>AI Priority feed</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute bottom-4 z-25 transition-all duration-300 pointer-events-auto",
        rightOffset
      )}
    >
      <div className="relative">
        {/* =========================================================================
            BACKGROUND ANIMATION: Smooth Soft Ambient Glow + Delicate Light Radar Lines
            Light, 1px thin, smooth expanding radar waves that fade gracefully
            ========================================================================= */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl">
          {/* 1. Deep soft diffused aura that gently breathes over 4.5s */}
          <div className="absolute -inset-2.5 rounded-2xl bg-gradient-to-tr from-red-600/25 via-rose-500/15 to-red-600/25 blur-2xl animate-overlay-smooth-glow" />

          {/* 2. Light, smooth, delicate expanding radar line 1 (1px thin, gentle opacity) */}
          <div className="absolute inset-0 rounded-xl border border-red-500/35 dark:border-rose-400/30 animate-radar-smooth-1" />

          {/* 3. Light, smooth, delicate expanding radar line 2 (delayed 2.1s) */}
          <div className="absolute inset-0 rounded-xl border border-rose-500/30 dark:border-rose-400/25 animate-radar-smooth-2" />
        </div>

        {/* =========================================================================
            OVERLAY CARD: Content exactly matching reference
            ========================================================================= */}
        <div
          className={cn(
            "w-[360px] sm:w-[380px] max-w-[calc(100vw-32px)] bg-white dark:bg-slate-900 rounded-xl border border-rose-300/60 dark:border-rose-950/60 overflow-hidden select-none relative",
            "shadow-[0_12px_40px_-5px_rgba(204,0,0,0.22)] dark:shadow-[0_12px_40px_-5px_rgba(0,0,0,0.85)] ring-1 ring-[#CC0000]/20",
            "animate-in fade-in-0 slide-in-from-bottom-4 zoom-in-95 duration-200"
          )}
        >
          {/* =========================================================================
              HEADER: AI Priority feed matching reference with smooth specular shimmer
              ========================================================================= */}
          <div className="relative overflow-hidden bg-[#CC0000] dark:bg-[#B71C1C] text-white px-3.5 py-2.5 flex items-center justify-between">
            {/* Subtle animated moving specular light wave across the header */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-ai-shimmer" />

            <div className="relative z-10 flex items-center gap-2">
              {/* [AI] Chip Icon from reference */}
              <AIIcon className="h-4.5 w-4.5 text-white shrink-0" />
              <h3 className="font-bold text-[13px] text-white tracking-tight leading-none">
                AI Priority feed
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsClosed(true)}
              className="relative z-10 p-0.5 text-white/90 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* =========================================================================
              CONTENT: Exactly matching the 3 items in the reference
              ========================================================================= */}
          <div className="divide-y divide-border/60">
            {REFERENCE_ALERTS.map((alert) => {
              const isExpanded = expandedAlertIds.includes(alert.id);

              return (
                <div key={alert.id} className="p-3">
                  {/* Title Row with Red Alert Triangle Icon */}
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-[#CC0000] fill-[#CC0000]/15 shrink-0 mt-0.5 stroke-[2.2]" />

                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() => toggleExpand(alert.id)}
                        className="text-xs font-medium text-slate-900 dark:text-slate-100 leading-snug cursor-pointer"
                      >
                        {alert.title}
                      </h4>

                      {/* Expanded Gray Box matching reference */}
                      {isExpanded && (
                        <div className="mt-2 rounded-lg bg-[#F8F9FA] dark:bg-slate-800/80 p-2.5 text-xs text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5 animate-in fade-in duration-150">
                          <div className="font-normal text-slate-700 dark:text-slate-300">
                            {alert.stats}
                          </div>
                          <div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                              Affected Vehicles:
                            </div>
                            <div className="font-normal text-slate-800 dark:text-slate-200">
                              {alert.affectedVehicles}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* View more / View less link matching reference */}
                      <div className="mt-1.5">
                        <button
                          type="button"
                          onClick={() => toggleExpand(alert.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0089FF] hover:underline cursor-pointer select-none"
                        >
                          <span>{isExpanded ? "View less" : "View more"}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * [AI] Chip Icon matching the user's reference image
 */
function AIIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7 15l2.5-6 2.5 6M8 13h3" />
      <path d="M16 9v6" />
    </svg>
  );
}
