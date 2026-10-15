import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { BATTERY_DEGRADATION_DATA } from "@/data/oldAppFleet";

export function BatteryDegradationWidget() {
  return (
    <WidgetCard
      id="battery-degradation"
      info="Predictive battery lifespan degradation forecast across fleet assets."
    >
      <div className="flex flex-col h-full min-h-0 justify-around select-none py-1">
        <div className="grid grid-cols-3 gap-3 my-auto">
          {BATTERY_DEGRADATION_DATA.map((item) => (
            <div
              key={item.period}
              className="rounded-xl border p-4 flex flex-col items-center justify-center text-center bg-card shadow-xs transition-shadow"
              style={{ borderColor: `${item.color}40`, backgroundColor: `${item.color}08` }}
            >
              <span className="text-xs font-bold text-foreground leading-tight">
                {item.period}
              </span>
              <span
                className="text-3xl font-black font-mono my-2 leading-none"
                style={{ color: item.color }}
              >
                {item.count}
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                Vehicles
              </span>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}


