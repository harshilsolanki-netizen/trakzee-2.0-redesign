import { useState, useEffect, useCallback } from "react";

export function useActiveApp() {
  const [activeAppId, setActiveAppIdState] = useState<string>(() => {
    try {
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/roster")) {
        return "roster-management";
      }
      return localStorage.getItem("trakzee-active-app-id") || "hp-trakzee-premium";
    } catch {
      return "hp-trakzee-premium";
    }
  });

  useEffect(() => {
    const handleAppChange = () => {
      try {
        const stored = localStorage.getItem("trakzee-active-app-id") || "hp-trakzee-premium";
        setActiveAppIdState(stored);
      } catch {}
    };

    window.addEventListener("trakzee-app-changed", handleAppChange);
    window.addEventListener("storage", handleAppChange);

    // Also check on location change if user navigates to /roster
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/roster")) {
      setActiveAppIdState("roster-management");
    }

    return () => {
      window.removeEventListener("trakzee-app-changed", handleAppChange);
      window.removeEventListener("storage", handleAppChange);
    };
  }, []);

  const setActiveAppId = useCallback((id: string) => {
    try {
      localStorage.setItem("trakzee-active-app-id", id);
      setActiveAppIdState(id);
      window.dispatchEvent(new Event("trakzee-app-changed"));
    } catch {}
  }, []);

  const isRoster =
    activeAppId === "roster-management" ||
    (typeof window !== "undefined" && window.location.pathname.startsWith("/roster"));

  return { activeAppId, setActiveAppId, isRoster };
}
