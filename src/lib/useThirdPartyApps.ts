import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface ThirdPartyApp {
  id: string;
  name: string;
  url: string;
  category: string;
  iconName: string;
  color: string;
  isCustom?: boolean;
}

export const DEFAULT_THIRD_PARTY_APPS: ThirdPartyApp[] = [
  {
    id: "youtube",
    name: "YouTube",
    url: "https://www.youtube.com",
    category: "Media",
    iconName: "SlidersVertical",
    color: "#EF4444",
    isCustom: false,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    url: "https://web.whatsapp.com",
    category: "Chat",
    iconName: "MessageCircle",
    color: "#22C55E",
    isCustom: false,
  },
  {
    id: "jira",
    name: "Jira",
    url: "https://jira.atlassian.com",
    category: "Management",
    iconName: "Layers",
    color: "#0089FF",
    isCustom: false,
  },
  {
    id: "keka",
    name: "Keka",
    url: "https://app.keka.com",
    category: "HR & Payroll",
    iconName: "Building2",
    color: "#F59E0B",
    isCustom: false,
  },
];

const STORAGE_KEY = "trakzee_third_party_apps_v3";

export function useThirdPartyApps() {
  const [apps, setApps] = useState<ThirdPartyApp[]>(() => {
    if (typeof window === "undefined") return DEFAULT_THIRD_PARTY_APPS;
    try {
      try { localStorage.removeItem('trakzee_third_party_apps_v1'); localStorage.removeItem('trakzee_third_party_apps_v2'); } catch(e) {}
    const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_THIRD_PARTY_APPS;
  });

  const saveApps = useCallback((updated: ThirdPartyApp[]) => {
    setApps(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const addApp = useCallback(
    (newApp: {
      name: string;
      url: string;
      category?: string;
      iconName?: string;
      color?: string;
    }) => {
      // Normalize URL
      let formattedUrl = newApp.url.trim();
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const created: ThirdPartyApp = {
        id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: newApp.name.trim(),
        url: formattedUrl,
        category: newApp.category || "General",
        iconName: newApp.iconName || "Globe",
        color: newApp.color || "#0089FF",
        isCustom: true,
      };

      const next = [...apps, created];
      saveApps(next);
      toast.success(`"${created.name}" added to Apps`);
      return created;
    },
    [apps, saveApps]
  );

  const removeApp = useCallback(
    (id: string) => {
      const app = apps.find((a) => a.id === id);
      const next = apps.filter((a) => a.id !== id);
      saveApps(next);
      if (app) {
        toast.info(`"${app.name}" removed from Apps`);
      }
    },
    [apps, saveApps]
  );

  const openApp = useCallback((app: ThirdPartyApp) => {
    try {
      window.open(app.url, "_blank", "noopener,noreferrer");
      toast.success(`Opening ${app.name}...`, {
        description: app.url,
      });
    } catch {
      toast.error(`Could not open ${app.name}`);
    }
  }, []);

  return {
    apps,
    addApp,
    removeApp,
    openApp,
  };
}
