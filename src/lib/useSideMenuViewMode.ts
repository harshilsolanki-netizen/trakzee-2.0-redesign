import { useState, useEffect } from "react";

export type SideMenuViewMode = "standard" | "full";

const STORAGE_KEY = "trakzee-side-menu-view-mode";
const EVENT_KEY = "trakzee-side-menu-view-mode-changed";

export function getStoredSideMenuViewMode(): SideMenuViewMode {
  if (typeof window === "undefined") return "standard";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "standard" || stored === "full") {
      return stored;
    }
  } catch {}
  return "standard";
}

export function setStoredSideMenuViewMode(mode: SideMenuViewMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: mode }));
  } catch {}
}

export function useSideMenuViewMode() {
  const [sideMenuViewMode, setMode] = useState<SideMenuViewMode>(() =>
    getStoredSideMenuViewMode()
  );

  useEffect(() => {
    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<SideMenuViewMode>;
      if (customEvent.detail) {
        setMode(customEvent.detail);
      } else {
        setMode(getStoredSideMenuViewMode());
      }
    };

    window.addEventListener(EVENT_KEY, handleModeChange);
    window.addEventListener("storage", handleModeChange);

    return () => {
      window.removeEventListener(EVENT_KEY, handleModeChange);
      window.removeEventListener("storage", handleModeChange);
    };
  }, []);

  return {
    sideMenuViewMode,
    setSideMenuViewMode: setStoredSideMenuViewMode,
  };
}
