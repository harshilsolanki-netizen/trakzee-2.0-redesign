import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Radio, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface IntercomDevice {
  id: string;
  name: string;
  location?: string;
}

interface IntercomCardProps {
  device: IntercomDevice;
  onClose: () => void;
  className?: string;
}

export function IntercomCard({ device, onClose, className }: IntercomCardProps) {
  const [seconds, setSeconds] = useState(0);
  const [isMutedMic, setIsMutedMic] = useState(false);
  const [isMutedAudio, setIsMutedAudio] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleToggleMic = () => {
    setIsMutedMic((prev) => {
      const next = !prev;
      toast.info(next ? "Microphone muted" : "Microphone active");
      return next;
    });
  };

  const handleToggleAudio = () => {
    setIsMutedAudio((prev) => {
      const next = !prev;
      toast.info(next ? "Speaker audio muted" : "Speaker audio active");
      return next;
    });
  };

  const handleDisconnect = () => {
    toast.error(`Intercom disconnected from ${device.name}`);
    onClose();
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl overflow-hidden border border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl w-full shrink-0 transition-all select-none",
        className
      )}
    >
      {/* Top Header Bar with Accent Color */}
      <div className="bg-[#0089FF] px-4 py-3 flex items-center justify-between text-white font-bold text-sm shadow-xs">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 animate-pulse text-white stroke-[2.5]" />
          <span className="tracking-tight">Intercom</span>
        </div>
        <button
          type="button"
          onClick={handleDisconnect}
          className="p-1 rounded-lg hover:bg-white/20 text-white transition-all cursor-pointer"
          title="Close Intercom"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Card Main Body */}
      <div className="p-4 flex flex-col items-center justify-between gap-4 bg-white dark:bg-slate-900 flex-1 min-h-[300px]">
        {/* Vehicle Name (NO subtext below per requirement) */}
        <div className="w-full text-left font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
          {device.name}
        </div>

        {/* Concentric Audio Wave Pulsing Visualizer */}
        <div className="relative flex items-center justify-center my-1 h-32 w-32">
          <div
            className={cn(
              "absolute inset-0 rounded-full border-2 border-[#0089FF]/20 bg-[#0089FF]/5 transition-all duration-700",
              isMutedMic ? "scale-100 opacity-20" : "animate-ping opacity-40"
            )}
          />
          <div
            className={cn(
              "absolute inset-3 rounded-full border-2 border-[#0089FF]/30 bg-[#0089FF]/10 transition-all duration-500",
              isMutedMic ? "scale-100 opacity-30" : "animate-pulse"
            )}
          />
          <div className="absolute inset-7 rounded-full border-2 border-[#0089FF]/40 bg-[#0089FF]/15" />

          {/* Central Microphone Action Sphere */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={cn(
              "relative z-10 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all cursor-pointer active:scale-95",
              isMutedMic
                ? "bg-amber-500 text-white"
                : "bg-[#0089FF] text-white hover:bg-[#0077EE]"
            )}
            title={isMutedMic ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isMutedMic ? (
              <MicOff className="h-7 w-7 stroke-[2.2]" />
            ) : (
              <Mic className="h-7 w-7 animate-pulse stroke-[2.2]" />
            )}
          </button>
        </div>

        {/* Connection Status & Live Call Timer */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isMutedMic ? "Microphone Muted" : "Live 2-Way Audio Connected"}</span>
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Duration: <span className="font-bold text-slate-800 dark:text-slate-200">{formatTime(seconds)}</span>
          </div>
        </div>

        {/* Audio Controls (Mute Mic / Mute Audio) */}
        <div className="flex items-center gap-3 w-full justify-center">
          <button
            type="button"
            onClick={handleToggleMic}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shadow-xs",
              isMutedMic
                ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-semibold"
                : "border-[#DFE3EB] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
          >
            {isMutedMic ? (
              <MicOff className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <Mic className="h-3.5 w-3.5 text-[#0089FF]" />
            )}
            <span>{isMutedMic ? "Unmute Mic" : "Mute Mic"}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleAudio}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shadow-xs",
              isMutedAudio
                ? "border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold"
                : "border-[#DFE3EB] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
          >
            {isMutedAudio ? (
              <VolumeX className="h-3.5 w-3.5 text-rose-500" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-emerald-500" />
            )}
            <span>{isMutedAudio ? "Unmute Audio" : "Mute Audio"}</span>
          </button>
        </div>

        {/* Primary Disconnect Call Button */}
        <button
          type="button"
          onClick={handleDisconnect}
          className="w-full py-2.5 px-4 rounded-xl bg-[#1E3A8A] hover:bg-rose-600 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-1"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
