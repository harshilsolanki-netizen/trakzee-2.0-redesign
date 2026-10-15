import { TrendingUp } from "lucide-react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { FLEET_STRESS_INDEX } from "@/data/oldAppFleet";

export function FleetStressIndexWidget() {
  return (
    <WidgetCard
      id="fleet-stress-index"
      info="Fleet mechanical stress index and weekly telemetry load."
    >
      <div className="flex flex-col h-full min-h-0 justify-around items-center select-none py-1">
        {/* Semi-circular Speedometer Gauge */}
        <div className="relative h-[150px] w-full max-w-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={[{ name: "stress", value: FLEET_STRESS_INDEX.currentScore, fill: "#ef4444" }]}
              innerRadius="75%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              barSize={16}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={8} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex flex-col items-center">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black font-mono text-foreground leading-none">
                {FLEET_STRESS_INDEX.currentScore}
              </span>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                {FLEET_STRESS_INDEX.level}
              </span>
            </div>
            <span className="text-xs text-rose-500 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> {FLEET_STRESS_INDEX.trend}
            </span>
          </div>
        </div>

        {/* Min / Avg / Max Stress Triplets */}
        <div className="grid grid-cols-3 gap-2 w-full text-center border-t border-border/50 pt-2">
          <div className="flex flex-col p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">Min</span>
            <span className="text-sm font-mono font-bold text-emerald-600">
              {FLEET_STRESS_INDEX.minStress}
            </span>
          </div>
          <div className="flex flex-col p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 border-x">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">Avg</span>
            <span className="text-sm font-mono font-bold text-amber-600">
              {FLEET_STRESS_INDEX.avgStress}
            </span>
          </div>
          <div className="flex flex-col p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">Max</span>
            <span className="text-sm font-mono font-bold text-rose-600">
              {FLEET_STRESS_INDEX.maxStress}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low (0-50)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Med (51-75)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> High (76-100)
          </span>
        </div>
      </div>
    </WidgetCard>
  );
}
