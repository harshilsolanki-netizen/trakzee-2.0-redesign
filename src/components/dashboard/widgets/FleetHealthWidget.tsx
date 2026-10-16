import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { FLEET_HEALTH_DATA } from "@/data/oldAppFleet";

const METRICS = [
  { name: "Engine", value: FLEET_HEALTH_DATA.engine, color: "#10b981" },
  { name: "Battery", value: FLEET_HEALTH_DATA.battery, color: "#f59e0b" },
  { name: "Coolant", value: FLEET_HEALTH_DATA.coolant, color: "#f59e0b" },
  { name: "Fuel", value: FLEET_HEALTH_DATA.fuel, color: "#10b981" },
];

export function FleetHealthWidget() {
  return (
    <WidgetCard
      id="fleet-health"
      info="Fleet health index and core subsystem diagnostics."
    >
      <div className="flex flex-col h-full min-h-0 justify-around select-none py-1">
        {/* Top Big Score */}
        <div className="flex items-baseline justify-between border-b border-border/50 pb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-foreground leading-none">
              {FLEET_HEALTH_DATA.score}
            </span>
            <span className="text-[14px] font-semibold text-muted-foreground">/ 100 Health Score</span>
          </div>
          <span className="text-[14px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Good
          </span>
        </div>

        {/* 4 Subsystem Progress Bars */}
        <div className="space-y-3 py-1">
          {METRICS.map((m) => (
            <div key={m.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-foreground">{m.name}</span>
                <span className="font-mono text-[14px] font-semibold" style={{ color: m.color }}>
                  {m.value}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${m.value}%`, backgroundColor: m.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Legend */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-border/50 text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            Healthy: <span className="font-semibold text-foreground font-mono">{FLEET_HEALTH_DATA.healthy}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            Warning: <span className="font-semibold text-foreground font-mono">{FLEET_HEALTH_DATA.warning}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
            Critical: <span className="font-semibold text-foreground font-mono">{FLEET_HEALTH_DATA.critical}</span>
          </span>
        </div>
      </div>
    </WidgetCard>
  );
}
