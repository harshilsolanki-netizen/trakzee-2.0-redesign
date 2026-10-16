import { Clock, Fuel, AlertOctagon, TrendingDown } from "lucide-react";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { cn } from "@/lib/utils";

const IDLE_OFFENDERS = [
  { plate: "MH04AB1234", vehicle: "Volvo FH16", idleTime: "6h 45m", fuelWasted: "18.2 L", cost: "$23.60", level: "Critical" },
  { plate: "GJ21HS1609", vehicle: "BharatBenz 2823", idleTime: "5h 10m", fuelWasted: "14.5 L", cost: "$18.80", level: "High" },
  { plate: "DL01CD5678", vehicle: "Tata Prima", idleTime: "3h 25m", fuelWasted: "9.8 L", cost: "$12.70", level: "Medium" },
  { plate: "KA02EF9876", vehicle: "Ashok Leyland 3118", idleTime: "2h 50m", fuelWasted: "7.4 L", cost: "$9.60", level: "Low" },
];

export function FleetIdleWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const size = useWidgetSize();
  const range = activeTab.range;
  const isLarge = size === "large";
  const offenders = IDLE_OFFENDERS;

  return (
    <WidgetCard
      id="fleet-idle"
      info="Vehicles with excessive engine idling duration, wasted fuel, and carbon cost impact."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div className="flex flex-col h-full min-h-0 justify-between gap-1 select-none">
        {/* KPI Strip */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-amber-500/10 p-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Idle Duration</span>
              <Clock className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 font-mono block mt-0.5">
              48h 22m
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <TrendingDown className="h-2.5 w-2.5" /> -14% vs prev period
            </span>
          </div>

          <div className="rounded-lg bg-rose-500/10 p-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Wasted Fuel</span>
              <Fuel className="h-3.5 w-3.5 text-rose-500" />
            </div>
            <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 font-mono block mt-0.5">
              142.4 Liters
            </span>
            <span className="text-[11px] text-muted-foreground font-mono mt-0.5 block">
              ~$185.12 expense
            </span>
          </div>

          <div className="rounded-lg bg-muted/30 p-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Idling Ratio</span>
              <AlertOctagon className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <span className="text-sm font-extrabold text-foreground font-mono block mt-0.5">
              7.4%
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              Target: &lt; 5.0%
            </span>
          </div>
        </div>

        {/* Runtime Ratio Bar */}
        <div className="rounded-lg bg-muted/30 p-2 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-foreground">Engine Runtime Split</span>
            <span className="text-[11px] text-muted-foreground font-mono">642h total run</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500 w-[92.6%]" title="Moving 92.6%" />
            <div className="h-full bg-amber-500 w-[7.4%]" title="Idling 7.4%" />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              Moving: <span className="font-semibold text-foreground font-mono">593h 38m (92.6%)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              Idling: <span className="font-semibold text-foreground font-mono">48h 22m (7.4%)</span>
            </span>
          </div>
        </div>

        {/* Ranked Idling Offender Assets */}
        <div className="border-t border-border/60 pt-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground mb-1">
            <span>Vehicles With Highest Idling</span>
            <span className="text-[11px] text-muted-foreground font-mono">Fuel penalty</span>
          </div>
          <div className="divide-y divide-border/50">
            {offenders.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 px-1 text-xs hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-foreground font-mono">{item.plate}</span>
                  <span className="text-[11px] text-muted-foreground hidden sm:inline">({item.vehicle})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                    {item.idleTime}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {item.fuelWasted}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-bold px-1.5 py-0.5 rounded",
                      item.level === "Critical"
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        : item.level === "High"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                    )}
                  >
                    {item.level}
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
