import { Briefcase, AlertCircle, CheckCircle2, Clock, Users } from "lucide-react";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { cn } from "@/lib/utils";

const WORKLOAD_ASSETS = [
  { plate: "GJ21HS1609", driver: "John Smith", dutyHours: "11.4h / day", status: "Overworked", shift: "Double Shift" },
  { plate: "KA03MG4411", driver: "Mike Johnson", dutyHours: "10.8h / day", status: "Overworked", shift: "Long Haul" },
  { plate: "MH12RQ8821", driver: "Vijay Singh", dutyHours: "8.5h / day", status: "Optimal", shift: "Single Shift" },
  { plate: "DL01CD5678", driver: "Rahul Mehta", dutyHours: "2.1h / day", status: "Underutilized", shift: "Depot Standby" },
];

export function FleetWorkloadWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const size = useWidgetSize();
  const range = activeTab.range;
  const isLarge = size === "large";
  const assets = WORKLOAD_ASSETS;

  return (
    <WidgetCard
      id="fleet-workload"
      info="Asset utilization rates, driver duty hour compliance, and shift capacity allocation."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div className="flex flex-col h-full min-h-0 justify-between gap-1 select-none">
        {/* KPI Strip */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-muted/30 p-2">
            <span className="text-[11px] text-muted-foreground block font-medium">Fleet Utilization</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-[#0089FF] font-mono">84.6%</span>
              <span className="text-[11px] text-muted-foreground">/ 85% target</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">● Healthy Capacity</span>
          </div>

          <div className="rounded-lg bg-rose-500/10 p-2">
            <span className="text-[11px] text-muted-foreground block font-medium">Overworked Assets</span>
            <span className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-mono block mt-0.5">
              12 Units
            </span>
            <span className="text-[11px] text-rose-600 font-semibold mt-0.5 block">&gt; 10h/day limit</span>
          </div>

          <div className="rounded-lg bg-muted/30 p-2">
            <span className="text-[11px] text-muted-foreground block font-medium">Available Assets</span>
            <span className="text-base font-extrabold text-foreground font-mono block mt-0.5">
              20 Units
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">&lt; 3h/day standby</span>
          </div>
        </div>

        {/* Capacity Distribution Progress Bar */}
        <div className="rounded-lg bg-muted/30 p-2 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-foreground">Duty Cycle Distribution</span>
            <span className="text-[11px] text-muted-foreground font-mono">108 Fleet Assets</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500 w-[70.4%]" title="Optimal: 76 vehicles" />
            <div className="h-full bg-rose-500 w-[11.1%]" title="Overworked: 12 vehicles" />
            <div className="h-full bg-blue-500 w-[18.5%]" title="Underutilized: 20 vehicles" />
          </div>
          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              Optimal <span className="font-semibold text-foreground font-mono">(70%)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
              Overworked <span className="font-semibold text-foreground font-mono">(11%)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
              Idle <span className="font-semibold text-foreground font-mono">(19%)</span>
            </span>
          </div>
        </div>

        {/* High Load Assets List */}
        <div className="border-t border-border/60 pt-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground mb-1">
            <span>Shift Duty Monitoring</span>
            <span className="text-[11px] text-muted-foreground font-mono">Hours logged</span>
          </div>
          <div className="divide-y divide-border/50">
            {assets.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 px-1 text-xs hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-foreground font-mono">{item.plate}</span>
                  <span className="text-[11px] text-muted-foreground">({item.driver})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-foreground font-semibold">{item.dutyHours}</span>
                  <span
                    className={cn(
                      "text-[11px] font-bold px-1.5 py-0.5 rounded",
                      item.status === "Overworked"
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        : item.status === "Optimal"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                    )}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
