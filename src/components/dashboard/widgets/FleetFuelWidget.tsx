import { Fuel, Droplet, ShieldCheck, ArrowUpRight, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { cn } from "@/lib/utils";

const FUEL_CHART = [
  { day: "Mon", consumed: 520, refuel: 600 },
  { day: "Tue", consumed: 580, refuel: 400 },
  { day: "Wed", consumed: 640, refuel: 750 },
  { day: "Thu", consumed: 510, refuel: 300 },
  { day: "Fri", consumed: 690, refuel: 800 },
  { day: "Sat", consumed: 340, refuel: 0 },
  { day: "Sun", consumed: 280, refuel: 200 },
];

export function FleetFuelWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const size = useWidgetSize();
  const range = activeTab.range;
  const isLarge = size === "large";
  const chartHeight = isLarge ? 220 : 74;

  return (
    <WidgetCard
      id="fleet-fuel"
      info="Fleetwide fuel consumption, refueling logs, sensor-based drainage detection, and mileage efficiency."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div className="flex flex-col h-full min-h-0 justify-between select-none">
        {/* KPI Strip */}
        <div className="grid grid-cols-4 gap-1.5">
          <div className="rounded-md border border-border/70 bg-card px-1.5 py-1">
            <span className="text-[11px] text-muted-foreground block font-medium">Consumed</span>
            <span className="text-[11px] font-bold text-foreground font-mono block mt-0.5">3,560 L</span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="h-2 w-2" /> +2.4%
            </span>
          </div>

          <div className="rounded-md border border-border/70 bg-card px-1.5 py-1">
            <span className="text-[11px] text-muted-foreground block font-medium">Avg Mileage</span>
            <span className="text-[11px] font-bold text-[#0089FF] font-mono block mt-0.5">3.8 km/L</span>
            <span className="text-[11px] text-muted-foreground">Standard</span>
          </div>

          <div className="rounded-md border border-border/70 bg-card px-1.5 py-1">
            <span className="text-[11px] text-muted-foreground block font-medium">Refuel Log</span>
            <span className="text-[11px] font-bold text-emerald-600 font-mono block mt-0.5">3,050 L</span>
            <span className="text-[11px] text-muted-foreground">18 events</span>
          </div>

          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-1">
            <span className="text-[11px] text-muted-foreground block font-medium">Fuel Theft</span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 font-mono block mt-0.5">0 Alerts</span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <ShieldCheck className="h-2 w-2" /> Normal
            </span>
          </div>
        </div>

        {/* Bar Chart comparing Consumed vs Refueled */}
        <div style={{ height: chartHeight }} className="w-full pt-0.5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FUEL_CHART} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: number, name: string) => [
                  `${val} Liters`,
                  name === "consumed" ? "Consumed" : "Refueled",
                ]}
                contentStyle={{
                  backgroundColor: "var(--color-surface, #fff)",
                  borderColor: "var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Bar dataKey="consumed" fill="#0089FF" radius={[3, 3, 0, 0]} name="consumed" />
              <Bar dataKey="refuel" fill="#10b981" radius={[3, 3, 0, 0]} name="refuel" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Efficiency High/Low Highlight */}
        <div className="border-t border-border/60 pt-1.5">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-1.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-emerald-600 font-bold block uppercase">Top Efficiency</span>
                <span className="text-[11px] font-bold text-foreground font-mono">GJ21HS1609</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 font-mono">4.4 km/L</span>
            </div>

            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-1.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-600 font-bold block uppercase">High Consumption</span>
                <span className="text-[11px] font-bold text-foreground font-mono">MH04AB1234</span>
              </div>
              <span className="text-xs font-extrabold text-amber-600 font-mono">3.1 km/L</span>
            </div>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
