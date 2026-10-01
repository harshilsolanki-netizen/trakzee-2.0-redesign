import { useEffect, useMemo, useState } from "react";
import { FleetExplorerPanel } from "@/components/tracking/FleetExplorerPanel";
import { LiveTrackingMap } from "@/components/tracking/LiveTrackingMap";
import { VehicleTelemetryDrawer } from "@/components/tracking/VehicleTelemetryDrawer";
import { RoutePlaybackBar } from "@/components/tracking/RoutePlaybackBar";
import { LiveDashcamModal } from "@/components/tracking/LiveDashcamModal";
import { AddVehiclePage } from "@/components/tracking/AddVehiclePage";
import {
  ObjectColumnSettingsModal,
  DEFAULT_COLUMNS,
} from "@/components/tracking/ObjectColumnSettingsModal";
import { fleetObjects, type FleetObject } from "@/data/fleet";
import { useZio } from "@/zio/ZioContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Navigation } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";


export function TrackingPage() {
  const navigate = useNavigate();
  const [vehiclesList, setVehiclesList] = useState<FleetObject[]>(fleetObjects);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleIdState] = useState<
    string | null
  >(null);
  const [checkedVehicleIds, setCheckedVehicleIds] = useState<string[]>(
    fleetObjects.map((v) => v.id),
  );
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isTelemetryDrawerOpen, setIsTelemetryDrawerOpen] = useState(false);
  const [isHealthTelemetryOnly, setIsHealthTelemetryOnly] = useState(false);
  const [playbackOpen, setPlaybackOpen] = useState(false);
  const [playbackTimeframe, setPlaybackTimeframe] = useState("Today");
  const [dashcamVehicle, setDashcamVehicle] = useState<FleetObject | null>(
    null,
  );
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);

  const { setSelectedVehicleId } = useZio();

  // Sync selected vehicle with Zio AI Assistant context
  useEffect(() => {
    if (selectedVehicleId) {
      setSelectedVehicleId(selectedVehicleId);
    }
  }, [selectedVehicleId, setSelectedVehicleId]);

  const selectedVehicle = selectedVehicleId
    ? (fleetObjects.find((v) => v.id === selectedVehicleId) ?? null)
    : null;

  const checkedVehicles = fleetObjects.filter((v) =>
    checkedVehicleIds.includes(v.id),
  );

  // Checkbox toggle handlers
  const handleToggleCheckVehicle = (id: string) => {
    setCheckedVehicleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleToggleCheckGroup = (ids: string[]) => {
    const allIn = ids.every((id) => checkedVehicleIds.includes(id));
    setCheckedVehicleIds((prev) =>
      allIn
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])],
    );
  };

  const handleToggleCheckAll = () => {
    const allIn = fleetObjects.every((v) => checkedVehicleIds.includes(v.id));
    setCheckedVehicleIds(allIn ? [] : fleetObjects.map((v) => v.id));
  };

  const handleTraceVehicle = (v: FleetObject) => {
    setSelectedVehicleIdState(v.id);
    toast.success("Centering map on " + v.name, {
      description: "Current Speed: " + v.speed + " km/h · Branch: " + v.branch,
    });
  };

  const DEFAULT_PANEL_WIDTH = 630;
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const panelWidth = customWidth ?? DEFAULT_PANEL_WIDTH;

  // Global mousemove and mouseup listeners when cursor drag resizing
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      // 12px is the left padding from screen edge
      const newWidth = Math.max(380, Math.min(1100, e.clientX - 12));
      setCustomWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleOpenPlayback = (tf?: string) => {
    if (tf) setPlaybackTimeframe(tf);
    if (!selectedVehicleId && vehiclesList.length > 0) {
      setSelectedVehicleIdState(vehiclesList[0].id);
    }
    setPlaybackOpen(true);
    setIsLeftPanelOpen(false);
    setIsTelemetryDrawerOpen(false);
  };

  const handleClosePlayback = () => {
    setPlaybackOpen(false);
    setIsLeftPanelOpen(true);
  };

  if (isAddVehicleOpen) {
    return (
      <AddVehiclePage
        onBack={() => setIsAddVehicleOpen(false)}
        onSaveVehicle={(newObj) => {
          setVehiclesList((prev) => [newObj, ...prev]);
          setSelectedVehicleIdState(newObj.id);
          setCheckedVehicleIds((prev) => [...prev, newObj.id]);
        }}
      />
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden select-none bg-background">
      {/* 1. Fullscreen Interactive GIS Map Canvas (Full Bleed Background) */}
      <div className="absolute inset-0 z-0">
        <LiveTrackingMap
          selectedVehicle={selectedVehicle}
          checkedVehicles={checkedVehicles}
          onOpenPlayback={handleOpenPlayback}
          isLeftPanelOpen={isLeftPanelOpen}
          leftPanelWidth={panelWidth}
          isTelemetryDrawerOpen={isTelemetryDrawerOpen}
          onToggleTelemetryDrawer={() =>
            setIsTelemetryDrawerOpen((prev) => !prev)
          }
          onSelectVehicle={(id) => setSelectedVehicleIdState(id)}
          className="h-full w-full rounded-none border-0 shadow-none"
        />
      </div>

      {/* 2. Left Floating Fleet Explorer Panel */}
      {isLeftPanelOpen ? (
        <div className="absolute top-2.5 bottom-2.5 left-2.5 z-10 flex flex-col pointer-events-none">
          <FleetExplorerPanel
            vehicles={vehiclesList}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={(id) => setSelectedVehicleIdState(id)}
            checkedVehicleIds={checkedVehicleIds}
            onToggleCheckVehicle={handleToggleCheckVehicle}
            onToggleCheckGroup={handleToggleCheckGroup}
            onToggleCheckAll={handleToggleCheckAll}
            onOpenDashcam={(v) => setDashcamVehicle(v)}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onOpenTelemetry={(v, isHealthOnly) => {
              setSelectedVehicleIdState(v.id);
              setIsHealthTelemetryOnly(!!isHealthOnly);
              setIsTelemetryDrawerOpen(true);
            }}
            onTraceVehicle={handleTraceVehicle}
            onOpenAddVehicle={() => navigate({ to: "/setting", search: { action: "add" } })}
            onToggleCollapse={() => setIsLeftPanelOpen(false)}
            selectedColumns={selectedColumns}
            onStartResize={() => setIsResizing(true)}
            onResetWidth={() => setCustomWidth(null)}
            style={{ width: `${panelWidth}px` }}
            className={cn(
              "relative h-full shadow-2xl pointer-events-auto border-[#DFE3EB] dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl animate-in slide-in-from-left-4 duration-200",
              isResizing
                ? "transition-none select-none cursor-col-resize"
                : "transition-[width,max-width,transform] duration-300 ease-in-out",
            )}
          />
        </div>
      ) : (
        <div className="absolute left-0 top-3 z-30 animate-in slide-in-from-left duration-200">
          <button
            type="button"
            onClick={() => setIsLeftPanelOpen(true)}
            className="flex h-10 w-5 items-center justify-center rounded-r-xl border border-l-0 border-[#DFE3EB] dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-600 dark:text-slate-300 shadow-md hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#0089FF] dark:hover:text-[#0089FF] transition-all cursor-pointer active:scale-95"
            title="Expand Fleet Explorer"
          >
            <ChevronRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* 3. Right Floating Vehicle Telemetry & Diagnostics Drawer */}
      {isTelemetryDrawerOpen && selectedVehicle && (
        <div className="absolute top-2.5 bottom-2.5 right-2.5 z-10 flex flex-col pointer-events-none animate-in slide-in-from-right-4 duration-200">
          <VehicleTelemetryDrawer
            vehicle={selectedVehicle}
            onClose={() => setIsTelemetryDrawerOpen(false)}
            onSelectVehicle={(id) => setSelectedVehicleIdState(id)}
            allVehicles={fleetObjects}
            onOpenPlayback={() => handleOpenPlayback()}
            isHealthOnly={isHealthTelemetryOnly}
            className="w-[220px] sm:w-[220px] h-full pointer-events-auto bg-transparent border-0 shadow-none"
          />
        </div>
      )}

      {/* 4. Floating Route Playback Bar (when active) */}
      {playbackOpen && selectedVehicle && (
        <RoutePlaybackBar
          vehicle={selectedVehicle}
          allVehicles={fleetObjects}
          timeframe={playbackTimeframe}
          onSelectVehicle={(v) => setSelectedVehicleIdState(v.id)}
          onClose={handleClosePlayback}
        />
      )}

      {/* 5. Live Multi-Channel Dashcam Video Streaming Modal */}
      {dashcamVehicle && (
        <LiveDashcamModal
          vehicle={dashcamVehicle}
          onClose={() => setDashcamVehicle(null)}
        />
      )}

      {/* 6. Object Display & Columns Customization Settings Modal */}
      <ObjectColumnSettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        selectedColumns={selectedColumns}
        onSaveColumns={setSelectedColumns}
      />
    </div>
  );
}
