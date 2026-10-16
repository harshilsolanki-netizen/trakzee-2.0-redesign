import { ShieldAlert } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { SOS_ALERTS_FEED } from "@/data/oldAppFleet";

export function SosAlertsWidget() {
  return (
    <WidgetCard
      id="sos-alerts"
      info="Real-time SOS panic triggers and vehicle emergency alerts feed."
    >
      <div className="flex flex-col h-full min-h-0 select-none">
        <div className="divide-y divide-border/50 overflow-y-auto pr-0.5">
          {SOS_ALERTS_FEED.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between py-3 px-1.5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    row.severity === "Critical"
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold font-mono text-xs text-foreground">{row.vehicle}</span>
                    <span className="text-[11px] text-muted-foreground truncate font-medium">({row.type})</span>
                  </div>
                  <span
                    className={`text-xs font-bold block ${
                      row.severity === "Critical" ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono text-muted-foreground block font-medium">{row.time}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold inline-block mt-0.5 ${
                    row.severity === "Critical"
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {row.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}


