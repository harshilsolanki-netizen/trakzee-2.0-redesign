import type { TravelRow } from "@/data/fleet";

export type ExportFormat = "XLS" | "PDF" | "CSV";
export type ExportScope = "summary" | "detail";

const SUMMARY_HEADERS = [
  "Company",
  "Vehicle No",
  "Driver",
  "Distance (km)",
  "Running",
  "Idle",
  "Stop",
  "Avg Speed",
  "Max Speed",
  "Toll Cost",
  "Alerts",
];

const DETAIL_HEADERS = [
  "Vehicle No",
  "Date",
  "First Ignition On",
  "Start Location",
  "Distance (km)",
  "Running",
  "Idle",
  "Stop",
  "Alerts",
  "Last Ignition On",
  "End Location",
];

const cell = (value: string | number) => {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const toCsv = (rows: (string | number)[][]) =>
  rows.map((r) => r.map(cell).join(",")).join("\n");

export function buildReportCsv(rows: TravelRow[], scope: ExportScope) {
  const lines: (string | number)[][] = [SUMMARY_HEADERS];
  for (const r of rows) {
    lines.push([
      r.company,
      r.vehicleNo,
      r.driver,
      r.distance.toFixed(2),
      r.running,
      r.idle,
      r.stop,
      r.avgSpeed,
      r.maxSpeed,
      r.tollCost,
      r.alerts,
    ]);
  }
  if (scope === "detail") {
    lines.push([]);
    lines.push(["Trip details"]);
    lines.push(DETAIL_HEADERS);
    for (const r of rows) {
      for (const t of r.trips) {
        lines.push([
          r.vehicleNo,
          t.date,
          t.firstIgnitionOn,
          t.startLocation,
          t.distance.toFixed(2),
          t.running,
          t.idle,
          t.stop,
          t.alerts,
          t.lastIgnitionOn,
          t.endLocation,
        ]);
      }
    }
  }
  return toCsv(lines);
}

/** Triggers a client-side file download for the generated report. */
export function downloadReport(
  rows: TravelRow[],
  format: ExportFormat,
  scope: ExportScope,
) {
  const csv = buildReportCsv(rows, scope);
  const name = `travel-summary-${scope}.${format === "CSV" ? "csv" : format.toLowerCase()}`;
  const mime =
    format === "CSV"
      ? "text/csv;charset=utf-8"
      : format === "XLS"
        ? "application/vnd.ms-excel"
        : "text/plain;charset=utf-8";
  if (typeof window === "undefined") return name;
  const url = URL.createObjectURL(new Blob([csv], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return name;
}
