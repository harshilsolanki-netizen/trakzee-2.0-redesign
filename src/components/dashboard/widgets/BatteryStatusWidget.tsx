import React, { useState } from "react";
import { Zap } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { BATTERY_STATUS_DATA } from "@/data/oldAppFleet";
import { WidgetDrilldownModal } from "@/components/dashboard/WidgetDrilldownModal";
import { BATTERY_TIER_DRILLDOWN } from "@/data/widgetDrilldownData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function BatteryStatusWidget() {
  const [drilldownCategory, setDrilldownCategory] = useState<string | null>(null);
  const total = BATTERY_STATUS_DATA.reduce((sum, b) => sum + b.count, 0);

  const handleOpenDrilldown = (level: string) => {
    setDrilldownCategory(level);
  };

  const selectedBucket = drilldownCategory
    ? BATTERY_STATUS_DATA.find((b) => b.level === drilldownCategory)
    : null;

  // Map bucket label to key in BATTERY_TIER_DRILLDOWN
  const getVehicles = (level: string) => {
    if (level.startsWith("> 80%")) return BATTERY_TIER_DRILLDOWN["> 80%"] || [];
    return BATTERY_TIER_DRILLDOWN[level] || [];
  };

  return (
    <TooltipProvider delayDuration={100}>
      <WidgetCard
        id="battery-status"
        info="Battery charge state and capacity distribution across fleet units. Click any tier to view vehicle health details."
      >
        <div className="flex flex-col h-full min-h-0 justify-around select-none py-2">
          {/* Horizontal Battery Graphic */}
          <div className="relative mx-auto w-full max-w-[320px] h-[135px] rounded-2xl border-2 border-border/80 bg-muted/20 p-2.5 flex items-center gap-2 shadow-2xs">
            {/* Battery Positive Terminal Tip on Right */}
            <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-2 h-8 bg-border/80 rounded-r-md" />

            {BATTERY_STATUS_DATA.map((bucket, idx) => {
              const pct = Math.round((bucket.count / total) * 100);
              return (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleOpenDrilldown(bucket.level)}
                      className="flex-1 h-full rounded-xl flex flex-col items-center justify-center p-1.5 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      style={{
                        backgroundColor: `${bucket.color}18`,
                        border: `1.5px solid ${bucket.color}55`,
                      }}
                    >
                      {bucket.isCharging ? (
                        <Zap className="h-5 w-5 mb-1 animate-pulse" style={{ color: bucket.color }} />
                      ) : null}
                      <span
                        className="text-2xl font-black font-mono leading-none"
                        style={{ color: bucket.color }}
                      >
                        {bucket.count}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={8}
                    showArrow={true}
                    className="z-50 rounded-xl border border-border/80 bg-popover px-3 py-2 text-popover-foreground shadow-2xl min-w-[120px] pointer-events-none animate-in fade-in-0 zoom-in-95"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-black/10 dark:ring-white/20"
                        style={{ backgroundColor: bucket.color }}
                      />
                      <span className="text-xs font-bold text-foreground">{bucket.level}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 font-mono">
                      <span className="text-base font-black text-foreground">{bucket.count} Vehicles</span>
                      <span className="text-xs text-muted-foreground font-semibold">({pct}%)</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Bottom Buckets Legend */}
          <div className="grid grid-cols-5 gap-1.5 text-center pt-2">
            {BATTERY_STATUS_DATA.map((bucket, idx) => {
              const pct = Math.round((bucket.count / total) * 100);
              return (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleOpenDrilldown(bucket.level)}
                      className="flex flex-col items-center p-1.5 rounded-lg hover:bg-muted/40 transition-all duration-150 cursor-pointer"
                    >
                      <span className="text-[12px] font-semibold text-foreground whitespace-nowrap">
                        {bucket.level.replace(" / Charging", "")}
                      </span>
                      <span
                        className="text-xs font-semibold mt-0.5 inline-flex items-baseline gap-1"
                        style={{ color: bucket.color }}
                      >
                        <span className="font-mono text-sm font-bold">{bucket.count}</span>
                        <span className="font-sans text-[11px] font-medium text-muted-foreground">Vehicles</span>
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={8}
                    showArrow={true}
                    className="z-50 rounded-xl border border-border/80 bg-popover px-3 py-2 text-popover-foreground shadow-2xl min-w-[120px] pointer-events-none"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: bucket.color }} />
                      <span className="text-xs font-bold">{bucket.level}</span>
                    </div>
                    <div className="text-xs font-mono font-semibold text-muted-foreground">
                      {bucket.count} of {total} vehicles ({pct}%)
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </WidgetCard>

      {/* Drilldown Modal */}
      {drilldownCategory && (
        <WidgetDrilldownModal
          open={!!drilldownCategory}
          onOpenChange={(open) => !open && setDrilldownCategory(null)}
          widgetTitle="Battery Status"
          category={drilldownCategory}
          color={selectedBucket?.color ?? "#10b981"}
          count={`${selectedBucket?.count ?? 0} Vehicles`}
          pct={selectedBucket ? Math.round((selectedBucket.count / total) * 100) : undefined}
          vehicles={getVehicles(drilldownCategory)}
        />
      )}
    </TooltipProvider>
  );
}

