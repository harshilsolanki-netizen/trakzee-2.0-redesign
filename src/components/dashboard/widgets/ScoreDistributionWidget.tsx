import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { bucketColor, scoreDistribution, type Range } from "@/data/fleet";

export function ScoreDistributionWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const range: Range = activeTab.range;
  const data = scoreDistribution[range];

  return (
    <WidgetCard
      id="score-distribution"
      info="Number of drivers falling into each score range."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 8, right: 16, top: 4, bottom: 18 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              label={{
                value: "Number of Drivers",
                position: "insideBottom",
                offset: -12,
                fontSize: 12,
                fill: "var(--color-foreground)",
              }}
            />
            <YAxis
              type="category"
              dataKey="bucket"
              width={52}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 6,
                border: "1px solid var(--color-border)",
                fontSize: 12,
              }}
              formatter={(v: number) => [`${v} drivers`, "Drivers"]}
            />
            <Bar dataKey="drivers" barSize={16} radius={[0, 3, 3, 0]}>
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
