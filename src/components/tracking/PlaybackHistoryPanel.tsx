import { useState } from "react";
import {
  RotateCcw,
  X,
  Play,
  Pause,
  Download,
  Search,
  Calendar,
  Clock,
  Film,
  FileVideo,
  AlertTriangle,
  Volume2,
  VolumeX,
  Maximize2,
  Camera,
  MapPin,
  ChevronRight,
  Filter,
  Loader2,
  MoreVertical,
  FlipHorizontal,
  FlipVertical,
  Tv,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface PlaybackDeviceProps {
  deviceName: string;
  channelName?: string;
  location?: string;
  channels?: string[];
  scenario?: 1 | 2 | 3;
}

interface PlaybackHistoryPanelProps {
  device: PlaybackDeviceProps;
  onClose: () => void;
  className?: string;
}

// 3-Dots Action Popover for Event List Items (Play & Download Options matching Trakzee Theme)
function EventActionPopover({
  eventInfo,
  onPlay,
  onDownload,
}: {
  eventInfo: string;
  onPlay?: () => void;
  onDownload?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="More Actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-40 p-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-[#DFE3EB] dark:border-slate-800 shadow-xl rounded-xl text-xs space-y-0.5 z-[100]"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onPlay) onPlay();
            else toast.info(`Playing video for ${eventInfo}`);
            setIsOpen(false);
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left font-semibold transition-colors cursor-pointer"
        >
          <Play className="h-3.5 w-3.5 text-[#0089FF] fill-[#0089FF]" />
          <span>Play Video</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onDownload) onDownload();
            else toast.success(`Downloading clip for ${eventInfo}`);
            setIsOpen(false);
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left font-semibold transition-colors cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-[#0089FF] stroke-[2.2]" />
          <span>Download</span>
        </button>
      </PopoverContent>
    </Popover>
  );
}

