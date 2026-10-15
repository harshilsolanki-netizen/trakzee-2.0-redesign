import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { ALERTS_BREAKDOWN_DATA } from "@/data/oldAppFleet";

export function AlertsBreakdownWidget() {
  return (
    <WidgetCard
      id="alerts-breakdown"
      info="Volume breakdown of primary driving and system alarms."
    >
      <div className="flex flex-col h-full min-h-0 justify-around select-none py-1">
        <div className="space-y-3">
          {ALERTS_BREAKDOWN_DATA.map((item) => {
            const pct = Math.round((item.count / item.max) * 100);
            return (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-foreground truncate pr-1">
                    {item.name}
                  </span>
                  <span className="font-mono text-[14px] font-semibold text-rose-600 dark:text-rose-400 shrink-0">
                    {item.count}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetCard>
  );
}
