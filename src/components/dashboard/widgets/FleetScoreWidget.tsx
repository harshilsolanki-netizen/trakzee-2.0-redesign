import { TrendingDown, TrendingUp } from "lucide-react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { RANGE_LABEL, fleetScore, type Range } from "@/data/fleet";
import { cn } from "@/lib/utils";

const band = (score: number) => {
  if (score <= 50) return { label: "Poor", color: "var(--color-danger)" };
  if (score <= 89) return { label: "Fair", color: "var(--color-warning)" };
  return { label: "Excellent", color: "var(--color-success)" };
};

export function FleetScoreWidget() {
  const { activeTab, setTabRange, settings } = useDashboard();
  const size = useWidgetSize();
  const range: Range = activeTab.range;
  const { score, delta } = fleetScore[range];
  const { color } = band(score);

  const isLarge = size === "large";
  const gaugeHeight = isLarge ? 260 : 210;

  return (
    <WidgetCard
      id="fleet-score"
      info="Overall safety rating of your drivers."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div className="flex flex-col items-center justify-around h-full min-h-0 select-none py-2">
        <div style={{ height: gaugeHeight }} className="relative w-full max-w-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={[{ name: "score", value: score, fill: color }]}
              innerRadius={isLarge ? "76%" : "72%"}
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              barSize={isLarge ? 22 : 18}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex flex-col items-center">
            <span className={cn("font-bold tabular-nums text-foreground leading-none", isLarge ? "text-5xl" : "text-4xl")}>
              {score}
            </span>
            <span className={cn("flex items-center gap-1 font-medium", isLarge ? "mt-1 text-sm" : "mt-0.5 text-xs")}>
              {delta >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-danger" />
              )}
              <span className={delta >= 0 ? "text-success" : "text-danger"}>
                {Math.abs(delta)}%
              </span>
              <span className="text-muted-foreground">
                in {RANGE_LABEL[range].toLowerCase()}
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 text-xs mt-1">
          <Legend color="var(--color-danger)" label="Poor" hint="(0-50)" />
          <Legend color="var(--color-warning)" label="Fair" hint="(51-89)" />
          <Legend
            color="var(--color-success)"
            label="Excellent"
            hint="(90-100)"
          />
        </div>

        {settings.showNotes ? (
          <p className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground px-2">
            <span className="font-semibold text-foreground">Note: </span>
            Fleet Average Score represents the overall safety rating of your
            drivers, calculated from speeding, distraction, fatigue, and harsh
            driving events.
          </p>
        ) : null}
      </div>
    </WidgetCard>
  );
}

function Legend({
  color,
  label,
  hint,
}: {
  color: string;
  label: string;
  hint: string;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">{hint}</span>
    </span>
  );
}
