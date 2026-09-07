import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gauge,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { type FleetObject } from "@/data/fleet";
import { cn } from "@/lib/utils";

export function RoutePlaybackBar({
  vehicle,
  onClose,
  className,
}: {
  vehicle: FleetObject;
  onClose: () => void;
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35); // 0 to 100%
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2 | 5 | 10>(1);

  // Playback timer simulation
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1 * speedMultiplier));
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speedMultiplier]);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/98 backdrop-blur-xl shadow-2xl p-3 text-xs animate-in slide-in-from-bottom-4 duration-200 select-none",
        className,
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-border pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="font-bold text-xs text-foreground">
            Route Playback · {vehicle.name}
          </h4>
          <span className="text-[11px] text-muted-foreground font-mono">
            Date: 27-08-2026 (08:00 AM → 11:30 AM)
          </span>
        </div>

        {/* Speed Controls & Close */}
        <div className="flex items-center gap-2">
          {/* Speed Multiplier Pill */}
          <div className="flex items-center bg-surface-muted rounded-md p-0.5 border border-border text-[10px] font-bold">
            {([1, 2, 5, 10] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeedMultiplier(s)}
                className={cn(
                  "px-2 py-0.5 rounded transition-colors cursor-pointer",
                  speedMultiplier === s
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Center Scrubber Progress Bar */}
      <div className="space-y-1.5 mb-2.5">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span>08:15 AM · Kolaka Depot (0 km)</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            Speed: {Math.round(12 + (progress % 40))} km/h · Odo: 66,460 km
          </span>
          <span>11:22 AM · Kendari Port (288.44 km)</span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between text-xs">
        {/* Play / Pause / Skip */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setProgress(0)}
            title="Restart playback"
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setProgress((p) => Math.max(0, p - 10))}
            title="Previous 10 mins"
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setProgress((p) => Math.min(100, p + 10))}
            title="Next 10 mins"
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Live Trip Telemetry Stat Pills */}
        <div className="flex items-center gap-2 text-[11px]">
          <div className="flex items-center gap-1 bg-surface-muted px-2 py-0.5 rounded border border-border">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono">
              Trip: {((progress / 100) * 3.2).toFixed(1)} hrs
            </span>
          </div>
          <div className="flex items-center gap-1 bg-surface-muted px-2 py-0.5 rounded border border-border">
            <MapPin className="h-3 w-3 text-blue-600" />
            <span className="font-mono">
              {((progress / 100) * 288.44).toFixed(1)} km
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
