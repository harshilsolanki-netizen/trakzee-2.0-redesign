import {
  AlertTriangle,
  AlignLeft,
  ArrowLeft,
  BarChart3,
  Clock,
  Copy,
  FileText,
  History,
  MapPin,
  Maximize2,
  MessageSquare,
  Mic,
  PanelRight,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useZio,
  type ZioChatSession,
  type ZioPanelMode,
} from "@/zio/ZioContext";
import { ApplicationScreenPreview } from "./ApplicationScreenPreview";
import { TrakzeeWalkthroughScreen } from "./TrakzeeWalkthroughScreen";
import { cn } from "@/lib/utils";

function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="font-semibold text-slate-950">
          {inner}
        </strong>
      );
    }
    return part;
  });
}

function FormattedZioMessage({
  content,
  isFullscreen,
}: {
  content: string;
  isFullscreen: boolean;
}) {
  const lines = content.split("\n");

  return (
    <div
      className={cn(
        "space-y-2.5 text-slate-800",
        isFullscreen
          ? "text-sm sm:text-base leading-relaxed"
          : "text-xs leading-relaxed",
      )}
    >
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        // Headings
        if (line.startsWith("### ")) {
          return (
            <h4
              key={idx}
              className={cn(
                "font-bold text-slate-950 mt-2 mb-1",
                isFullscreen ? "text-base sm:text-lg" : "text-xs sm:text-sm",
              )}
            >
              {renderInlineMarkdown(line.slice(4))}
            </h4>
          );
        }

        // Numbered list: 1.
        const numMatch = line.match(/^(\d+\.)\s+(.*)$/);
        if (numMatch && numMatch[1] && numMatch[2]) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 py-0.5">
              <span className="font-semibold text-violet-700 shrink-0">
                {numMatch[1]}
              </span>
              <span className="flex-1 text-slate-800">
                {renderInlineMarkdown(numMatch[2])}
              </span>
            </div>
          );
        }

        // Bullet point: -
        if (line.startsWith("- ")) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 py-0.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-600 shrink-0 mt-2" />
              <span className="flex-1 text-slate-800">
                {renderInlineMarkdown(line.slice(2))}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return "Just now";
  const now = Date.now();
  const diffMs = now - timestamp;
  if (diffMs < 0) return "Just now";

  const diffSeconds = Math.floor(diffMs / 1000);
  if (diffSeconds < 60) {
    return "Just now";
  }
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return "1 day ago";
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) {
    return "1 week ago";
  }
  if (diffWeeks < 4) {
    return `${diffWeeks} weeks ago`;
  }
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) {
    return "1 month ago";
  }
  if (diffMonths < 12) {
    return `${diffMonths} months ago`;
  }
  const diffYears = Math.floor(diffDays / 365);
  return diffYears <= 1 ? "1 year ago" : `${diffYears} years ago`;
}

