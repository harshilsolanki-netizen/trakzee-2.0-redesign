import { AlertTriangle } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { COMPONENT_FAILURES } from "@/data/oldAppFleet";

export function ComponentFailureWidget() {
  return (
    <WidgetCard
      id="component-failure"
      info="Diagnosed component failures and maintenance severity breakdown."
    >
      <div className="flex flex-col h-full min-h-0 select-none">
        <div className="flex-1 flex flex-col justify-between py-1">
          {COMPONENT_FAILURES.map((item) => {
            const pct = Math.min(100, Math.round((item.alerts / 15) * 100));
            return (
              <div key={item.component} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="truncate text-[12px] font-medium text-foreground">
                      {item.component}
                    </span>
                    {item.severity === "Critical" ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    ) : null}
                  </div>
                  <span
                    className="text-xs font-semibold shrink-0 ml-1 inline-flex items-baseline gap-1"
                    style={{ color: item.color }}
                  >
                    <span className="font-mono text-sm font-bold">{item.alerts}</span>
                    <span className="font-sans font-medium">{item.alerts === 1 ? "Alert" : "Alerts"}</span>
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
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


