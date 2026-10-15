import { useMemo } from "react";
import { TrendingDown, ShieldAlert, Video, Eye } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";

const TREND_DATA = {
  today: [
    { time: "06:00", dms: 2, adas: 1 },
    { time: "09:00", dms: 4, adas: 2 },
    { time: "12:00", dms: 3, adas: 1 },
    { time: "15:00", dms: 6, adas: 3 },
    { time: "18:00", dms: 4, adas: 2 },
    { time: "21:00", dms: 1, adas: 1 },
  ],
  "7d": [
    { time: "Mon", dms: 18, adas: 11 },
    { time: "Tue", dms: 14, adas: 8 },
    { time: "Wed", dms: 19, adas: 12 },
    { time: "Thu", dms: 12, adas: 7 },
    { time: "Fri", dms: 22, adas: 14 },
    { time: "Sat", dms: 9, adas: 5 },
    { time: "Sun", dms: 6, adas: 4 },
  ],
  "30d": [
    { time: "W1", dms: 84, adas: 52 },
    { time: "W2", dms: 76, adas: 48 },
    { time: "W3", dms: 92, adas: 61 },
    { time: "W4", dms: 68, adas: 44 },
  ],
};

const TOP_EVENTS = [
  { label: "Drowsiness & Distraction", cat: "DMS", count: 14, trend: "-12%", color: "text-rose-500" },
  { label: "Forward Collision", cat: "ADAS", count: 8, trend: "-25%", color: "text-amber-500" },
  { label: "Lane Departure", cat: "ADAS", count: 11, trend: "-5%", color: "text-blue-500" },
];

export function EventTrendWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const size = useWidgetSize();
  const range = activeTab.range;
  const chartData = TREND_DATA[range] ?? TREND_DATA["7d"];

  const isLarge = size === "large";
  const chartHeight = isLarge ? 220 : 76;

  return (
    <WidgetCard
      id="event-trend"
      info="Trend of DMS (driver behavior) and ADAS (forward road safety) events over time."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div className="flex flex-col h-full min-h-0 justify-between select-none">
        {/* Top KPI Banner */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">DMS Alerts</span>
              <Eye className="h-3 w-3 text-rose-500" />
            </div>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">14</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center">-12%</span>
            </div>
          </div>

          <div className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">ADAS Alerts</span>
              <Video className="h-3 w-3 text-amber-500" />
            </div>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">8</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center">-25%</span>
            </div>
          </div>

          <div className="rounded-md border border-border/70 bg-card px-2 py-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Total</span>
              <ShieldAlert className="h-3 w-3 text-[#0089FF]" />
            </div>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-xs font-bold text-foreground font-mono">22</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center">-17%</span>
            </div>
          </div>
        </div>

        {/* Multi-series Area Chart (DMS vs ADAS) */}
        <div style={{ height: chartHeight }} className="w-full pt-0.5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="dmsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="adasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: number, name: string) => [
                  `${val} Events`,
                  name === "dms" ? "DMS (Driver Behavior)" : "ADAS (Forward Safety)",
                ]}
                contentStyle={{
                  backgroundColor: "var(--color-surface, #fff)",
                  borderColor: "var(--color-border)",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
              />
              <Area type="monotone" dataKey="dms" stroke="#f43f5e" strokeWidth={1.5} fill="url(#dmsGradient)" name="dms" />
              <Area type="monotone" dataKey="adas" stroke="#f59e0b" strokeWidth={1.5} fill="url(#adasGradient)" name="adas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Top Events Pill Bar */}
        <div className="border-t border-border/60 pt-1">
          <div className="grid grid-cols-3 gap-1 text-[11px]">
            {TOP_EVENTS.map((item, idx) => (
              <div
                key={idx}
                className="rounded border border-border/70 bg-muted/20 px-1.5 py-0.5 flex items-center justify-between"
              >
                <span className="truncate text-foreground font-medium pr-1" title={item.label}>
                  {item.label}
                </span>
                <span className={`font-mono font-bold shrink-0 ${item.color}`}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