export function PlaybackHistoryPanel({
  device,
  onClose,
  className,
}: PlaybackHistoryPanelProps) {
  // Scenario state (1: No channel dropdown + Tabs, 2: Channel dropdown + Tabs, 3: Channel dropdown + Search & Download + No Tabs)
  const [activeScenario, setActiveScenario] = useState<1 | 2 | 3>(
    device.scenario || 2
  );

  // Fetch state for initial empty state UX
  const [hasFetched, setHasFetched] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Device channels setup
  const availableChannels = device.channels || ["CH1", "CH2", "CH3", "CH4"];
  const isMultiChannel = availableChannels.length > 1;

  const [selectedChannel, setSelectedChannel] = useState<string>(
    device.channelName || (isMultiChannel && activeScenario !== 1 ? "CH1" : availableChannels[0] || "CH1")
  );

  const [selectedDate, setSelectedDate] = useState<string>("2026-10-08");
  const [startTime, setStartTime] = useState<string>("00:00 AM");
  const [endTime, setEndTime] = useState<string>("01:45 PM");

  const [activeTab, setActiveTab] = useState<"timeline" | "files" | "events">("timeline");
  const [scrubberTime, setScrubberTime] = useState<number>(360); // 06:00 AM in minutes

  // Video Preview Player Controls state for Event List & Timeline
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(true);
  const [isPreviewMuted, setIsPreviewMuted] = useState<boolean>(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);

  // Individual video play states
  const [playingFeeds, setPlayingFeeds] = useState<Record<string, boolean>>({
    CH1: true,
    CH2: true,
    CH3: true,
    CH4: true,
  });

  // Filtered feeds list based on channel selector & scenario
  const activeFeedsToDisplay =
    activeScenario === 1
      ? availableChannels
      : selectedChannel === "All Channels"
      ? availableChannels
      : [selectedChannel];

  // Helper time formatter (minutes to HH:MM)
  const formatMinutesToTime = (totalMin: number) => {
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    const padH = String(hrs).padStart(2, "0");
    const padM = String(mins).padStart(2, "0");
    return `${padH}:${padM}`;
  };

  const handleFetch = () => {
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      setHasFetched(true);
      toast.success(`Loaded video playback for ${selectedDate} (${startTime} - ${endTime})`, {
        description: activeScenario === 1 ? `Device: ${device.deviceName}` : `Channel: ${selectedChannel}`,
      });
    }, 400);
  };

  const handleDownload = () => {
    toast.success(`Downloading playback archive for ${device.deviceName}`, {
      description: `Channel: ${selectedChannel} · Date: ${selectedDate}`,
    });
  };

  const toggleFeedPlay = (ch: string) => {
    setPlayingFeeds((prev) => {
      const next = !prev[ch];
      toast.info(next ? `Resumed playback on ${ch}` : `Paused playback on ${ch}`);
      return { ...prev, [ch]: next };
    });
  };

  // File List Information (Matches Reference Image 1 Content)
  const fileListData = Array.from({ length: 16 }, (_, i) => ({
    id: `cam-${i + 1}`,
    channel: `Cam ${i + 1}`,
    startTime: i === 13 ? "2025-11-06 00:00:00" : "2024-03-15 14:00:00",
    endTime: i === 13 ? "2024-03-15 14:00:00" : "2024-03-15 14:15:00",
    duration: "00:15:00",
  }));

  // Event List Information (Matches Reference Image 2 Content)
  const eventListData = [
    { id: "ev-1", dateTime: "2024-03-15 14:00:00", type: "DMS", info: "Eye Closed", location: "Primary School....", feedUrl: "/telematics/driver_fatigue_rubbing_eyes.png" },
    { id: "ev-2", dateTime: "2024-03-15 14:00:00", type: "ADAS", info: "Driver on Call", location: "Near Abrama", feedUrl: "/telematics/driver_cabin_2.png" },
    { id: "ev-3", dateTime: "2024-03-15 14:00:00", type: "DMS", info: "Yawn", location: "Near Abrama", feedUrl: "/telematics/driver_fatigue_rubbing_eyes.png" },
    { id: "ev-4", dateTime: "2024-03-15 14:00:00", type: "ADAS", info: "Eye Closed", location: "Near Abrama", feedUrl: "/telematics/driver_cabin_2.png" },
    { id: "ev-5", dateTime: "2024-03-15 14:00:00", type: "DMS", info: "Driver on Call", location: "Near Abrama", feedUrl: "/telematics/driver_smoking.png" },
    { id: "ev-6", dateTime: "2024-03-15 14:00:00", type: "DMS", info: "Driver on Call", location: "Near Abrama", feedUrl: "/telematics/driver_smoking.png" },
    { id: "ev-7", dateTime: "2024-03-15 14:00:00", type: "ADAS", info: "Eye Closed", location: "Near Abrama", feedUrl: "/telematics/driver_fatigue_rubbing_eyes.png" },
    { id: "ev-8", dateTime: "2024-03-15 14:00:00", type: "ADAS", info: "Eye Closed", location: "Near Abrama", feedUrl: "/telematics/driver_fatigue_rubbing_eyes.png" },
    { id: "ev-9", dateTime: "2024-03-15 14:00:00", type: "DMS", info: "Driver on Call", location: "Near Abrama", feedUrl: "/telematics/driver_smoking.png" },
    { id: "ev-10", dateTime: "2024-03-15 14:00:00", type: "ADAS", info: "Eye Closed", location: "Near Abrama", feedUrl: "/telematics/driver_fatigue_rubbing_eyes.png" },
  ];

  return (
    <div
      className={cn(
        "flex flex-col w-full h-auto max-h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-[#DFE3EB] dark:border-slate-800 shadow-2xl overflow-hidden pointer-events-auto select-none",
        className
      )}
    >
      {/* 1. Original Header Bar matching Trakzee Theme */}
      <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5">
          <RotateCcw className="h-4 w-4 text-[#0089FF] stroke-[2.2] animate-spin-slow shrink-0" />
          <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 tracking-tight">
            Playback History
          </span>
        </div>

        {/* Interactive Scenario Toggle Pills */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-[#DFE3EB] dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveScenario(1)}
              className={cn(
                "px-1.5 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                activeScenario === 1
                  ? "bg-[#0089FF] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
              title="Scenario 1: Single Line (Date + Times + Search)"
            >
              S1
            </button>
            <button
              type="button"
              onClick={() => setActiveScenario(2)}
              className={cn(
                "px-1.5 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                activeScenario === 2
                  ? "bg-[#0089FF] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
              title="Scenario 2: Single Line (Channel + Date + Times + Search)"
            >
              S2
            </button>
            <button
              type="button"
              onClick={() => setActiveScenario(3)}
              className={cn(
                "px-1.5 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                activeScenario === 3
                  ? "bg-[#0089FF] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
              title="Scenario 3: Single Line (Channel + Date + Times + Search + Download - No Tabs)"
            >
              S3
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer ml-0.5"
            title="Close Playback History"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 2. Original Search Filter Toolbar (11px labels, 12px values) */}
      <div className="p-3.5 bg-slate-50/70 dark:bg-slate-950/80 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0 space-y-3 text-xs">
        {activeScenario === 1 ? (
          /* SCENARIO 1 FILTER LAYOUT: No Channel Dropdown (Date, Start Time, End Time + Fetch Playback) */
          <>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                  Date Selection
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-8 w-full px-2 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg text-[12px] font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all cursor-pointer shadow-2xs"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                  Start Time
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-8 w-full px-2 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg text-[12px] font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all shadow-2xs"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                  End Time
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-8 w-full px-2 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg text-[12px] font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleFetch}
              disabled={isFetching}
              className="w-full h-8.5 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] active:bg-[#005bb5] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98 disabled:opacity-75"
            >
              {isFetching ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Loading Video...</span>
                </>
              ) : (
                <>
                  <Film className="h-3.5 w-3.5 stroke-[2.2]" />
                  <span>Load Video</span>
                </>
              )}
            </button>
          </>
        ) : activeScenario === 2 ? (
          /* SCENARIO 2 FILTER LAYOUT: Single line for Channel, Date, Start Time, End Time + Load Video underneath */
          <>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                  Channel
                </label>
                <Select value={selectedChannel} onValueChange={(val) => setSelectedChannel(val)}>
                  <SelectTrigger className="h-8 w-full px-1.5 sm:px-2 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg text-[11px] sm:text-[12px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all cursor-pointer shadow-2xs">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl shadow-xl p-1">
                    <SelectItem value="All Channels" className="text-[12px] font-semibold hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer rounded-lg">
                      All Channels
                    </SelectItem>
                    {availableChannels.map((ch) => (
                      <SelectItem key={ch} value={ch} className="text-[12px] font-semibold hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer rounded-lg">
                        {ch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                  Date Selection
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-8 w-full px-1.5 sm:px-2 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg text-[11px] sm:text-[12px] font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all cursor-pointer shadow-2xs"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                  Start Time
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-8 w-full px-1.5 sm:px-2 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg text-[11px] sm:text-[12px] font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all shadow-2xs"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                  End Time
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-8 w-full px-1.5 sm:px-2 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg text-[11px] sm:text-[12px] font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleFetch}
              disabled={isFetching}
              className="w-full h-8.5 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] active:bg-[#005bb5] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98 disabled:opacity-75"
            >
              {isFetching ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Loading Video...</span>
                </>
              ) : (
                <>
                  <Film className="h-3.5 w-3.5 stroke-[2.2]" />
                  <span>Load Video</span>
                </>
              )}
            </button>
          </>
        ) : (
          /* SCENARIO 3 FILTER LAYOUT: Single line for Channel, Date, Start Time, End Time + Load Video & Download underneath */
          <>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                  Channel
                </label>
                <Select value={selectedChannel} onValueChange={(val) => setSelectedChannel(val)}>
                  <SelectTrigger className="h-8 w-full px-1.5 sm:px-2 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg text-[11px] sm:text-[12px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all cursor-pointer shadow-2xs">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-xl shadow-xl p-1">
                    <SelectItem value="All Channels" className="text-[12px] font-semibold hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer rounded-lg">
                      All Channels
                    </SelectItem>
                    {availableChannels.map((ch) => (
                      <SelectItem key={ch} value={ch} className="text-[12px] font-semibold hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer rounded-lg">
                        {ch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                  Date Selection
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-8 w-full px-1.5 sm:px-2 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg text-[11px] sm:text-[12px] font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all cursor-pointer shadow-2xs"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                  Start Time
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-8 w-full px-1.5 sm:px-2 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg text-[11px] sm:text-[12px] font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all shadow-2xs"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                  End Time
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-8 w-full px-1.5 sm:px-2 bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-700 rounded-lg text-[11px] sm:text-[12px] font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-0.5">
              <button
                type="button"
                onClick={handleFetch}
                disabled={isFetching}
                className="flex-1 h-8.5 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] active:bg-[#005bb5] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98 disabled:opacity-75"
              >
                {isFetching ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Film className="h-3.5 w-3.5 stroke-[2.2]" />
                )}
                <span>Load Video</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 h-8.5 rounded-lg bg-[#1E3A8A] hover:bg-[#172e6e] active:bg-[#122457] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <Download className="h-3.5 w-3.5 stroke-[2.2]" />
                <span>Download</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* 3. Sub-Tabs Header (Text Only - Timeline, File List, Event List) */}
      {activeScenario !== 3 && (
        <div className="flex items-center border-b border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 px-2 pt-1 gap-1 text-xs select-none">
          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={cn(
              "flex-1 py-2 font-bold text-center border-b-2 transition-all cursor-pointer flex items-center justify-center",
              activeTab === "timeline"
                ? "border-[#0089FF] text-[#0089FF]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <span>Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("files")}
            className={cn(
              "flex-1 py-2 font-bold text-center border-b-2 transition-all cursor-pointer flex items-center justify-center",
              activeTab === "files"
                ? "border-[#0089FF] text-[#0089FF]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <span>File List</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("events")}
            className={cn(
              "flex-1 py-2 font-bold text-center border-b-2 transition-all cursor-pointer flex items-center justify-center",
              activeTab === "events"
                ? "border-[#0089FF] text-[#0089FF]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <span>Event List</span>
          </button>
        </div>
      )}

      {/* 4. Tab Body Content */}
      <div className="flex-1 overflow-hidden bg-slate-100 dark:bg-slate-950 flex flex-col min-h-0">
        {!hasFetched ? (
          /* INITIAL EMPTY STATE BEFORE FETCHING */
          <div className="py-12 px-5 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-xl border border-[#DFE3EB] dark:border-slate-800 space-y-3 m-3 shadow-2xs">
            <div className="p-3.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-[#0089FF] border border-sky-100 dark:border-sky-900/50 shadow-2xs">
              <Film className="h-7 w-7 stroke-[1.8]" />
            </div>
            <div className="space-y-1 max-w-[300px]">
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                No Playback Footage Loaded
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Select date, time range, and channel above, then click <span className="font-bold text-[#0089FF]">Load Video</span> to retrieve recordings.
              </p>
            </div>
          </div>
        ) : activeScenario === 3 || activeTab === "timeline" ? (
          /* SCENARIO 3 OR TAB 1: TIMELINE VIEW */
          <div className="flex-1 overflow-y-auto p-2.5 space-y-3 custom-scrollbar min-h-0">
            {activeFeedsToDisplay.map((ch) => {
              const isPlaying = playingFeeds[ch] ?? true;

              return (
                <div
                  key={ch}
                  className="rounded-xl border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Card Header Overlay */}
                  <div className="px-3 py-2 bg-slate-900 text-white flex items-center justify-between text-xs font-semibold shrink-0">
                    <div className="flex items-center gap-2 truncate max-w-[260px]">
                      <span className="font-bold text-white truncate">
                        {device.deviceName}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/40">
                        {ch}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-emerald-400 font-semibold shrink-0">
                      25 fps | 3.39 MB
                    </div>
                  </div>

                  {/* Video Player Display Screen */}
                  <div className="relative h-48 w-full bg-black overflow-hidden flex items-center justify-center group">
                    <img
                      src={
                        ch === "CH1"
                          ? "/telematics/driver_cabin_2.png"
                          : ch === "CH2"
                          ? "/telematics/driver_fatigue_rubbing_eyes.png"
                          : ch === "CH3"
                          ? "/telematics/driver_smoking.png"
                          : "/telematics/cargo_hold.png"
                      }
                      alt={`Playback ${device.deviceName} ${ch}`}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-300",
                        !isPlaying && "brightness-75 blur-[1px]"
                      )}
                    />

                    {/* Center Play/Pause Overlay */}
                    <button
                      type="button"
                      onClick={() => toggleFeedPlay(ch)}
                      className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-black/60 hover:bg-[#0089FF] text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95 group-hover:scale-110"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 stroke-[2.5]" />
                      ) : (
                        <Play className="h-5 w-5 stroke-[2.5] ml-0.5" />
                      )}
                    </button>

                    {/* Bottom Status & Timestamp Overlay */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/90 drop-shadow-md pointer-events-none">
                      <span className="bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs">
                        {selectedDate} {formatMinutesToTime(scrubberTime)}:00
                      </span>
                      <span className="bg-emerald-500/80 text-white px-2 py-0.5 rounded font-bold backdrop-blur-xs">
                        {isPlaying ? "PLAYING" : "PAUSED"}
                      </span>
                    </div>
                  </div>

                  {/* 24-Hour Scrubber Timeline Bar */}
                  {activeScenario !== 3 && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border-t border-[#DFE3EB] dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                        <span>00:00</span>
                        <span>04:00</span>
                        <span>08:00</span>
                        <span>12:00</span>
                        <span>16:00</span>
                        <span>20:00</span>
                        <span>24:00</span>
                      </div>

                      {/* Colored Recording Segments Bar */}
                      <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md overflow-hidden cursor-pointer">
                        <div className="absolute left-[10%] w-[35%] h-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" title="Recorded footage (02:24 - 10:48)" />
                        <div className="absolute left-[50%] w-[40%] h-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" title="Recorded footage (12:00 - 21:36)" />
                        <div className="absolute left-[22%] w-[2%] h-full bg-rose-500" title="DMS Fatigue Event Alert" />
                        <div className="absolute left-[68%] w-[2%] h-full bg-amber-500" title="Speeding Motion Alert" />

                        {/* Interactive Time Scrubber Line */}
                        <input
                          type="range"
                          min={0}
                          max={1440}
                          value={scrubberTime}
                          onChange={(e) => setScrubberTime(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        {/* Scrubber Pin Indicator */}
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-[#0089FF] shadow-md z-0 pointer-events-none"
                          style={{ left: `${(scrubberTime / 1440) * 100}%` }}
                        >
                          <div className="h-2 w-2 rounded-full bg-[#0089FF] -ml-0.5 -mt-0.5 shadow-sm" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : activeTab === "files" ? (
          /* TAB 2: RECORDED FILE LIST VIEW (Matches Information in Reference Image 1) */
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900">
            {/* Scrollable File List Table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-[#DFE3EB] dark:border-slate-700 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-2 text-center">Start Time</th>
                    <th className="py-2.5 px-2 text-center">End Time</th>
                    <th className="py-2.5 px-2 text-center">Duration</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE3EB] dark:divide-slate-800 text-[11px] font-mono">
                  {fileListData.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-sky-50/60 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <td className="py-2 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                        {file.channel}
                      </td>
                      <td className="py-2 px-2 text-center text-slate-600 dark:text-slate-400">
                        {file.startTime}
                      </td>
                      <td className="py-2 px-2 text-center text-slate-600 dark:text-slate-400">
                        {file.endTime}
                      </td>
                      <td className="py-2 px-2 text-center text-slate-600 dark:text-slate-400">
                        {file.duration}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toast.success(`Downloading recording for ${file.channel}`)}
                          className="p-1 rounded text-[#254796] hover:text-[#0089FF] hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="Download Video File"
                        >
                          <Download className="h-4 w-4 stroke-[2.2]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom XLS Export Button (Exact Match to Reference Image 1) */}
            <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-[#DFE3EB] dark:border-slate-800 flex justify-center shrink-0">
              <button
                type="button"
                onClick={() => toast.success("Exported File List to Excel (.xlsx)")}
                className="px-10 py-1.5 rounded-md bg-[#254796] hover:bg-[#1e3a7a] active:bg-[#162c5e] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-98"
              >
                <span>XLS</span>
              </button>
            </div>
          </div>
        ) : (
          /* TAB 3: TELEMATICS EVENT LIST VIEW (Matches Information in Reference Image 2) */
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900">
            {/* Top Video Preview Box (Matches Reference Image 2 Video Preview) */}
            <div className="relative h-44 w-full bg-black shrink-0 overflow-hidden flex items-center justify-center group border-b border-[#DFE3EB] dark:border-slate-800">
              <img
                src={eventListData[selectedEventIndex]?.feedUrl || "/telematics/driver_fatigue_rubbing_eyes.png"}
                alt="Event Video Preview"
                className={cn(
                  "w-full h-full object-cover transition-all duration-300",
                  !isPreviewPlaying && "brightness-75 blur-[1px]"
                )}
              />

              {/* Video Player Control Bar (Play, Progress Bar 0:30 / 1:00, Volume, Settings) */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 flex items-center gap-3 text-white text-xs z-10">
                <button
                  type="button"
                  onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  {isPreviewPlaying ? (
                    <Pause className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    <Play className="h-4 w-4 stroke-[2.5]" />
                  )}
                </button>

                <div className="flex items-center gap-2 flex-1">
                  <span className="font-mono text-[10px] text-white/80">0:30</span>
                  <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden relative cursor-pointer">
                    <div className="h-full w-1/2 bg-[#0089FF] rounded-full" />
                  </div>
                  <span className="font-mono text-[10px] text-white/80">1:00</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPreviewMuted(!isPreviewMuted)}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  {isPreviewMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toast.info("Expanded full video screen")}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Event List Table (Matches Reference Image 2 Table) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-[#DFE3EB] dark:border-slate-700 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-2.5">Date Time</th>
                    <th className="py-2.5 px-2">Type</th>
                    <th className="py-2.5 px-2">Information</th>
                    <th className="py-2.5 px-2">Location</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE3EB] dark:divide-slate-800 text-[11px]">
                  {eventListData.map((evt, index) => {
                    const isSelected = selectedEventIndex === index;

                    return (
                      <tr
                        key={evt.id}
                        onClick={() => {
                          setSelectedEventIndex(index);
                          toast.info(`Selected Event: ${evt.type} - ${evt.info}`);
                        }}
                        className={cn(
                          "transition-colors cursor-pointer",
                          isSelected
                            ? "bg-sky-100/70 dark:bg-sky-950/60 font-semibold"
                            : "hover:bg-sky-50/60 dark:hover:bg-slate-800/60"
                        )}
                      >
                        <td className="py-2 px-2.5 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {evt.dateTime}
                        </td>
                        <td className="py-2 px-2 font-bold text-slate-800 dark:text-slate-200">
                          {evt.type}
                        </td>
                        <td className="py-2 px-2 text-slate-800 dark:text-slate-200">
                          {evt.info}
                        </td>
                        <td className="py-2 px-2 text-slate-600 dark:text-slate-400 truncate max-w-[110px]">
                          {evt.location}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <EventActionPopover eventInfo={`${evt.type} - ${evt.info}`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
