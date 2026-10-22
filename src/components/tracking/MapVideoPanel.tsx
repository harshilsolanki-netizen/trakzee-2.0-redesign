import { useState, useEffect } from "react";
import {
  X,
  LayoutGrid,
  List,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  PictureInPicture2,
  Settings,
  Camera,
  MapPin,
  Square,
  Grid2x2,
  Grid3x3,
  ChevronLeft,
  ChevronRight,
  FlipHorizontal,
  FlipVertical,
  Tv,
  Maximize,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Radio,
  Pin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IntercomCard, type IntercomDevice } from "@/components/tracking/IntercomCard";

export interface VideoChannelFeed {
  id: string;
  deviceName: string;
  channelName: string;
  location?: string;
  status: "Active" | "Offline";
  fps?: number;
  dataUsed?: string;
  bitrate?: string;
  resolution?: string;
  coordinates?: string;
  speed?: string;
  snapshotUrl?: string;
}

interface SettingsPopoverProps {
  feed: VideoChannelFeed;
  isHMirrored: boolean;
  isVMirrored: boolean;
  isHD: boolean;
  currentRatio: string;
  zoomScale: number;
  onToggleHMirror: () => void;
  onToggleVMirror: () => void;
  onTakeSnapshot: () => void;
  onToggleHD: () => void;
  onSetRatio: (ratio: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

function VideoPlayerSettingsPopover({
  feed,
  isHMirrored,
  isVMirrored,
  isHD,
  currentRatio,
  zoomScale,
  onToggleHMirror,
  onToggleVMirror,
  onTakeSnapshot,
  onToggleHD,
  onSetRatio,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: SettingsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuView, setMenuView] = useState<"main" | "ratio">("main");

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setMenuView("main");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="h-9 w-9 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/80 text-white transition-all cursor-pointer active:scale-95 flex items-center justify-center"
          title="Video Player Settings"
        >
          <Settings className="h-4 w-4 stroke-[2]" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={8}
        className="w-56 p-1.5 bg-white dark:bg-slate-900 border-[#DFE3EB] dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-2xl backdrop-blur-md rounded-xl z-[9999] animate-in fade-in-80 zoom-in-95 border max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {menuView === "ratio" ? (
          /* RATIO SUBMENU (Matching media_1791374627028.png) */
          <div className="flex flex-col text-xs font-semibold select-none">
            {/* Submenu Back Header */}
            <button
              type="button"
              onClick={() => setMenuView("main")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-all cursor-pointer font-bold text-xs text-left"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
              <span>Ratio</span>
            </button>

            {/* Divider Line */}
            <div className="h-px bg-[#DFE3EB] dark:bg-slate-800 my-1" />

            {/* Ratio Options: Stretch, Original Ratio, 16:9, 4:3 */}
            {[
              { id: "Stretch", label: "Stretch" },
              { id: "Original Ratio", label: "Original Ratio" },
              { id: "16:9", label: "16:9" },
              { id: "4:3", label: "4:3" },
            ].map((opt) => {
              const isSelected = (currentRatio ?? "16:9") === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSetRatio(opt.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer text-left text-xs font-medium",
                    isSelected
                      ? "bg-[#0089FF]/10 text-[#0089FF] dark:text-[#0089FF] font-bold"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200"
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-[#0089FF] stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        ) : (
          /* MAIN SETTINGS MENU (Theme-aligned Trakzee 2.0) */
          <div className="flex flex-col text-xs font-medium space-y-0.5 select-none">
            {/* 1. Horizontal Mirror */}
            <button
              type="button"
              onClick={() => {
                onToggleHMirror();
              }}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer text-left",
                isHMirrored
                  ? "bg-[#0089FF]/10 text-[#0089FF] dark:text-[#0089FF] font-bold"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200"
              )}
            >
              <FlipHorizontal className="h-4 w-4 stroke-[2]" />
              <span className="flex-1">Horizontal Mirror</span>
              {isHMirrored && <Check className="h-3.5 w-3.5 text-[#0089FF] stroke-[2.5]" />}
            </button>

            {/* 2. Vertical Mirror */}
            <button
              type="button"
              onClick={() => {
                onToggleVMirror();
              }}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer text-left",
                isVMirrored
                  ? "bg-[#0089FF]/10 text-[#0089FF] dark:text-[#0089FF] font-bold"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200"
              )}
            >
              <FlipVertical className="h-4 w-4 stroke-[2]" />
              <span className="flex-1">Vertical Mirror</span>
              {isVMirrored && <Check className="h-3.5 w-3.5 text-[#0089FF] stroke-[2.5]" />}
            </button>

            {/* 3. Snapshot */}
            <button
              type="button"
              onClick={() => {
                onTakeSnapshot();
                setIsOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-all cursor-pointer text-left"
            >
              <Camera className="h-4 w-4 stroke-[2]" />
              <span className="flex-1">Snapshot</span>
            </button>

            <div className="h-px bg-[#DFE3EB] dark:bg-slate-800 my-1" />

            {/* 4. Non-HD (SD) Video Option */}
            <button
              type="button"
              onClick={() => {
                if (isHD) onToggleHD();
              }}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer text-left",
                !isHD
                  ? "bg-[#0089FF]/10 text-[#0089FF] dark:text-[#0089FF] font-bold"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200"
              )}
            >
              <Tv className="h-4 w-4 stroke-[2]" />
              <span className="flex-1">Non-HD (SD)</span>
              {!isHD && <Check className="h-3.5 w-3.5 text-[#0089FF] stroke-[2.5]" />}
            </button>

            {/* 5. HD Video Option */}
            <button
              type="button"
              onClick={() => {
                if (!isHD) onToggleHD();
              }}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer text-left",
                isHD
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200"
              )}
            >
              <Tv className="h-4 w-4 stroke-[2] text-emerald-500" />
              <span className="flex-1">HD (1080p Video)</span>
              {isHD && <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />}
            </button>

            {/* 6. Ratio Submenu Trigger */}
            <button
              type="button"
              onClick={() => setMenuView("ratio")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-all cursor-pointer text-left group/ratio"
            >
              <Maximize className="h-4 w-4 stroke-[2]" />
              <span className="flex-1">Ratio</span>
              <span className="text-[11px] font-mono text-slate-400 mr-0.5">
                {currentRatio ?? "16:9"}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 stroke-[2] group-hover/ratio:translate-x-0.5 transition-transform" />
            </button>

            <div className="h-px bg-[#DFE3EB] dark:bg-slate-800 my-1" />

            {/* 7. Zoom In */}
            <button
              type="button"
              onClick={onZoomIn}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-all cursor-pointer text-left"
            >
              <ZoomIn className="h-4 w-4 stroke-[2]" />
              <span className="flex-1">Zoom In</span>
              {zoomScale > 1 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0089FF]/15 text-[#0089FF] font-bold">
                  {Math.round(zoomScale * 100)}%
                </span>
              )}
            </button>

            {/* 8. Zoom Out */}
            <button
              type="button"
              onClick={onZoomOut}
              disabled={zoomScale <= 1}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left",
                zoomScale <= 1
                  ? "opacity-50 cursor-not-allowed text-slate-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 cursor-pointer"
              )}
            >
              <ZoomOut className="h-4 w-4 stroke-[2]" />
              <span className="flex-1">Zoom Out</span>
            </button>

