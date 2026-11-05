import React from "react";
import { CloudDownload, Check, X, ArrowDown } from "lucide-react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCloudDownload } from "@/components/cloud/CloudDownloadContext";
import { cn } from "@/lib/utils";

export function CloudDownloadTopBarButton() {
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const isCloudDownload = location.pathname.startsWith("/cloud-download");

  const { activeDownload, isDownloading, progress, cancelDownload } =
    useCloudDownload();

  const isCompleted = activeDownload?.status === "completed";

  // Clean SVG circular ring metrics (size 28x28, center 14, radius 10)
  const radius = 10.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference * (1 - Math.min(100, Math.max(0, progress)) / 100);

  const handleClick = () => {
    if (!isCloudDownload) {
      navigate({ to: "/cloud-download" as any });
    }
  };

  // Downloading or Completed State (Subtle, professional, matching Trakzee theme)
  if (isDownloading || isCompleted) {
    return (
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Cloud Download Progress"
                onClick={handleClick}
                className={cn(
                  "relative flex h-[30px] w-[30px] items-center justify-center rounded-md transition-colors duration-150 cursor-pointer select-none mr-1.5",
                  isCompleted
                    ? "bg-white/10 text-emerald-400"
                    : "bg-white/10 text-white hover:bg-white/15"
                )}
              >
                {/* Clean Circular Progress Ring around Cloud Icon */}
                <svg
                  className="absolute inset-0 h-[30px] w-[30px] -rotate-90 pointer-events-none p-0.5"
                  viewBox="0 0 28 28"
                >
                  {/* Subtle Background Track */}
                  <circle
                    cx="14"
                    cy="14"
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="2"
                  />
                  {/* Precise Progress Arc in Theme Brand Blue */}
                  <circle
                    cx="14"
                    cy="14"
                    r={radius}
                    fill="none"
                    stroke={isCompleted ? "#10B981" : "#0089FF"}
                    strokeWidth="2"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-100 ease-linear"
                  />
                </svg>

                {/* Center Icon */}
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <CloudDownload className="h-3.5 w-3.5 text-white" />
                )}

                {/* Percentage Badge: Increased to 11.5px/12px font size with comfortable pill padding */}
                <span
                  className={cn(
                    "absolute -top-1.5 -right-3 min-w-[24px] h-[18px] px-1.5 flex items-center justify-center rounded-full text-[11.5px] font-mono font-bold text-white text-center leading-none shadow-md border border-[#070D1E] select-none z-10",
                    isCompleted ? "bg-emerald-600" : "bg-[#0089FF]"
                  )}
                >
                  {isCompleted ? "100%" : `${Math.round(progress)}%`}
                </span>
              </button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="bg-[#18191b] text-white text-xs px-2.5 py-1 rounded shadow-xl border border-white/10 font-medium"
          >
            {isCompleted
              ? "Download complete • Click to open Cloud Download"
              : `Downloading ${activeDownload?.taskName || "task"} (${Math.round(progress)}%)`}
          </TooltipContent>
        </Tooltip>

        {/* Detailed Download Card styled to match Trakzee Popover theme */}
        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-72 p-3 text-xs bg-popover/98 backdrop-blur-xl border border-border/80 shadow-2xl rounded-xl z-[90] text-foreground select-none"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md",
                    isCompleted
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                      : "bg-blue-50 dark:bg-blue-950/40 text-[#0089FF]"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <CloudDownload className="h-3.5 w-3.5" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-foreground leading-tight">
                    {isCompleted ? "Download Complete" : "Cloud Download"}
                  </h4>
                  <span className="text-[10px] text-muted-foreground">
                    {activeDownload?.taskName}
                  </span>
                </div>
              </div>
              {isDownloading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelDownload();
                  }}
                  className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  title="Cancel download"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <p
                className="font-medium text-foreground truncate text-xs font-mono"
                title={activeDownload?.fileName}
              >
                {activeDownload?.fileName}
              </p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>File Size: {activeDownload?.fileSize}</span>
                <span className="font-mono font-semibold text-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Clean Progress Bar matching Trakzee theme */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full transition-all duration-100 ease-linear rounded-full",
                  isCompleted ? "bg-emerald-500" : "bg-[#0089FF]"
                )}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                navigate({ to: "/cloud-download" as any });
              }}
              className="mt-1 w-full rounded-md border border-input bg-background hover:bg-muted py-1.5 text-center text-xs font-medium text-foreground transition-colors cursor-pointer shadow-2xs"
            >
              Open Cloud Download Page
            </button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Idle State: Exact styling matching Headset and Bell in the top bar (NO solid blue box!)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Cloud Download"
          onClick={handleClick}
          className={cn(
            "relative rounded-md p-1.5 transition-colors duration-150 cursor-pointer select-none",
            isCloudDownload
              ? "bg-white/15 text-white"
              : "text-nav-foreground/90 hover:bg-white/10 hover:text-white"
          )}
        >
          <CloudDownload className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-[#18191b] text-white text-xs px-2.5 py-1 rounded shadow-xl border border-white/10 font-medium"
      >
        Cloud Download
      </TooltipContent>
    </Tooltip>
  );
}
