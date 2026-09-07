import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboard } from "@/dashboard/store";
import { eventTypes, type EventCategory } from "@/data/fleet";
import { cn } from "@/lib/utils";

export function EventsDistributionWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const range = activeTab.range;
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [muted, setMuted] = useState<string[]>([]);

  const rows = eventTypes.filter(
    (e) => category === "all" || e.category === category,
  );
  const active = rows.filter((e) => !muted.includes(e.id));

  const pieData = active.map((e) => ({
    name: e.label,
    value: e.count[range],
    color: e.color,
    category: e.category,
  }));

  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <WidgetCard
      id="events-distribution"
      info="Split of detected events between driver monitoring (DMS) and road-facing (ADAS) systems."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
      extraControls={
        <div className="mr-1 flex items-center gap-1">
          {(["all", "DMS", "ADAS"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "h-7 rounded-lg px-2.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs border",
                category === c
                  ? "bg-[#155dfc] text-white border-[#155dfc]"
                  : "bg-background text-muted-foreground border-border/80 hover:bg-muted hover:text-foreground",
              )}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-[260px] min-w-0 flex-1">
          {active.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
              All series hidden — re-enable one from the legend.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  paddingAngle={1}
                >
                  {pieData.map((d) => (
                    <Cell
                      key={d.name}
                      fill={d.color}
                      stroke="var(--color-surface, #ffffff)"
                      strokeWidth={1.5}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} (${totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0}%)`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: 6,
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface, #fff)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <ScrollArea className="h-[260px] w-[210px] shrink-0">
          <ul className="pr-3">
            {rows.map((e) => {
              const isMuted = muted.includes(e.id);
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setMuted((m) =>
                        m.includes(e.id)
                          ? m.filter((i) => i !== e.id)
                          : [...m, e.id],
                      )
                    }
                    className={cn(
                      "flex w-full items-center gap-2 rounded px-1 py-1.5 text-left text-xs transition-colors hover:bg-muted",
                      isMuted && "opacity-40",
                    )}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: e.color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-foreground">
                      {e.label}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {e.count[range]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </div>
    </WidgetCard>
  );
}
