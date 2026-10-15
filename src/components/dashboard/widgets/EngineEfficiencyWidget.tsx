import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { ENGINE_EFFICIENCY_DATA } from "@/data/oldAppFleet";

export function EngineEfficiencyWidget() {
  return (
    <WidgetCard
      id="engine-efficiency"
      info="Combustion efficiency and RPM duty operating bands."
    >
      <div className="flex flex-col h-full min-h-0 justify-around select-none py-1">
        {/* Top Big Metric with Status Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div>
            <span className="text-3xl font-black font-mono text-foreground leading-none block">
              {ENGINE_EFFICIENCY_DATA.score}%
            </span>
            <span className="text-xs text-muted-foreground mt-1 block font-medium">
              Fleet Average
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            {ENGINE_EFFICIENCY_DATA.status}
          </span>
        </div>

        {/* Operating Range Split Bar */}
        <div className="space-y-2 py-2">
          <div className="h-3 w-full rounded-full bg-muted/60 overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${ENGINE_EFFICIENCY_DATA.optimalRpm}%` }}
              title={`Optimal: ${ENGINE_EFFICIENCY_DATA.optimalRpm}%`}
            />
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${ENGINE_EFFICIENCY_DATA.overRevving}%` }}
              title={`Over-revving: ${ENGINE_EFFICIENCY_DATA.overRevving}%`}
            />
            <div className="h-full bg-slate-400 flex-1" title="Idle" />
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground font-medium">Optimal RPM:</span>
            <span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400 mt-0.5">
              {ENGINE_EFFICIENCY_DATA.optimalRpm}%
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-muted-foreground font-medium">Over-revving:</span>
            <span className="font-mono font-bold text-base text-amber-600 dark:text-amber-400 mt-0.5">
              {ENGINE_EFFICIENCY_DATA.overRevving}%
            </span>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}


