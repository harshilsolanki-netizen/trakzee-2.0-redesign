import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Fuel, X } from "lucide-react";
import {
  INITIAL_FUEL_VEHICLES,
  type FuelVehicle,
  getFuelStatus,
} from "@/data/fuelDashboardData";
import { FuelVehicleCard } from "./FuelVehicleCard";
import { FuelDashboardHeader } from "./FuelDashboardHeader";
import {
  FuelFilterDrawer,
  DEFAULT_FUEL_FILTERS,
  type FuelFilterState,
} from "./FuelFilterDrawer";
import { FuelChartModal } from "./FuelChartModal";
import { FuelDetailModal } from "./FuelDetailModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function FuelDashboardPage() {
  const [vehicles, setVehicles] = useState<FuelVehicle[]>(
    INITIAL_FUEL_VEHICLES
  );
  const [filters, setFilters] = useState<FuelFilterState>(
    DEFAULT_FUEL_FILTERS
  );
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Pagination state: strictly 6 cards per view
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Modals state
  const [selectedChartVehicle, setSelectedChartVehicle] =
    useState<FuelVehicle | null>(null);
  const [selectedDetailVehicle, setSelectedDetailVehicle] =
    useState<FuelVehicle | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Available branches
  const availableBranches = useMemo(() => {
    const set = new Set<string>();
    INITIAL_FUEL_VEHICLES.forEach((v) => set.add(v.branch));
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
    if (filters.fuelType !== "all") count++;
    if (filters.ignition !== "all") count++;
    if (filters.branches.length > 0) count += filters.branches.length;
    if (filters.sortBy !== "fuel-desc") count++;
    return count;
  }, [filters]);

  // Auto-refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          const delta = (Math.random() - 0.5) * 2;
          const updatedFuel = Math.max(
            5,
            Math.min(v.capacity, Math.round(v.currentFuel + delta))
          );
          return {
            ...v,
            currentFuel: updatedFuel,
          };
        })
      );
      setIsRefreshing(false);
      toast.success("Fuel telemetry refreshed", {
        description: "Received latest digital capacitive probe readings.",
      });
    }, 500);
  };

  // Filtered and sorted vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        const st = getFuelStatus(v.currentFuel, v.capacity).status;

        // Status filter
        if (filters.status.length > 0 && !filters.status.includes(st)) {
          return false;
        }

        // Fuel type filter
        if (filters.fuelType !== "all" && v.fuelType !== filters.fuelType) {
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
          if (!matchesName && !matchesPlate && !matchesAddress) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "fuel-desc") return b.currentFuel - a.currentFuel;
        if (filters.sortBy === "fuel-asc") return a.currentFuel - b.currentFuel;
        if (filters.sortBy === "name") return a.name.localeCompare(b.name);
        if (filters.sortBy === "speed-desc") return b.speed - a.speed;
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
      <FuelDashboardHeader
        onOpenFilter={() => setFilterDrawerOpen(true)}
        filterOpen={filterDrawerOpen}
        activeFilterCount={activeFilterCount}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalVehicles={vehicles.length}
      />

      {/* 2. Main Content Container */}
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
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 capitalize"
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
              {filters.fuelType !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                  Fuel: {filters.fuelType}
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, fuelType: "all" }))
                    }
                    className="hover:text-slate-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
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
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_FUEL_FILTERS)}
                className="text-[11px] text-[#0089FF] hover:underline font-semibold ml-1 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Cards Grid or Table */}
          {filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center flex-1">
              <Fuel className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                No fuel telemetry matches your filters
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Try resetting or clearing your active filters.
              </p>
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_FUEL_FILTERS)}
                className="mt-4 px-4 py-2 rounded-xl bg-[#0089FF] text-white text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Responsive Grid: strictly 3 cards per row, 2 rows (6 cards total) fitting without scrolling */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-2.5 sm:gap-3 flex-1 min-h-0">
              {currentVehicles.map((vehicle) => (
                <FuelVehicleCard
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
                    <th className="py-2.5 px-4">Ignition</th>
                    <th className="py-2.5 px-4">Fuel Type</th>
                    <th className="py-2.5 px-4">Current Level</th>
                    <th className="py-2.5 px-4">Percentage</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Est. Range</th>
                    <th className="py-2.5 px-4">Speed</th>
                    <th className="py-2.5 px-4">Location</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentVehicles.map((vehicle) => {
                    const { color, label, badgeBg } = getFuelStatus(
                      vehicle.currentFuel,
                      vehicle.capacity
                    );
                    const pct = (
                      (vehicle.currentFuel / vehicle.capacity) *
                      100
                    ).toFixed(1);

                    return (
                      <tr
                        key={vehicle.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-100">
                          {vehicle.name}
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold",
                              vehicle.ignition
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-rose-500/10 text-rose-600"
                            )}
                          >
                            {vehicle.ignition ? "ON" : "OFF"}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">
                          {vehicle.fuelType}
                        </td>
                        <td
                          className="py-2.5 px-4 font-mono font-bold text-sm"
                          style={{ color }}
                        >
                          {vehicle.currentFuel}{" "}
                          <span className="text-xs font-normal text-slate-400">
                            /{vehicle.capacity}L
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-200">
                          {pct}%
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
                        <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                          ~{vehicle.estimatedRangeKm} km
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                          {vehicle.speed} kmph
                        </td>
                        <td
                          className="py-2.5 px-4 text-slate-500 max-w-xs truncate"
                          title={vehicle.address}
                        >
                          {vehicle.address}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedChartVehicle(vehicle)}
                            className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-[#0089FF] hover:bg-blue-50 dark:hover:bg-slate-800 font-medium cursor-pointer mr-1.5"
                          >
                            Trends
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedDetailVehicle(vehicle)}
                            className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
                          >
                            Specs
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

      {/* 3. Filter Drawer */}
      <FuelFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApply={(next) => setFilters(next)}
        availableBranches={availableBranches}
      />

      {/* 4. Modals */}
      {selectedChartVehicle && (
        <FuelChartModal
          vehicle={selectedChartVehicle}
          onClose={() => setSelectedChartVehicle(null)}
        />
      )}
      {selectedDetailVehicle && (
        <FuelDetailModal
          vehicle={selectedDetailVehicle}
          onClose={() => setSelectedDetailVehicle(null)}
        />
      )}
    </div>
  );
}
