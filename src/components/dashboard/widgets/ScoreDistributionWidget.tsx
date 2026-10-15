import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { bucketColor, scoreDistribution, type Range } from "@/data/fleet";

export function ScoreDistributionWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const range: Range = activeTab.range;
  const data = scoreDistribution[range];
  const size = useWidgetSize();

  const isLarge = size === "large";
  const chartHeight = isLarge ? 580 : 260;
  const barSize = isLarge ? 22 : 12;
  const fontSize = isLarge ? 12 : 10;

  return (
    <WidgetCard
      id="score-distribution"
      info="Number of drivers falling into each score range."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div style={{ height: chartHeight }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 4, right: 12, top: 2, bottom: isLarge ? 16 : 4 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize, fill: "var(--color-muted-foreground)" }}
              label={
                isLarge
                  ? {
                      value: "Number of Drivers",
                      position: "insideBottom",
                      offset: -10,
                      fontSize: 11,
                      fill: "var(--color-foreground)",
                    }
                  : undefined
              }
            />
            <YAxis
              type="category"
              dataKey="bucket"
              width={isLarge ? 52 : 44}
              tick={{ fontSize, fill: "var(--color-muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 6,
                border: "1px solid var(--color-border)",
                fontSize: 11,
              }}
              formatter={(v: number) => [`${v} drivers`, "Drivers"]}
            />
            <Bar dataKey="drivers" barSize={barSize} radius={[0, 3, 3, 0]}>
              {data.map((d) => (
                <Cell key={d.bucket} fill={bucketColor(d.bucket)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
