import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { ALERTS_OBJECT_TYPE } from "@/data/oldAppFleet";

export function AlertsObjectTypeWidget() {
  return (
    <WidgetCard
      id="alerts-object-type"
      info="Alarm volume and risk severity categorized per vehicle object class."
    >
      <div className="flex flex-col h-full min-h-0 select-none">
        <div className="overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-semibold text-xs">
                <th className="py-2.5 px-2">Object Type</th>
                <th className="py-2.5 px-2 text-center">Alerts</th>
                <th className="py-2.5 px-2 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {ALERTS_OBJECT_TYPE.map((row) => (
                <tr key={row.type} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-2 font-sans font-medium text-xs text-foreground truncate max-w-[140px]">
                    {row.type}
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold text-xs text-foreground">
                    {row.count}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        row.severity === "High"
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          : row.severity === "Medium"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {row.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </WidgetCard>
  );
}


