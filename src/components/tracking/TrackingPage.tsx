import { useEffect, useState } from "react";
import { FleetExplorerPanel } from "@/components/tracking/FleetExplorerPanel";
import { LiveTrackingMap } from "@/components/tracking/LiveTrackingMap";
import { VehicleTelemetryDrawer } from "@/components/tracking/VehicleTelemetryDrawer";
import { RoutePlaybackBar } from "@/components/tracking/RoutePlaybackBar";
import { LiveDashcamModal } from "@/components/tracking/LiveDashcamModal";
import { ObjectColumnSettingsModal } from "@/components/tracking/ObjectColumnSettingsModal";
import { fleetObjects, type FleetObject } from "@/data/fleet";
import { useZio } from "@/zio/ZioContext";
import { toast } from "sonner";

export function TrackingPage() {
  const [selectedVehicleId, setSelectedVehicleIdState] = useState(
    fleetObjects[0]!.id,
  );
  const [checkedVehicleIds, setCheckedVehicleIds] = useState<string[]>(
    fleetObjects.map((v) => v.id),
  );
  const [isTelemetryDrawerOpen, setIsTelemetryDrawerOpen] = useState(true);
  const [playbackOpen, setPlaybackOpen] = useState(false);
  const [dashcamVehicle, setDashcamVehicle] = useState<FleetObject | null>(
    null,
  );
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const { setSelectedVehicleId } = useZio();

  // Sync selected vehicle with Zio AI Assistant context
  useEffect(() => {
    setSelectedVehicleId(selectedVehicleId);
  }, [selectedVehicleId, setSelectedVehicleId]);

  const selectedVehicle =
    fleetObjects.find((v) => v.id === selectedVehicleId) ?? fleetObjects[0]!;

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

  return (
    <div className="relative flex h-full w-full overflow-hidden p-2.5 gap-2.5 bg-background">
      {/* 1. Left Floating / Docked Fleet Object Explorer Panel */}
      <FleetExplorerPanel
        vehicles={fleetObjects}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={(id) => setSelectedVehicleIdState(id)}
        checkedVehicleIds={checkedVehicleIds}
        onToggleCheckVehicle={handleToggleCheckVehicle}
        onToggleCheckGroup={handleToggleCheckGroup}
        onToggleCheckAll={handleToggleCheckAll}
        onOpenDashcam={(v) => setDashcamVehicle(v)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenTelemetry={(v) => {
          setSelectedVehicleIdState(v.id);
          setIsTelemetryDrawerOpen(true);
        }}
        onTraceVehicle={handleTraceVehicle}
        className="w-full sm:w-[410px] shrink-0 z-10"
      />

      {/* 2. Center Fullscreen Interactive GIS Map Canvas */}
      <div className="relative flex-1 h-full min-w-0 flex flex-col">
        <LiveTrackingMap
          selectedVehicle={selectedVehicle}
          checkedVehicles={checkedVehicles}
          onOpenPlayback={() => setPlaybackOpen(true)}
          isTelemetryDrawerOpen={isTelemetryDrawerOpen}
          onToggleTelemetryDrawer={() =>
            setIsTelemetryDrawerOpen((prev) => !prev)
          }
          className="h-full w-full"
        />

        {/* Floating Route Playback Bar (when active) */}
        {playbackOpen && (
          <div className="absolute bottom-3 left-4 right-4 z-30 max-w-2xl mx-auto">
            <RoutePlaybackBar
              vehicle={selectedVehicle}
              onClose={() => setPlaybackOpen(false)}
            />
          </div>
        )}
      </div>

      {/* 3. Right Floating Vehicle Telemetry & Diagnostics Drawer */}
      {isTelemetryDrawerOpen && (
        <VehicleTelemetryDrawer
          vehicle={selectedVehicle}
          onClose={() => setIsTelemetryDrawerOpen(false)}
          onSelectVehicle={(id) => setSelectedVehicleIdState(id)}
          allVehicles={fleetObjects}
          className="shrink-0 z-10 animate-in slide-in-from-right-4 duration-200"
        />
      )}

      {/* 4. Live Multi-Channel Dashcam Video Streaming Modal */}
      {dashcamVehicle && (
        <LiveDashcamModal
          vehicle={dashcamVehicle}
          onClose={() => setDashcamVehicle(null)}
        />
      )}

      {/* 5. Object Display & Columns Customization Settings Modal */}
      <ObjectColumnSettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
}
