import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fleetObjects } from "@/data/fleet";
import {
  getVehicleScoreData,
  streamZioResponse,
  type VehicleScoreContext,
} from "./zio-service";
import { type ApplicationScreenType } from "@/components/zio/ApplicationScreenPreview";

export type ZioPanelMode = "floating" | "sidebar" | "fullscreen";

export type ZioMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean | undefined;
  appScreenType?: ApplicationScreenType | null | undefined;
  scoreData?: VehicleScoreContext | null | undefined;
};

type ZioContextType = {
  isOpen: boolean;
  mode: ZioPanelMode;
  previousMode: ZioPanelMode;
  messages: ZioMessage[];
  isStreaming: boolean;
  selectedVehicle: VehicleScoreContext;
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  openZio: (mode?: ZioPanelMode) => void;
  closeZio: () => void;
  setMode: (mode: ZioPanelMode) => void;
  toggleFullscreen: () => void;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
};

const ZioContext = createContext<ZioContextType | null>(null);

export function ZioProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const [mode, setModeState] = useState<ZioPanelMode>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(
          "zio-preferred-mode-v4",
        ) as ZioPanelMode;
        if (
          saved === "floating" ||
          saved === "sidebar" ||
          saved === "fullscreen"
        ) {
          return saved;
        }
      } catch {}
    }
    return "floating";
  });

  const [previousMode, setPreviousMode] = useState<ZioPanelMode>("sidebar");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    fleetObjects[0]?.id || "o1",
  );
  const [messages, setMessages] = useState<ZioMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const selectedVehicle: VehicleScoreContext = useMemo(() => {
    const v =
      fleetObjects.find((o) => o.id === selectedVehicleId) || fleetObjects[0]!;
    return getVehicleScoreData(v);
  }, [selectedVehicleId]);

  const setMode = useCallback((newMode: ZioPanelMode) => {
    setModeState((current) => {
      if (current !== "fullscreen" && newMode === "fullscreen") {
        setPreviousMode(current);
      }
      return newMode;
    });
    setIsOpen(true);
    try {
      localStorage.setItem("zio-preferred-mode-v4", newMode);
    } catch {}
  }, []);

  const toggleFullscreen = useCallback(() => {
    setModeState((current) => {
      if (current === "fullscreen") {
        const target = previousMode || "sidebar";
        try {
          localStorage.setItem("zio-preferred-mode-v4", target);
        } catch {}
        return target;
      } else {
        setPreviousMode(current);
        try {
          localStorage.setItem("zio-preferred-mode-v4", "fullscreen");
        } catch {}
        return "fullscreen";
      }
    });
    setIsOpen(true);
  }, [previousMode]);

  const openZio = useCallback((requestedMode?: ZioPanelMode) => {
    if (requestedMode) {
      setModeState((current) => {
        if (current !== "fullscreen" && requestedMode === "fullscreen") {
          setPreviousMode(current);
        }
        return requestedMode;
      });
      try {
        localStorage.setItem("zio-preferred-mode-v4", requestedMode);
      } catch {}
    }
    setIsOpen(true);
  }, []);

  const closeZio = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: ZioMessage = {
        id: "user-" + Date.now(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      const assistantMsgId = "assistant-" + Date.now();
      const placeholderAssistantMsg: ZioMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, placeholderAssistantMsg]);
      setIsStreaming(true);

      try {
        const result = await streamZioResponse(
          text,
          selectedVehicle,
          (chunk, appScreen, scoreData) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: chunk,
                      appScreenType: appScreen,
                      scoreData,
                      isStreaming: true,
                    }
                  : m,
              ),
            );
          },
        );

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: result.content,
                  appScreenType: result.appScreenType,
                  scoreData: result.scoreData,
                  isStreaming: false,
                }
              : m,
          ),
        );
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content:
                    "Sorry, I encountered an issue retrieving the telemetry data. Please try again.",
                  isStreaming: false,
                }
              : m,
          ),
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, selectedVehicle],
  );

  return (
    <ZioContext.Provider
      value={{
        isOpen,
        mode,
        previousMode,
        messages,
        isStreaming,
        selectedVehicle,
        selectedVehicleId,
        setSelectedVehicleId,
        openZio,
        closeZio,
        setMode,
        toggleFullscreen,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </ZioContext.Provider>
  );
}

export function useZio() {
  const ctx = useContext(ZioContext);
  if (!ctx) {
    throw new Error("useZio must be used within a ZioProvider");
  }
  return ctx;
}
