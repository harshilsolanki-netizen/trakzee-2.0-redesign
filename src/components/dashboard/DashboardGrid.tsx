import { useState, type ReactElement } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/dashboard/store";
import { widgetMeta, type WidgetId, type WidgetSize } from "@/dashboard/widgets";
import { cn } from "@/lib/utils";

// Reference Widget Components
import { FleetStatusWidget } from "./widgets/FleetStatusWidget";
import { BatteryStatusWidget } from "./widgets/BatteryStatusWidget";
import { RemoteLockStatusWidget } from "./widgets/RemoteLockStatusWidget";
import { AlertsBreakdownWidget } from "./widgets/AlertsBreakdownWidget";
import { AlertHeatmapWidget } from "./widgets/AlertHeatmapWidget";
import { FleetHealthWidget } from "./widgets/FleetHealthWidget";
import { ComponentFailureWidget } from "./widgets/ComponentFailureWidget";
import { FleetStressIndexWidget } from "./widgets/FleetStressIndexWidget";
import { VehicleStatusAlertsWidget } from "./widgets/VehicleStatusAlertsWidget";
import { GsmSignalQualityWidget } from "./widgets/GsmSignalQualityWidget";
import { GeoCalibrationAlertsWidget } from "./widgets/GeoCalibrationAlertsWidget";
import { EngineEfficiencyWidget } from "./widgets/EngineEfficiencyWidget";
import { BatteryDegradationWidget } from "./widgets/BatteryDegradationWidget";
import { FuelLossOpportunityWidget } from "./widgets/FuelLossOpportunityWidget";
import { JobDeliveryStatusWidget } from "./widgets/JobDeliveryStatusWidget";
import { FleetUsageWidget } from "./widgets/FleetUsageWidget";
import { FleetFuelTrendWidget } from "./widgets/FleetFuelTrendWidget";
import { AlarmStatusTilesWidget } from "./widgets/AlarmStatusTilesWidget";
import {
  OverspeedAlarmWidget,
  HarshCorneringAlarmWidget,
  AcFreezeAlarmWidget,
  HighTempAlarmWidget,
  PanicSosAlarmWidget,
  CollisionAlarmWidget,
} from "./widgets/MiniAlarmWidgets";
import {
  FleetEfficiencyWidget,
  TollExpenseWidget,
  CarbonEmissionWidget,
  ActiveAlertsWidget,
} from "./widgets/OperationalMetricWidgets";
import { VehicleTypeWiseWidget } from "./widgets/VehicleTypeWiseWidget";
import { FleetMetricsSummaryWidget } from "./widgets/FleetMetricsSummaryWidget";
import { SosAlertsWidget } from "./widgets/SosAlertsWidget";
import { AlertsDayTimeWidget } from "./widgets/AlertsDayTimeWidget";
import { AlertsObjectTypeWidget } from "./widgets/AlertsObjectTypeWidget";
import { RiskyDriversWidget } from "./widgets/RiskyDriversWidget";
import { FleetScoreWidget } from "./widgets/FleetScoreWidget";
import { ScoreDistributionWidget } from "./widgets/ScoreDistributionWidget";
import { CameraStatusWidget } from "./widgets/CameraStatusWidget";
import { ShiftComplianceWidget } from "./widgets/ShiftComplianceWidget";
import { TariffWidget } from "./widgets/TariffWidget";

const MAP: Record<WidgetId, (props: { id?: WidgetId }) => ReactElement> = {
  // Row 1
  "fleet-status": FleetStatusWidget,
  "battery-status": BatteryStatusWidget,
  "remote-lock-status": RemoteLockStatusWidget,

  // Row 2
  "alerts-breakdown": AlertsBreakdownWidget,

  // Row 3
  "fleet-health": FleetHealthWidget,
  "component-failure": ComponentFailureWidget,
  "fleet-stress-index": FleetStressIndexWidget,

  // Row 4
  "vehicle-status-alerts": VehicleStatusAlertsWidget,
  "gsm-signal-quality": GsmSignalQualityWidget,
  "geo-calibration-alerts": GeoCalibrationAlertsWidget,

  // Row 5
  "engine-efficiency": EngineEfficiencyWidget,
  "battery-degradation": BatteryDegradationWidget,
  "fuel-loss-opportunity": FuelLossOpportunityWidget,

  // Row 6
  "job-status": JobDeliveryStatusWidget,
  "fleet-usage": FleetUsageWidget,
  "fleet-fuel": FleetFuelTrendWidget,

  // Row 7 (6 Individual Mini Alarm Indicators)
  "overspeed-alarm": OverspeedAlarmWidget,
  "harsh-cornering-alarm": HarshCorneringAlarmWidget,
  "ac-freeze-alarm": AcFreezeAlarmWidget,
  "high-temp-alarm": HighTempAlarmWidget,
  "panic-sos-alarm": PanicSosAlarmWidget,
  "collision-alarm": CollisionAlarmWidget,
  "alarm-status-tiles": AlarmStatusTilesWidget,

  // Row 8 (Individual 0.5x0.5 Operational Metric Widgets)
  "fleet-efficiency": FleetEfficiencyWidget,
  "toll-expense": TollExpenseWidget,
  "carbon-emission": CarbonEmissionWidget,
  "active-alerts": ActiveAlertsWidget,
  "vehicle-type-wise": VehicleTypeWiseWidget,
  "fleet-metrics-summary": FleetMetricsSummaryWidget,
  "sos-alerts": SosAlertsWidget,

  // Row 9
  "alerts-day-time": AlertsDayTimeWidget,
  "alerts-object-type": AlertsObjectTypeWidget,
  "risky-drivers": RiskyDriversWidget,

  // Row 10
  "fleet-score": FleetScoreWidget,
  "score-distribution": ScoreDistributionWidget,
  "camera-status": CameraStatusWidget,

  // Row 11
  "event-heatmap": AlertHeatmapWidget,
  "shift-compliance": ShiftComplianceWidget,

  // Row 12
  "tariff": TariffWidget,
};