function ZioHistoryView({
  isFullscreen,
}: {
  isFullscreen: boolean;
}) {
  const {
    sessions,
    activeSessionId,
    loadChatSession,
    deleteChatSession,
    clearAllHistory,
    createNewChat,
    setIsHistoryOpen,
  } = useZio();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter((s) => {
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchMessages = s.messages.some((m) =>
        m.content.toLowerCase().includes(q),
      );
      return matchTitle || matchMessages;
    });
  }, [sessions, searchQuery]);

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full font-sans animate-in fade-in duration-200",
        isFullscreen ? "max-w-3xl mx-auto py-2" : "max-w-full",
      )}
    >
      {/* Search Input (No duplicate header/New Chat button) */}
      <div className="relative w-full pb-2 shrink-0">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations..."
          className="h-8 w-full rounded-md border border-input bg-white pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1.5 focus:ring-primary/40 font-sans"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Sessions list: Clean single-line items with title on left and duration aligned on the right */}
      <div className="flex-1 min-h-0 overflow-y-auto py-1 divide-y divide-slate-100/80 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <div className="h-9 w-9 rounded-md bg-violet-50 flex items-center justify-center text-violet-600 mb-2 border border-violet-100">
              <MessageSquare className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold text-foreground">
              {searchQuery ? "No matching conversations" : "No chat history yet"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs font-normal">
              {searchQuery
                ? "Try searching for a different keyword or prompt."
                : "Your conversations with Zio will appear here."}
            </p>
            <button
              type="button"
              onClick={createNewChat}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Start new conversation</span>
            </button>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isActive = session.id === activeSessionId;

            return (
              <div
                key={session.id}
                onClick={() => {
                  loadChatSession(session.id);
                  setIsHistoryOpen(false);
                }}
                className={cn(
                  "group relative flex items-center justify-between gap-3 px-1.5 py-2.5 rounded-md transition-colors cursor-pointer text-left select-none w-full",
                  isActive
                    ? "bg-violet-50/90 text-violet-950 font-semibold"
                    : "bg-transparent hover:bg-slate-100/70 text-slate-800",
                )}
              >
                {/* Left side: Icon (no background, larger) + Title */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-violet-600"
                        : "text-slate-400 group-hover:text-slate-600",
                    )}
                  />

                  <span
                    className={cn(
                      "text-xs truncate leading-none font-sans",
                      isActive
                        ? "text-violet-950 font-semibold"
                        : "text-slate-800 font-medium group-hover:text-slate-950",
                    )}
                  >
                    {session.title}
                  </span>
                </div>

                {/* Right side: Delete action on hover + Duration directly aligned to right */}
                <div className="flex items-center gap-1.5 shrink-0 text-right">
                  <button
                    type="button"
                    title="Delete chat"
                    aria-label="Delete chat"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChatSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:bg-red-50 hover:text-red-600 transition-opacity cursor-pointer shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <span className="text-[11px] text-slate-400 font-normal shrink-0 font-sans">
                    {formatRelativeTime(
                      session.updatedAt || session.createdAt,
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* History Footer */}
      {sessions.length > 0 && (
        <div className="pt-2.5 mt-auto border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={clearAllHistory}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer px-1 py-1 rounded"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear all history</span>
          </button>

          <button
            type="button"
            onClick={() => setIsHistoryOpen(false)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            <span>Back to Chat</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function ZioPanel({
  mode: forcedMode,
  className,
}: {
  mode?: ZioPanelMode;
  className?: string;
}) {
  const {
    isOpen,
    mode: contextMode,
    messages,
    isStreaming,
    closeZio,
    setMode,
    sendMessage,
    clearMessages,
    isHistoryOpen,
    setIsHistoryOpen,
    toggleHistory,
    createNewChat,
  } = useZio();

  const mode = forcedMode || contextMode;
  const isFullscreen = mode === "fullscreen";
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"ask" | "artifacts">("ask");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!isHistoryOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, isHistoryOpen]);

  // Focus input on open
  useEffect(() => {
    if ((isOpen || mode === "fullscreen") && !isHistoryOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, mode, isHistoryOpen]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    const text = input;
    setInput("");
    setIsWalkthroughDismissed(false);
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen && mode !== "fullscreen") return null;

  // Dynamic icon reflecting the CURRENT active mode
  const CurrentModeIcon =
    mode === "sidebar" ? PanelRight : mode === "fullscreen" ? Maximize2 : Copy;

  const [isWalkthroughDismissed, setIsWalkthroughDismissed] = useState(false);

  const handleExitWalkthrough = useCallback(() => {
    setIsWalkthroughDismissed(true);
    if (!forcedMode) {
      closeZio();
    }
  }, [forcedMode, closeZio]);

  // Check if a walkthrough is currently active in the chat
  const isWalkthroughActive =
    !isWalkthroughDismissed &&
    !isHistoryOpen &&
    messages.length > 0 &&
    messages.some(
      (m) =>
        m.appScreenType === "add-object-walkthrough" ||
        m.appScreenType === "company-walkthrough" ||
        m.content.toLowerCase().includes("how to add") ||
        m.content.toLowerCase().includes("i want to add") ||
        m.content.toLowerCase().includes("how would i create a company") ||
        m.content.toLowerCase().includes("create a company") ||
        m.content.toLowerCase().includes("create company") ||
        m.content.toLowerCase().includes("add object") ||
        m.content.toLowerCase().includes("add vehicle") ||
        m.content.toLowerCase().includes("walkthrough") ||
        m.content.toLowerCase().includes("guidance") ||
        m.content.toLowerCase().includes("guidence"),
    );

  const walkthroughTopic: "company" | "object" =
    messages.some(
      (m) =>
        m.appScreenType === "company-walkthrough" ||
        (m.content.toLowerCase().includes("company") &&
          !m.content.toLowerCase().includes("object") &&
          !m.content.toLowerCase().includes("vehicle")),
    )
      ? "company"
      : "object";

  if (isFullscreen && isWalkthroughActive) {
    return (
      <div
        className={cn(
          "relative transition-all duration-300 ease-out flex flex-col w-full h-full flex-1 bg-[#F0F0F0] p-0 border-0 shadow-none overflow-hidden",
          className,
        )}
      >
        <TrakzeeWalkthroughScreen
          topic={walkthroughTopic}
          userQuery={[...messages].reverse().find((m) => m.role === "user")?.content}
          onSendMessage={(msg) => {
            setIsWalkthroughDismissed(false);
            sendMessage(msg);
          }}
          onClose={handleExitWalkthrough}
          onBack={handleExitWalkthrough}
        />
      </div>
    );
  }


  return (
    <div
      className={cn(
        "relative transition-all duration-300 ease-out flex flex-col",
        isFullscreen
          ? "w-full h-full flex-1 bg-white dark:bg-slate-950 p-0 border-0 rounded-tl-[24px] shadow-none overflow-hidden"
          : "rounded-xl p-[1.5px] bg-gradient-to-b from-[#7c3aed] via-[#a855f7] via-[#ec4899] to-[#f43f5e] shadow-[0_16px_50px_-10px_rgba(139,92,246,0.18)]",
        mode === "floating" && "w-[380px] sm:w-[410px] h-[580px] max-h-[85vh]",
        mode === "sidebar" && "w-full h-full flex-1",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col w-full h-full text-foreground overflow-hidden relative",
          isFullscreen
            ? "bg-white dark:bg-slate-950 rounded-tl-[24px]"
            : "bg-gradient-to-b from-white via-[#faf7ff] to-[#f4ebff] rounded-[10.5px]"
        )}
      >
        {/* Seamless full-screen ambient atmospheric gradient merging seamlessly */}
        {isFullscreen && (
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 110% 70% at 50% 100%, rgba(228, 240, 255, 0.75) 0%, rgba(246, 235, 248, 0.45) 45%, rgba(255, 255, 255, 0) 80%)",
            }}
          />
        )}

        {/* Header */}
        <header
          className={cn(
            "flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-2.5 transition-all duration-300 ease-out shrink-0 select-none z-10",
            isFullscreen && "px-6 py-3 border-transparent bg-transparent",
          )}
        >
        {/* Left header area: Show Title when in History view, clean empty space when in Chat view */}
        <div className="flex items-center gap-2 min-w-0">
          {isHistoryOpen && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <History className="h-3.5 w-3.5 text-violet-600 shrink-0" />
              <span>Chat History</span>
            </div>
          )}
        </div>

        {/* Right header controls: All action buttons consistently formatted */}
        <div className="flex items-center gap-1">
          {/* New Chat Icon Button */}
          <button
            type="button"
            onClick={createNewChat}
            title="New chat"
            aria-label="New chat"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-violet-100 hover:text-slate-900 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-slate-700" />
          </button>

          {/* History Toggle Icon Button */}
          <button
            type="button"
            onClick={toggleHistory}
            title={isHistoryOpen ? "Back to chat" : "Chat history"}
            aria-label="Chat history"
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-violet-100 hover:text-slate-900 cursor-pointer",
              isHistoryOpen &&
                "bg-violet-100 text-violet-900 ring-1 ring-violet-200",
            )}
          >
            <History className="h-4 w-4 text-slate-700" />
          </button>

          {/* Clear Active Chat */}
          {!isHistoryOpen && messages.length > 0 && (
            <button
              type="button"
              onClick={clearMessages}
              title="Clear chat messages"
              aria-label="Clear chat messages"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-violet-100 hover:text-slate-900 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 text-slate-700" />
            </button>
          )}

          {/* Subtle separator */}
          <div className="h-3.5 w-px bg-violet-200/70 mx-0.5" />

          {/* Mode Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                title={`Layout mode: ${mode}`}
                aria-label={`Switch layout mode (current: ${mode})`}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-violet-100 hover:text-slate-900 cursor-pointer"
              >
                <CurrentModeIcon className="h-4 w-4 text-slate-700" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 rounded-lg p-1.5 shadow-2xl border border-violet-100 text-xs z-50 bg-white"
            >
              <div className="px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">
                Switch to
              </div>
              <DropdownMenuItem
                onClick={() => setMode("floating")}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-2 cursor-pointer",
                  mode === "floating" &&
                    "bg-violet-50 text-violet-900 font-semibold",
                )}
              >
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Floating</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setMode("sidebar")}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-2 cursor-pointer",
                  mode === "sidebar" &&
                    "bg-violet-50 text-violet-900 font-semibold",
                )}
              >
                <PanelRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Sidebar</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setMode("fullscreen")}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-2 cursor-pointer",
                  mode === "fullscreen" &&
                    "bg-violet-50 text-violet-900 font-semibold",
                )}
              >
                <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Full screen</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Close button */}
          <button
            type="button"
            onClick={closeZio}
            aria-label="Close Zio"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-violet-100 hover:text-slate-900 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Body area: either History view or Chat view */}
      <div
        className={cn(
          "flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 transition-all duration-300 ease-out z-10 flex flex-col",
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300",
          isFullscreen ? "p-6" : "space-y-4",
        )}
      >
        {isHistoryOpen ? (
          <ZioHistoryView isFullscreen={isFullscreen} />
        ) : messages.length === 0 ? (
          isFullscreen ? (
            /* Fullscreen Initial View matching reference screenshot */
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] py-10 w-full max-w-4xl mx-auto my-auto animate-in fade-in duration-300">
              {/* Title Greeting */}
              <div className="mb-8 text-center space-y-1">
                <h2 className="text-3xl sm:text-4xl font-semibold text-slate-800 tracking-tight">
                  Hi, Good Morning. How can I help?
                </h2>
              </div>

              {/* ── Zio prompt component: connected tabs + 9px gradient-framed white box ── */}
              <div className="w-full max-w-[800px] relative">
                {/* Tabs row — sits directly on top edge of container with zero gap */}
                <div className="flex items-end pl-12 -mb-[1px] relative z-20 select-none">
                  {/* Ask Zio Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("ask")}
                    className={cn(
                      "relative h-[34px] w-[100px] flex items-center justify-center cursor-pointer transition-colors focus:outline-none",
                      activeTab === "ask"
                        ? "z-20 text-slate-800 font-semibold"
                        : "z-10 text-[#64748B] font-medium hover:text-slate-800"
                    )}
                  >
                    <svg
                      className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                      viewBox="0 0 100 34"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M -10 34 C -4.5 34 0 28.5 0 22 L 0 10 C 0 4.5 4.5 0 10 0 L 90 0 C 95.5 0 100 4.5 100 10 L 100 22 C 100 28.5 104.5 34 110 34 Z"
                        fill={activeTab === "ask" ? "#BBE6FD" : "#F4F5F7"}
                      />
                    </svg>
                    <span className="relative z-10 text-[13px] whitespace-nowrap">Ask Zio</span>
                  </button>

                  {/* Artifacts Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("artifacts")}
                    className={cn(
                      "relative h-[34px] w-[104px] flex items-center justify-center cursor-pointer transition-colors focus:outline-none",
                      activeTab === "artifacts"
                        ? "z-20 text-slate-800 font-semibold"
                        : "z-10 text-[#64748B] font-medium hover:text-slate-800"
                    )}
                  >
                    <svg
                      className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                      viewBox="0 0 104 34"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M -10 34 C -4.5 34 0 28.5 0 22 L 0 10 C 0 4.5 4.5 0 10 0 L 94 0 C 99.5 0 104 4.5 104 10 L 104 22 C 104 28.5 108.5 34 114 34 Z"
                        fill={activeTab === "artifacts" ? "#BBE6FD" : "#F4F5F7"}
                      />
                    </svg>
                    <span className="relative z-10 text-[13px] whitespace-nowrap">Artifacts</span>
                  </button>
                </div>

                {/* Gradient border frame — exactly 9px padding creates the 9px gap/stroke around the white box */}
                <div
                  className="relative w-full rounded-[28px] shadow-[0_4px_24px_-4px_rgba(0,137,255,0.08)] z-10"
                  style={{
                    padding: "9px",
                    background:
                      "linear-gradient(135deg, #BAE6FD 0%, #C7E8FD 35%, #FED7AA 75%, #FDE4D8 100%)",
                  }}
                >
                  {/* White inner container */}
                  <div className="rounded-[19px] bg-white dark:bg-slate-900 min-h-[185px] h-[185px] p-5 flex flex-col justify-between">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Turn ideas into action. Create tasks, documents, or anything else with a prompt."
                      className="w-full flex-1 resize-none bg-transparent text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none leading-relaxed"
                    />

                    {/* Bottom controls: + / Mic idle → Send when typing */}
                    <div className="flex items-center justify-between">
                      {input.trim() ? (
                        <>
                          <div />
                          <button
                            type="button"
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="flex items-center justify-center h-8 w-8 rounded-full bg-[#0089FF] text-white shadow-md shadow-[#0089FF]/30 hover:bg-[#007ae6] transition-all duration-200 cursor-pointer disabled:opacity-50"
                            aria-label="Send message"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-150 cursor-pointer"
                            aria-label="Add attachment or action"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-150 cursor-pointer"
                            aria-label="Voice input"
                          >
                            <Mic className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action / Suggestion Cards (Dynamically changes based on active tab: Ask Zio vs Artifacts) */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full max-w-[800px]">
                {activeTab === "ask" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => sendMessage("Provide me the travel report")}
                      className="group flex flex-col items-start p-3 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 hover:border-[#0089FF]/40 hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      <div className="h-7 w-7 rounded-lg bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-[#0089FF] mb-2">
                        <Truck className="h-3.5 w-3.5 text-[#0089FF]" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors leading-tight">
                        Travel Report
                      </span>
                      <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                        Summary & Trip History...
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => sendMessage("Provide me the fuel report of the last 15 days")}
                      className="group flex flex-col items-start p-3 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 hover:border-[#0089FF]/40 hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 mb-2">
                        <BarChart3 className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors leading-tight">
                        Fuel Report (15 Days)
                      </span>
                      <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                        Fill-drain & telemetry...
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => sendMessage("Show me the idle report by driver")}
                      className="group flex flex-col items-start p-3 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 hover:border-[#0089FF]/40 hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 mb-2">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors leading-tight">
                        Idle Report
                      </span>
                      <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                        Idle time by driver...
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => sendMessage("Give me daily briefing on what needs attention today")}
                      className="group flex flex-col items-start p-3 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 hover:border-[#0089FF]/40 hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 mb-2">
                        <AlignLeft className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors leading-tight">
                        Daily Briefing
                      </span>
                      <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                        What needs attention today
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Artifacts Tab: 4 Cards matching user reference */}
                    <button
                      type="button"
                      onClick={() => sendMessage("Show my saved artifacts, reports, and dashboards")}
                      className="group flex flex-col items-start p-3.5 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 hover:border-[#0089FF]/40 hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      <svg
                        className="h-5 w-5 text-slate-500 mb-2.5 transition-colors group-hover:text-[#0089FF]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="4" />
                        <line x1="8" x2="16" y1="9" y2="9" />
                        <line x1="8" x2="13" y1="14" y2="14" />
                      </svg>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors leading-tight">
                        My Artifacts
                      </span>
                      <span className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate w-full mt-0.5">
                        Saved reports, dashboards and ...
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => sendMessage("Show available templates and ready-made starting points")}
                      className="group flex flex-col items-start p-3.5 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 hover:border-[#0089FF]/40 hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      <svg
                        className="h-5 w-5 text-slate-500 mb-2.5 transition-colors group-hover:text-[#0089FF]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="6" x2="6" y1="12" y2="18" />
                        <line x1="12" x2="12" y1="6" y2="18" />
                        <line x1="18" x2="18" y1="13" y2="18" />
                      </svg>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors leading-tight">
                        Templates
                      </span>
                      <span className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate w-full mt-0.5">
                        Ready-made starting points
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => sendMessage("Show my scheduled reports and auto-refresh deliveries")}
                      className="group flex flex-col items-start p-3.5 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 hover:border-[#0089FF]/40 hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      <svg
                        className="h-5 w-5 text-slate-500 mb-2.5 transition-colors group-hover:text-[#0089FF]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="4" x2="17" y1="8" y2="8" />
                        <line x1="4" x2="17" y1="13" y2="13" />
                        <line x1="4" x2="11" y1="18" y2="18" />
                      </svg>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors leading-tight">
                        Scheduled
                      </span>
                      <span className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate w-full mt-0.5">
                        Auto-refresh and delivery
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => sendMessage("Show shared artifacts and access permissions")}
                      className="group flex flex-col items-start p-3.5 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 hover:border-[#0089FF]/40 hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      <MapPin className="h-5 w-5 text-slate-500 mb-2.5 transition-colors group-hover:text-[#0089FF]" strokeWidth={1.8} />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors leading-tight">
                        Shared
                      </span>
                      <span className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate w-full mt-0.5">
                        Access and permissions
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Floating / Sidebar Initial View matching reference: docked at the bottom */
            <div className="mt-auto flex flex-col space-y-3 pb-2 text-left justify-end animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight text-foreground leading-snug">
                  Hi, I’m Zio
                </h3>
                <p className="text-xs text-muted-foreground">
                  How can I help you analyze your fleet today?
                </p>
              </div>

              {/* Suggestion Prompt Buttons matching Application standard ADS CTAs */}
              <div className="flex flex-col gap-2 pt-1 w-full">
                <button
                  type="button"
                  onClick={() => sendMessage("Provide me the travel report")}
                  className="flex items-center justify-between rounded-md border border-sky-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-2xs transition-all hover:bg-white/90 hover:border-[#0089FF]/40 hover:text-[#0089FF] cursor-pointer w-full text-left"
                >
                  <span>🚗 Provide me the travel report</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    sendMessage("Provide me the fuel report of the last 15 days")
                  }
                  className="flex items-center justify-between rounded-md border border-emerald-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-2xs transition-all hover:bg-white/90 hover:border-emerald-300 hover:text-emerald-700 cursor-pointer w-full text-left"
                >
                  <span>⛽ Fuel report of the last 15 days</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendMessage("Show me the fleet dashboard")}
                  className="flex items-center justify-between rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer w-full text-left"
                >
                  <span>Show me the fleet dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    sendMessage("Where are my vehicles right now?")
                  }
                  className="flex items-center justify-between rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer w-full text-left"
                >
                  <span>Where are my vehicles right now?</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendMessage("Why is the Safety low?")}
                  className="flex items-center justify-between rounded-md border border-violet-100/80 bg-white/60 backdrop-blur-xs px-3.5 py-2.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:bg-white/90 hover:border-violet-200 hover:text-slate-950 cursor-pointer w-full text-left"
                >
                  <span>Why is the Safety low?</span>
                </button>
              </div>
            </div>
          )
        ) : (
          /* Active Chat View */
          <div
            className={cn(
              "w-full space-y-4",
              isFullscreen ? "max-w-4xl mx-auto py-2" : "max-w-full",
            )}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col space-y-1.5 transition-all duration-200",
                  msg.role === "user" ? "items-end" : "items-start",
                )}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-br-xs bg-[#111c38] px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-sm leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  /* Clean Zio Reply with Embedded Application Screen Preview */
                  <div className="w-full max-w-[96%] px-1 py-1 leading-relaxed text-slate-800 space-y-2">
                    {/* Embedded Trakzee Application Screen if requested */}
                    {msg.appScreenType && (
                      <div className="animate-in fade-in zoom-in-95 duration-300">
                        <ApplicationScreenPreview
                          type={msg.appScreenType}
                          data={msg.scoreData}
                        />
                      </div>
                    )}

                    {/* Initial Typing Indicator before first token */}
                    {msg.isStreaming && !msg.content && !msg.appScreenType && (
                      <div className="flex items-center gap-2 rounded-xl bg-white/80 p-3 border border-violet-100/80 shadow-2xs backdrop-blur-xs w-fit animate-in fade-in duration-200">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-violet-600 animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 rounded-full bg-pink-500 animate-bounce" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">
                          Zio is analyzing fleet data...
                        </span>
                      </div>
                    )}

                    {/* Markdown text response with typewriter cursor */}
                    {msg.content && (
                      <div className="relative">
                        {msg.content.includes("AI Insights") && (
                          <div className="flex flex-col gap-0.5 mb-2.5 select-none pb-2 border-b border-violet-100/60 dark:border-violet-900/40">
                            <span className="text-[10px] text-muted-foreground/80">Worked for 2s</span>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                              <span className="text-violet-600 dark:text-violet-400 font-bold text-xs">✦</span>
                              <span>Analyzing this widget</span>
                            </div>
                          </div>
                        )}
                        <FormattedZioMessage
                          content={msg.content}
                          isFullscreen={isFullscreen}
                        />
                        {msg.isStreaming && (
                          <span className="inline-block w-1.5 h-4 ml-1 bg-gradient-to-b from-violet-600 to-pink-500 rounded-full animate-pulse align-middle" />
                        )}
                      </div>
                    )}
                  </div>
                )}
                <span className="text-[10px] sm:text-xs text-muted-foreground px-1">
                  {msg.role === "user" ? "You" : "Zio"} ·{" "}
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Footer: Pinned cleanly to the bottom when not in history view */}
      {!isHistoryOpen && (!isFullscreen || messages.length > 0) && (
        <footer
          className={cn(
            "p-3 sm:p-4 pt-1 bg-transparent transition-all duration-300 ease-out shrink-0 z-10",
            isFullscreen && "p-6 pt-0 bg-transparent border-0",
          )}
        >
          <div
            className={cn(
              "w-full mx-auto",
              isFullscreen ? "max-w-4xl" : "max-w-full",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 rounded-md bg-white/80 backdrop-blur-xs p-1.5 shadow-2xs border border-violet-100/80 focus-within:border-primary focus-within:bg-white focus-within:ring-1.5 focus-within:ring-primary/40",
              )}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isStreaming}
                placeholder="Ask me ..."
                className="flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                aria-label="Send message"
                className={cn(
                  "flex h-7.5 w-7.5 items-center justify-center rounded-md transition-colors cursor-pointer shadow-2xs shrink-0",
                  input.trim()
                    ? "bg-[#111c38] text-white hover:bg-[#0c1429]"
                    : "bg-[#111c38] text-white opacity-80 cursor-not-allowed",
                )}
              >
                <Send className="h-3.5 w-3.5 fill-white text-white" />
              </button>
            </div>
          </div>
        </footer>
      )}
      </div>
    </div>
  );
}

