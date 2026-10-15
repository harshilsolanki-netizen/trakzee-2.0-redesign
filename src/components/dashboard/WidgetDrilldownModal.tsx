import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Truck,
  Car,
  Wifi,
  Lock,
  Unlock,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface DrilldownVehicle {
  id: string;
  plate: string;
  name: string;
  model?: string;
  driver: string;
  driverPhone?: string;
  status: string;
  speed: number;
  location: string;
  updatedAt: string;
  fuel?: number;
  battery?: number;
  note?: string;
}

export interface WidgetDrilldownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetTitle: string;
  category: string;
  color: string;
  count: number | string;
  pct?: string | number;
  vehicles: DrilldownVehicle[];
}

export function WidgetDrilldownModal({
  open,
  onOpenChange,
  widgetTitle,
  category,
  color,
  count,
  pct,
  vehicles,
}: WidgetDrilldownModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Filtered vehicles based on search
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return vehicles;
    const term = searchTerm.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.plate.toLowerCase().includes(term) ||
        v.name.toLowerCase().includes(term) ||
        v.driver.toLowerCase().includes(term) ||
        v.location.toLowerCase().includes(term) ||
        (v.model && v.model.toLowerCase().includes(term)),
    );
  }, [vehicles, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleExportCSV = () => {
    const headers = ["Vehicle ID", "Plate", "Model", "Driver", "Status", "Speed (km/h)", "Location", "Last Update"];
    const rows = filtered.map((v) => [
      v.id,
      v.plate,
      v.name,
      v.driver,
      v.status,
      v.speed,
      `"${v.location.replace(/"/g, '""')}"`,
      v.updatedAt,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${widgetTitle.toLowerCase().replace(/\s+/g, "_")}_${category.toLowerCase()}_vehicles.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filtered.length} ${category} vehicles to CSV`);
  };

  const handleTrackLive = (plate: string) => {
    toast.info(`Opening Live Tracking for ${plate}`, {
      description: "Redirecting to tracking radar view...",
    });
    window.location.href = "/tracking";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden rounded-2xl border border-border/80 shadow-2xl bg-card">
        {/* Header */}
        <div className="p-5 border-b border-border/70 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-3">
              <span
                className="h-4 w-4 rounded-full ring-4 ring-black/5 dark:ring-white/10 shrink-0"
                style={{ backgroundColor: color }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base font-bold text-foreground">
                    {widgetTitle} · {category}
                  </DialogTitle>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {count} {typeof count === "number" ? "Objects" : ""}
                    {pct ? ` (${pct}%)` : ""}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Detailed vehicle roster currently categorized under <strong className="text-foreground">{category}</strong>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.info(`Tracking all ${category} vehicles on live map`);
                  window.location.href = "/tracking";
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-white" />
                <span>Track on Map</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mt-4">
            <div className="flex h-9 items-center gap-2 rounded-lg border border-input/80 bg-background px-3 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder={`Search ${category} vehicles by plate, driver, location or model...`}
                className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Table */}
        <div className="max-h-[380px] min-h-[220px] overflow-y-auto divide-y divide-border/50">
          {paginated.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/40 sticky top-0 z-10 border-b border-border/60 text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none">
                <tr>
                  <th className="py-2.5 px-4">Vehicle / Asset</th>
                  <th className="py-2.5 px-4">Driver</th>
                  <th className="py-2.5 px-4">Speed</th>
                  <th className="py-2.5 px-4">Location</th>
                  <th className="py-2.5 px-4">Last Ping</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {paginated.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 border border-border/50">
                          <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono font-bold text-foreground block truncate">
                            {v.plate}
                          </span>
                          <span className="text-[11px] text-muted-foreground block truncate">
                            {v.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-4">
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground block truncate">
                          {v.driver}
                        </span>
                        {v.driverPhone && (
                          <span className="text-[11px] font-mono text-muted-foreground block">
                            {v.driverPhone}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "font-mono font-bold px-2 py-0.5 rounded text-[11px]",
                          v.speed > 0
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {v.speed} km/h
                      </span>
                    </td>

                    <td className="py-2.5 px-4 max-w-[200px]">
                      <span className="text-[11px] text-muted-foreground truncate block" title={v.location}>
                        {v.location}
                      </span>
                    </td>

                    <td className="py-2.5 px-4 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                      {v.updatedAt}
                    </td>

                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTrackLive(v.plate)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#0089FF] hover:bg-[#0089FF]/10 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Track</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Search className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-xs font-semibold text-foreground">No vehicles found</p>
              <p className="text-[11px]">No vehicles match "{searchTerm}". Try a different search.</p>
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        <div className="p-3.5 border-t border-border/70 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{paginated.length}</strong> of{" "}
            <strong className="text-foreground">{filtered.length}</strong> vehicles
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-md border border-border/80 bg-background hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono font-semibold text-foreground text-[11px]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md border border-border/80 bg-background hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
