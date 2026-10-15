import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { widgetMeta, type WidgetId } from "@/dashboard/widgets";
import {
  FLEET_STATUS_DATA,
  BATTERY_STATUS_DATA,
  REMOTE_LOCK_DATA,
  ALERTS_BREAKDOWN_DATA,
  FLEET_HEALTH_DATA,
  COMPONENT_FAILURES,
  FLEET_STRESS_INDEX,
  VEHICLE_STATUS_ALERTS,
  GSM_SIGNAL_DATA,
  GEO_CALIBRATION_DATA,
  ENGINE_EFFICIENCY_DATA,
  BATTERY_DEGRADATION_DATA,
  FUEL_LOSS_OPPORTUNITY,
  JOB_DELIVERY_DATA,
  ALARM_TILES_DATA,
  VEHICLE_TYPE_DATA,
  OPERATIONAL_METRICS_DATA,
  SOS_ALERTS_FEED,
  ALERTS_DAY_TIME,
  ALERTS_OBJECT_TYPE,
  SHIFT_COMPLIANCE_DATA,
} from "@/data/oldAppFleet";
import { cn } from "@/lib/utils";

interface TableRow {
  [key: string]: string | number;
}

interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  isBadge?: boolean;
}

export function WidgetTextualModal({
  widgetId,
  open,
  onOpenChange,
}: {
  widgetId: WidgetId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const meta = widgetMeta(widgetId);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Generate widget-specific tabular data
  const { columns, rows }: { columns: TableColumn[]; rows: TableRow[] } = useMemo(() => {
    switch (widgetId) {
      case "fleet-status":
        return {
          columns: [
            { key: "status", label: "Operating Status" },
            { key: "count", label: "Vehicle Count", align: "right" },
            { key: "pct", label: "Share (%)", align: "right" },
            { key: "telemetry", label: "GPS State", isBadge: true },
          ],
          rows: [
            { status: "Running", count: FLEET_STATUS_DATA.running.count, pct: `${FLEET_STATUS_DATA.running.pct}%`, telemetry: "Moving" },
            { status: "Idle", count: FLEET_STATUS_DATA.idle.count, pct: `${FLEET_STATUS_DATA.idle.pct}%`, telemetry: "Ignition On" },
            { status: "Stopped", count: FLEET_STATUS_DATA.stopped.count, pct: `${FLEET_STATUS_DATA.stopped.pct}%`, telemetry: "Parked" },
            { status: "Inactive", count: FLEET_STATUS_DATA.inactive.count, pct: `${FLEET_STATUS_DATA.inactive.pct}%`, telemetry: "Offline" },
            { status: "No Data", count: FLEET_STATUS_DATA.noData.count, pct: `${FLEET_STATUS_DATA.noData.pct}%`, telemetry: "Unreachable" },
          ],
        };

      case "battery-status":
        return {
          columns: [
            { key: "level", label: "Battery Level Tier" },
            { key: "count", label: "Vehicles", align: "right" },
            { key: "health", label: "Condition", isBadge: true },
          ],
          rows: BATTERY_STATUS_DATA.map((b) => ({
            level: b.level,
            count: b.count,
            health: b.isCharging ? "Optimal (Charging)" : b.count > 5 ? "Critical Low" : "Operational",
          })),
        };

      case "remote-lock-status":
        return {
          columns: [
            { key: "state", label: "Immobilizer State" },
            { key: "count", label: "Vehicles", align: "right" },
            { key: "share", label: "Ratio", align: "right" },
            { key: "status", label: "Health", isBadge: true },
          ],
          rows: [
            { state: "Unlocked (Allowed)", count: REMOTE_LOCK_DATA.unlocked.count, share: `${REMOTE_LOCK_DATA.unlocked.pct}%`, status: "Normal" },
            { state: "Locked (Immobilized)", count: REMOTE_LOCK_DATA.locked.count, share: `${REMOTE_LOCK_DATA.locked.pct}%`, status: "Restricted" },
          ],
        };

      case "alerts-breakdown":
        return {
          columns: [
            { key: "name", label: "Alarm Classification" },
            { key: "count", label: "Total Triggers", align: "right" },
            { key: "severity", label: "Severity Priority", isBadge: true },
          ],
          rows: ALERTS_BREAKDOWN_DATA.map((a) => ({
            name: a.name,
            count: a.count,
            severity: a.count >= 8 ? "High" : a.count >= 4 ? "Medium" : "Low",
          })),
        };

      case "fleet-health":
        return {
          columns: [
            { key: "system", label: "Vehicle Subsystem" },
            { key: "health", label: "Health Score", align: "right" },
            { key: "status", label: "Status Rating", isBadge: true },
          ],
          rows: [
            { system: "Engine Diagnostics", health: `${FLEET_HEALTH_DATA.engine}%`, status: "Optimal" },
            { system: "Battery Voltage", health: `${FLEET_HEALTH_DATA.battery}%`, status: "Warning" },
            { system: "Cooling Circuit", health: `${FLEET_HEALTH_DATA.coolant}%`, status: "Warning" },
            { system: "Fuel Line & Sensors", health: `${FLEET_HEALTH_DATA.fuel}%`, status: "Optimal" },
          ],
        };

      case "component-failure":
        return {
          columns: [
            { key: "component", label: "Component Failure Mode" },
            { key: "alerts", label: "Diagnosed Faults", align: "right" },
            { key: "severity", label: "Service Priority", isBadge: true },
          ],
          rows: COMPONENT_FAILURES.map((c) => ({
            component: c.component,
            alerts: c.alerts,
            severity: c.severity,
          })),
        };

      case "fleet-stress-index":
        return {
          columns: [
            { key: "metric", label: "Stress Metric" },
            { key: "value", label: "Value", align: "right" },
            { key: "status", label: "Status Tier", isBadge: true },
          ],
          rows: [
            { metric: "Current Fleet Stress", value: `${FLEET_STRESS_INDEX.currentScore}/100`, status: FLEET_STRESS_INDEX.level },
            { metric: "Weekly Trend Delta", value: FLEET_STRESS_INDEX.trend, status: "High" },
            { metric: "Minimum Stress (Sunday)", value: FLEET_STRESS_INDEX.minStress, status: "Low" },
            { metric: "Average Fleet Stress", value: FLEET_STRESS_INDEX.avgStress, status: "Medium" },
            { metric: "Peak Stress (Monday)", value: FLEET_STRESS_INDEX.maxStress, status: "Critical" },
          ],
        };

      case "vehicle-status-alerts":
        return {
          columns: [
            { key: "vehicle", label: "Vehicle ID" },
            { key: "engine", label: "Engine", align: "center" },
            { key: "battery", label: "Battery", align: "center" },
            { key: "fuel", label: "Fuel", align: "center" },
            { key: "cooling", label: "Cooling", align: "center" },
          ],
          rows: VEHICLE_STATUS_ALERTS,
        };

      case "gsm-signal-quality":
        return {
          columns: [
            { key: "tier", label: "Cellular Signal Tier" },
            { key: "share", label: "Packet Ratio", align: "right" },
            { key: "status", label: "Telemetry Health", isBadge: true },
          ],
          rows: [
            { tier: "4G / 5G High Speed", share: `${GSM_SIGNAL_DATA.excellent.pct}%`, status: "Excellent" },
            { tier: "3G Standard Speed", share: `${GSM_SIGNAL_DATA.fair.pct}%`, status: "Fair" },
            { tier: "2G / No Signal Zone", share: `${GSM_SIGNAL_DATA.poor.pct}%`, status: "Poor" },
          ],
        };

      case "geo-calibration-alerts":
        return {
          columns: [
            { key: "zone", label: "Geofence Zone" },
            { key: "count", label: "Perimeter Triggers", align: "right" },
            { key: "risk", label: "Risk Level", isBadge: true },
          ],
          rows: GEO_CALIBRATION_DATA.map((z) => ({
            zone: z.zone,
            count: z.count,
            risk: z.count > 30 ? "High" : "Normal",
          })),
        };

      case "engine-efficiency":
        return {
          columns: [
            { key: "band", label: "RPM Operating Band" },
            { key: "ratio", label: "Operating Ratio", align: "right" },
            { key: "status", label: "Engine Health", isBadge: true },
          ],
          rows: [
            { band: "Optimal Green RPM Band", ratio: `${ENGINE_EFFICIENCY_DATA.optimalRpm}%`, status: "Good" },
            { band: "Over-revving / High RPM", ratio: `${ENGINE_EFFICIENCY_DATA.overRevving}%`, status: "Warning" },
            { band: "Idle Run / Stop", ratio: `${100 - ENGINE_EFFICIENCY_DATA.optimalRpm - ENGINE_EFFICIENCY_DATA.overRevving}%`, status: "Neutral" },
          ],
        };

      case "battery-degradation":
        return {
          columns: [
            { key: "period", label: "Replacement Threshold" },
            { key: "count", label: "Vehicle Units", align: "right" },
            { key: "urgency", label: "Urgency", isBadge: true },
          ],
          rows: BATTERY_DEGRADATION_DATA.map((b) => ({
            period: b.period,
            count: b.count,
            urgency: b.period.includes("30") ? "Immediate" : "Scheduled",
          })),
        };

      case "fuel-loss-opportunity":
        return {
          columns: [
            { key: "type", label: "Fuel Drain Category" },
            { key: "volume", label: "Liters Lost", align: "right" },
            { key: "cost", label: "Estimated Expense", align: "right" },
            { key: "recovery", label: "Actionability", isBadge: true },
          ],
          rows: [
            { type: "Preventable Idling & Siphoning", volume: `${Math.round(FUEL_LOSS_OPPORTUNITY.fuelLostLtr * 0.82)} ltr`, cost: "₹5,330", recovery: "Recoverable" },
            { type: "Mechanical Vaporization / Run", volume: `${Math.round(FUEL_LOSS_OPPORTUNITY.fuelLostLtr * 0.18)} ltr`, cost: "₹1,170", recovery: "Normal" },
          ],
        };

      case "job-status":
        return {
          columns: [
            { key: "status", label: "Delivery Job Status" },
            { key: "count", label: "Total Orders", align: "right" },
            { key: "pct", label: "Fulfillment (%)", align: "right" },
            { key: "sla", label: "SLA Tier", isBadge: true },
          ],
          rows: [
            { status: "Completed on Route", count: JOB_DELIVERY_DATA.completed.count, pct: `${JOB_DELIVERY_DATA.completed.pct}%`, sla: "On Time" },
            { status: "Pending / In-Transit", count: JOB_DELIVERY_DATA.pending.count, pct: `${JOB_DELIVERY_DATA.pending.pct}%`, sla: "Active" },
            { status: "Delayed Route", count: JOB_DELIVERY_DATA.delayed.count, pct: `${JOB_DELIVERY_DATA.delayed.pct}%`, sla: "Breached" },
            { status: "Cancelled / Failed", count: JOB_DELIVERY_DATA.cancelled.count, pct: `${JOB_DELIVERY_DATA.cancelled.pct}%`, sla: "Critical" },
          ],
        };

      case "alarm-status-tiles":
        return {
          columns: [
            { key: "label", label: "Alarm Indicator" },
            { key: "count", label: "Active Triggers", align: "right" },
            { key: "status", label: "System State", isBadge: true },
          ],
          rows: ALARM_TILES_DATA.map((t) => ({
            label: t.label,
            count: t.count,
            status: t.status,
          })),
        };

      case "overspeed-alarm":
      case "harsh-cornering-alarm":
      case "ac-freeze-alarm":
      case "high-temp-alarm":
      case "panic-sos-alarm":
      case "collision-alarm": {
        const idKey = widgetId.replace("-alarm", "");
        const tile = ALARM_TILES_DATA.find((t) => t.id === idKey) ?? ALARM_TILES_DATA[0];
        return {
          columns: [
            { key: "metric", label: "Indicator Parameter" },
            { key: "value", label: "Current Value", align: "right" },
            { key: "status", label: "Status State", isBadge: true },
          ],
          rows: [
            { metric: "Alarm Classification", value: tile.label, status: tile.status },
            { metric: "Active Triggers Today", value: tile.count, status: tile.count > 0 ? "Critical Trigger" : "Normal" },
            { metric: "Notification Dispatch", value: "Real-time Push & SMS", status: "Active" },
            { metric: "Sensor Calibration", value: "Auto-synced", status: "Operational" },
          ],
        };
      }

      case "vehicle-type-wise":
        return {
          columns: [
            { key: "type", label: "Chassis & Vehicle Type" },
            { key: "count", label: "Active Units", align: "right" },
            { key: "share", label: "Fleet Share", align: "right" },
          ],
          rows: VEHICLE_TYPE_DATA.types.map((t) => ({
            type: t.name,
            count: t.count,
            share: `${((t.count / 235) * 100).toFixed(1)}%`,
          })),
        };

      case "fleet-metrics-summary":
        return {
          columns: [
            { key: "indicator", label: "Key Performance Indicator" },
            { key: "value", label: "Metric Value", align: "right" },
            { key: "type", label: "Category", isBadge: true },
          ],
          rows: [
            { indicator: "Fleet Operating Efficiency", value: `${OPERATIONAL_METRICS_DATA.fleetEfficiencyPct}%`, type: "Performance" },
            { indicator: "Toll Expenses Paid", value: OPERATIONAL_METRICS_DATA.tollExpenseInr, type: "Expense" },
            { indicator: "CO2 Emissions Saved", value: `${OPERATIONAL_METRICS_DATA.carbonEmissionSavedTons} Tons`, type: "Eco / ESG" },
            { indicator: "Active System Alerts", value: OPERATIONAL_METRICS_DATA.activeAlertsCount, type: "Safety" },
          ],
        };

      case "sos-alerts":
        return {
          columns: [
            { key: "vehicle", label: "Vehicle Plate" },
            { key: "type", label: "Operating Hub" },
            { key: "status", label: "Emergency Trigger" },
            { key: "time", label: "Timestamp", align: "right" },
            { key: "severity", label: "Severity", isBadge: true },
          ],
          rows: SOS_ALERTS_FEED,
        };

      case "alerts-day-time":
        return {
          columns: [
            { key: "day", label: "Day of Week" },
            { key: "alerts", label: "Alert Count", align: "right" },
            { key: "severity", label: "Severity Index", align: "right" },
            { key: "risk", label: "Risk Status", isBadge: true },
          ],
          rows: ALERTS_DAY_TIME.map((d) => ({
            day: d.day,
            alerts: d.alerts,
            severity: d.severity,
            risk: d.severity >= 80 ? "Critical" : d.severity >= 60 ? "High" : "Normal",
          })),
        };

      case "alerts-object-type":
        return {
          columns: [
            { key: "type", label: "Object / Vehicle Category" },
            { key: "count", label: "Alert Volume", align: "right" },
            { key: "severity", label: "Risk Tier", isBadge: true },
          ],
          rows: ALERTS_OBJECT_TYPE,
        };

      case "shift-compliance":
        return {
          columns: [
            { key: "day", label: "Day" },
            { key: "hours", label: "Duty Hours Logged", align: "right" },
            { key: "status", label: "Compliance State", isBadge: true },
          ],
          rows: SHIFT_COMPLIANCE_DATA.dailyTrend.map((d) => ({
            day: d.day,
            hours: `${d.hours} hrs`,
            status: d.hours > 10 ? "Violation" : d.hours >= 8 ? "Optimal" : "Standby",
          })),
        };

      case "risky-drivers":
        return {
          columns: [
            { key: "name", label: "Driver Name" },
            { key: "vehicle", label: "Assigned Unit" },
            { key: "score", label: "Risk Score", align: "right" },
            { key: "level", label: "Risk Level", isBadge: true },
          ],
          rows: [
            { name: "John Smith", vehicle: "V0001", score: 45, level: "High" },
            { name: "Jane Doe", vehicle: "V0014", score: 30, level: "High" },
            { name: "Mike Johnson", vehicle: "V0031", score: 10, level: "Medium" },
            { name: "John Smith 2", vehicle: "V0052", score: 5, level: "Low" },
            { name: "John Smith 3", vehicle: "V0077", score: 2, level: "Low" },
          ],
        };

      case "fleet-score":
        return {
          columns: [
            { key: "metric", label: "Rating Dimension" },
            { key: "score", label: "Fleet Score", align: "right" },
            { key: "benchmark", label: "Benchmark Delta", align: "center", isBadge: true },
            { key: "rating", label: "Rating Tier", isBadge: true },
          ],
          rows: [
            { metric: "Overall Fleet Safety Average", score: 90, benchmark: "+4.3% in 7 days", rating: "Excellent" },
            { metric: "Harsh Driving Score", score: 94, benchmark: "+2.1%", rating: "Excellent" },
            { metric: "Speed Compliance Score", score: 88, benchmark: "+5.0%", rating: "Fair" },
            { metric: "Fatigue & DMS Score", score: 86, benchmark: "-1.2%", rating: "Fair" },
          ],
        };

      case "score-distribution":
        return {
          columns: [
            { key: "bracket", label: "Score Range Bracket" },
            { key: "drivers", label: "Driver Count", align: "right" },
            { key: "share", label: "Percentage (%)", align: "right" },
            { key: "rating", label: "Band Quality", isBadge: true },
          ],
          rows: [
            { bracket: "91 - 100", drivers: 120, share: "17.4%", rating: "Excellent" },
            { bracket: "81 - 90", drivers: 105, share: "15.2%", rating: "Fair" },
            { bracket: "71 - 80", drivers: 85, share: "12.3%", rating: "Fair" },
            { bracket: "61 - 70", drivers: 92, share: "13.3%", rating: "Fair" },
            { bracket: "51 - 60", drivers: 75, share: "10.8%", rating: "Fair" },
            { bracket: "41 - 50", drivers: 45, share: "6.5%", rating: "Poor" },
            { bracket: "31 - 40", drivers: 68, share: "9.8%", rating: "Poor" },
            { bracket: "21 - 30", drivers: 78, share: "11.3%", rating: "Poor" },
            { bracket: "11 - 20", drivers: 32, share: "4.6%", rating: "Critical" },
            { bracket: "0 - 10", drivers: 42, share: "6.1%", rating: "Critical" },
          ],
        };

      case "camera-status":
        return {
          columns: [
            { key: "status", label: "Camera State" },
            { key: "count", label: "Units Online", align: "right" },
            { key: "pct", label: "Operational Share", align: "right" },
            { key: "health", label: "Hardware State", isBadge: true },
          ],
          rows: [
            { status: "Online / Streaming", count: 44, pct: "44%", health: "Active" },
            { status: "Offline / No Signal", count: 36, pct: "36%", health: "Disconnected" },
            { status: "Video Loss / Tampered", count: 20, pct: "20%", health: "Alert" },
          ],
        };

      default:
        return {
          columns: [
            { key: "name", label: "Item" },
            { key: "value", label: "Value", align: "right" },
          ],
          rows: [
            { name: "Total Monitored", value: "100%" },
            { name: "Active Telemetry", value: "Verified" },
          ],
        };
    }
  }, [widgetId]);

  // Search filtering
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((val) => String(val).toLowerCase().includes(term)),
    );
  }, [rows, searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  // CSV Export
  const exportCSV = () => {
    const headers = columns.map((c) => `"${c.label}"`).join(",");
    const csvRows = filteredRows.map((r) =>
      columns.map((c) => `"${r[c.key] ?? ""}"`).join(","),
    );
    const content = [headers, ...csvRows].join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${widgetId}-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV successfully");
  };

  // XLS Export
  const exportXLS = () => {
    const headers = columns.map((c) => `<th>${c.label}</th>`).join("");
    const tableRows = filteredRows
      .map(
        (r) =>
          `<tr>${columns.map((c) => `<td>${r[c.key] ?? ""}</td>`).join("")}</tr>`,
      )
      .join("");
    const html = `<html><head><meta charset="utf-8"/></head><body><table><thead><tr>${headers}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${widgetId}-export.xls`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported XLS successfully");
  };

  // PDF Export
  const exportPDF = () => {
    window.print();
    toast.success("Print dialog opened for PDF export");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-6 z-50">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
          <div>
            <DialogTitle className="text-base font-bold text-foreground">
              {meta.title} — Data Details
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Exact tabular records extracted from dashboard telemetry.
            </p>
          </div>
        </DialogHeader>

        {/* Toolbar: Search input + Export Dropdown */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="h-3.5 w-3.5 text-[#0089FF]" />
                <span>Export</span>
                <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 text-xs p-1">
              <DropdownMenuItem onClick={exportCSV} className="cursor-pointer">
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportXLS} className="cursor-pointer">
                Export XLS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportPDF} className="cursor-pointer">
                Export PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table View */}
        <div className="rounded-lg border border-border/80 overflow-hidden mt-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/40 border-b border-border/80 text-muted-foreground">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={cn(
                      "py-2.5 px-3 font-semibold",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                    )}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-8 text-center text-xs text-muted-foreground"
                  >
                    No matching records found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {columns.map((c) => {
                      const val = row[c.key];
                      if (c.isBadge) {
                        const str = String(val);
                        const isPos =
                          str.includes("Optimal") ||
                          str.includes("Low") ||
                          str.includes("Normal") ||
                          str.includes("Excellent") ||
                          str.includes("Active") ||
                          str.includes("On Time") ||
                          str.includes("Recoverable");
                        const isNeg =
                          str.includes("Critical") ||
                          str.includes("High") ||
                          str.includes("Violation") ||
                          str.includes("Breached") ||
                          str.includes("Alert") ||
                          str.includes("Restricted");
                        return (
                          <td
                            key={c.key}
                            className={cn(
                              "py-2 px-3",
                              c.align === "right" && "text-right",
                              c.align === "center" && "text-center",
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block px-2 py-0.5 rounded text-[10.5px] font-bold font-mono",
                                isPos
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : isNeg
                                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                              )}
                            >
                              {str}
                            </span>
                          </td>
                        );
                      }
                      return (
                        <td
                          key={c.key}
                          className={cn(
                            "py-2 px-3 text-foreground",
                            c.align === "right" && "text-right font-mono",
                            c.align === "center" && "text-center",
                          )}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3">
          <span>
            Showing{" "}
            <strong className="text-foreground">
              {filteredRows.length > 0 ? (page - 1) * pageSize + 1 : 0}
            </strong>{" "}
            to{" "}
            <strong className="text-foreground">
              {Math.min(page * pageSize, filteredRows.length)}
            </strong>{" "}
            of <strong className="text-foreground">{filteredRows.length}</strong>{" "}
            entries
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono text-xs px-2">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
