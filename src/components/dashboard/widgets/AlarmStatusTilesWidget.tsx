import { Gauge, Navigation, Snowflake, Flame, Bell, ShieldAlert } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { ALARM_TILES_DATA } from "@/data/oldAppFleet";

const ICONS: Record<string, any> = {
  overspeed: Gauge,
  "harsh-cornering": Navigation,
  "ac-freeze": Snowflake,
  "high-temp": Flame,
  "panic-sos": Bell,
  collision: ShieldAlert,
};

export function AlarmStatusTilesWidget() {
  return (
    <WidgetCard
      id="alarm-status-tiles"
      info="Real-time alarm indicator tiles with active trigger counts."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 h-full min-h-0 items-center select-none py-1">
        {ALARM_TILES_DATA.map((tile) => {
          const Icon = ICONS[tile.id] ?? ShieldAlert;
          return (
            <div
              key={tile.id}
              className={`h-full min-h-[110px] rounded-xl border p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow ${tile.bgClass}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold leading-tight line-clamp-2">
                  {tile.label}
                </span>
                <span className="text-[11px] opacity-75 font-mono uppercase shrink-0 px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">
                  {tile.status}
                </span>
              </div>

              <div className="flex items-end justify-between mt-2">
                <Icon className="h-6 w-6 opacity-80" />
                <span className="text-[32px] font-black font-mono leading-none">
                  {tile.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
