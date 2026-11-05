import React, { useState } from "react";
import { Check, Download, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface CompletedDownloadItem {
  id: string;
  taskName: string;
  fileName?: string;
  csvContent?: string;
}

// Exactly matches the completed items in the reference image
const INITIAL_ITEMS: CompletedDownloadItem[] = [
  {
    id: "dl-card-1",
    taskName: "Travel Summary",
    fileName: "travel_summary_CD-8841.csv",
  },
  {
    id: "dl-card-2",
    taskName: "Travel Summary",
    fileName: "travel_summary_CD-8840.csv",
  },
];

interface DownloadOverlayMenuProps {
  completedItems?: CompletedDownloadItem[];
  onDismissItem?: (id: string) => void;
  onDownloadItem?: (item: CompletedDownloadItem) => void;
}

export function DownloadOverlayMenu({
  completedItems,
  onDismissItem,
  onDownloadItem,
}: DownloadOverlayMenuProps) {
  const [internalItems, setInternalItems] = useState<CompletedDownloadItem[]>(INITIAL_ITEMS);
  const items = completedItems !== undefined ? completedItems : internalItems;

  const handleDismiss = (id: string) => {
    if (onDismissItem) {
      onDismissItem(id);
    }
    setInternalItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDownload = (item: CompletedDownloadItem) => {
    if (onDownloadItem) {
      onDownloadItem(item);
      return;
    }

    // Default trigger browser CSV download
    const fileName =
      item.fileName ||
      `${item.taskName.toLowerCase().replace(/[^a-z0-9]/g, "_")}.csv`;
    const content =
      item.csvContent ||
      `ID,Task,Status,Completed At\n"${item.id}","${item.taskName}","Completed","${new Date().toLocaleString()}"\n`;

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Download started", {
      description: `${fileName} saved to your device.`,
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2.5 pointer-events-auto">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "w-[280px] sm:w-[290px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden select-none",
            "animate-in fade-in-0 slide-in-from-bottom-3 duration-200"
          )}
        >
          {/* =========================================================================
              HEADER: Download with close button, styled according to our theme
              ========================================================================= */}
          <div className="bg-[#0089FF] dark:bg-sky-600 text-white px-3 py-2 flex items-center justify-between">
            <span className="font-semibold text-xs text-white tracking-tight">
              Download
            </span>
            <button
              type="button"
              onClick={() => handleDismiss(item.id)}
              className="p-0.5 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* =========================================================================
              BODY: Green checkmark + completion text matching reference exactly
              ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 px-3 py-2.5 flex items-start gap-2.5">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xs mt-0.5">
              <Check className="h-3 w-3 stroke-[3]" />
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug font-normal">
              Your request:{" "}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {item.taskName}
              </span>{" "}
              has been successfully completed.
            </p>
          </div>

          {/* =========================================================================
              FOOTER: Download button matching reference exactly
              ========================================================================= */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200/60 dark:border-slate-800 px-2.5 py-1.5 flex items-center justify-center">
            <button
              type="button"
              onClick={() => handleDownload(item)}
              className="w-full py-1.5 px-3 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs hover:border-[#0089FF] hover:text-[#0089FF] cursor-pointer group"
            >
              <Download className="h-3.5 w-3.5 text-slate-500 group-hover:text-[#0089FF] transition-colors" />
              <span>Download</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
