import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CloudDownload,
  FileText,
  Grip,
  Home,
  LayoutDashboard,
  Headset,
  MapPin,
  Pin,
  PinOff,
  Settings,
  ShoppingCart,
  Star,
  LayoutGrid,
  ExternalLink,
  Globe,
  Plus,
} from "lucide-react";
import { useState, useRef, useEffect, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { ChartsMenu } from "@/components/chrome/ChartsMenu";
import { DashboardMenu } from "@/components/chrome/DashboardMenu";
import { FavoritesMenu } from "@/components/chrome/FavoritesMenu";
import { ReportsMenu } from "@/components/chrome/ReportsMenu";
import { SettingsMenu } from "@/components/chrome/SettingsMenu";
import { AddThirdPartyAppModal, APP_ICONS } from "@/components/chrome/AddThirdPartyAppModal";
import { useThirdPartyApps } from "@/lib/useThirdPartyApps";
import { ZioIcon } from "@/components/zio/ZioLogo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDashboard } from "@/dashboard/store";
import { useSidebarState } from "@/lib/useSidebarState";
import { cn } from "@/lib/utils";


function SlidersVerticalIcon(props: { className?: string }) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function WhatsAppIcon(props: { className?: string }) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function JiraIcon(props: { className?: string }) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="3" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function KekaIcon(props: { className?: string }) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="3" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function getAppIconComponent(name: string, iconName?: string) {
  const lower = name.toLowerCase();
  if (lower.includes("youtube")) return SlidersVerticalIcon;
  if (lower.includes("whatsapp")) return WhatsAppIcon;
  if (lower.includes("jira")) return JiraIcon;
  if (lower.includes("keka")) return KekaIcon;
  if (iconName && APP_ICONS[iconName]) return APP_ICONS[iconName];
  return Globe;
}

export function AppSidebar() {
  const { pinnedMoreItems, toggleMorePin } = useDashboard();
  const { isCollapsed, toggleSidebar } = useSidebarState();
  const [moreOpen, setMoreOpen] = useState(false);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>("keka");
  const [menuTop, setMenuTop] = useState(450);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { apps, addApp, openApp } = useThirdPartyApps();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!moreOpen) return;

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const top = Math.min(rect.top, window.innerHeight - 240);
        setMenuTop(Math.max(55, top));
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
        setMoreOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
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
  }, [moreOpen]);

    return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          "relative flex shrink-0 flex-col bg-[#070D1E] dark:bg-[#070D1E] select-none z-30 border-r border-white/5 overflow-x-hidden pt-2.5 pb-2 px-2.5 items-stretch transition-[width] duration-300 ease-in-out will-change-[width]",
          isCollapsed ? "w-[60px]" : "w-[200px]"
        )}
      >
        {/* Brand Logo Header: Circular white pill with uffizio script logo */}
        <div className="flex items-center mb-3 w-full h-10 px-2.5 overflow-hidden">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            <Link
              to="/"
              aria-label="Home"
              className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white shadow-md shadow-black/25 hover:scale-105 transition-all duration-200 shrink-0"
            >
              <span className="text-[11px] font-black italic tracking-tighter text-slate-900 lowercase font-serif select-none">
                uffizio
              </span>
            </Link>
          </div>
          <div
            className={cn(
              "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
              isCollapsed
                ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none"
                : "max-w-[130px] opacity-100 translate-x-0 ml-3"
            )}
          >
            <span className="font-bold text-sm tracking-tight text-white font-sans truncate block">
              Trakzee
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 w-full flex flex-col gap-2.5 overflow-y-auto overflow-x-hidden custom-scrollbar py-1">
          {/* AI / Zio Navigation Tab */}
          <Link
            to="/zio"
            activeOptions={{ exact: false }}
            className="w-full flex"
            aria-label="Zio"
          >
            {({ isActive }) => (
              <SidebarItem
                label="Zio"
                icon={ZioIcon}
                active={isActive}
                collapsed={isCollapsed}
                iconClassName={!isActive ? "text-[#0089FF] group-hover:text-white" : "text-white"}
              />
            )}
          </Link>

          {/* 1. Favourites */}
          <FavoritesMenu collapsed={isCollapsed} />

          {/* 2. Dashboard */}
          <DashboardMenu collapsed={isCollapsed} />

          {/* 3. Tracking */}
          <Link
            to="/tracking"
            activeOptions={{ exact: false }}
            className="w-full flex"
            aria-label="Tracking"
          >
            {({ isActive }) => (
              <SidebarItem
                label="Tracking"
                icon={MapPin}
                active={isActive}
                collapsed={isCollapsed}
              />
            )}
          </Link>

          {/* 4. Report */}
          <ReportsMenu collapsed={isCollapsed} />

          {/* 5. Charts */}
          <ChartsMenu collapsed={isCollapsed} />

          {/* 6. Setting */}
          <SettingsMenu collapsed={isCollapsed} />

          {/* 7. Setu Navigation Tab (Replaces Support in Sidebar) */}
          <div className="w-full flex">
            <Link
              to="/setting"
              activeOptions={{ exact: false }}
              className="w-full flex"
              aria-label="Setu"
              onClick={() => {
                toast.success("Welcome to Setu", {
                  description: "Explore telematics hardware, devices, and marketplace addons.",
                });
              }}
            >
              {({ isActive }) => (
                <SidebarItem
                  label="Setu"
                  icon={ShoppingCart}
                  active={isActive}
                  collapsed={isCollapsed}
                />
              )}
            </Link>
          </div>

          {/* 8. More Apps Navigation Tab */}
          <div ref={triggerRef} className="w-full flex">
            <SidebarItem
              label="More Apps"
              icon={LayoutGrid}
              active={moreOpen}
              collapsed={isCollapsed}
              onClick={() => {
                setHoveredAppId("keka");
                setMoreOpen((prev) => !prev);
              }}
            />
          </div>


        </div>

        {/* Bottom Section: Collapse Navigation Button [<] */}
        <div className="pt-2 mt-auto border-t border-white/5 flex items-center justify-center w-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
                className="flex items-center justify-center w-full rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer h-7 py-1"
              >
                <div className="flex items-center text-[11px] font-mono font-bold leading-none select-none tracking-tighter">
                  {isCollapsed ? (
                    <span className="flex items-center font-semibold text-slate-300">
                      [<ChevronRight className="h-3 w-3 -mx-0.5 inline" />]
                    </span>
                  ) : (
                    <span className="flex items-center font-semibold text-slate-300">
                      [<ChevronLeft className="h-3 w-3 -mx-0.5 inline" />]
                    </span>
                  )}
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={14}
              className="bg-[#18191b] text-white text-xs px-2.5 py-1 rounded shadow-xl border border-white/10 font-medium"
            >
              {isCollapsed ? "Expand navigation" : "Collapse navigation"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Add Third-Party App Modal */}
        <AddThirdPartyAppModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onAdd={addApp}
        />
      </aside>

      {/* Flyout & Backdrop for More Apps - Portal to body matching Reports, Charts, Dashboard */}
      {moreOpen && typeof document !== "undefined" && (
        createPortal(
          <>
            {/* Backdrop: TopBar (top-[45px]) and Sidebar (left-[60px]/left-[200px]) remain completely unblurred */}
            <div
              className={cn(
                "fixed inset-0 top-[45px] z-40 bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-200",
                isCollapsed ? "left-[60px]" : "left-[200px]"
              )}
              onClick={() => setMoreOpen(false)}
            />

            {/* Flyout Panel anchored exactly beside the More Apps icon */}
            <div
              ref={menuRef}
              style={{ top: `${menuTop}px` }}
              className={cn(
                "fixed z-50 flex flex-col w-48 p-2 rounded-2xl border border-slate-700/60 bg-[#0C152E]/98 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-left-2 duration-150 text-slate-100 select-none",
                isCollapsed ? "left-[70px]" : "left-[210px]"
              )}
            >
              {/* Header: MORE APPS matching reference */}
              <div className="px-3 pt-2 pb-1 select-none">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase select-none">
                  MORE APPS
                </span>
              </div>

              {/* Apps List matching reference screenshot */}
              <div className="flex flex-col gap-0.5 mt-0.5 max-h-64 overflow-y-auto custom-scrollbar">
                {apps.map((app) => {
                  const isHovered = hoveredAppId === app.id;
                  const AppIcon = getAppIconComponent(app.name, app.iconName);

                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => {
                        setMoreOpen(false);
                        openApp(app);
                      }}
                      onMouseEnter={() => setHoveredAppId(app.id)}
                      className={cn(
                        "group flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer text-left",
                        isHovered
                          ? "bg-[#102A6B] text-white shadow-xs"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center transition-colors",
                          isHovered ? "text-white" : "text-slate-400 group-hover:text-white"
                        )}
                      >
                        <AppIcon className="h-4 w-4" />
                      </span>
                      <span className="flex-1 truncate tracking-tight">{app.name}</span>
                      {isHovered && (
                        <ChevronRight className="h-3.5 w-3.5 text-blue-300 shrink-0 animate-in fade-in slide-in-from-left-1 duration-100" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>,
          document.body
        )
      )}
    </TooltipProvider>
  );
}

/**
 * Reusable Sidebar Item:
 * - Fluid width and layout transition (no jumps between collapsed and expanded)
 * - Collapsed: 60px rail with tooltip
 * - Expanded: 200px width with smoothly faded label
 * - Active: Vibrant electric blue (#0089FF) pill background
 */
export function SidebarItem({
  label,
  icon: Icon,
  active,
  collapsed,
  iconClassName,
  onClick,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  collapsed?: boolean;
  iconClassName?: string;
  onClick?: () => void;
}) {
  const buttonEl = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full h-10 items-center rounded-xl transition-colors duration-200 cursor-pointer select-none overflow-hidden",
        collapsed ? "justify-center px-0" : "px-2.5",
        active
          ? "bg-[#0089FF] text-white shadow-lg shadow-[#0089FF]/35 font-semibold"
          : "text-slate-400 hover:bg-white/10 hover:text-white font-medium"
      )}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200",
            active
              ? "text-white"
              : "text-slate-400 group-hover:text-white group-hover:scale-105",
            iconClassName
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
            active ? "font-semibold text-white" : "font-medium text-slate-300 group-hover:text-white"
          )}
        >
          {label}
        </span>
      </div>
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonEl}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="bg-[#18191b] text-white text-xs px-2.5 py-1 rounded shadow-xl border border-white/10 font-medium"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonEl;
}
