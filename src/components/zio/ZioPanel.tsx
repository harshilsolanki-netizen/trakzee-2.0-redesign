import {
  ArrowLeft,
  Clock,
  Copy,
  History,
  Maximize2,
  MessageSquare,
  PanelRight,
  Plus,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

  return (
    <div
      style={{
        border: "1.5px solid transparent",
        background:
          "linear-gradient(to bottom, #ffffff 0%, #faf7ff 45%, #f4ebff 100%) padding-box, linear-gradient(to bottom, #7c3aed 0%, #a855f7 30%, #ec4899 70%, #f43f5e 100%) border-box",
        borderRadius: "0.75rem",
      }}
      className={cn(
        "flex flex-col text-foreground transition-all duration-300 ease-out overflow-hidden shadow-[0_16px_50px_-10px_rgba(139,92,246,0.18)] relative",
        isFullscreen && "w-full h-full flex-1",
        mode === "floating" && "w-[380px] sm:w-[410px] h-[580px] max-h-[85vh]",
        mode === "sidebar" && "w-full h-full flex-1",
        className,
      )}
    >
      {/* Ambient gradient glow in Fullscreen mode */}
      {isFullscreen && (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-60 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle at 12% 75%, rgba(254, 205, 211, 0.45) 0%, transparent 45%), radial-gradient(circle at 88% 75%, rgba(219, 234, 254, 0.55) 0%, transparent 45%), radial-gradient(circle at 50% 90%, rgba(237, 233, 254, 0.45) 0%, transparent 50%)",
          }}
        />
      )}

      {/* Header */}
      <header
        className={cn(
          "flex items-center justify-between border-b border-violet-100/70 bg-white/80 px-4 py-2.5 backdrop-blur-xs transition-all duration-300 ease-out shrink-0 select-none z-10",
          isFullscreen && "px-6 py-3",
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
            /* Fullscreen Initial View matching original UI */
            <div className="flex flex-col items-center justify-end h-full py-6 w-full max-w-4xl mx-auto mt-auto animate-in fade-in duration-200">
              <div className="mb-6 text-center space-y-1">
                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  Hi, I’m Zio. How can I help?
                </h3>
                <p className="text-xs text-muted-foreground">
                  How can I help you analyze your fleet today?
                </p>
              </div>

              {/* Suggestion Chips + Bottom Input */}
              <div className="w-full flex flex-col items-center gap-4">
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => sendMessage("Show me the fleet dashboard")}
                    className="rounded-md border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted hover:border-border/80 cursor-pointer"
                  >
                    Show me the fleet dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      sendMessage("Where are my vehicles right now?")
                    }
                    className="rounded-md border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted hover:border-border/80 cursor-pointer"
                  >
                    Where are my vehicles right now?
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      sendMessage("Show me the trip summary with dashboard")
                    }
                    className="rounded-md border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted hover:border-border/80 cursor-pointer"
                  >
                    Show me the trip summary with dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => sendMessage("Why is the Safety low?")}
                    className="rounded-md border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted hover:border-border/80 cursor-pointer"
                  >
                    Why is the Safety low?
                  </button>
                  <button
                    type="button"
                    onClick={() => sendMessage("How to improve vehicle score?")}
                    className="rounded-md border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted hover:border-border/80 cursor-pointer"
                  >
                    How to improve vehicle score?
                  </button>
                </div>

                <div className="w-full max-w-3xl">
                  <div className="flex items-center gap-2 rounded-md border border-input bg-background p-1.5 shadow-2xs focus-within:border-primary focus-within:ring-1.5 focus-within:ring-primary/40">
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
                        "flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer shadow-2xs shrink-0",
                        input.trim()
                          ? "bg-[#111c38] text-white hover:bg-[#0c1429]"
                          : "bg-[#111c38] text-white opacity-80 cursor-not-allowed",
                      )}
                    >
                      <Send className="h-4 w-4 fill-white text-white" />
                    </button>
                  </div>
                </div>
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
                  onClick={() => sendMessage("Show me the fleet dashboard")}
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted hover:border-border/80 cursor-pointer w-full text-left"
                >
                  <span>Show me the fleet dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    sendMessage("Where are my vehicles right now?")
                  }
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted hover:border-border/80 cursor-pointer w-full text-left"
                >
                  <span>Where are my vehicles right now?</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    sendMessage("Show me the trip summary with dashboard")
                  }
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted hover:border-border/80 cursor-pointer w-full text-left"
                >
                  <span>Show me the trip summary with dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendMessage("Why is the Safety low?")}
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted hover:border-border/80 cursor-pointer w-full text-left"
                >
                  <span>Why is the Safety low?</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendMessage("How to improve vehicle score?")}
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground shadow-2xs transition-colors hover:bg-muted hover:border-border/80 cursor-pointer w-full text-left"
                >
                  <span>How to improve vehicle score?</span>
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
                "flex items-center gap-2 rounded-md bg-background p-1.5 shadow-2xs border border-input focus-within:border-primary focus-within:ring-1.5 focus-within:ring-primary/40",
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
  );
}

