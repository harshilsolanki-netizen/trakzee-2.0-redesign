import { useEffect, useMemo, useState } from "react";
import { FleetExplorerPanel } from "@/components/tracking/FleetExplorerPanel";
import { LiveTrackingMap } from "@/components/tracking/LiveTrackingMap";
import { VehicleTelemetryDrawer } from "@/components/tracking/VehicleTelemetryDrawer";
import { RoutePlaybackBar } from "@/components/tracking/RoutePlaybackBar";
import { LiveDashcamModal } from "@/components/tracking/LiveDashcamModal";
import { MapVideoPanel, type VideoChannelFeed } from "@/components/tracking/MapVideoPanel";
import { AddVehiclePage } from "@/components/tracking/AddVehiclePage";
import {
  ObjectColumnSettingsModal,
  DEFAULT_COLUMNS,
} from "@/components/tracking/ObjectColumnSettingsModal";
import { AddAddressModal, type AddressFormData } from "@/components/tracking/AddAddressModal";
import { UploadAddressModal } from "@/components/tracking/UploadAddressModal";
import { AddGeofenceModal, type GeofenceFormData } from "@/components/tracking/AddGeofenceModal";
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
  const [checkedGeofenceIds, setCheckedGeofenceIds] = useState<string[]>([
    "g-1", "g-2", "g-3", "g-4", "g-5",
  ]);
  const [activeTab, setActiveTab] = useState<string>("object");
  const [selectedGeofenceId, setSelectedGeofenceId] = useState<string | null>(null);

  const handleToggleCheckGeofence = (id: string) => {
    setCheckedGeofenceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleToggleCheckAllGeofences = (checked: boolean) => {
    if (checked) {
      setCheckedGeofenceIds([
        "g-1", "g-2", "g-3", "g-4", "g-5", "g-6", "g-7", "g-8", "g-9", "g-10",
        "g-11", "g-12", "g-13", "g-14", "g-15", "g-16", "g-17", "g-18", "g-19", "g-20", "g-21",
      ]);
    } else {
      setCheckedGeofenceIds([]);
    }
  };

  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isTelemetryDrawerOpen, setIsTelemetryDrawerOpen] = useState(false);
  const [isHealthTelemetryOnly, setIsHealthTelemetryOnly] = useState(false);
  const [selectedJobForDrawer, setSelectedJobForDrawer] = useState<any | null>(null);
  const [playbackOpen, setPlaybackOpen] = useState(false);
  const [playbackTimeframe, setPlaybackTimeframe] = useState("Today");
  const [dashcamVehicle, setDashcamVehicle] = useState<FleetObject | null>(
    null,
  );
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);

  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isUploadAddressModalOpen, setIsUploadAddressModalOpen] = useState(false);
  const [editingAddressData, setEditingAddressData] = useState<AddressFormData | null>(null);

  const [isAddGeofenceModalOpen, setIsAddGeofenceModalOpen] = useState(false);
  const [editingGeofenceData, setEditingGeofenceData] = useState<GeofenceFormData | null>(null);

  // Map + Video Right Panel Camera Feeds state
  const [activeVideoFeeds, setActiveVideoFeeds] = useState<VideoChannelFeed[]>([
    {
      id: "v-1",
      deviceName: "H20P TRACKNOW",
      channelName: "Main Cabin View",
      location: "At Uffizio - Head Office",
      status: "Active",
      fps: 25,
      dataUsed: "3.39 MB",
      bitrate: "1/40.34 kbps",
      resolution: "704x576 px",
      coordinates: "20.594165N 72.938700E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/driver_cabin_2.png",
    },
    {
      id: "v-2",
      deviceName: "H20P TRACKNOW",
      channelName: "CH2",
      location: "At Uffizio - Head Office",
      status: "Active",
      fps: 25,
      dataUsed: "3.39 MB",
      bitrate: "1/40.34 kbps",
      resolution: "704x576 px",
      coordinates: "20.594183N 72.938680E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/driver_fatigue.png",
    },
    {
      id: "v-3",
      deviceName: "H20P TRACKNOW",
      channelName: "CH5",
      location: "At Uffizio - Head Office",
      status: "Active",
      fps: 25,
      dataUsed: "3.39 MB",
      bitrate: "1/40.34 kbps",
      resolution: "704x576 px",
      coordinates: "20.594183N 72.938680E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/cargo_hold.png",
    },
    {
      id: "v-4",
      deviceName: "HP Bonga Stream...",
      channelName: "CH1",
      location: "At Uffizio - Head Office",
      status: "Active",
      fps: 25,
      dataUsed: "3.39 MB",
      bitrate: "1/40.34 kbps",
      resolution: "704x576 px",
      coordinates: "20.594183N 72.938680E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/driver_cabin_1.jpg",
    },
    {
      id: "v-5",
      deviceName: "HP Bonga Stream...",
      channelName: "CH2",
      location: "At Uffizio - Head Office",
      status: "Active",
      fps: 25,
      dataUsed: "3.39 MB",
      bitrate: "1/40.34 kbps",
      resolution: "704x576 px",
      coordinates: "20.594183N 72.938680E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/driver_phone_distraction.png",
    },
  ]);
  const [isVideoMatrixMode, setIsVideoMatrixMode] = useState(false);

  const handleOpenVideoChannel = (feed: VideoChannelFeed) => {
    setActiveVideoFeeds((prev) => {
      const exists = prev.some((c) => c.id === feed.id);
      if (exists) {
        toast.info(`${feed.deviceName} (${feed.channelName}) is already active`);
        return prev;
      }
      toast.success(`Added ${feed.deviceName} (${feed.channelName}) to video panel`);
      return [...prev, feed];
    });
  };

  const handleOpenAddAddress = (initialData?: AddressFormData) => {
    setEditingAddressData(initialData || null);
    setIsAddAddressModalOpen(true);
  };

  const handleOpenAddGeofence = (initialData?: GeofenceFormData) => {
    setEditingGeofenceData(initialData || null);
    setIsAddGeofenceModalOpen(true);
  };

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
          checkedGeofenceIds={checkedGeofenceIds}
          selectedGeofenceId={selectedGeofenceId}
          onOpenPlayback={handleOpenPlayback}
          isLeftPanelOpen={isLeftPanelOpen}
          leftPanelWidth={panelWidth}
          isTelemetryDrawerOpen={isTelemetryDrawerOpen}
          onToggleTelemetryDrawer={() =>
            setIsTelemetryDrawerOpen((prev) => !prev)
          }
          activeTab={activeTab}
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
            checkedGeofenceIds={checkedGeofenceIds}
            onToggleCheckGeofence={handleToggleCheckGeofence}
            onToggleCheckAllGeofences={handleToggleCheckAllGeofences}
            selectedGeofenceId={selectedGeofenceId}
            onSelectGeofence={(id) => setSelectedGeofenceId(id)}
            onOpenDashcam={(v) => setDashcamVehicle(v)}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onOpenTelemetry={(v, isHealthOnly, job) => {
              setSelectedVehicleIdState(v.id);
              setIsHealthTelemetryOnly(!!isHealthOnly);
              setSelectedJobForDrawer(job || null);
              setIsTelemetryDrawerOpen(true);
            }}
            onCloseTelemetry={() => setIsTelemetryDrawerOpen(false)}
            onTraceVehicle={handleTraceVehicle}
            onOpenAddVehicle={() => navigate({ to: "/setting", search: { action: "add" } })}
            onOpenAddAddress={handleOpenAddAddress}
            onOpenUploadAddress={() => setIsUploadAddressModalOpen(true)}
            onOpenAddGeofence={handleOpenAddGeofence}
            onToggleCollapse={() => setIsLeftPanelOpen(false)}
            selectedColumns={selectedColumns}
            onStartResize={() => setIsResizing(true)}
            onResetWidth={() => setCustomWidth(null)}
            activeTab={activeTab as any}
            onTabChange={(tab) => setActiveTab(tab)}
            onOpenVideoChannel={handleOpenVideoChannel}
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

      {/* 3. Right Floating Map + Video Live Camera Feeds Panel */}
      {activeVideoFeeds.length > 0 && (
        <div
          className={cn(
            "absolute top-2.5 bottom-2.5 z-20 flex flex-col pointer-events-none animate-in slide-in-from-right-4 duration-200",
            isVideoMatrixMode ? "right-2.5" : "right-2.5 w-[398px]"
          )}
          style={
            isVideoMatrixMode
              ? {
                  left: isLeftPanelOpen ? `${panelWidth + 20}px` : "32px",
                }
              : undefined
          }
        >
          <MapVideoPanel
            channels={activeVideoFeeds}
            onCloseChannel={(id) =>
              setActiveVideoFeeds((prev) => prev.filter((c) => c.id !== id))
            }
            onCloseAll={() => setActiveVideoFeeds([])}
            isMatrixMode={isVideoMatrixMode}
            onToggleMatrixMode={(enabled) => setIsVideoMatrixMode(enabled)}
          />
        </div>
      )}

      {/* 4. Right Floating Vehicle Telemetry & Diagnostics Drawer */}
      {isTelemetryDrawerOpen && selectedVehicle && (
        <div className="absolute top-2.5 bottom-2.5 right-2.5 z-10 flex flex-col pointer-events-none animate-in slide-in-from-right-4 duration-200">
          <VehicleTelemetryDrawer
            vehicle={selectedVehicle}
            onClose={() => setIsTelemetryDrawerOpen(false)}
            onSelectVehicle={(id) => setSelectedVehicleIdState(id)}
            allVehicles={fleetObjects}
            onOpenPlayback={() => handleOpenPlayback()}
            isHealthOnly={isHealthTelemetryOnly}
            selectedJob={selectedJobForDrawer}
            className={cn(
              isHealthTelemetryOnly ? "w-[300px] sm:w-[300px]" : "w-[220px] sm:w-[220px]",
              "h-full pointer-events-auto bg-transparent border-0 shadow-none",
            )}
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

      {/* 7. Modern Theme-Consistent Add Address Modal */}
      <AddAddressModal
        open={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        onSaveAddress={(addressData) => {
          // Address saved callback
        }}
        initialData={editingAddressData}
      />

      {/* 8. Modern Theme-Consistent Upload Address Modal */}
      <UploadAddressModal
        open={isUploadAddressModalOpen}
        onClose={() => setIsUploadAddressModalOpen(false)}
      />

      {/* 9. Modern Theme-Consistent Add Geofence Modal */}
      <AddGeofenceModal
        open={isAddGeofenceModalOpen}
        onClose={() => setIsAddGeofenceModalOpen(false)}
        onSaveGeofence={(geofenceData) => {
          // Geofence saved callback
        }}
        initialData={editingGeofenceData}
      />
    </div>
  );
}
