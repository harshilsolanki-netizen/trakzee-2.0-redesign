import React, { useState, useEffect } from "react";
import {
  History,
  X,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { AnnouncementBullhornIcon } from "@/components/icons/AnnouncementBullhornIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type?: "maintenance" | "update" | "alert" | "info";
  duration?: string;
  isNew?: boolean;
}

// Default system announcements matching reference
const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-server-maint",
    title: "Server Maintenance",
    message:
      "The server will be undergoing scheduled maintenance for 10 minutes. Live GPS tracking, telemetry, and report exports will resume automatically once completed.",
    timestamp: "04-11-2026 05:20:00 PM",
    type: "maintenance",
    duration: "10 min",
    isNew: true,
  },
  {
    id: "ann-perf-upg",
    title: "System Performance Upgrade",
    message:
      "Database indexing and fleet query caching optimization completed. Telematics response times reduced by 40%.",
    timestamp: "04-11-2026 02:30:15 PM",
    type: "update",
  },
  {
    id: "ann-new-heatmap",
    title: "New Feature: Event Heatmap",
    message:
      "The Event Heatmap widget is now available to add directly into your custom Dashboard tabs.",
    timestamp: "03-11-2026 11:15:00 AM",
    type: "info",
  },
];

interface AnnouncementsOverlayProps {
  announcements?: AnnouncementItem[];
  defaultOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function AnnouncementsOverlay({
  announcements = DEFAULT_ANNOUNCEMENTS,
  defaultOpen = true,
  onClose,
  className,
}: AnnouncementsOverlayProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isHistoryView, setIsHistoryView] = useState(false);
  const [items, setItems] = useState<AnnouncementItem[]>(announcements);
  const [selectedId, setSelectedId] = useState<string>(
    announcements[0]?.id || ""
  );

  // Allow other components to trigger announcements via custom DOM event
  useEffect(() => {
    const handleAddAnnouncement = (e: Event) => {
      const customEvent = e as CustomEvent<AnnouncementItem>;
      if (customEvent.detail) {
        setItems((prev) => [customEvent.detail, ...prev]);
        setSelectedId(customEvent.detail.id);
        setIsOpen(true);
        setIsHistoryView(false);
      }
    };

    window.addEventListener(
      "trakzee:show-announcement",
      handleAddAnnouncement
    );
    return () =>
      window.removeEventListener(
        "trakzee:show-announcement",
        handleAddAnnouncement
      );
  }, []);

  const activeAnnouncement =
    items.find((item) => item.id === selectedId) || items[0];

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  // If dismissed, provide a clean, subtle floating pill in the bottom-right corner to reopen anytime
  if (!isOpen) {
    return (
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 pointer-events-auto",
          className
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setIsHistoryView(false);
              }}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0089FF] hover:bg-[#0077E6] text-white shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer animate-in fade-in select-none border border-white/20 active:scale-95"
            >
              <AnnouncementBullhornIcon className="h-3.5 w-3.5 text-white transition-transform group-hover:scale-110" />
              <span className="text-xs font-semibold tracking-tight">
                Announcements
              </span>
              <span className="text-[10px] font-bold bg-white/25 px-1.5 py-0.2 rounded-full">
                {items.length}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="bg-[#18191b] text-white text-xs px-2.5 py-1 rounded shadow-xl border border-white/10 font-medium"
          >
            Click to view announcements
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 pointer-events-auto",
        className
      )}
    >
      <div
        className={cn(
          "w-[320px] sm:w-[340px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden select-none",
          "animate-in fade-in-0 slide-in-from-bottom-3 duration-200"
        )}
      >
        {/* =========================================================================
            HEADER: Announcements with Bullhorn icon, History button & Close button
            Styled according to our theme (#0089FF), no extra badges
            ========================================================================= */}
        <div className="bg-[#0089FF] dark:bg-sky-600 text-white px-3.5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {isHistoryView ? (
              <button
                type="button"
                onClick={() => setIsHistoryView(false)}
                className="p-0.5 rounded text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer mr-0.5"
                title="Back to announcement"
                aria-label="Back"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            ) : (
              <AnnouncementBullhornIcon className="h-4 w-4 text-white shrink-0" />
            )}

            <h3 className="font-semibold text-xs text-white tracking-tight leading-none truncate">
              {isHistoryView ? "Announcements History" : "Announcements"}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* History Toggle Button matching reference clock icon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setIsHistoryView((prev) => !prev)}
                  className={cn(
                    "p-1 rounded text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer",
                    isHistoryView && "bg-white/20 text-white"
                  )}
                  aria-label="View announcements history"
                >
                  <History className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-[#18191b] text-white text-xs px-2.5 py-1 rounded shadow-xl border border-white/10 font-medium"
              >
                {isHistoryView ? "Active Announcement" : "Announcements History"}
              </TooltipContent>
            </Tooltip>

            {/* Close button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1 rounded text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-[#18191b] text-white text-xs px-2.5 py-1 rounded shadow-xl border border-white/10 font-medium"
              >
                Dismiss
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* =========================================================================
            BODY CONTENT:
            - Active View: Distinctive inner bordered container matching reference
            - History View: Past announcements list
            ========================================================================= */}
        {isHistoryView ? (
          /* ----------------- Announcements History List ----------------- */
          <div className="p-2.5 max-h-[300px] overflow-y-auto space-y-2 bg-slate-50/50 dark:bg-slate-950/30">
            {items.map((item) => {
              const isSelected = item.id === activeAnnouncement.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setIsHistoryView(false);
                  }}
                  className={cn(
                    "p-2.5 rounded-lg border text-left transition-all cursor-pointer group select-none",
                    isSelected
                      ? "bg-white dark:bg-slate-900 border-[#0089FF] shadow-xs"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  )}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors truncate">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{item.timestamp}</span>
                    <span className="text-[#0089FF] group-hover:translate-x-0.5 transition-transform flex items-center">
                      View <ChevronRight className="h-3 w-3 inline" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ----------------- Active Announcement Card (1-to-1 Match) ----------------- */
          <div className="p-3 bg-white dark:bg-slate-900">
            {/* Inner bordered container matching reference image */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3 shadow-2xs">
              {/* 1. Subject / Title (Clean bold text matching reference, no extra badges) */}
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  {activeAnnouncement.title}
                </h4>
              </div>

              {/* 2. Thin horizontal separation line matching reference */}
              <div className="border-b border-slate-200 dark:border-slate-700/60 my-2" />

              {/* 3. Description message */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {activeAnnouncement.message}
              </p>

              {/* 4. Clean timestamp matching reference format (No extra badges or labels) */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/30 text-[10.5px] text-slate-400 dark:text-slate-500 font-mono">
                <span>{activeAnnouncement.timestamp}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
