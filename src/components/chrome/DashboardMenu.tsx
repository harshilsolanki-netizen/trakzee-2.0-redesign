import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Thermometer,
  Fuel,
  Check,
  ChevronRight,
  Sparkles,
  Search,
  X,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DashboardOption {
  id: string;
  title: string;
  path: string;
  icon: typeof LayoutDashboard;
  iconColor: string;
  iconBg: string;
}

const DASHBOARD_OPTIONS: DashboardOption[] = [
  {
    id: "fleet-overview",
    title: "Fleet Overview",
    path: "/",
    icon: LayoutDashboard,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/15 border-blue-500/30",
  },
  {
    id: "temperature",
    title: "Temperature Dashboard",
    path: "/temperature-dashboard",
    icon: Thermometer,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
  },
  {
    id: "fuel",
    title: "Fuel Dashboard",
    path: "/fuel-dashboard",
    icon: Fuel,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
  },
];

export function DashboardMenu({ collapsed }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuTop, setMenuTop] = useState(130);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardRoute =
    location.pathname === "/" ||
    location.pathname.startsWith("/temperature-dashboard") ||
    location.pathname.startsWith("/fuel-dashboard");

  // Click outside, ESC listeners, and trigger position update (open beside dashboard icon)
  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setMenuTop(rect.top);
      }
    };

    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  // Reset search query on open
  useEffect(() => {
    if (open) setSearchQuery("");
  }, [open]);

  const handleSelect = (option: DashboardOption) => {
    setOpen(false);
    navigate({ to: option.path });
  };

  const isCurrent = (path: string) => {
    if (path === "/temperature-dashboard") {
      return location.pathname.startsWith("/temperature-dashboard");
    }
    if (path === "/fuel-dashboard") {
      return location.pathname.startsWith("/fuel-dashboard");
    }
    if (path === "/") {
      return (
        location.pathname === "/" &&
        !location.pathname.startsWith("/temperature") &&
        !location.pathname.startsWith("/fuel")
      );
    }
    return location.pathname === path;
  };

  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return DASHBOARD_OPTIONS;
    return DASHBOARD_OPTIONS.filter((opt) =>
      opt.title.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const triggerButton = (
    <button
      ref={triggerRef}
      type="button"
      aria-label="Dashboard"
      onClick={() => setOpen((prev) => !prev)}
      className={cn(
        "group flex w-full h-10 items-center rounded-xl transition-colors duration-200 cursor-pointer select-none overflow-hidden",
        collapsed ? "justify-center px-0" : "px-2.5",
        open || isDashboardRoute
          ? "bg-[#0089FF] text-white shadow-lg shadow-[#0089FF]/35 font-semibold"
          : "text-slate-400 hover:bg-white/10 hover:text-white font-medium"
      )}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        <LayoutDashboard
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200",
            open || isDashboardRoute
              ? "text-white"
              : "text-slate-400 group-hover:text-white group-hover:scale-105"
          )}
        />
      </div>
      <div
        className={cn(
          "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
          collapsed
            ? "w-0 max-w-0 opacity-0 m-0 p-0 pointer-events-none"
            : "max-w-[130px] opacity-100 translate-x-0 ml-3"
        )}
      >
        <span
          className={cn(
            "leading-tight tracking-tight block truncate text-xs",
            open || isDashboardRoute
              ? "font-semibold text-white"
              : "font-medium text-slate-300 group-hover:text-white"
          )}
        >
          Dashboard
        </span>
      </div>
    </button>
  );

  return (
    <div className="w-full relative">
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{triggerButton}</TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={12}
            className="bg-[#18191b] text-white text-xs px-2.5 py-1 rounded shadow-xl border border-white/10 font-medium"
          >
            Dashboard
          </TooltipContent>
        </Tooltip>
      ) : (
        triggerButton
      )}

      {open && typeof document !== "undefined" && (
        createPortal(
          <>
            {/* Backdrop for outside click dismiss with blur effect */}
            <div
              className={cn(
                "fixed inset-0 top-[45px] z-40 bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-200",
                collapsed ? "left-[60px]" : "left-[200px]"
              )}
              onClick={() => setOpen(false)}
            />

            {/* Flyout Panel anchored exactly beside the Dashboard icon */}
            <div
              ref={menuRef}
              style={{ top: `${menuTop}px` }}
              className={cn(
                "fixed z-50 flex flex-col w-[290px] sm:w-[310px] max-h-[calc(100vh-120px)] overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0B1736]/98 p-0 text-slate-100 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-left-2 duration-150",
                collapsed ? "left-[70px]" : "left-[210px]"
              )}
            >
              {/* Header with Search Input */}
              <div className="border-b border-slate-800/80 bg-slate-900/60 px-3 py-2.5">
                <div className="relative flex items-center rounded-lg border border-slate-700/60 bg-slate-950/60 px-2.5 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all">
                  <Search className="h-3.5 w-3.5 text-slate-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dashboards..."
                    className="h-full flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
                    autoFocus
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-slate-400 hover:text-slate-200 cursor-pointer p-0.5 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-full shrink-0">
                      3 Options
                    </span>
                  )}
                </div>
              </div>

              {/* Direct List of 3 Dashboard Options (Clean: Only Icon, Title & Active Checkmark) */}
              <div className="p-2 space-y-1.5 max-h-[65vh] overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No dashboard found matching &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  filteredOptions.map((opt) => {
                    const active = isCurrent(opt.path);
                    const Icon = opt.icon;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelect(opt)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer border",
                          active
                            ? "bg-blue-600/20 border-blue-500/50 text-white shadow-sm"
                            : "border-transparent hover:bg-slate-800/70 hover:border-slate-700/60 text-slate-300 hover:text-white"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg shrink-0 border transition-transform duration-200 group-hover:scale-105",
                            opt.iconBg,
                            opt.iconColor
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        <span
                          className={cn(
                            "flex-1 text-xs font-semibold truncate",
                            active
                              ? "text-white font-bold"
                              : "text-slate-200 group-hover:text-white"
                          )}
                        >
                          {opt.title}
                        </span>

                        {active ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white shrink-0">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer Quick Status Bar matching Reports theme */}
              <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/80 px-3.5 py-2 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-blue-400" />
                  <span>3 Dashboard Workspaces</span>
                </div>
                <span className="text-slate-400 font-mono">Click to open</span>
              </div>
            </div>
          </>,
          document.body
        )
      )}
    </div>
  );
}
