import { AlertTriangle, User, ArrowUpRight, ArrowDownRight, ShieldAlert } from "lucide-react";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { cn } from "@/lib/utils";

const DRIVER_ALERTS = [
  {
    name: "John Smith",
    vehicle: "GJ21HS1609",
    totalAlerts: 42,
    delta: "+15%",
    trendUp: true,
    topViolation: "DMS Fatigue & Phone",
    risk: "Critical",
  },
  {
    name: "Jane Doe",
    vehicle: "MH04AB1234",
    totalAlerts: 31,
    delta: "-8%",
    trendUp: false,
    topViolation: "Harsh Braking & Tailgating",
    risk: "High",
  },
  {
    name: "Mike Johnson",
    vehicle: "DL01CD5678",
    totalAlerts: 24,
    delta: "+4%",
    trendUp: true,
    topViolation: "Overspeeding (> 80 km/h)",
    risk: "Medium",
  },
  {
    name: "Rahul Mehta",
    vehicle: "KA02EF9876",
    totalAlerts: 18,
    delta: "-12%",
    trendUp: false,
    topViolation: "Lane Departure Alert",
    risk: "Medium",
  },
  {
    name: "Suresh Patil",
    vehicle: "RJ14AB3322",
    totalAlerts: 12,
    delta: "-5%",
    trendUp: false,
    topViolation: "Yawn / Mild Distraction",
    risk: "Low",
  },
];

export function DriverMostAlertsWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const size = useWidgetSize();
  const range = activeTab.range;
  const isLarge = size === "large";
  const drivers = DRIVER_ALERTS;

  return (
    <WidgetCard
      id="driver-most-alerts"
      info="Drivers triggering the highest volume of safety and operational alarms."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div className="flex flex-col h-full min-h-0 select-none">
        {/* Header alert summary banner */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />
            <span className="font-semibold text-rose-700 dark:text-rose-400">Total Safety Alarms:</span>
            <strong className="text-foreground font-mono">127 Events</strong>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">Top 5 Drivers = 74%</span>
        </div>

        {/* Driver Leaderboard List */}
        <div className="divide-y divide-border/50 overflow-y-auto flex-1 min-h-0">
          {drivers.map((d, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2.5 px-1 hover:bg-muted/30 transition-colors text-xs"
            >
              {/* Left: Rank & Driver Info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground font-mono shrink-0">
                  #{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground text-xs truncate">{d.name}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">({d.vehicle})</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate block">
                    {d.topViolation}
                  </span>
                </div>
              </div>

              {/* Right: Alert Count & Risk Badge */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-extrabold text-foreground font-mono block">
                    {d.totalAlerts}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-semibold flex items-center justify-end gap-0.5",
                      d.trendUp ? "text-rose-500" : "text-emerald-500",
                    )}
                  >
                    {d.trendUp ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                    {d.delta}
                  </span>
                </div>

                <span
                  className={cn(
                    "text-[11px] font-bold px-1.5 py-0.5 rounded",
                    d.risk === "Critical"
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      : d.risk === "High"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                  )}
                >
                  {d.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}
