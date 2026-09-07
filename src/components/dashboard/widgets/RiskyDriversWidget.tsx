import { EyeOff, PhoneCall, Cigarette, Bed, ScanFace } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { useDashboard } from "@/dashboard/store";
import { riskyDrivers, type RiskLevel } from "@/data/fleet";
import { cn } from "@/lib/utils";

const TAG_ICON: Record<string, typeof EyeOff> = {
  fatigue: Bed,
  phone: PhoneCall,
  smoking: Cigarette,
  distraction: ScanFace,
  eye: EyeOff,
};

const LEVEL_CLASS: Record<RiskLevel, string> = {
  High: "bg-danger/10 text-danger",
  Medium: "bg-warning/20 text-warning-foreground",
  Low: "bg-success/10 text-success",
};

export function RiskyDriversWidget() {
  const { activeTab, setTabRange } = useDashboard();
  const range = activeTab.range;
  const rows = riskyDrivers
    .filter((d) => d.range.includes(range))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <WidgetCard
      id="risky-drivers"
      info="Drivers with the highest number of risk events in the selected period."
      range={range}
      onRangeChange={(r) => setTabRange(activeTab.id, r)}
    >
      {rows.length === 0 ? (
        <p className="py-10 text-center text-xs text-muted-foreground">
          No risky drivers in this period.
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {rows.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 py-3 px-1 transition-colors hover:bg-muted/30"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {d.name}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground">
                  {d.vehicle}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {d.tags.map((t) => {
                  const Icon = TAG_ICON[t] ?? ScanFace;
                  return (
                    <span
                      key={t}
                      title={t}
                      className="rounded-full border border-border/70 p-1 text-muted-foreground/80"
                    >
                      <Icon className="h-3 w-3" />
                    </span>
                  );
                })}
              </div>
              <span className="w-8 text-right text-base font-semibold tabular-nums text-foreground">
                {String(d.score).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "w-14 rounded-full px-2 py-0.5 text-center text-[10.5px] font-semibold",
                  d.level === "High"
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    : d.level === "Medium"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                )}
              >
                {d.level}
              </span>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}
