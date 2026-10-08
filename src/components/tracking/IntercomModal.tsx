import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, X, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface IntercomDevice {
  id: string;
  name: string;
  location?: string;
  status?: string;
}

interface IntercomModalProps {
  device: IntercomDevice;
  onClose: () => void;
}

export function IntercomModal({ device, onClose }: IntercomModalProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Live Call Timer
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatTimer = (totalSec: number) => {
    const mins = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const secs = String(totalSec % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast.info(`Intercom call disconnected from ${device.name}`);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const toggleMuteMic = () => {
    setIsMuted((prev) => {
      const next = !prev;
      toast.info(next ? "Microphone muted" : "Microphone unmuted");
      return next;
    });
  };

  const toggleSpeaker = () => {
    setIsSpeakerMuted((prev) => {
      const next = !prev;
      toast.info(next ? "Speaker muted" : "Speaker unmuted");
      return next;
    });
  };

  return (
    <div className="fixed top-14 right-6 z-[9999] w-[360px] sm:w-[380px] bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden select-none animate-in zoom-in-95 slide-in-from-top-4 duration-200">
      {/* 1. Header Bar matching media_1791441667937.png */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0089FF] text-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-white/20 text-white">
            <Radio className="h-4 w-4 stroke-[2.2] animate-pulse" />
          </div>
          <span className="font-bold text-sm tracking-tight">Intercom</span>
        </div>

        <button
          type="button"
          onClick={handleDisconnect}
          className="p-1 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
          title="Close Intercom"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Device Title Section */}
      <div className="px-5 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 tracking-tight truncate">
          {device.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {device.location ?? "At Uffizio - Head Office"}
        </p>
      </div>

      {/* 3. Audio Wave Visualizer Area (Concentric Pulsing Circles) */}
      <div className="p-6 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col items-center justify-center relative min-h-[200px]">
        {/* Pulsing Ripple Rings */}
        <div className="relative flex items-center justify-center w-36 h-36">
          {/* Ring 3 (Outer) */}
          <div
            className={cn(
              "absolute inset-0 rounded-full border border-sky-400/30 dark:border-sky-500/20 bg-sky-400/10 dark:bg-sky-500/10 transition-all duration-700",
              isConnected && !isMuted ? "animate-ping opacity-75" : "opacity-30"
            )}
          />

          {/* Ring 2 (Middle) */}
          <div
            className={cn(
              "absolute inset-3 rounded-full border border-sky-400/50 dark:border-sky-500/30 bg-sky-400/15 dark:bg-sky-500/15 transition-all duration-500",
              isConnected && !isMuted ? "animate-pulse" : "opacity-40"
            )}
          />

          {/* Ring 1 (Inner Core with Icon) */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-[#0089FF] dark:bg-[#0089FF] text-white flex items-center justify-center shadow-lg shadow-sky-500/30">
            {isMuted ? (
              <MicOff className="h-8 w-8 stroke-[2] text-rose-200" />
            ) : (
              <Mic className="h-8 w-8 stroke-[2] text-white animate-pulse" />
            )}
          </div>
        </div>

        {/* Audio Status & Live Timer */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isMuted ? "Microphone Muted" : "Live 2-Way Audio Connected"}</span>
          </div>

          <div className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
            Duration: {formatTimer(secondsElapsed)}
          </div>
        </div>
      </div>

      {/* 4. Controls & Disconnect Action Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
        {/* Quick Audio Toggles: Mute Mic & Speaker Mute */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={toggleMuteMic}
            className={cn(
              "h-9 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer",
              isMuted
                ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
            )}
          >
            {isMuted ? <MicOff className="h-4 w-4 stroke-[2]" /> : <Mic className="h-4 w-4 stroke-[2]" />}
            <span>{isMuted ? "Unmute Mic" : "Mute Mic"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSpeaker}
            className={cn(
              "h-9 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer",
              isSpeakerMuted
                ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
            )}
          >
            {isSpeakerMuted ? <VolumeX className="h-4 w-4 stroke-[2]" /> : <Volume2 className="h-4 w-4 stroke-[2]" />}
            <span>{isSpeakerMuted ? "Unmute Audio" : "Mute Audio"}</span>
          </button>
        </div>

        {/* Primary Disconnect Button matching media_1791441667937.png */}
        <button
          type="button"
          onClick={handleDisconnect}
          className="h-10 w-full rounded-xl bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer active:scale-98 flex items-center justify-center"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
