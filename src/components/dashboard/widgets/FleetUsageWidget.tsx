import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { WidgetCard } from "@/components/dashboard/WidgetCard";

const USAGE_POINTS = [
  { p: "Day 1", dist: 12 },
  { p: "Day 2", dist: 18 },
  { p: "Day 3", dist: 14 },
  { p: "Day 4", dist: 28 },
  { p: "Day 5", dist: 42 },
  { p: "Day 6", dist: 35 },
  { p: "Day 7", dist: 52 },
  { p: "Day 8", dist: 46 },
  { p: "Day 9", dist: 65 },
  { p: "Day 10", dist: 58 },
  { p: "Day 11", dist: 72 },
  { p: "Day 12", dist: 48 },
  { p: "Day 13", dist: 62 },
  { p: "Day 14", dist: 54 },
];

export function FleetUsageWidget() {
  return (
    <WidgetCard
      id="fleet-usage"
      info="Daily distance wave trajectory and fleet mileage contribution."
    >
      <div className="flex flex-col h-full min-h-0 justify-between select-none py-1">
        {/* Top Header Metrics */}
        <div className="flex items-center justify-end gap-4 text-xs font-mono pb-2 border-b border-border/40">
          <div className="text-right">
            <span className="text-muted-foreground font-sans mr-1">Total Distance:</span>
            <span className="font-bold text-foreground">2,350 km</span>
          </div>
          <div className="text-right border-l border-border/60 pl-4">
            <span className="text-muted-foreground font-sans mr-1">Avg Distance:</span>
            <span className="font-bold text-[#0089FF]">38 km</span>
          </div>
        </div>

        {/* Smooth Area Wave Chart */}
        <div className="h-[230px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={USAGE_POINTS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fleetUsageWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0089FF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0089FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
              <XAxis dataKey="p" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: number) => [`${val} km`, "Distance"]}
                contentStyle={{
                  backgroundColor: "var(--color-surface, #fff)",
                  borderColor: "var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="dist"
                stroke="#0089FF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#fleetUsageWave)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetCard>
  );
}


