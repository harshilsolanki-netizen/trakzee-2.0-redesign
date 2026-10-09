import { useState, useEffect, useCallback } from "react";

export type TrackingViewMode = "standard" | "tree";

const STORAGE_KEY = "trakzee-tracking-view-mode";
const EVENT_KEY = "trakzee-tracking-view-mode-changed";

export function getStoredTrackingViewMode(): TrackingViewMode {
  if (typeof window === "undefined") return "standard";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "standard" || stored === "tree") {
      return stored;
    }
  } catch {}
  return "standard";
}

export function setStoredTrackingViewMode(mode: TrackingViewMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: mode }));
  } catch {}
}

export function useTrackingViewMode() {
  const [trackingViewMode, setMode] = useState<TrackingViewMode>(() =>
    getStoredTrackingViewMode()
  );

  useEffect(() => {
    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<TrackingViewMode>;
      if (customEvent.detail) {
        setMode(customEvent.detail);
      } else {
        setMode(getStoredTrackingViewMode());
      }
    };

    window.addEventListener(EVENT_KEY, handleModeChange);
    window.addEventListener("storage", handleModeChange);

    return () => {
      window.removeEventListener(EVENT_KEY, handleModeChange);
      window.removeEventListener("storage", handleModeChange);
    };
  }, []);

  const changeTrackingViewMode = useCallback((newMode: TrackingViewMode) => {
    setStoredTrackingViewMode(newMode);
    setMode(newMode);
  }, []);

  return {
    trackingViewMode,
    setTrackingViewMode: changeTrackingViewMode,
    isStandard: trackingViewMode === "standard",
    isTree: trackingViewMode === "tree",
  };
}