            {/* 9. Reset Zoom */}
            <button
              type="button"
              onClick={onResetZoom}
              disabled={zoomScale === 1}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left",
                zoomScale === 1
                  ? "opacity-50 cursor-not-allowed text-slate-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 cursor-pointer"
              )}
            >
              <RotateCcw className="h-4 w-4 stroke-[2]" />
              <span className="flex-1">Reset Zoom</span>
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

interface MapVideoPanelProps {
  channels: VideoChannelFeed[];
  onCloseChannel: (id: string) => void;
  onCloseAll: () => void;
  isMatrixMode?: boolean;
  onToggleMatrixMode?: (enabled: boolean) => void;
  intercomDevice?: IntercomDevice | null;
  onCloseIntercom?: () => void;
  onOpenIntercom?: (device: IntercomDevice) => void;
  className?: string;
  pinnedView?: "map_video" | "matrix" | null;
  onTogglePinView?: (view: "map_video" | "matrix" | null) => void;
}

export function MapVideoPanel({
  channels,
  onCloseChannel,
  onCloseAll,
  isMatrixMode: propIsMatrixMode,
  onToggleMatrixMode,
  intercomDevice,
  onCloseIntercom,
  onOpenIntercom,
  className,
  pinnedView: propPinnedView,
  onTogglePinView,
}: MapVideoPanelProps) {
  // Layout Modes: "stack" (side panel), "1x1", "2x2", "2x3" (asymmetric matrix), "3x3"
  const [internalLayoutMode, setInternalLayoutMode] = useState<"stack" | "1x1" | "2x2" | "2x3" | "3x3">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trakzee_matrix_layout_mode") as any;
      if (saved && ["1x1", "2x2", "2x3", "3x3"].includes(saved)) return saved;
    }
    return "stack";
  });
  const [internalMatrixMode, setInternalMatrixMode] = useState(false);

  // Pinned Default View state ("map_video" or "matrix")
  const [internalPinnedView, setInternalPinnedView] = useState<"map_video" | "matrix" | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trakzee_pinned_video_view");
      if (saved === "matrix" || saved === "map_video") return saved;
    }
    return null;
  });

  const pinnedView = propPinnedView !== undefined ? propPinnedView : internalPinnedView;

  const handleTogglePin = (view: "map_video" | "matrix") => {
    const nextView = pinnedView === view ? null : view;
    if (typeof window !== "undefined") {
      if (nextView) {
        localStorage.setItem("trakzee_pinned_video_view", nextView);
        toast.success(
          nextView === "matrix"
            ? "Matrix View pinned as default view"
            : "Map + Video pinned as default view"
        );
      } else {
        localStorage.removeItem("trakzee_pinned_video_view");
        toast.info(
          view === "matrix"
            ? "Matrix View unpinned. Default view reset."
            : "Map + Video unpinned. Default view reset."
        );
      }
    }
    setInternalPinnedView(nextView);
    onTogglePinView?.(nextView);
  };

  const isMatrixMode = propIsMatrixMode ?? internalMatrixMode;
  const layoutMode = isMatrixMode ? (internalLayoutMode === "stack" ? "2x3" : internalLayoutMode) : "stack";
  const [isMatrixContainerFullscreen, setIsMatrixContainerFullscreen] = useState(false);

  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isAllPlaying, setIsAllPlaying] = useState(true);
  const [activePage, setActivePage] = useState(1);

  // Dynamic Pagination Calculation based on selected Matrix Layout Mode
  const pageSize = layoutMode === "1x1" ? 1 : layoutMode === "2x2" ? 4 : layoutMode === "2x3" ? 6 : layoutMode === "3x3" ? 9 : channels.length;
  const totalPages = Math.max(1, Math.ceil(channels.length / pageSize));
  const currentPage = Math.min(Math.max(1, activePage), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleFeeds = isMatrixMode ? channels.slice(startIndex, startIndex + pageSize) : channels;

  const changeLayoutMode = (mode: "1x1" | "2x2" | "2x3" | "3x3") => {
    setInternalLayoutMode(mode);
    setActivePage(1);
  };

  const [mutedChannels, setMutedChannels] = useState<Record<string, boolean>>({});
  const [pausedChannels, setPausedChannels] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState<string>("");

  // Video Settings Overlay States per channel
  const [hMirroredChannels, setHMirroredChannels] = useState<Record<string, boolean>>({});
  const [vMirroredChannels, setVMirroredChannels] = useState<Record<string, boolean>>({});
  const [hdChannels, setHdChannels] = useState<Record<string, boolean>>({});
  const [ratioChannels, setRatioChannels] = useState<Record<string, string>>({});
  const [zoomChannels, setZoomChannels] = useState<Record<string, number>>({});

  // Floating PiP & Single Video Full View Modal States
  const [singleFullViewFeed, setSingleFullViewFeed] = useState<VideoChannelFeed | null>(null);
  const [pipChannel, setPipChannel] = useState<VideoChannelFeed | null>(null);
  const [flashingChannelId, setFlashingChannelId] = useState<string | null>(null);

  // Dynamic live clock timestamp
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // ESC key listener to exit full matrix view mode
  useEffect(() => {
    if (!isMatrixContainerFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        setIsMatrixContainerFullscreen(false);
        toast.info("Exited Full View matrix mode");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMatrixContainerFullscreen]);

  const toggleMute = (id: string, name: string) => {
    setMutedChannels((prev) => {
      const next = !prev[id];
      toast.info(next ? `Muted ${name}` : `Unmuted ${name}`);
      return { ...prev, [id]: next };
    });
  };

  const togglePlayPause = (id: string, name: string) => {
    setPausedChannels((prev) => {
      const isPaused = !prev[id];
      toast.info(isPaused ? `Paused stream on ${name}` : `Resumed live stream on ${name}`);
      return { ...prev, [id]: isPaused };
    });
  };

  const toggleHMirror = (id: string, name: string) => {
    setHMirroredChannels((prev) => {
      const next = !prev[id];
      toast.info(next ? `Horizontal Mirror enabled for ${name}` : `Horizontal Mirror disabled for ${name}`);
      return { ...prev, [id]: next };
    });
  };

  const toggleVMirror = (id: string, name: string) => {
    setVMirroredChannels((prev) => {
      const next = !prev[id];
      toast.info(next ? `Vertical Mirror enabled for ${name}` : `Vertical Mirror disabled for ${name}`);
      return { ...prev, [id]: next };
    });
  };

  const toggleHD = (id: string, name: string) => {
    setHdChannels((prev) => {
      const isHD = !prev[id];
      toast.success(isHD ? `Stream switched to HD (1080p) for ${name}` : `Stream switched to Non-HD (SD 704x576) for ${name}`);
      return { ...prev, [id]: isHD };
    });
  };

  const setChannelRatio = (id: string, ratio: string, name: string) => {
    setRatioChannels((prev) => ({ ...prev, [id]: ratio }));
    toast.info(`Video aspect ratio set to ${ratio} for ${name}`);
  };

  const handleZoomIn = (id: string, name: string) => {
    setZoomChannels((prev) => {
      const current = prev[id] ?? 1.0;
      const next = Math.min(3.0, current + 0.25);
      toast.info(`Zoom level: ${Math.round(next * 100)}% on ${name}`);
      return { ...prev, [id]: next };
    });
  };

  const handleZoomOut = (id: string, name: string) => {
    setZoomChannels((prev) => {
      const current = prev[id] ?? 1.0;
      const next = Math.max(1.0, current - 0.25);
      toast.info(`Zoom level: ${Math.round(next * 100)}% on ${name}`);
      return { ...prev, [id]: next };
    });
  };

  const handleResetZoom = (id: string, name: string) => {
    setZoomChannels((prev) => ({ ...prev, [id]: 1.0 }));
    toast.info(`Zoom reset to 100% on ${name}`);
  };

  const handleTakeSnapshot = (feed: VideoChannelFeed) => {
    setFlashingChannelId(feed.id);
    setTimeout(() => setFlashingChannelId(null), 400);
    toast.success(`Snapshot captured for ${feed.deviceName} (${feed.channelName})`, {
      description: "Image saved to downloads frame folder",
    });
  };

  const handleTogglePiP = (feed: VideoChannelFeed) => {
    if (pipChannel?.id === feed.id) {
      setPipChannel(null);
      toast.info(`Closed Picture-in-Picture for ${feed.deviceName}`);
    } else {
      setPipChannel(feed);
      toast.success(`Picture-in-Picture activated for ${feed.deviceName} (${feed.channelName})`);
    }
  };

  const handleStartAll = () => {
    if (isAllPlaying) {
      setIsAllPlaying(false);
      const allPaused: Record<string, boolean> = {};
      channels.forEach((c) => {
        allPaused[c.id] = true;
      });
      setPausedChannels(allPaused);
      toast.info("Paused all camera video streams");
    } else {
      setIsAllPlaying(true);
      setPausedChannels({});
      toast.success("Started all live camera video streams");
    }
  };

  const setMatrixModeState = (enabled: boolean) => {
    setInternalMatrixMode(enabled);
    onToggleMatrixMode?.(enabled);
  };

  if ((!channels || channels.length === 0) && !intercomDevice) return null;

  // Single Video Card Renderer
  const renderVideoCard = (feed: VideoChannelFeed, isFeatured = false) => {
    const isMuted = mutedChannels[feed.id] ?? false;
    const isPaused = pausedChannels[feed.id] ?? !isAllPlaying;

    const isHMirrored = hMirroredChannels[feed.id] ?? false;
    const isVMirrored = vMirroredChannels[feed.id] ?? false;
    const isHD = hdChannels[feed.id] ?? false;
    const ratio = ratioChannels[feed.id] ?? "16:9";
    const zoomScale = zoomChannels[feed.id] ?? 1.0;
    const isFlashing = flashingChannelId === feed.id;

    return (
      <div
        key={feed.id}
        className={cn(
          "relative flex flex-col rounded-2xl overflow-hidden border border-[#DFE3EB] dark:border-slate-800 bg-black shadow-md group transition-all w-full shrink-0 select-none",
          layoutMode === "stack" ? "h-[255px]" : "h-full"
        )}
      >
        {/* Top Video Header Overlay Area */}
        <div className="absolute top-0 left-0 right-0 p-3.5 bg-gradient-to-b from-black/90 via-black/50 to-transparent text-white flex flex-col gap-1.5 z-20 pointer-events-none">
          {/* Row 1: Object Name (Left) + Channel Badge & Close Button X (Right) */}
          <div className="flex items-center justify-between w-full pointer-events-auto gap-2">
            <h3
              className="font-bold text-sm sm:text-base text-white tracking-tight drop-shadow-md truncate min-w-0"
              title={`Object: ${feed.deviceName}`}
            >
              {feed.deviceName}
            </h3>

            {/* Right: Channel Name Badge + Close Button X */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className="px-2 py-0.5 rounded-lg border border-sky-400/40 bg-sky-500/20 text-sky-300 font-mono text-[11px] font-bold shrink-0 truncate max-w-[150px] shadow-xs"
                title={`Channel: ${feed.channelName}`}
              >
                {feed.channelName}
              </span>

              <button
                type="button"
                onClick={() => onCloseChannel(feed.id)}
                className="p-1 rounded-lg bg-black/40 hover:bg-rose-600/80 text-white/80 hover:text-white transition-all cursor-pointer shrink-0"
                title={`Close ${feed.deviceName} ${feed.channelName}`}
              >
                <X className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* Row 2: Active Status (Left) & Single-Line Technical Metrics (Right) */}
          <div className="flex items-center justify-between w-full pointer-events-auto min-w-0">
            {/* Left: Status Dot & Active Label */}
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] shrink-0 whitespace-nowrap drop-shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active</span>
            </div>

            {/* Right: Technical Metrics in Single Horizontal Line */}
            <div className="flex items-center gap-1.5 text-right font-mono text-[11px] text-white/90 drop-shadow-md pointer-events-none shrink-0 font-medium">
              <div className="hidden group-hover:flex items-center gap-1.5 text-white/80">
                <span>{feed.fps ?? 25} fps</span>
                <span className="text-white/40">|</span>
                <span>{feed.dataUsed ?? "3.39 MB"}</span>
                <span className="text-white/40">|</span>
              </div>
              <span className="text-white/90 font-bold font-mono">
                {feed.bitrate ?? "1/40.34 kbps"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Location & Resolution Info Overlay Area (Slides up smoothly on hover above controllers toolbar) */}
        <div className="absolute left-0 right-0 px-3.5 flex items-end justify-between z-20 pointer-events-none transition-all duration-200 bottom-3 group-hover:bottom-[54px]">
          {/* Bottom-Left: Location Icon + Address (Wraps up to 2 lines cleanly for long addresses) */}
          <div
            className="flex items-start gap-1.5 text-xs text-white font-semibold drop-shadow-md max-w-[70%] pointer-events-auto"
            title={feed.location ?? "At Uffizio - Head Office"}
          >
            <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0 stroke-[2.2] mt-0.5" />
            <span className="text-[11px] sm:text-[12px] leading-tight font-semibold line-clamp-2">
              {feed.location ?? "At Uffizio - Head Office"}
            </span>
          </div>

          {/* Bottom-Right: Video Resolution */}
          <div className="text-[11px] font-mono text-white/90 font-semibold drop-shadow-md pointer-events-auto shrink-0 pb-0.5">
            {isHD ? "1920x1080 px" : (feed.resolution ?? "704x576 px")}
          </div>
        </div>

        {/* Telemetry Video Display Canvas Container */}
        <div className="relative w-full flex-1 bg-black overflow-hidden flex items-center justify-center">
          {/* Bottom dark gradient overlay for text & control legibility over video stream */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none transition-all duration-200 group-hover:h-36" />
          {/* Camera Feed Stream Image with Mirror & Zoom Transforms */}
          <img
            src={
              feed.snapshotUrl ||
              "/telematics/driver_cabin_2.png"
            }
            alt={`${feed.deviceName} ${feed.channelName}`}
            style={{
              transform: `scaleX(${isHMirrored ? -1 : 1}) scaleY(${isVMirrored ? -1 : 1}) scale(${zoomScale})`,
            }}
            className={cn(
              "w-full h-full transition-all duration-300",
              ratio === "Fill" ? "object-fill" : ratio === "4:3" ? "object-contain" : "object-cover",
              isPaused ? "opacity-40 grayscale-[40%]" : "opacity-90"
            )}
          />

          {/* Snapshot Shutter Flash Animation */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300" />
          )}

          {/* Paused Overlay Indicator */}
          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40">
              <div className="p-3.5 rounded-full bg-black/70 text-white border border-white/20 shadow-2xl animate-in zoom-in-90">
                <Play className="h-7 w-7 fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* HOVER VIDEO PLAYER CONTROLLER TOOLBAR (Matching Reference 1:1) */}
          <div className="absolute bottom-0 left-0 right-0 px-3.5 py-2.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
            {/* Left Controllers: Play/Pause Pill + Sound/Mute Box */}
            <div className="flex items-center gap-1.5">
              {/* Play / Pause Pill Button */}
              <button
                type="button"
                onClick={() => togglePlayPause(feed.id, `${feed.deviceName} ${feed.channelName}`)}
                className="h-9 px-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-all cursor-pointer active:scale-95 flex items-center justify-center shadow-md"
                title={isPaused ? "Play Stream" : "Pause Stream"}
              >
                {isPaused ? (
                  <Play className="h-4 w-4 fill-slate-900 stroke-none" />
                ) : (
                  <Pause className="h-4 w-4 fill-slate-900 stroke-none" />
                )}
              </button>

              {/* Sound / Mute Toggle Square */}
              <button
                type="button"
                onClick={() => toggleMute(feed.id, `${feed.deviceName} ${feed.channelName}`)}
                className="h-9 w-9 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/80 text-white transition-all cursor-pointer active:scale-95 flex items-center justify-center"
                title={isMuted ? "Sound On" : "Mute Sound"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 stroke-[2]" />
                ) : (
                  <Volume2 className="h-4 w-4 stroke-[2] text-emerald-400" />
                )}
              </button>

              {/* Live Intercom / 2-Way Audio Square */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenIntercom) {
                    onOpenIntercom({
                      id: feed.id,
                      name: feed.deviceName,
                      location: feed.location,
                    });
                  } else {
                    toast.info(`Starting Intercom session with ${feed.deviceName}...`);
                  }
                }}
                className="h-9 w-9 rounded-xl bg-black/60 backdrop-blur-md hover:bg-[#0089FF] text-white transition-all cursor-pointer active:scale-95 flex items-center justify-center"
                title="Live Intercom / Two-Way Audio"
              >
                <Radio className="h-4 w-4 stroke-[2]" />
              </button>
            </div>

            {/* Right Controllers: Snapshot, PiP, Settings Popover, Full View */}
            <div className="flex items-center gap-1.5">
              {/* 1. Take Snapshot */}
              <button
                type="button"
                onClick={() => handleTakeSnapshot(feed)}
                className="h-9 w-9 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/80 text-white transition-all cursor-pointer active:scale-95 flex items-center justify-center"
                title="Take Snapshot"
              >
                <Camera className="h-4 w-4 stroke-[2]" />
              </button>

              {/* 2. Picture in Picture */}
              <button
                type="button"
                onClick={() => handleTogglePiP(feed)}
                className={cn(
                  "h-9 w-9 rounded-xl backdrop-blur-md transition-all cursor-pointer active:scale-95 flex items-center justify-center text-white",
                  pipChannel?.id === feed.id ? "bg-[#0089FF] text-white" : "bg-black/60 hover:bg-black/80"
                )}
                title="Picture in Picture"
              >
                <PictureInPicture2 className="h-4 w-4 stroke-[2]" />
              </button>

              {/* 3. Video Player Settings Popover */}
              <VideoPlayerSettingsPopover
                feed={feed}
                isHMirrored={isHMirrored}
                isVMirrored={isVMirrored}
                isHD={isHD}
                currentRatio={ratio}
                zoomScale={zoomScale}
                onToggleHMirror={() => toggleHMirror(feed.id, feed.deviceName)}
                onToggleVMirror={() => toggleVMirror(feed.id, feed.deviceName)}
                onTakeSnapshot={() => handleTakeSnapshot(feed)}
                onToggleHD={() => toggleHD(feed.id, feed.deviceName)}
                onSetRatio={(r) => setChannelRatio(feed.id, r, feed.deviceName)}
                onZoomIn={() => handleZoomIn(feed.id, feed.deviceName)}
                onZoomOut={() => handleZoomOut(feed.id, feed.deviceName)}
                onResetZoom={() => handleResetZoom(feed.id, feed.deviceName)}
              />

              {/* 4. Full View / Fullscreen */}
              <button
                type="button"
                onClick={() => {
                  setSingleFullViewFeed(feed);
                  toast.success(`Full View opened for ${feed.deviceName} (${feed.channelName})`);
                }}
                className="h-9 w-9 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/80 text-white transition-all cursor-pointer active:scale-95 flex items-center justify-center"
                title="Full View (This Video Stream Only)"
              >
                <Maximize2 className="h-4 w-4 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden select-none z-30 pointer-events-auto transition-all duration-300 h-full w-full",
        isMatrixContainerFullscreen && "fixed inset-0 z-[99999] rounded-none border-0 shadow-none w-screen h-screen bg-white dark:bg-slate-950",
        className
      )}
    >
      {/* 1. Main Header Bar: 2 View Tabs (Map + Video & Matrix View) matching Object Panel Tabs */}
      <div className="flex items-center justify-between px-2.5 py-2 bg-white dark:bg-slate-900 shrink-0 border-b border-slate-200 dark:border-slate-800">
        {/* Left: 2 View Tabs with Pin as Default View */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {/* Tab 1: Map + Video View */}
          {!isMatrixMode ? (
            <div className="h-8 flex items-center rounded-lg text-xs font-semibold shadow-2xs transition-all shrink-0 bg-[#0089FF] text-white pl-2.5 pr-1 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMatrixModeState(false);
                  setInternalLayoutMode("stack");
                }}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-95 active:scale-98 transition-all"
                title="Map + Video View"
              >
                <MapPin className="h-3.5 w-3.5 stroke-[2.2] shrink-0" />
                <span>Map + Video</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePin("map_video");
                }}
                title={
                  pinnedView === "map_video"
                    ? "Map + Video is pinned as default view (Click to unpin)"
                    : "Pin Map + Video as default view (opens automatically on tab open)"
                }
                aria-label={
                  pinnedView === "map_video"
                    ? "Unpin Map + Video as default view"
                    : "Pin Map + Video as default view"
                }
                className={cn(
                  "h-6 w-6 rounded-md flex items-center justify-center transition-all cursor-pointer ml-0.5",
                  pinnedView === "map_video"
                    ? "bg-white/25 text-amber-300 hover:bg-white/35 shadow-2xs"
                    : "text-white/70 hover:text-white hover:bg-white/15"
                )}
              >
                <Pin
                  className={cn(
                    "h-3 w-3 transition-transform",
                    pinnedView === "map_video"
                      ? "fill-amber-300 text-amber-300 rotate-45"
                      : "-rotate-12"
                  )}
                />
              </button>
            </div>
          ) : (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMatrixModeState(false);
                  setInternalLayoutMode("stack");
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleTogglePin("map_video");
                }}
                title={
                  pinnedView === "map_video"
                    ? "Map + Video (Pinned Default) · Click to switch (Right-click to unpin)"
                    : "Map + Video · Click to switch (Right-click to pin as default)"
                }
                className="h-8 w-8 flex items-center justify-center rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0 active:scale-98"
              >
                <MapPin className="h-3.5 w-3.5 stroke-[2.2] shrink-0" />
              </button>

              {pinnedView === "map_video" && (
                <span
                  className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs pointer-events-none ring-2 ring-white dark:ring-slate-900"
                  title="Map + Video is pinned as default view"
                >
                  <Pin className="h-2 w-2 fill-white rotate-45" />
                </span>
              )}
            </div>
          )}

          {/* Tab 2: Matrix View */}
          {isMatrixMode ? (
            <div className="h-8 flex items-center rounded-lg text-xs font-semibold shadow-2xs transition-all shrink-0 bg-[#0089FF] text-white pl-2.5 pr-1 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMatrixModeState(true);
                  if (internalLayoutMode === "stack") {
                    const saved = (typeof window !== "undefined" && localStorage.getItem("trakzee_matrix_layout_mode")) as any;
                    setInternalLayoutMode(saved || "2x3");
                  }
                }}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-95 active:scale-98 transition-all"
                title="Matrix View"
              >
                <LayoutGrid className="h-3.5 w-3.5 stroke-[2.2] shrink-0" />
                <span>Matrix View</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePin("matrix");
                }}
                title={
                  pinnedView === "matrix"
                    ? "Matrix View is pinned as default view (Click to unpin)"
                    : "Pin Matrix View as default view (opens automatically on tab open)"
                }
                aria-label={
                  pinnedView === "matrix"
                    ? "Unpin Matrix View as default view"
                    : "Pin Matrix View as default view"
                }
                className={cn(
                  "h-6 w-6 rounded-md flex items-center justify-center transition-all cursor-pointer ml-0.5",
                  pinnedView === "matrix"
                    ? "bg-white/25 text-amber-300 hover:bg-white/35 shadow-2xs"
                    : "text-white/70 hover:text-white hover:bg-white/15"
                )}
              >
                <Pin
                  className={cn(
                    "h-3 w-3 transition-transform",
                    pinnedView === "matrix"
                      ? "fill-amber-300 text-amber-300 rotate-45"
                      : "-rotate-12"
                  )}
                />
              </button>
            </div>
          ) : (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMatrixModeState(true);
                  if (internalLayoutMode === "stack") {
                    const saved = (typeof window !== "undefined" && localStorage.getItem("trakzee_matrix_layout_mode")) as any;
                    setInternalLayoutMode(saved || "2x3");
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleTogglePin("matrix");
                }}
                title={
                  pinnedView === "matrix"
                    ? "Matrix View (Pinned Default) · Click to switch (Right-click to unpin)"
                    : "Matrix View · Click to switch (Right-click to pin as default)"
                }
                className="h-8 w-8 flex items-center justify-center rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0 active:scale-98"
              >
                <LayoutGrid className="h-3.5 w-3.5 stroke-[2.2] shrink-0" />
              </button>

              {pinnedView === "matrix" && (
                <span
                  className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs pointer-events-none ring-2 ring-white dark:ring-slate-900"
                  title="Matrix View is pinned as default view"
                >
                  <Pin className="h-2 w-2 fill-white rotate-45" />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Header Action Controls: Close All */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onCloseAll}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
            title="Close All Video Feeds"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 2. Sub-Toolbar Bar (Matching Preset Icons: 1, 4, 6, 9 & Full View) */}
      {isMatrixMode && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-slate-50/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs shrink-0 select-none">
          {/* Left Grid Layout Presets Selector */}
          <div className="flex items-center gap-1">
            {/* 1. Single Channel View (1x1) */}
            <button
              type="button"
              onClick={() => changeLayoutMode("1x1")}
              className={cn(
                "p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center",
                layoutMode === "1x1"
                  ? "bg-[#0089FF] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              )}
              title="1 Channel View (1x1)"
            >
              <Square className="h-4 w-4 stroke-[2]" />
            </button>

            {/* 2. 4 Channels Grid (2x2) */}
            <button
              type="button"
              onClick={() => changeLayoutMode("2x2")}
              className={cn(
                "p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center",
                layoutMode === "2x2"
                  ? "bg-[#0089FF] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              )}
              title="4 Channels View (2x2)"
            >
              <Grid2x2 className="h-4 w-4 stroke-[2]" />
            </button>

            {/* 3. 6 Channels Matrix View (6 Grid / 2x3) */}
            <button
              type="button"
              onClick={() => changeLayoutMode("2x3")}
              className={cn(
                "p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center",
                layoutMode === "2x3"
                  ? "bg-[#0089FF] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              )}
              title="6 Channels View (6 Grid)"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-none stroke-current stroke-[2]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="5" height="8" rx="1" />
                <rect x="9.5" y="3" width="5" height="8" rx="1" />
                <rect x="16" y="3" width="5" height="8" rx="1" />
                <rect x="3" y="13" width="5" height="8" rx="1" />
                <rect x="9.5" y="13" width="5" height="8" rx="1" />
                <rect x="16" y="13" width="5" height="8" rx="1" />
              </svg>
            </button>

            {/* 4. 9 Channels Grid (3x3) */}
            <button
              type="button"
              onClick={() => changeLayoutMode("3x3")}
              className={cn(
                "p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center",
                layoutMode === "3x3"
                  ? "bg-[#0089FF] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              )}
              title="9 Channels View (3x3)"
            >
              <Grid3x3 className="h-4 w-4 stroke-[2]" />
            </button>

            {/* 5. Full View (Fullscreen Matrix Container Toggle) */}
            <button
              type="button"
              onClick={() => setIsMatrixContainerFullscreen((prev) => !prev)}
              className={cn(
                "p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center ml-1 border-l border-slate-200 dark:border-slate-800 pl-2",
                isMatrixContainerFullscreen
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              )}
              title={isMatrixContainerFullscreen ? "Exit Full View (ESC)" : "Full View Matrix Mode"}
            >
              <Maximize className="h-4 w-4 stroke-[2]" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Camera Cards Container Workspace */}
      {layoutMode === "1x1" && isMatrixMode ? (
        /* Mode 1: 1 Channel Full View (1x1) */
        <div className="flex-1 p-2 bg-slate-100 dark:bg-slate-950 overflow-hidden min-h-0 h-full w-full">
          {visibleFeeds.length > 0 && renderVideoCard(visibleFeeds[0], true)}
        </div>
      ) : layoutMode === "2x2" && isMatrixMode ? (
        /* Mode 2: 4 Channels Grid View (2x2) */
        <div className="flex-1 p-2 bg-slate-100 dark:bg-slate-950 overflow-hidden min-h-0 h-full w-full grid grid-cols-2 grid-rows-2 gap-2">
          {visibleFeeds.map((feed) => (
            <div key={feed.id} className="h-full w-full min-h-0 flex flex-col overflow-hidden">
              {renderVideoCard(feed, false)}
            </div>
          ))}
        </div>
      ) : layoutMode === "2x3" && isMatrixMode ? (
        /* Mode 3: 6 Channels Asymmetric Matrix View (1 Large + 5 Small) */
        <div className="flex-1 p-2 bg-slate-100 dark:bg-slate-950 overflow-hidden min-h-0 h-full w-full grid grid-cols-3 grid-rows-3 gap-2">
          {visibleFeeds.map((feed, idx) => (
            <div
              key={feed.id}
              className={cn(
                "h-full w-full min-h-0 flex flex-col overflow-hidden",
                idx === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
              )}
            >
              {renderVideoCard(feed, idx === 0)}
            </div>
          ))}
        </div>
      ) : layoutMode === "3x3" && isMatrixMode ? (
        /* Mode 4: 9 Channels Grid View (3x3) */
        <div className="flex-1 p-2 bg-slate-100 dark:bg-slate-950 overflow-hidden min-h-0 h-full w-full grid grid-cols-3 grid-rows-3 gap-2">
          {visibleFeeds.map((feed) => (
            <div key={feed.id} className="h-full w-full min-h-0 flex flex-col overflow-hidden">
              {renderVideoCard(feed, false)}
            </div>
          ))}
        </div>
      ) : (
        /* Default Stack Mode (Side Panel List) */
        <div className="flex-1 overflow-y-auto p-2.5 bg-slate-100 dark:bg-slate-950 custom-scrollbar space-y-2.5 min-h-0">
          {channels.map((feed) => renderVideoCard(feed, false))}
        </div>
      )}

      {/* 4. Bottom Footer Pagination Bar (Matching Old Application Screenshots) */}
      {isMatrixMode && (
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs shrink-0 select-none">
          <div className="text-[11px] font-medium text-slate-500">
            Showing {channels.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + pageSize, channels.length)} of {channels.length} feeds
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className={cn(
                "h-6 w-6 rounded flex items-center justify-center border transition-all",
                currentPage <= 1
                  ? "border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5 stroke-[2]" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                type="button"
                onClick={() => setActivePage(pg)}
                className={cn(
                  "h-6 w-6 rounded flex items-center justify-center text-xs font-bold cursor-pointer transition-all",
                  currentPage === pg
                    ? "bg-[#0089FF] text-white shadow-2xs"
                    : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {pg}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setActivePage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className={cn(
                "h-6 w-6 rounded flex items-center justify-center border transition-all",
                currentPage >= totalPages
                  ? "border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              )}
            >
              <ChevronRight className="h-3.5 w-3.5 stroke-[2]" />
            </button>
          </div>
        </div>
      )}

      {/* Single Video Stream Full View Fullscreen Modal */}
      {singleFullViewFeed && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col backdrop-blur-xl animate-in fade-in-90 duration-200">
          {/* Top Fullscreen Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black via-black/80 to-transparent border-b border-white/10 text-white select-none">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                {singleFullViewFeed.deviceName}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-sky-500/30 border border-sky-400/40 text-sky-300 font-mono text-xs font-bold">
                {singleFullViewFeed.channelName}
              </span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs ml-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Live Stream
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono text-xs text-slate-300 hidden sm:block">
                <span>{singleFullViewFeed.location ?? "At Uffizio - Head Office"}</span>
                <span className="mx-2 text-slate-500">•</span>
                <span className="text-emerald-300">{hdChannels[singleFullViewFeed.id] ? "1080p HD" : "704x576 SD"}</span>
              </div>
              <button
                type="button"
                onClick={() => setSingleFullViewFeed(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-all cursor-pointer"
                title="Exit Full View"
              >
                <X className="h-6 w-6 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Fullscreen Video Canvas */}
          <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden p-4">
            <img
              src={
                singleFullViewFeed.snapshotUrl ||
                "/telematics/driver_cabin_2.png"
              }
              alt={singleFullViewFeed.deviceName}
              style={{
                transform: `scaleX(${hMirroredChannels[singleFullViewFeed.id] ? -1 : 1}) scaleY(${vMirroredChannels[singleFullViewFeed.id] ? -1 : 1})`,
              }}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />

            {/* Bottom Fullscreen Overlay Player Bar */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => togglePlayPause(singleFullViewFeed.id, singleFullViewFeed.deviceName)}
                  className="p-2.5 rounded-xl bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer"
                >
                  {pausedChannels[singleFullViewFeed.id] ? (
                    <Play className="h-6 w-6 fill-white stroke-none" />
                  ) : (
                    <Pause className="h-6 w-6 fill-white stroke-none" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => toggleMute(singleFullViewFeed.id, singleFullViewFeed.deviceName)}
                  className="p-2.5 rounded-xl bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer"
                >
                  {mutedChannels[singleFullViewFeed.id] ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6 text-emerald-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">{currentTime}</span>
                <span>•</span>
                <span>25 fps</span>
                <span>•</span>
                <span>3.39 MB</span>
                <span>•</span>
                <span className="text-sky-300 font-bold">40.34 kbps</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTakeSnapshot(singleFullViewFeed)}
                  className="p-2.5 rounded-xl bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer"
                  title="Snapshot"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSingleFullViewFeed(null)}
                  className="p-2.5 rounded-xl bg-white/15 hover:bg-rose-600 text-white transition-all cursor-pointer"
                  title="Close Full View"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Picture in Picture Mini Player */}
      {pipChannel && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-48 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#0089FF] bg-black animate-in slide-in-from-bottom-5 duration-300 group">
          <img
            src={pipChannel.snapshotUrl || "/telematics/driver_cabin_2.png"}
            alt={pipChannel.deviceName}
            style={{
              transform: `scaleX(${hMirroredChannels[pipChannel.id] ? -1 : 1}) scaleY(${vMirroredChannels[pipChannel.id] ? -1 : 1})`,
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between text-white text-xs font-semibold">
            <span className="truncate pr-2">{pipChannel.deviceName} ({pipChannel.channelName})</span>
            <button
              type="button"
              onClick={() => setPipChannel(null)}
              className="p-1 rounded-md bg-black/50 hover:bg-rose-600 text-white transition-all cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
