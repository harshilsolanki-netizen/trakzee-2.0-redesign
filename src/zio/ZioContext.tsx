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

export type ZioChatSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ZioMessage[];
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
  sendMessage: (text: string, displayText?: string) => Promise<void>;
  clearMessages: () => void;
  // History state & operations
  sessions: ZioChatSession[];
  activeSessionId: string | null;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  toggleHistory: () => void;
  createNewChat: () => void;
  loadChatSession: (sessionId: string) => void;
  deleteChatSession: (sessionId: string) => void;
  clearAllHistory: () => void;
};

const INITIAL_DEMO_SESSIONS: ZioChatSession[] = [
  {
    id: "session-sample-1",
    title: "Fleet Safety & Harsh Braking Analysis",
    createdAt: Date.now() - 3600 * 1000 * 2,
    updatedAt: Date.now() - 3600 * 1000 * 2,
    messages: [
      {
        id: "msg-s1-1",
        role: "user",
        content: "Why is the Safety score low for Volvo FH16?",
        timestamp: new Date(Date.now() - 3600 * 1000 * 2),
      },
      {
        id: "msg-s1-2",
        role: "assistant",
        content:
          "### ⚠️ Fleet Safety Analysis — Volvo FH16 (GJ-01-AB-1234)\n\nThe Safety Score for **Volvo FH16** is currently **68/100** (Needs Attention). Here is the breakdown:\n\n1. **Harsh Braking Incidents**: 6 events logged in the last 24h on the NH48 Highway corridor.\n2. **Night Driving**: 3.5 hours recorded past 11:00 PM.\n3. **Cornering G-Force**: Minor spike on hairpin turns near expressway exit.\n\n### 💡 Recommended Actions\n- Schedule a driver coaching review for harsh deceleration.\n- Inspect front brake caliper sensors during the upcoming 45,000 km maintenance service.",
        timestamp: new Date(Date.now() - 3600 * 1000 * 2 + 3000),
      },
    ],
  },
  {
    id: "session-sample-2",
    title: "Trip Summary & Dashboard Diagnostics",
    createdAt: Date.now() - 3600 * 1000 * 24,
    updatedAt: Date.now() - 3600 * 1000 * 24,
    messages: [
      {
        id: "msg-s2-1",
        role: "user",
        content: "Show me the trip summary with dashboard",
        timestamp: new Date(Date.now() - 3600 * 1000 * 24),
      },
      {
        id: "msg-s2-2",
        role: "assistant",
        content:
          "Here is the interactive **Fleet Operations Summary** and real-time dashboard analytics for your active vehicles.",
        appScreenType: "trip_summary",
        timestamp: new Date(Date.now() - 3600 * 1000 * 24 + 3000),
      },
    ],
  },
  {
    id: "session-sample-3",
    title: "Vehicle Live Telemetry & Locations",
    createdAt: Date.now() - 3600 * 1000 * 48,
    updatedAt: Date.now() - 3600 * 1000 * 48,
    messages: [
      {
        id: "msg-s3-1",
        role: "user",
        content: "Where are my vehicles right now?",
        timestamp: new Date(Date.now() - 3600 * 1000 * 48),
      },
      {
        id: "msg-s3-2",
        role: "assistant",
        content:
          "All 12 fleet units are connected to GPS tracking. 8 are currently **En Route**, 3 are **Idling** at logistics hubs, and 1 is **Parked** in maintenance bay.",
        appScreenType: "live_tracking",
        timestamp: new Date(Date.now() - 3600 * 1000 * 48 + 3000),
      },
    ],
  },
];

const ZioContext = createContext<ZioContextType | null>(null);

