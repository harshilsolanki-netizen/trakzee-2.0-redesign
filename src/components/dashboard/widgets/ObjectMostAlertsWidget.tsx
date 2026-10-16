import { Truck, AlertTriangle, ArrowUpRight, ArrowDownRight, Radio } from "lucide-react";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { cn } from "@/lib/utils";

const OBJECT_ALERTS = [
  {
    plate: "GJ21HS1609",
    type: "Volvo FH16 (Trailer)",
    totalAlerts: 58,
    delta: "+18%",
    trendUp: true,
    breakdown: "24 Speed, 18 DMS, 16 Geofence",
    status: "Running",
  },
  {
    plate: "MH04AB1234",
    type: "BharatBenz 2823 (Container)",
    totalAlerts: 44,
    delta: "-5%",
    trendUp: false,
    breakdown: "21 Harsh Braking, 14 ADAS, 9 Idle",
    status: "Running",
  },
  {
    plate: "DL01CD5678",
    type: "Tata Prima 4028 (Logistics)",
    totalAlerts: 39,
    delta: "+8%",
    trendUp: true,
    breakdown: "19 Speed, 12 Video Loss, 8 Cornering",
    status: "Stopped",
  },
  {
    plate: "KA03MG4411",
    type: "Eicher Pro 3015 (Reefer)",
    totalAlerts: 27,
    delta: "-14%",
    trendUp: false,
    breakdown: "15 Temp Deviation, 8 Speed, 4 Door",
    status: "Running",
  },
  {
    plate: "RJ14AB3322",
    type: "Ashok Leyland 3118 (Tipper)",
    totalAlerts: 21,
    delta: "-2%",
    trendUp: false,
    breakdown: "11 Idle, 7 Overspeed, 3 Geofence",
    status: "Idle",
  },
];

export function ObjectMostAlertsWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const size = useWidgetSize();
  const range = activeTab.range;
  const isLarge = size === "large";
  const objects = OBJECT_ALERTS;

  return (
    <WidgetCard
      id="object-most-alerts"
      info="Vehicles (objects) generating the highest volume of telematics and hardware alarms."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div className="flex flex-col h-full min-h-0 select-none">
        {/* Header alert summary banner */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <Radio className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="font-semibold text-amber-800 dark:text-amber-400">Total Vehicle Triggers:</span>
            <strong className="text-foreground font-mono">189 Alarms</strong>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">5 High-Volume Units</span>
        </div>

        {/* Object Leaderboard List */}
        <div className="divide-y divide-border/50 overflow-y-auto flex-1 min-h-0">
          {objects.map((obj, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2.5 px-1 hover:bg-muted/30 transition-colors text-xs"
            >
              {/* Left: Rank & Vehicle Info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground font-mono shrink-0">
                  #{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground font-mono text-xs truncate">
                      {obj.plate}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                      {obj.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate block">
                    {obj.breakdown}
                  </span>
                </div>
              </div>

              {/* Right: Alert Count & Operational Status */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-extrabold text-foreground font-mono block">
                    {obj.totalAlerts}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-semibold flex items-center justify-end gap-0.5",
                      obj.trendUp ? "text-rose-500" : "text-emerald-500",
                    )}
                  >
                    {obj.trendUp ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                    {obj.delta}
                  </span>
                </div>

                <span
                  className={cn(
                    "text-[11px] font-bold px-1.5 py-0.5 rounded",
                    obj.status === "Running"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : obj.status === "Idle"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400",
                  )}
                >
                  {obj.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}
