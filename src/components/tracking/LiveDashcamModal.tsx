import {
  Camera,
  Download,
  Maximize2,
  Mic,
  Radio,
  RefreshCw,
  Video,
  Volume2,
  X,
} from "lucide-react";
import { useState } from "react";
import { type FleetObject } from "@/data/fleet";
import { cn } from "@/lib/utils";

export function LiveDashcamModal({
  vehicle,
  onClose,
}: {
  vehicle: FleetObject;
  onClose: () => void;
}) {
  const [activeChannel, setActiveChannel] = useState<1 | 2 | 3>(1);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close Dashcam"
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
      />
      <div className="relative z-10 w-full max-w-3xl rounded-lg border border-border bg-surface text-foreground shadow-xl overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150 select-none">
        {/* Header */}
        <header className="flex h-[56px] items-center justify-between border-b border-border px-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-[16px] font-semibold tracking-tight">
              Live Dashcam · {vehicle.name}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close Dashcam"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {/* Simulated Dashcam Video Frame */}
          <img
            src={
              activeChannel === 1
                ? "/telematics/driver_cabin_1.jpg"
                : activeChannel === 2
                  ? "/telematics/driver_fatigue_rubbing_eyes.png"
                  : "/telematics/cargo_hold.png"
            }
            alt="Live Dashcam Stream"
            className="h-full w-full object-cover opacity-90"
          />

          {/* Video Overlay Telemetry OSD */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-mono text-white space-y-0.5 shadow-md">
            <div>
              CAM {activeChannel}:{" "}
              {activeChannel === 1
                ? "Road Forward"
                : activeChannel === 2
                  ? "Driver Cabin"
                  : "Cargo Rear"}
            </div>
            <div>SPEED: {vehicle.speed} km/h · GPS: 3.9745° S, 122.5872° E</div>
            <div>TIME: 27-08-2026 11:26:40 AM UTC+8</div>
          </div>

          {/* Channel Selector Pills */}
          <div className="absolute bottom-3 left-3 flex gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-md border border-white/20">
            {([1, 2, 3] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setActiveChannel(ch)}
                className={cn(
                  "px-2.5 py-1 rounded-md font-bold text-[11px] transition-colors cursor-pointer",
                  activeChannel === ch
                    ? "bg-blue-600 text-white"
                    : "text-white/80 hover:bg-white/10",
                )}
              >
                CH {ch} ({ch === 1 ? "Road" : ch === 2 ? "Cabin" : "Cargo"})
              </button>
            ))}
          </div>

          {/* Quick Capture Overlay Buttons */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsRecording((r) => !r)}
              className={cn(
                "inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold shadow-md transition-colors cursor-pointer",
                isRecording
                  ? "bg-rose-600 text-white animate-pulse"
                  : "bg-black/60 text-white hover:bg-black/80",
              )}
            >
              <div className="h-2 w-2 rounded-full bg-white" />
              <span>{isRecording ? "Recording..." : "Record"}</span>
            </button>

            <button
              type="button"
              title="Snapshot"
              className="p-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white shadow-md cursor-pointer"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-border bg-surface-muted/40 px-4 py-2.5 text-[11px] text-muted-foreground">
          <span>
            Vehicle: <strong>{vehicle.name}</strong> · Driver:{" "}
            <strong>{vehicle.driver || "Unassigned"}</strong>
          </span>
          <span className="text-emerald-600 font-semibold">
            Stream Latency: 180ms
          </span>
        </div>
      </div>
    </div>
  );
}
