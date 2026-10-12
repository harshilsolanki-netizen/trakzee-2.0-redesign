import { useSyncExternalStore } from "react";

const STORAGE_KEY = "trakzee-sidebar-collapsed";

let isCollapsedState = false;

if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      isCollapsedState = JSON.parse(stored);
    }
  } catch {}
}

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return isCollapsedState;
}

function getServerSnapshot() {
  return false;
}

export function useSidebarState() {
  const isCollapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleSidebar = () => {
    isCollapsedState = !isCollapsedState;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isCollapsedState));
    } catch {}
    emitChange();
  };

  const setCollapsed = (val: boolean) => {
    isCollapsedState = val;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isCollapsedState));
    } catch {}
    emitChange();
  };

  return {
    isCollapsed,
    toggleSidebar,
    setCollapsed,
  };
}
