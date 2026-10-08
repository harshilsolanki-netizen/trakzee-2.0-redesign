import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Radio, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface IntercomDevice {
  id: string;
  name: string;
  location?: string;
}

interface IntercomPanelProps {
  device: IntercomDevice;
  onClose: () => void;
  className?: string;
}

export function IntercomPanel({ device, onClose, className }: IntercomPanelProps) {
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
        "absolute top-2.5 right-2.5 z-20 flex flex-col w-[398px] max-h-[calc(100vh-20px)] h-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-[#DFE3EB] dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-right-4 duration-200 pointer-events-auto select-none",
        className
      )}
    >
      {/* 1. Panel Top Header (Matches Trakzee 2.0 Theme Headers) */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-[#0089FF] stroke-[2.2] animate-pulse shrink-0" />
          <span className="font-bold text-sm text-slate-800 dark:text-slate-100 tracking-tight">
            Intercom
          </span>
        </div>

        <button
          type="button"
          onClick={handleDisconnect}
          className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title="Close Intercom"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Panel Content Body */}
      <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-950/80 flex flex-col items-center gap-4 overflow-y-auto">
        {/* Vehicle Name Header (Bold, Left-Aligned, NO Subtext) */}
        <div className="w-full text-left">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
            {device.name}
          </h3>
        </div>

        {/* Modern Trending 2026 Glassmorphic Voice Equalizer Visualizer */}
        <div className="relative w-full rounded-2xl bg-gradient-to-b from-sky-500/10 via-slate-100/50 to-transparent dark:from-sky-500/15 dark:via-slate-900/40 p-5 flex flex-col items-center justify-center border border-sky-200/50 dark:border-sky-900/40 shadow-inner my-1 overflow-hidden">
          {/* Ambient Glow Aura */}
          <div
            className={cn(
              "absolute h-32 w-32 rounded-full bg-[#0089FF]/20 blur-2xl transition-all duration-500 pointer-events-none",
              !isMutedMic && "animate-pulse"
            )}
          />

          {/* Glassmorphic Central Microphone Button */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={cn(
              "relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-2xl transition-all duration-300 cursor-pointer active:scale-95",
              isMutedMic
                ? "bg-slate-800 text-amber-400 border-2 border-amber-400/60 shadow-amber-500/20"
                : "bg-gradient-to-br from-[#0089FF] via-sky-500 to-indigo-600 text-white shadow-sky-500/40 hover:scale-105"
            )}
            title={isMutedMic ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isMutedMic ? (
              <MicOff className="h-8 w-8 stroke-[2.2]" />
            ) : (
              <Mic className="h-8 w-8 stroke-[2.2] animate-pulse" />
            )}
          </button>

          {/* Dynamic Frequency Waveform Equalizer Spectrum */}
          <div className="flex items-center gap-1.5 h-10 justify-center mt-5 z-10 w-full">
            {[35, 65, 40, 85, 60, 95, 70, 50, 90, 55, 80, 45, 30].map((baseHeight, i) => (
              <span
                key={i}
                className={cn(
                  "w-1 rounded-full transition-all duration-300",
                  isMutedMic
                    ? "h-1.5 bg-slate-300 dark:bg-slate-700"
                    : "bg-gradient-to-t from-[#0089FF] via-sky-400 to-emerald-400 animate-pulse"
                )}
                style={{
                  height: isMutedMic
                    ? "6px"
                    : `${Math.max(10, Math.min(38, baseHeight * (((i % 3 === 0 ? (seconds % 3 + 1) : (seconds % 2 + 1.2)) / 2))))}px`,
                  animationDelay: `${i * 70}ms`,
                  animationDuration: `${600 + (i % 5) * 150}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Connection Status & Live Call Timer */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isMutedMic ? "Microphone Muted" : "Live 2-Way Audio Connected"}</span>
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Duration: <span className="font-bold text-slate-800 dark:text-slate-200">{formatTime(seconds)}</span>
          </div>
        </div>

        {/* Mic & Audio Control Pills */}
        <div className="flex items-center gap-3 w-full justify-center">
          <button
            type="button"
            onClick={handleToggleMic}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-xs",
              isMutedMic
                ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                : "border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
          >
            {isMutedMic ? (
              <MicOff className="h-4 w-4 text-amber-500" />
            ) : (
              <Mic className="h-4 w-4 text-[#0089FF]" />
            )}
            <span>{isMutedMic ? "Unmute Mic" : "Mute Mic"}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleAudio}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-xs",
              isMutedAudio
                ? "border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                : "border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
          >
            {isMutedAudio ? (
              <VolumeX className="h-4 w-4 text-rose-500" />
            ) : (
              <Volume2 className="h-4 w-4 text-emerald-500" />
            )}
            <span>{isMutedAudio ? "Unmute Audio" : "Mute Audio"}</span>
          </button>
        </div>

        {/* Primary Disconnect Call Button */}
        <button
          type="button"
          onClick={handleDisconnect}
          className="w-full py-3 px-4 rounded-xl bg-[#1E3A8A] hover:bg-rose-600 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