export function ZioProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Initialize and persist chat sessions in localStorage
  const [sessions, setSessions] = useState<ZioChatSession[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("zio-chat-sessions-v6");
        if (saved) {
          const parsed = JSON.parse(saved) as Array<{
            id: string;
            title: string;
            createdAt: number;
            updatedAt: number;
            messages: Array<any>;
          }>;
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((s) => ({
              ...s,
              messages: s.messages.map((m) => ({
                ...m,
                timestamp: new Date(m.timestamp),
              })),
            }));
          }
        }
      } catch {}
    }
    return INITIAL_DEMO_SESSIONS;
  });

  // Sync sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("zio-chat-sessions-v6", JSON.stringify(sessions));
    } catch {}
  }, [sessions]);

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

  const toggleHistory = useCallback(() => {
    setIsHistoryOpen((prev) => !prev);
  }, []);

  const createNewChat = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
    setIsHistoryOpen(false);
  }, []);

  const loadChatSession = useCallback(
    (sessionId: string) => {
      const target = sessions.find((s) => s.id === sessionId);
      if (target) {
        setActiveSessionId(target.id);
        setMessages(target.messages);
        setIsHistoryOpen(false);
      }
    },
    [sessions],
  );

  const deleteChatSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
    },
    [activeSessionId],
  );

  const clearAllHistory = useCallback(() => {
    setSessions([]);
    setActiveSessionId(null);
    setMessages([]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (activeSessionId) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, messages: [], updatedAt: Date.now() }
            : s,
        ),
      );
    }
  }, [activeSessionId]);

  const sendMessage = useCallback(
    async (text: string, displayText?: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: ZioMessage = {
        id: "user-" + Date.now(),
        role: "user",
        content: (displayText || text).trim(),
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

      const newMsgList = [...messages, userMsg, placeholderAssistantMsg];
      setMessages(newMsgList);
      setIsStreaming(true);

      // Manage session creation or update
      let currentSessionId = activeSessionId;
      if (!currentSessionId) {
        currentSessionId = "session-" + Date.now();
        setActiveSessionId(currentSessionId);
        // Generate neat title from first user prompt
        const rawTitle = (displayText || text).trim().replace(/^###?\s*/, "");
        const formattedTitle =
          rawTitle.length > 38 ? rawTitle.slice(0, 38) + "..." : rawTitle;

        const newSession: ZioChatSession = {
          id: currentSessionId,
          title: formattedTitle,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [userMsg, placeholderAssistantMsg],
        };
        setSessions((prev) => [newSession, ...prev]);
      }

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

        const finalAssistantMsg: ZioMessage = {
          id: assistantMsgId,
          role: "assistant",
          content: result.content,
          appScreenType: result.appScreenType,
          scoreData: result.scoreData,
          isStreaming: false,
          timestamp: new Date(),
        };

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? finalAssistantMsg : m)),
        );

        if (
          result.appScreenType === "add-object-walkthrough" ||
          result.appScreenType === "company-walkthrough"
        ) {
          setModeState("fullscreen");
          try {
            localStorage.setItem("zio-preferred-mode-v4", "fullscreen");
          } catch {}
        }

        // Update session messages in sessions state
        if (currentSessionId) {
          const sid = currentSessionId;
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id === sid) {
                const existingWithoutStreaming = s.messages.filter(
                  (m) => m.id !== assistantMsgId && m.id !== userMsg.id,
                );
                return {
                  ...s,
                  updatedAt: Date.now(),
                  messages: [
                    ...existingWithoutStreaming,
                    userMsg,
                    finalAssistantMsg,
                  ],
                };
              }
              return s;
            }),
          );
        }
      } catch (err) {
        const errorMsg: ZioMessage = {
          id: assistantMsgId,
          role: "assistant",
          content:
            "Sorry, I encountered an issue retrieving the telemetry data. Please try again.",
          isStreaming: false,
          timestamp: new Date(),
        };

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? errorMsg : m)),
        );

        if (currentSessionId) {
          const sid = currentSessionId;
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id === sid) {
                const existing = s.messages.filter(
                  (m) => m.id !== assistantMsgId && m.id !== userMsg.id,
                );
                return {
                  ...s,
                  updatedAt: Date.now(),
                  messages: [...existing, userMsg, errorMsg],
                };
              }
              return s;
            }),
          );
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, selectedVehicle, messages, activeSessionId],
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
        sessions,
        activeSessionId,
        isHistoryOpen,
        setIsHistoryOpen,
        toggleHistory,
        createNewChat,
        loadChatSession,
        deleteChatSession,
        clearAllHistory,
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
