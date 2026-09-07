import { TrendingDown, TrendingUp } from "lucide-react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { RANGE_LABEL, fleetScore, type Range } from "@/data/fleet";

const band = (score: number) => {
  if (score <= 50) return { label: "Poor", color: "var(--color-danger)" };
  if (score <= 89) return { label: "Fair", color: "var(--color-warning)" };
  return { label: "Excellent", color: "var(--color-success)" };
};

export function FleetScoreWidget() {
  const { activeTab, setTabRange, settings } = useDashboard();
  const range: Range = activeTab.range;
  const { score, delta } = fleetScore[range];
  const { color } = band(score);

  return (
    <WidgetCard
      id="fleet-score"
      info="Overall safety rating of your drivers."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div className="flex flex-col items-center">
        <div className="relative h-[190px] w-full max-w-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={[{ name: "score", value: score, fill: color }]}
              innerRadius="76%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              barSize={22}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={12} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center">
            <span className="text-5xl font-semibold tabular-nums text-foreground">
              {score}
            </span>
            <span className="mt-1 flex items-center gap-1 text-sm font-medium">
              {delta >= 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-danger" />
              )}
              <span className={delta >= 0 ? "text-success" : "text-danger"}>
                {Math.abs(delta)} %
              </span>
              <span className="text-muted-foreground">
                in {RANGE_LABEL[range].toLowerCase()}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
          <Legend color="var(--color-danger)" label="Poor" hint="(0-50)" />
          <Legend color="var(--color-warning)" label="Fair" hint="(51-89)" />
          <Legend
            color="var(--color-success)"
            label="Excellent"
            hint="(90-100)"
          />
        </div>

        {settings.showNotes ? (
          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
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