const SIZE_CLASSES: Record<WidgetSize, string> = {
  mini: "col-span-1 md:col-span-1 lg:col-span-1 row-span-1 min-h-[192.75px] h-[192.75px]",
  compact: "col-span-1 md:col-span-1 lg:col-span-2 row-span-1 min-h-[192.75px] h-[192.75px]",
  small: "col-span-1 md:col-span-1 lg:col-span-2 row-span-2 min-h-[395.5px] h-[395.5px]",
  medium: "col-span-1 md:col-span-2 lg:col-span-4 row-span-2 min-h-[395.5px] h-[395.5px]",
  large: "col-span-1 md:col-span-2 lg:col-span-4 row-span-4 min-h-[801px] h-[801px]",
  full: "col-span-1 md:col-span-2 lg:col-span-6 row-span-1 min-h-[192.75px]",
};

export function DashboardGrid() {
  const { activeTab, reorderWidgets } = useDashboard();
  const [draggedWidgetId, setDraggedWidgetId] = useState<WidgetId | null>(null);
  const [overWidgetId, setOverWidgetId] = useState<WidgetId | null>(null);

  if (!activeTab || activeTab.widgets.length === 0) {
    return (
      <div className="m-4 rounded-xl border border-dashed border-border bg-card p-12 text-center text-xs">
        <p className="font-bold text-foreground text-sm">
          No widgets on this dashboard
        </p>
        <p className="mt-1 text-muted-foreground">
          Click the <strong>Configuration</strong> button on the top right to
          select widgets.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-[10px] pb-6 w-full auto-rows-[192.75px] grid-flow-dense">
      {activeTab.widgets.map((id) => {
        const Widget = MAP[id] ?? FleetScoreWidget;
        const meta = widgetMeta(id);
        const rawSize: WidgetSize =
          activeTab?.widgetSizes?.[id] || meta.defaultSize || "small";
        const currentSize: WidgetSize =
          id === "fleet-score" &&
          (rawSize === "medium" || rawSize === "large" || rawSize === "full")
            ? "small"
            : rawSize;
        const sizeClass = SIZE_CLASSES[currentSize] || SIZE_CLASSES.small;

        const isDragging = draggedWidgetId === id;
        const isOver = overWidgetId === id && draggedWidgetId !== id;

        return (
          <div
            key={id}
            draggable
            onDragStart={(e) => {
              setDraggedWidgetId(id);
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", id);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (draggedWidgetId && draggedWidgetId !== id) {
                setOverWidgetId(id);
              }
            }}
            onDragLeave={() => {
              setOverWidgetId((prev) => (prev === id ? null : prev));
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromId = (draggedWidgetId ??
                e.dataTransfer.getData("text/plain")) as WidgetId;
              if (fromId && fromId !== id) {
                reorderWidgets(activeTab.id, fromId, id);
                toast.success("Widget reordered");
              }
              setDraggedWidgetId(null);
              setOverWidgetId(null);
            }}
            onDragEnd={() => {
              setDraggedWidgetId(null);
              setOverWidgetId(null);
            }}
            className={cn(
              "transition-all duration-200 select-none rounded-xl relative w-full",
              sizeClass,
              isDragging && "opacity-30 scale-[0.98] ring-2 ring-[#0089FF]/40",
              isOver && "ring-2 ring-[#0089FF] shadow-xl scale-[1.01] z-10",
            )}
          >
            <Widget id={id} />
          </div>
        );
      })}
    </div>
  );
}
