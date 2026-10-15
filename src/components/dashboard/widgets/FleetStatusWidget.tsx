import React, { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Sector } from "recharts";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { FLEET_STATUS_DATA } from "@/data/oldAppFleet";
import { WidgetDrilldownModal } from "@/components/dashboard/WidgetDrilldownModal";
import { FLEET_STATUS_DRILLDOWN } from "@/data/widgetDrilldownData";

const STATUS_SLICES = [
  { name: "Running", value: FLEET_STATUS_DATA.running.count, pct: FLEET_STATUS_DATA.running.pct, color: "#10b981" },
  { name: "Idle", value: FLEET_STATUS_DATA.idle.count, pct: FLEET_STATUS_DATA.idle.pct, color: "#f59e0b" },
  { name: "Stopped", value: FLEET_STATUS_DATA.stopped.count, pct: FLEET_STATUS_DATA.stopped.pct, color: "#ef4444" },
  { name: "Inactive", value: FLEET_STATUS_DATA.inactive.count, pct: FLEET_STATUS_DATA.inactive.pct, color: "#0089FF" },
  { name: "No Data", value: FLEET_STATUS_DATA.noData.count, pct: FLEET_STATUS_DATA.noData.pct, color: "#94a3b8" },
];

function CustomDonutTooltip({ active, payload, coordinate }: any) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const isLeft = (coordinate?.x ?? 0) > 112;

  return (
    <div className="relative z-50 rounded-xl border border-border/80 bg-popover px-3 py-2 text-popover-foreground shadow-2xl pointer-events-none min-w-[120px] animate-in fade-in-0 zoom-in-95">
      {/* Pointer arrow pointing directly at the hovered slice */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-popover ${
          isLeft
            ? "-right-[6px] border-t border-r border-border/80"
            : "-left-[6px] border-b border-l border-border/80"
        }`}
      />
      <div className="relative z-10 flex items-center gap-2 mb-1">
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-black/10 dark:ring-white/20"
          style={{ backgroundColor: data.color }}
        />
        <span className="text-xs font-bold text-foreground">{data.name}</span>
      </div>
      <div className="relative z-10 flex items-baseline gap-1.5 font-mono">
        <span className="text-base font-black text-foreground">{Number(data.value).toLocaleString()}</span>
        <span className="text-xs text-muted-foreground font-semibold">({data.pct}%)</span>
      </div>
    </div>
  );
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g style={{ cursor: "pointer", outline: "none" }}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.22))",
          cursor: "pointer",
        }}
      />
    </g>
  );
};

export function FleetStatusWidget() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [drilldownCategory, setDrilldownCategory] = useState<string | null>(null);

  const activeSlice = activeIndex !== null ? STATUS_SLICES[activeIndex] : null;

  const handleOpenDrilldown = (categoryName: string) => {
    setDrilldownCategory(categoryName);
  };

  const selectedSlice = drilldownCategory
    ? STATUS_SLICES.find((s) => s.name === drilldownCategory)
    : null;

  return (
    <>
      <WidgetCard
        id="fleet-status"
        info="Real-time operating status distribution across total monitored fleet objects. Click any slice or status to view matching vehicles."
      >
        <div className="flex items-center justify-between h-full min-h-0 select-none gap-3">
          {/* Donut Chart */}
          <div className="relative h-[225px] w-[225px] shrink-0 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={<CustomDonutTooltip />}
                  wrapperStyle={{ outline: "none", zIndex: 50, pointerEvents: "none" }}
                />
                <Pie
                  data={STATUS_SLICES}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={108}
                  paddingAngle={2.5}
                  stroke="none"
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={(entry) => handleOpenDrilldown(entry.name)}
                  className="cursor-pointer outline-none"
                >
                  {STATUS_SLICES.map((s, idx) => (
                    <Cell
                      key={s.name}
                      fill={s.color}
                      className="cursor-pointer outline-none transition-opacity duration-200"
                      style={{
                        opacity: activeIndex === null || activeIndex === idx ? 1 : 0.65,
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center transition-all duration-200">
              {activeSlice ? (
                <>
                  <span
                    className="text-2xl font-black font-mono leading-tight"
                    style={{ color: activeSlice.color }}
                  >
                    {activeSlice.value.toLocaleString()}
                  </span>
                  <span className="text-[12px] font-bold text-foreground mt-0.5 max-w-[120px] truncate text-center">
                    {activeSlice.name} ({activeSlice.pct}%)
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-black font-mono text-foreground leading-tight">
                    {FLEET_STATUS_DATA.total.toLocaleString()}
                  </span>
                  <span className="text-[12px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">
                    Objects
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Legend beside chart */}
          <div className="flex-1 min-w-0 max-w-[210px] space-y-1.5 my-auto pr-1">
            {STATUS_SLICES.map((item, idx) => {
              const isHovered = activeIndex === idx;
              return (
                <div
                  key={item.name}
                  onClick={() => handleOpenDrilldown(item.name)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  title={`${item.name} (${item.value})`}
                  className={`flex items-center justify-between py-1.5 px-2 rounded-lg border transition-all duration-150 cursor-pointer ${
                    isHovered
                      ? "border-primary/60 bg-muted/80 shadow-xs scale-[1.02]"
                      : "border-border/40 bg-muted/20 hover:bg-muted/50 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 transition-transform ${
                        isHovered ? "scale-125" : ""
                      }`}
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={`text-[12px] truncate ${
                        isHovered ? "font-bold text-foreground" : "font-medium text-foreground"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono text-[14px] font-semibold text-foreground shrink-0 ml-2">
                    {item.value}{" "}
                    <span className="text-[12px] text-muted-foreground font-normal">
                      ({item.pct}%)
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </WidgetCard>

      {/* Drilldown Modal */}
      {drilldownCategory && (
        <WidgetDrilldownModal
          open={!!drilldownCategory}
          onOpenChange={(open) => !open && setDrilldownCategory(null)}
          widgetTitle="Fleet Status"
          category={drilldownCategory}
          color={selectedSlice?.color ?? "#10b981"}
          count={selectedSlice?.value ?? 0}
          pct={selectedSlice?.pct}
          vehicles={FLEET_STATUS_DRILLDOWN[drilldownCategory] || []}
        />
      )}
    </>
  );
}


