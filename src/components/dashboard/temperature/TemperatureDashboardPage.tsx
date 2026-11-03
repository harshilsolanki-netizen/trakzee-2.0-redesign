import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Thermometer, X } from "lucide-react";
import {
  INITIAL_TEMPERATURE_VEHICLES,
  type TemperatureVehicle,
  getTemperatureStatus,
} from "@/data/temperatureDashboardData";
import { TemperatureVehicleCard } from "./TemperatureVehicleCard";
import { TemperatureDashboardHeader } from "./TemperatureDashboardHeader";
import {
  TemperatureFilterDrawer,
  DEFAULT_TEMPERATURE_FILTERS,
  type TemperatureFilterState,
} from "./TemperatureFilterDrawer";
import { TemperatureChartModal } from "./TemperatureChartModal";
import { TemperatureDetailModal } from "./TemperatureDetailModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function TemperatureDashboardPage() {
  const [vehicles, setVehicles] = useState<TemperatureVehicle[]>(
    INITIAL_TEMPERATURE_VEHICLES
  );
  const [filters, setFilters] = useState<TemperatureFilterState>(
    DEFAULT_TEMPERATURE_FILTERS
  );
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Pagination state: strictly 6 cards per view
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Modals state
  const [selectedChartVehicle, setSelectedChartVehicle] =
    useState<TemperatureVehicle | null>(null);
  const [selectedDetailVehicle, setSelectedDetailVehicle] =
    useState<TemperatureVehicle | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Available branches
  const availableBranches = useMemo(() => {
    const set = new Set<string>();
    INITIAL_TEMPERATURE_VEHICLES.forEach((v) => set.add(v.branch));
    return Array.from(set);
  }, []);

  // Reset to page 1 on filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count++;
    if (filters.status.length > 0) count += filters.status.length;
    if (filters.ignition !== "all") count++;
    if (filters.branches.length > 0) count += filters.branches.length;
    if (filters.sortBy !== "temp-desc") count++;
    return count;
  }, [filters]);

  // Auto-refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          const delta = (Math.random() - 0.5) * 0.4;
          const updatedSensors = v.sensors.map((s) => ({
            ...s,
            temperature: Math.round((s.temperature + delta) * 10) / 10,
          }));
          return {
            ...v,
            sensors: updatedSensors,
          };
        })
      );
      setIsRefreshing(false);
      toast.success("Telemetry refreshed", {
        description: "Received latest BLE temperature & humidity readings.",
      });
    }, 500);
  };

  // Filtered and sorted vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        const activeSensor = v.sensors[0];
        const st = getTemperatureStatus(activeSensor.temperature).status;

        // Status filter
        if (filters.status.length > 0 && !filters.status.includes(st)) {
          return false;
        }

        // Ignition filter
        if (filters.ignition === "on" && !v.ignition) return false;
        if (filters.ignition === "off" && v.ignition) return false;

        // Branch filter
        if (
          filters.branches.length > 0 &&
          !filters.branches.includes(v.branch)
        ) {
          return false;
        }

        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesName = v.name.toLowerCase().includes(q);
          const matchesPlate = v.plateNumber.toLowerCase().includes(q);
          const matchesAddress = v.address.toLowerCase().includes(q);
          const matchesSensor = v.sensors.some((s) =>
            s.name.toLowerCase().includes(q)
          );
          if (!matchesName && !matchesPlate && !matchesAddress && !matchesSensor) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const tempA = a.sensors[0].temperature;
        const tempB = b.sensors[0].temperature;
        if (filters.sortBy === "temp-desc") return tempB - tempA;
        if (filters.sortBy === "temp-asc") return tempA - tempB;
        if (filters.sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [vehicles, filters]);

  // Pagination calculation
  const totalPages = Math.max(
    1,
    Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE)
  );
  const currentVehicles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVehicles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVehicles, currentPage]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F1F5F9] dark:bg-slate-950">
      {/* 1. Page Header (Single Screen - Clean Theme Title & Actions) */}
      <TemperatureDashboardHeader
        onOpenFilter={() => setFilterDrawerOpen(true)}
        filterOpen={filterDrawerOpen}
        activeFilterCount={activeFilterCount}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalVehicles={vehicles.length}
      />

      {/* 2. Main Content Container matching Fleet Safety Dashboard layout */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900">
        <div className="flex-1 min-h-0 p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden">
          {/* Active filter badges if any are applied */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mb-2 px-1 py-0.5 overflow-x-auto text-xs select-none shrink-0">
              <span className="text-[11px] font-semibold text-slate-500">
                Active Filters:
              </span>
              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[11px] font-medium border border-blue-200 dark:border-blue-900">
                  Search: &ldquo;{filters.searchQuery}&rdquo;
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, searchQuery: "" }))
                    }
                    className="hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.status.map((st) => (
                <span
                  key={st}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700"
                >
                  Status: {st}
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        status: prev.status.filter((x) => x !== st),
                      }))
                    }
                    className="hover:text-slate-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {filters.ignition !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                  Ignition: {filters.ignition.toUpperCase()}
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, ignition: "all" }))
                    }
                    className="hover:text-slate-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.branches.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700"
                >
                  {b}
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        branches: prev.branches.filter((x) => x !== b),
                      }))
                    }
                    className="hover:text-slate-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_TEMPERATURE_FILTERS)}
                className="text-[11px] text-[#0089FF] hover:underline font-semibold ml-1 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Cards Grid or Table */}
          {filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center flex-1">
              <Thermometer className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                No temperature telemetry matches your filters
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Try resetting or clearing your active filters.
              </p>
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_TEMPERATURE_FILTERS)}
                className="mt-4 px-4 py-2 rounded-xl bg-[#0089FF] text-white text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Responsive Grid: strictly 3 cards per row, 2 rows (6 cards total) fitting without scrolling */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-3 flex-1 min-h-0">
              {currentVehicles.map((vehicle) => (
                <TemperatureVehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onOpenChart={(v) => setSelectedChartVehicle(v)}
                  onOpenDetail={(v) => setSelectedDetailVehicle(v)}
                />
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="rounded-xl border border-[#DFE3EB]/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-auto shadow-2xs flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 font-semibold text-slate-600 dark:text-slate-400 sticky top-0">
                    <th className="py-2.5 px-4">Vehicle</th>
                    <th className="py-2.5 px-4">Ports</th>
                    <th className="py-2.5 px-4">Equipment</th>
                    <th className="py-2.5 px-4">Primary Sensor</th>
                    <th className="py-2.5 px-4">Temperature</th>
                    <th className="py-2.5 px-4">Min / Max</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Humidity</th>
                    <th className="py-2.5 px-4">Location</th>
                    <th className="py-2.5 px-4">Last Updated</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentVehicles.map((vehicle) => {
                    const sensor = vehicle.sensors[0];
                    const { color, label, badgeBg } = getTemperatureStatus(
                      sensor.temperature
                    );
                    return (
                      <tr
                        key={vehicle.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-100">
                          {vehicle.name}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-[#0089FF] font-mono">
                            {vehicle.sensors.length} Ports
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1 font-mono text-[9.5px]">
                            <span className={vehicle.ignition ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                              IGN
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className={vehicle.chiller ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                              CHL
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className={vehicle.door === "closed" ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                              DOR
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className={vehicle.ac ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                              AC
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">
                          {sensor.name}
                        </td>
                        <td
                          className="py-2.5 px-4 font-mono font-bold text-sm"
                          style={{ color }}
                        >
                          {sensor.temperature} °C
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[11px]">
                          <span className="text-emerald-500 font-bold">{vehicle.minTemp}°</span>
                          <span className="text-slate-400 mx-1">/</span>
                          <span className="text-rose-500 font-bold">{vehicle.maxTemp}°</span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                              badgeBg
                            )}
                          >
                            {label}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                          {vehicle.humidity} %RH
                        </td>
                        <td
                          className="py-2.5 px-4 text-slate-500 max-w-xs truncate"
                          title={vehicle.address}
                        >
                          {vehicle.address}
                        </td>
                        <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                          {vehicle.lastUpdated}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedChartVehicle(vehicle)}
                            className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-[#0089FF] hover:bg-blue-50 dark:hover:bg-slate-800 font-medium cursor-pointer mr-1.5"
                          >
                            Chart
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedDetailVehicle(vehicle)}
                            className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 3. Bottom Pagination Bar: theme-compliant centered pagination */}
        <div className="flex h-[38px] min-h-[38px] items-center justify-between border-t border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs text-slate-500 shrink-0 select-none">
          {/* Left section: vehicle count */}
          <div className="flex flex-1 items-center justify-start min-w-[140px]">
            <span className="font-medium text-slate-600 dark:text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {filteredVehicles.length === 0
                  ? 0
                  : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                –{Math.min(currentPage * ITEMS_PER_PAGE, filteredVehicles.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {filteredVehicles.length}
              </span>{" "}
              vehicles
            </span>
          </div>

          {/* Center section: Theme-compliant pagination */}
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 shrink-0">
            {/* Prev Button */}
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors px-1.5 py-1 rounded"
            >
              <ChevronLeft className="h-3.5 w-3.5 stroke-[2.2]" />
              <span>Prev</span>
            </button>

            {/* Page number pills */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "h-6 min-w-[24px] px-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center",
                      isActive
                        ? "border border-slate-400 dark:border-slate-500 bg-transparent text-slate-900 dark:text-white font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors px-1.5 py-1 rounded"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5 stroke-[2.2]" />
            </button>
          </div>

          {/* Right section: flex-1 spacer for symmetric alignment */}
          <div className="flex flex-1 items-center justify-end min-w-[140px]" />
        </div>
      </div>

      {/* 3. Dashboard Filter Drawer according to our theme */}
      <TemperatureFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApply={(next) => setFilters(next)}
        availableBranches={availableBranches}
      />

      {/* 4. Interactive Modals */}
      {selectedChartVehicle && (
        <TemperatureChartModal
          vehicle={selectedChartVehicle}
          onClose={() => setSelectedChartVehicle(null)}
        />
      )}
      {selectedDetailVehicle && (
        <TemperatureDetailModal
          vehicle={selectedDetailVehicle}
          onClose={() => setSelectedDetailVehicle(null)}
        />
      )}
    </div>
  );
}
