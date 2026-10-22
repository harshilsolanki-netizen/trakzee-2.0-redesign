import { useEffect, useMemo, useState } from "react";
import { FleetExplorerPanel } from "@/components/tracking/FleetExplorerPanel";
import { LiveTrackingMap } from "@/components/tracking/LiveTrackingMap";
import { VehicleTelemetryDrawer } from "@/components/tracking/VehicleTelemetryDrawer";
import { RoutePlaybackBar } from "@/components/tracking/RoutePlaybackBar";
import { LiveDashcamModal } from "@/components/tracking/LiveDashcamModal";
import { IntercomPanel, type IntercomDevice } from "@/components/tracking/IntercomPanel";
import { PlaybackHistoryPanel, type PlaybackDeviceProps } from "@/components/tracking/PlaybackHistoryPanel";
import { MapVideoPanel, type VideoChannelFeed } from "@/components/tracking/MapVideoPanel";
import { AddVehiclePage } from "@/components/tracking/AddVehiclePage";
import {
  ObjectColumnSettingsModal,
  DEFAULT_COLUMNS,
} from "@/components/tracking/ObjectColumnSettingsModal";
import { AddAddressModal, type AddressFormData } from "@/components/tracking/AddAddressModal";
import { UploadAddressModal } from "@/components/tracking/UploadAddressModal";
import { AddGeofenceModal, type GeofenceFormData } from "@/components/tracking/AddGeofenceModal";
import { FollowVehiclesPanel } from "@/components/tracking/FollowVehiclesPanel";
import { ShareLocationModal } from "@/components/tracking/ShareLocationModal";
import { NavigationModeModal, type NavigationRoute } from "@/components/tracking/NavigationModeModal";
import { FindNearByModal } from "@/components/tracking/FindNearByModal";
import { type VehicleModeData } from "@/components/tracking/VehicleModeModal";
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

  // Follow Vehicles (Multi-Track) State (Follow up to 4 vehicles simultaneously)
  const [followedVehicleIds, setFollowedVehicleIds] = useState<string[]>([
    "o1", // Fuel - 1001
  ]);
  const [isFollowPanelOpen, setIsFollowPanelOpen] = useState(false);
  const [vehicleModes, setVehicleModes] = useState<Record<string, VehicleModeData | null>>({});

  const handleToggleFollowVehicle = (id: string) => {
    setFollowedVehicleIds((prev) => {
      if (prev.includes(id)) {
        toast.info("Removed vehicle from follow list");
        const next = prev.filter((vId) => vId !== id);
        if (next.length === 0) {
          setIsFollowPanelOpen(false);
        }
        return next;
      }
      if (prev.length >= 4) {
        toast.error("Maximum 4 vehicles can be followed simultaneously", {
          description: "Please remove one vehicle before adding another.",
        });
        return prev;
      }
      toast.success("Added vehicle to follow panel");
      return [...prev, id];
    });
    setIsFollowPanelOpen(true);
  };

  const handleAddFollowVehicle = (id: string) => {
    if (followedVehicleIds.length >= 4) {
      toast.error("Maximum 4 vehicles can be followed simultaneously");
      return;
    }
    setFollowedVehicleIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleRemoveFollowVehicle = (id: string) => {
    setFollowedVehicleIds((prev) => {
      const next = prev.filter((vId) => vId !== id);
      if (next.length === 0) {
        setIsFollowPanelOpen(false);
      }
      return next;
    });
  };

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
  const [playbackCustomRange, setPlaybackCustomRange] = useState<string | null>(null);
  const [dashcamVehicle, setDashcamVehicle] = useState<FleetObject | null>(
    null,
  );
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [intercomDevice, setIntercomDevice] = useState<IntercomDevice | null>(null);
  const [playbackHistoryDevice, setPlaybackHistoryDevice] = useState<PlaybackDeviceProps | null>(null);

  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isUploadAddressModalOpen, setIsUploadAddressModalOpen] = useState(false);
  const [editingAddressData, setEditingAddressData] = useState<AddressFormData | null>(null);

  const [isAddGeofenceModalOpen, setIsAddGeofenceModalOpen] = useState(false);
  const [editingGeofenceData, setEditingGeofenceData] = useState<GeofenceFormData | null>(null);

  // Share Live Location Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalVehicle, setShareModalVehicle] = useState<FleetObject | null>(null);

  const handleOpenShare = (vehicle?: FleetObject | null) => {
    const target = vehicle || selectedVehicle || (vehiclesList.length > 0 ? vehiclesList[0] : null);
    setShareModalVehicle(target);
    setIsShareModalOpen(true);
  };

  // Modern Trakzee 2.0 Theme Navigation Mode state
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [navigationVehicle, setNavigationVehicle] = useState<FleetObject | null>(null);
  const [activeNavigationRoute, setActiveNavigationRoute] = useState<NavigationRoute | null>(null);

  const handleOpenNavigation = (vehicle?: FleetObject | null) => {
    const target = vehicle || selectedVehicle || (vehiclesList.length > 0 ? vehiclesList[0] : null);
    setNavigationVehicle(target);
    setIsNavigationOpen(true);
  };

  // Modern Trakzee 2.0 Theme Find Near By Modal state
  const [isFindNearByOpen, setIsFindNearByOpen] = useState(false);
  const [findNearByVehicle, setFindNearByVehicle] = useState<FleetObject | null>(null);

  const handleOpenFindNearBy = (vehicle?: FleetObject | null) => {
    const target = vehicle || selectedVehicle || (vehiclesList.length > 0 ? vehiclesList[0] : null);
    setFindNearByVehicle(target);
    setIsFindNearByOpen(true);
  };

  // Map + Video Right Panel Camera Feeds state using real telematics camera assets
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
      channelName: "DMS Fatigue Alert",
      location: "Plot 214, Phase 2, GIDC Industrial Estate, Vapi, Gujarat 396195",
      status: "Active",
      fps: 25,
      dataUsed: "7.50 MB",
      bitrate: "1/41.21 kbps",
      resolution: "704x576 px",
      coordinates: "20.594183N 72.938680E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/driver_fatigue_rubbing_eyes.png",
    },
    {
      id: "v-3",
      deviceName: "H20P TRACKNOW",
      channelName: "DMS Smoking Alert",
      location: "National Highway 48, Near Toll Plaza, Vapi",
      status: "Active",
      fps: 25,
      dataUsed: "7.85 MB",
      bitrate: "1/40.16 kbps",
      resolution: "704x576 px",
      coordinates: "20.594183N 72.938680E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/driver_smoking.png",
    },
    {
      id: "v-4",
      deviceName: "HP Bonga Stream...",
      channelName: "DMS Yawning Alert",
      location: "At Uffizio - Head Office",
      status: "Active",
      fps: 25,
      dataUsed: "5.12 MB",
      bitrate: "1/41.55 kbps",
      resolution: "704x576 px",
      coordinates: "20.594183N 72.938680E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/driver_yawning.png",
    },
    {
      id: "v-5",
      deviceName: "HP Bonga Stream...",
      channelName: "Night IR Phone Call",
      location: "At Uffizio - Head Office",
      status: "Active",
      fps: 25,
      dataUsed: "6.90 MB",
      bitrate: "1/42.10 kbps",
      resolution: "704x576 px",
      coordinates: "20.594183N 72.938680E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/driver_phone_night_1.png",
    },
    {
      id: "v-6",
      deviceName: "HP CL M920",
      channelName: "Night Sleeper Phone",
      location: "Sector 14, Gandhinagar Highway, Gujarat",
      status: "Active",
      fps: 25,
      dataUsed: "4.20 MB",
      bitrate: "1/39.80 kbps",
      resolution: "704x576 px",
      coordinates: "20.594183N 72.938680E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/driver_phone_night_2.png",
    },
    {
      id: "v-7",
      deviceName: "HP CV200",
      channelName: "DMS Distraction",
      location: "At Uffizio - Head Office",
      status: "Active",
      fps: 25,
      dataUsed: "3.90 MB",
      bitrate: "1/40.05 kbps",
      resolution: "704x576 px",
      coordinates: "20.594183N 72.938680E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/driver_fatigue.png",
    },
    {
      id: "v-8",
      deviceName: "HP DB3 Riumor",
      channelName: "Cargo Hold Cam",
      location: "Surat Logistics Hub Warehouse 3",
      status: "Active",
      fps: 25,
      dataUsed: "8.10 MB",
      bitrate: "1/41.90 kbps",
      resolution: "704x576 px",
      coordinates: "20.594183N 72.938680E 0km/h TIME:2815H DIST:43Km",
      snapshotUrl: "/telematics/cargo_hold.png",
    },
  ]);
  const [pinnedVideoView, setPinnedVideoView] = useState<"map_video" | "matrix" | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trakzee_pinned_video_view");
      if (saved === "matrix" || saved === "map_video") return saved;
    }
    return null;
  });

  const [isVideoMatrixMode, setIsVideoMatrixMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trakzee_pinned_video_view");
      return saved === "matrix";
    }
    return false;
  });
  const [isMapVideoPanelOpen, setIsMapVideoPanelOpen] = useState(false);

  // Sync Video Telematics Right Panel visibility with activeTab & restore pinned default view
  useEffect(() => {
    if (activeTab === "video_telematics") {
      const saved = localStorage.getItem("trakzee_pinned_video_view");
      if (saved === "matrix") {
        setIsVideoMatrixMode(true);
      } else if (saved === "map_video") {
        setIsVideoMatrixMode(false);
      }
      setIsMapVideoPanelOpen(true);
    } else {
      setIsMapVideoPanelOpen(false);
    }
  }, [activeTab]);

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
    setIntercomDevice(null);
    setPlaybackHistoryDevice(null);
    if (!isMapVideoPanelOpen) {
      const saved = localStorage.getItem("trakzee_pinned_video_view");
      if (saved === "matrix") {
        setIsVideoMatrixMode(true);
      } else if (saved === "map_video") {
        setIsVideoMatrixMode(false);
      }
    }
    setIsMapVideoPanelOpen(true);
    setActiveTab("video_telematics");
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

  const DEFAULT_FOLLOW_PANEL_WIDTH = 380;
  const [customFollowWidth, setCustomFollowWidth] = useState<number | null>(null);
  const [isResizingFollowCol, setIsResizingFollowCol] = useState(false);
  const followPanelWidth = customFollowWidth ?? DEFAULT_FOLLOW_PANEL_WIDTH;

  useEffect(() => {
    if (!isResizingFollowCol) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(280, Math.min(850, window.innerWidth - e.clientX));
      setCustomFollowWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingFollowCol(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingFollowCol]);

  const handleStartFollowColResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingFollowCol(true);
  };

  const handleOpenPlayback = (tf?: string, customRange?: string) => {
    if (tf) setPlaybackTimeframe(tf);
    setPlaybackCustomRange(customRange || null);
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
    <div className="relative h-full w-full overflow-hidden select-none bg-background flex">
      {/* 1. Main Map Canvas Section (Ends at follow panel boundary so map does NOT run underneath it) */}
      <div
        className={cn(
          "relative h-full flex-1 transition-[margin-right] duration-150 overflow-hidden",
          isResizingFollowCol && "transition-none select-none"
        )}
        style={{
          marginRight: isFollowPanelOpen ? `${followPanelWidth}px` : "0px",
        }}
      >
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
            isHealthTelemetryOnly={isHealthTelemetryOnly}
            onToggleTelemetryDrawer={() =>
              setIsTelemetryDrawerOpen((prev) => !prev)
            }
            activeTab={activeTab}
            onSelectVehicle={(id) => setSelectedVehicleIdState(id)}
            onToggleFollowPanel={() => {
              setIsFollowPanelOpen((prev) => {
                const next = !prev;
                if (next && followedVehicleIds.length === 0) {
                  setFollowedVehicleIds([selectedVehicleId || "o1"]);
                }
                return next;
              });
            }}
            isFollowPanelOpen={isFollowPanelOpen}
            followedCount={followedVehicleIds.length}
            onOpenShare={handleOpenShare}
            onOpenFindNearBy={handleOpenFindNearBy}
            navigationRoute={activeNavigationRoute}
            className="h-full w-full rounded-none border-0 shadow-none"
          />
        </div>

      {/* 2. Left Floating Fleet Explorer Panel */}
      {isLeftPanelOpen ? (
        <div className="absolute top-2.5 bottom-2.5 left-2.5 z-20 flex flex-col pointer-events-none">
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
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab === "video_telematics") {
                const saved = localStorage.getItem("trakzee_pinned_video_view");
                if (saved === "matrix") {
                  setIsVideoMatrixMode(true);
                } else if (saved === "map_video") {
                  setIsVideoMatrixMode(false);
                }
                setIsMapVideoPanelOpen(true);
              }
            }}
            onOpenVideoChannel={handleOpenVideoChannel}
            onOpenIntercom={(dev) => {
              setIntercomDevice(dev);
              setPlaybackHistoryDevice(null);
              setIsMapVideoPanelOpen(false);
            }}
            onOpenPlayback={(dev) => {
              setPlaybackHistoryDevice(dev);
              setIntercomDevice(null);
              setIsMapVideoPanelOpen(false);
            }}
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
        <div className="absolute left-0 top-[28px] z-30 animate-in slide-in-from-left duration-200">
          <button
            type="button"
            onClick={() => setIsLeftPanelOpen(true)}
            className="flex h-10 w-5 items-center justify-center rounded-r-xl border border-l-0 border-[#DFE3EB] dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-600 dark:text-slate-300 shadow-md hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#0089FF] dark:hover:text-[#0089FF] transition-all cursor-pointer active:scale-95"
            title="Expand Object Panel"
          >
            <ChevronRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* 3. Right Floating Map + Video Live Camera Feeds Panel */}
      {isMapVideoPanelOpen && activeVideoFeeds.length > 0 && !intercomDevice && !playbackHistoryDevice && (
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
              setActiveVideoFeeds((prev) => {
                const next = prev.filter((c) => c.id !== id);
                if (next.length === 0) setIsMapVideoPanelOpen(false);
                return next;
              })
            }
            onCloseAll={() => {
              setActiveVideoFeeds([]);
              setIsMapVideoPanelOpen(false);
            }}
            isMatrixMode={isVideoMatrixMode}
            onToggleMatrixMode={(enabled) => setIsVideoMatrixMode(enabled)}
            pinnedView={pinnedVideoView}
            onTogglePinView={(view) => {
              setPinnedVideoView(view);
              if (view) {
                localStorage.setItem("trakzee_pinned_video_view", view);
              } else {
                localStorage.removeItem("trakzee_pinned_video_view");
              }
            }}
            onOpenIntercom={(dev) => {
              setIntercomDevice(dev);
              setPlaybackHistoryDevice(null);
              setIsMapVideoPanelOpen(false);
            }}
          />
        </div>
      )}

      {/* 3.5 Right Floating Standalone Live Intercom Panel (Matches Object Panel top-2.5 bottom-2.5 height) */}
      {intercomDevice && !playbackHistoryDevice && (
        <div className="absolute top-2.5 bottom-2.5 right-2.5 z-20 flex flex-col pointer-events-none animate-in slide-in-from-right-4 duration-200">
          <IntercomPanel
            device={intercomDevice}
            onClose={() => setIntercomDevice(null)}
            className="w-[398px] h-full pointer-events-auto"
          />
        </div>
      )}

      {/* 3.6 Right Floating Standalone Playback History Panel (Dynamic height fits content up to max Object Panel height) */}
      {playbackHistoryDevice && (
        <div className="absolute top-2.5 bottom-2.5 right-2.5 z-20 flex flex-col items-end pointer-events-none animate-in slide-in-from-right-4 duration-200">
          <PlaybackHistoryPanel
            device={playbackHistoryDevice}
            onClose={() => setPlaybackHistoryDevice(null)}
            className="w-[450px] max-h-full h-auto pointer-events-auto shadow-2xl"
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
            onOpenPlayback={(tf, customRange) => handleOpenPlayback(tf, customRange)}
            isHealthOnly={isHealthTelemetryOnly}
            selectedJob={selectedJobForDrawer}
            onToggleFollow={handleToggleFollowVehicle}
            isFollowed={followedVehicleIds.includes(selectedVehicle.id)}
            onOpenShare={handleOpenShare}
            onOpenNavigation={handleOpenNavigation}
            onOpenFindNearBy={handleOpenFindNearBy}
            currentModeData={vehicleModes[selectedVehicle.id]}
            onSaveModeData={(vId, data) => setVehicleModes((prev) => ({ ...prev, [vId]: data }))}
            className={cn(
              isHealthTelemetryOnly ? "w-[400px] sm:w-[400px]" : "w-[228px] sm:w-[228px]",
              "h-full pointer-events-auto bg-transparent border-0 shadow-none",
            )}
          />
        </div>
      )}

      {/* 4.2 Floating Navigation Mode Card (Directly over Map, Exactly matching Reference Images) */}
      {isNavigationOpen && (
        <div
          className={cn(
            "absolute top-2.5 z-30 flex flex-col pointer-events-none transition-all duration-200",
            isTelemetryDrawerOpen
              ? isHealthTelemetryOnly
                ? "right-[314px]"
                : "right-[242px]"
              : "right-2.5"
          )}
        >
          <NavigationModeModal
            open={isNavigationOpen}
            onClose={() => {
              setIsNavigationOpen(false);
              setActiveNavigationRoute(null);
            }}
            vehicle={navigationVehicle || selectedVehicle}
            onStartNavigation={(route) => setActiveNavigationRoute(route)}
            onClearNavigation={() => setActiveNavigationRoute(null)}
            isNavigating={!!activeNavigationRoute}
            activeRoute={activeNavigationRoute}
          />
        </div>
      )}

      {/* 4. Floating Route Playback Bar (when active) */}
      {playbackOpen && selectedVehicle && (
        <RoutePlaybackBar
          vehicle={selectedVehicle}
          allVehicles={fleetObjects}
          timeframe={playbackTimeframe}
          customDateRange={playbackCustomRange}
          onSelectVehicle={(v) => setSelectedVehicleIdState(v.id)}
          onClose={handleClosePlayback}
        />
      )}
      </div>

      {/* 4.5. Dedicated Follow Vehicles Right Section (Different section, NOT on map, resizable with cursor) */}
      {isFollowPanelOpen && (
        <div className="absolute top-0 bottom-0 right-0 z-20 flex">
          <FollowVehiclesPanel
            followedVehicleIds={followedVehicleIds}
            allVehicles={vehiclesList}
            onAddVehicle={handleAddFollowVehicle}
            onRemoveVehicle={handleRemoveFollowVehicle}
            onFocusMainMap={(id) => {
              const target = vehiclesList.find((v) => v.id === id);
              if (target) {
                handleTraceVehicle(target);
              }
            }}
            panelWidth={followPanelWidth}
            onWidthChange={setCustomFollowWidth}
            onStartColResize={handleStartFollowColResize}
            isResizingCol={isResizingFollowCol}
          />
        </div>
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

      {/* 10. Modern Trakzee 2.0 Theme Share Live Location Modal */}
      <ShareLocationModal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        vehicle={shareModalVehicle || selectedVehicle}
        allVehicles={vehiclesList}
        onSelectVehicle={(veh) => setShareModalVehicle(veh)}
      />

      {/* 11. Modern Trakzee 2.0 Theme Find Near By Modal */}
      <FindNearByModal
        open={isFindNearByOpen}
        onClose={() => setIsFindNearByOpen(false)}
        vehicle={findNearByVehicle || selectedVehicle}
        allVehicles={vehiclesList}
      />
    </div>
  );
}
