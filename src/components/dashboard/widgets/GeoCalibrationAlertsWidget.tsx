import { MapPin } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { GEO_CALIBRATION_DATA } from "@/data/oldAppFleet";

export function GeoCalibrationAlertsWidget() {
  return (
    <WidgetCard
      id="geo-calibration-alerts"
      info="Geofence entry, exit, and perimeter boundary deviation alerts."
    >
      <div className="flex flex-col h-full min-h-0 select-none">
        <div className="flex-1 flex flex-col justify-between py-1">
          {GEO_CALIBRATION_DATA.map((item) => {
            const pct = Math.round((item.count / item.max) * 100);
            return (
              <div key={item.zone} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                    <span className="text-[12px] font-medium text-foreground truncate">{item.zone}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0089FF] shrink-0 inline-flex items-baseline gap-1">
                    <span className="font-mono text-sm font-bold">{item.count}</span>
                    <span className="font-sans font-medium">{item.count === 1 ? "Alert" : "Alerts"}</span>
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0089FF] transition-all duration-300"
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


