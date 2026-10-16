import { Gauge, Cloud, Landmark, ShieldAlert } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { OPERATIONAL_METRICS_DATA } from "@/data/oldAppFleet";

export function FleetMetricsSummaryWidget() {
  return (
    <WidgetCard
      id="fleet-metrics-summary"
      info="High-level operational metrics: efficiency, emissions saved, toll expense, and active alarms."
    >
      <div className="grid grid-cols-2 gap-3 h-full min-h-0 select-none py-1">
        {/* Metric 1: Fleet Efficiency */}
        <div className="rounded-xl bg-emerald-500/10 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-bold">Fleet Efficiency</span>
            <Gauge className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 leading-none">
            {OPERATIONAL_METRICS_DATA.fleetEfficiencyPct}%
          </span>
          <span className="text-[11px] text-muted-foreground">Performance Score</span>
        </div>

        {/* Metric 2: Toll Expenses */}
        <div className="rounded-xl bg-amber-500/10 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-bold">Toll</span>
            <Landmark className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 leading-none">
            {OPERATIONAL_METRICS_DATA.tollExpenseInr}
          </span>
          <span className="text-[11px] text-muted-foreground">Paid Today</span>
        </div>

        {/* Metric 3: Carbon Emission */}
        <div className="rounded-xl bg-teal-500/10 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-bold">Carbon Emission</span>
            <Cloud className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          </div>
          <span className="text-3xl font-black font-mono text-teal-600 dark:text-teal-400 leading-none">
            {OPERATIONAL_METRICS_DATA.carbonEmissionSavedTons} Tons
          </span>
          <span className="text-[11px] text-muted-foreground">Carbon Offset</span>
        </div>

        {/* Metric 4: Active Alerts */}
        <div className="rounded-xl bg-rose-500/10 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-bold">Alerts</span>
            <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
          <span className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400 leading-none">
            {OPERATIONAL_METRICS_DATA.activeAlertsCount}
          </span>
          <span className="text-[11px] text-muted-foreground">Active Triggers</span>
        </div>
      </div>
    </WidgetCard>
  );
}


