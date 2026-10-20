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
import { type WidgetId, type WidgetSize } from "@/dashboard/widgets";
import { cn } from "@/lib/utils";

const band = (score: number) => {
  if (score <= 50) return { label: "Poor", color: "var(--color-danger)" };
  if (score <= 89) return { label: "Fair", color: "var(--color-warning)" };
  return { label: "Excellent", color: "var(--color-success)" };
};

export function FleetScoreWidget({ id = "fleet-score" }: { id?: WidgetId }) {
  const { activeTab, setTabRange, settings } = useDashboard();
  const range: Range = activeTab.range;
  const { score, delta } = fleetScore[range];
  const { label: bandLabel, color } = band(score);

  const rawSize: WidgetSize =
    activeTab?.widgetSizes?.[id] || "small";
  const size: WidgetSize =
    rawSize === "medium" || rawSize === "large" || rawSize === "full"
      ? "small"
      : rawSize;

  const isMini = size === "mini";
  const isCompact = size === "compact";

  return (
    <WidgetCard
      id={id}
      info="Overall safety rating of your drivers."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      {isMini ? (
        /* 0.5x0.5 Mini Tile View */
        <div className="flex flex-col justify-between h-full min-h-0 select-none py-1">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono tracking-tight text-foreground">
              {score}
            </span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{
                backgroundColor: `${color}18`,
                color: color,
              }}
            >
              {bandLabel}
            </span>
          </div>

          <div className="my-1.5">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${score}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
            <span className="flex items-center gap-0.5">
              {delta >= 0 ? (
                <TrendingUp className="h-3 w-3 text-success shrink-0" />
              ) : (
                <TrendingDown className="h-3 w-3 text-danger shrink-0" />
              )}
              <span className={delta >= 0 ? "text-success font-semibold" : "text-danger font-semibold"}>
                {Math.abs(delta)}%
              </span>
            </span>
            <span className="truncate">in {RANGE_LABEL[range].toLowerCase()}</span>
          </div>
        </div>
      ) : isCompact ? (
        /* 1x0.5 Compact View (Side-by-Side) */
        <div className="flex items-center justify-between h-full min-h-0 select-none px-2 gap-3">
          <div className="relative w-[130px] h-[120px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="75%"
                data={[{ name: "score", value: score, fill: color }]}
                innerRadius="72%"
                outerRadius="100%"
                startAngle={180}
                endAngle={0}
                barSize={14}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={6} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-x-0 bottom-1 flex flex-col items-center">
              <span className="font-extrabold tabular-nums text-foreground text-2xl leading-none">
                {score}
              </span>
              <span className="flex items-center gap-0.5 font-semibold text-[10px] mt-0.5">
                {delta >= 0 ? (
                  <TrendingUp className="h-2.5 w-2.5 text-success" />
                ) : (
                  <TrendingDown className="h-2.5 w-2.5 text-danger" />
                )}
                <span className={delta >= 0 ? "text-success" : "text-danger"}>
                  {Math.abs(delta)}%
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center flex-1 min-w-0 gap-1.5 py-1">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${color}18`,
                  color: color,
                }}
              >
                {bandLabel} Fleet Rating
              </span>
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
              <Legend color="var(--color-danger)" label="Poor" hint="(0-50)" />
              <Legend color="var(--color-warning)" label="Fair" hint="(51-89)" />
              <Legend color="var(--color-success)" label="Excellent" hint="(90-100)" />
            </div>
          </div>
        </div>
      ) : (
        /* Standard 1x1 Small View (Properly Managed & Proportioned) */
        <div className="flex flex-col items-center justify-between h-full min-h-0 select-none py-1 gap-2">
          {/* Gauge Arc with Centered Score */}
          <div className="relative w-full max-w-[280px] h-[165px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="72%"
                data={[{ name: "score", value: score, fill: color }]}
                innerRadius="72%"
                outerRadius="100%"
                startAngle={180}
                endAngle={0}
                barSize={18}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex flex-col items-center">
              <span className="font-extrabold tabular-nums text-foreground text-4xl leading-none tracking-tight">
                {score}
              </span>
              <span className="flex items-center gap-1 font-semibold text-xs mt-1">
                {delta >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-danger" />
                )}
                <span className={delta >= 0 ? "text-success font-bold" : "text-danger font-bold"}>
                  {Math.abs(delta)}%
                </span>
                <span className="text-muted-foreground font-normal">
                  in {RANGE_LABEL[range].toLowerCase()}
                </span>
              </span>
            </div>
          </div>

          {/* 3 Rating Threshold Legends */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs shrink-0 py-0.5">
            <Legend color="var(--color-danger)" label="Poor" hint="(0-50)" />
            <Legend color="var(--color-warning)" label="Fair" hint="(51-89)" />
            <Legend
              color="var(--color-success)"
              label="Excellent"
              hint="(90-100)"
            />
          </div>

          {/* Descriptive Note (Cleanly proportioned, never overflows) */}
          {settings.showNotes ? (
            <p className="text-center text-[10.5px] leading-snug text-muted-foreground px-2 line-clamp-2 shrink-0">
              <span className="font-semibold text-foreground">Note: </span>
              Fleet Average Score represents the overall safety rating of your
              drivers, calculated from speeding, distraction, fatigue, and harsh
              driving events.
            </p>
          ) : null}
        </div>
      )}
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
      <span className="h-2.5 w-2.5 rounded-xs shrink-0" style={{ backgroundColor: color }} />
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">{hint}</span>
    </span>
  );
}
