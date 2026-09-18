import { useState, useEffect, useCallback } from "react";

export type ScreenLayoutMode = "tabs" | "single";

const STORAGE_KEY = "trakzee-screen-layout-mode";
const EVENT_KEY = "trakzee-layout-mode-changed";

export function getStoredLayoutMode(): ScreenLayoutMode {
  if (typeof window === "undefined") return "tabs";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "single" || stored === "tabs") {
      return stored;
    }
  } catch {}
  return "tabs";
}

export function setStoredLayoutMode(mode: ScreenLayoutMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: mode }));
  } catch {}
}

export function useLayoutMode() {
  const [layoutMode, setMode] = useState<ScreenLayoutMode>(() => getStoredLayoutMode());

  useEffect(() => {
    const handleLayoutChange = (e: Event) => {
      const customEvent = e as CustomEvent<ScreenLayoutMode>;
      if (customEvent.detail) {
        setMode(customEvent.detail);
      } else {
        setMode(getStoredLayoutMode());
      }
    };

    window.addEventListener(EVENT_KEY, handleLayoutChange);
    window.addEventListener("storage", handleLayoutChange);

    return () => {
      window.removeEventListener(EVENT_KEY, handleLayoutChange);
      window.removeEventListener("storage", handleLayoutChange);
    };
  }, []);

  const changeLayoutMode = useCallback((newMode: ScreenLayoutMode) => {
    setStoredLayoutMode(newMode);
    setMode(newMode);
  }, []);

  return {
    layoutMode,
    setLayoutMode: changeLayoutMode,
    isTabbed: layoutMode === "tabs",
    isSingle: layoutMode === "single",
  };
}
