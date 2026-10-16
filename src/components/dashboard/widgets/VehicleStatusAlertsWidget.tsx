import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { VEHICLE_STATUS_ALERTS } from "@/data/oldAppFleet";

function getScoreBadge(val: string) {
  const num = parseInt(val, 10);
  if (num >= 85) return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
  if (num >= 65) return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
  return "bg-rose-500/15 text-rose-600 dark:text-rose-400";
}

export function VehicleStatusAlertsWidget() {
  return (
    <WidgetCard
      id="vehicle-status-alerts"
      info="Real-time subsystem health status matrix per monitored vehicle."
    >
      <div className="flex flex-col h-full min-h-0 select-none">
        <div className="overflow-y-auto flex-1 min-h-0 [scrollbar-width:thin]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                <th className="py-2.5 px-2">Vehicle</th>
                <th className="py-2.5 px-2 text-center">Engine</th>
                <th className="py-2.5 px-2 text-center">Battery</th>
                <th className="py-2.5 px-2 text-center">Fuel</th>
                <th className="py-2.5 px-2 text-center">Cooling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {VEHICLE_STATUS_ALERTS.map((row) => (
                <tr key={row.vehicle} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-2 font-bold text-xs text-foreground truncate max-w-[100px]">
                    {row.vehicle}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getScoreBadge(row.engine)}`}>
                      {row.engine}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getScoreBadge(row.battery)}`}>
                      {row.battery}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getScoreBadge(row.fuel)}`}>
                      {row.fuel}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getScoreBadge(row.cooling)}`}>
                      {row.cooling}
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
