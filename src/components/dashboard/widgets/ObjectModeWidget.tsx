import { useState } from "react";
import { Layers, CheckCircle2, Wrench, Shield, CircleParking } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { WidgetCard, useWidgetSize } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { cn } from "@/lib/utils";

const MODES = [
  { name: "On-Duty Route", value: 62, percent: "57.4%", color: "#10b981", icon: CheckCircle2, desc: "Active transit on assigned route" },
  { name: "Standby / Depot", value: 24, percent: "22.2%", color: "#0089FF", icon: Shield, desc: "Available at logistics hubs" },
  { name: "Parked / Off-Duty", value: 14, percent: "13.0%", color: "#f59e0b", icon: CircleParking, desc: "Ignition off / driver rest" },
  { name: "Maintenance", value: 8, percent: "7.4%", color: "#ef4444", icon: Wrench, desc: "Scheduled service in garage" },
];

export function ObjectModeWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const size = useWidgetSize();
  const range = activeTab.range;
  const [activeMode, setActiveMode] = useState<string>("On-Duty Route");

  const isLarge = size === "large";
  const chartHeight = isLarge ? 240 : 100;
  const innerRadius = isLarge ? 55 : 28;
  const outerRadius = isLarge ? 88 : 46;

  return (
    <WidgetCard
      id="object-mode"
      info="Operating mode and duty assignment distribution across fleet assets."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      <div className="flex flex-col h-full min-h-0 justify-between select-none">
        {/* Top Header Summary */}
        <div className="flex items-center justify-between px-2 py-1 rounded-md bg-muted/40 border border-border/70 text-xs">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#0089FF]" />
            <span className="font-semibold text-foreground text-[11px]">Monitored Assets:</span>
            <strong className="text-foreground font-mono text-[11px]">108</strong>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold font-mono">● 79.6% Ready</span>
        </div>

        {/* Visual Split: Donut Chart on Left, Detail Cards on Right */}
        <div className="grid grid-cols-2 gap-2 items-center py-0.5">
          {/* Donut Chart */}
          <div style={{ height: chartHeight }} className="w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MODES}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  paddingAngle={3}
                >
                  {MODES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number, name: string) => [`${val} Assets`, name]}
                  contentStyle={{
                    backgroundColor: "var(--color-surface, #fff)",
                    borderColor: "var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Donut Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-extrabold text-foreground font-mono">108</span>
              <span className="text-[11px] text-muted-foreground uppercase font-semibold">Total</span>
            </div>
          </div>

          {/* Mode Badges Breakdown */}
          <div className="space-y-1.5">
            {MODES.map((m) => {
              const Icon = m.icon;
              const isSelected = activeMode === m.name;
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setActiveMode(m.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded-md border text-left transition-all cursor-pointer text-xs",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-2xs"
                      : "border-border/60 bg-card hover:bg-muted/40",
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                    <span className="text-[12px] font-medium text-foreground truncate">{m.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono shrink-0">
                    <span className="text-[14px] font-semibold text-foreground">{m.value}</span>
                    <span className="text-muted-foreground text-[12px]">({m.percent})</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Mode Description Bar */}
        <div className="border-t border-border/60 pt-1.5">
          {(() => {
            const current = MODES.find((m) => m.name === activeMode) || MODES[0];
            return (
              <div className="flex items-center justify-between px-2 py-1 rounded bg-muted/20 text-[11px]">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: current.color }} />
                  {current.name}:
                </span>
                <span className="text-muted-foreground text-[11px]">{current.desc}</span>
              </div>
            );
          })()}
        </div>
      </div>
    </WidgetCard>
  );
}
