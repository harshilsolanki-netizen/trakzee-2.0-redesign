import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Cloud,
  FileText,
  Grid2x2,
  Home,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  Pin,
  PinOff,
  Settings,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { toast } from "sonner";
import { ChartsMenu } from "@/components/chrome/ChartsMenu";
import { FavoritesMenu } from "@/components/chrome/FavoritesMenu";
import { ReportsMenu } from "@/components/chrome/ReportsMenu";
import { SettingsMenu } from "@/components/chrome/SettingsMenu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDashboard } from "@/dashboard/store";
import { useSidebarState } from "@/lib/useSidebarState";
import { cn } from "@/lib/utils";

const NAV_PRIMARY = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/tracking", label: "Tracking", icon: MapPin, exact: false },
] as const;

const MORE_ITEMS: {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  to?: string;
  action?: string;
}[] = [
  { id: "setup", label: "Setup", icon: ShoppingCart, to: "/setting" },
  { id: "support", label: "Support", icon: LifeBuoy, action: "support" },
  { id: "cloud", label: "Cloud Download", icon: Cloud, action: "cloud" },
];

export function AppSidebar() {
  const { pinnedMoreItems, toggleMorePin } = useDashboard();
  const { isCollapsed, toggleSidebar } = useSidebarState();
  const [moreOpen, setMoreOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const runItem = (item: (typeof MORE_ITEMS)[number]) => {
    setMoreOpen(false);
    if (item.to) {
      navigate({ to: item.to });
      return;
    }
    if (item.action === "support")
      toast.success("Support request opened", {
        description: "A specialist will reply in this window shortly.",
      });
    if (item.action === "cloud")
      toast.success("Cloud download queued", {
        description: "Fleet snapshot will be ready in a moment.",
      });
  };

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          "relative flex shrink-0 flex-col bg-[#282a2d] dark:bg-[#1f2124] select-none z-30 transition-all duration-300 ease-in-out border-r border-white/5",
          isCollapsed ? "w-[60px] px-2 py-3" : "w-[200px] px-3 py-3"
        )}
      >
        {/* Brand Logo Header: Orange circle logo matching reference screenshot */}
        <div className={cn("flex items-center mb-4", isCollapsed ? "justify-center" : "px-1 gap-2.5")}>
          <Link
            to="/"
            aria-label="Home"
            className="group flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5C35] text-white shadow-sm hover:scale-105 transition-all duration-200 shrink-0"
          >
            {/* Minimal HubSpot / Trakzee Hub style sprout/circle badge */}
            <svg
              className="h-4.5 w-4.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 3v6" />
              <path d="M12 15v6" />
              <path d="M4.93 4.93l4.24 4.24" />
              <path d="M14.83 14.83l4.24 4.24" />
            </svg>
          </Link>

          {!isCollapsed && (
            <span className="font-bold text-sm tracking-tight text-white font-sans truncate">
              Trakzee
            </span>
          )}
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* 1. Home / Dashboard */}
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="w-full"
            aria-label="Home"
          >
            {({ isActive }) => (
              <SidebarItem
                label="Home"
                icon={Home}
                active={isActive}
                collapsed={isCollapsed}
              />
            )}
          </Link>

          {/* 2. Bookmarks / Favorites */}
          <FavoritesMenu collapsed={isCollapsed} />

          {/* Subtle Horizontal Divider Line */}
          <div className="my-2 h-px bg-white/10 w-full shrink-0" />

          {/* 3. Tracking */}
          <Link
            to="/tracking"
            activeOptions={{ exact: false }}
            className="w-full"
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

          {/* 4. Reports Cascading Menu */}
          <ReportsMenu collapsed={isCollapsed} />

          {/* 5. Charts Cascading Menu */}
          <ChartsMenu collapsed={isCollapsed} />

          {/* 6. Settings Cascading Menu */}
          <SettingsMenu collapsed={isCollapsed} />

          {/* Pinned Extra Items */}
          {pinnedMoreItems.map((id) => {
            const item = MORE_ITEMS.find((m) => m.id === id);
            if (!item) return null;
            return (
              <SidebarItem
                key={id}
                label={item.label}
                icon={item.icon}
                collapsed={isCollapsed}
                onClick={() => runItem(item)}
              />
            );
          })}

          {/* More Actions Popover */}
          <div className="w-full">
            <Popover open={moreOpen} onOpenChange={setMoreOpen}>
              <PopoverTrigger asChild>
                <div>
                  <SidebarItem
                    label="More"
                    icon={Grid2x2}
                    active={moreOpen}
                    collapsed={isCollapsed}
                    onClick={() => setMoreOpen(!moreOpen)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                side={isCollapsed ? "right" : "right"}
                align="end"
                sideOffset={isCollapsed ? 12 : 8}
                className="w-64 p-3 bg-popover/98 backdrop-blur-xl border border-border shadow-2xl rounded-xl z-50 text-foreground"
              >
                <div className="grid grid-cols-3 gap-2">
                  {MORE_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selected === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelected(item.id)}
                        onDoubleClick={() => runItem(item)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-md border p-2 text-center text-[11px] font-medium transition-all cursor-pointer",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                            : "border-border/60 hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span className="rounded-md border border-border bg-background p-2 shadow-2xs">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={!selected}
                    onClick={() => {
                      const item = MORE_ITEMS.find((m) => m.id === selected);
                      if (item) runItem(item);
                    }}
                    className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 cursor-pointer shadow-xs"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    disabled={!selected}
                    onClick={() => {
                      if (!selected) return;
                      const wasPinned = pinnedMoreItems.includes(selected);
                      toggleMorePin(selected);
                      toast.success(
                        wasPinned ? "Removed from menu" : "Pinned to menu"
                      );
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium transition-all hover:bg-muted disabled:opacity-40 cursor-pointer shadow-2xs"
                  >
                    {selected && pinnedMoreItems.includes(selected) ? (
                      <>
                        <PinOff className="h-3.5 w-3.5" /> Unpin
                      </>
                    ) : (
                      <>
                        <Pin className="h-3.5 w-3.5" /> Pin
                      </>
                    )}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Bottom Section: Collapse Navigation Button [<] */}
        <div className="pt-2 mt-auto border-t border-white/5 flex items-center justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
                className={cn(
                  "flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer p-1.5",
                  isCollapsed ? "w-full h-8" : "h-7 px-2 gap-1.5"
                )}
              >
                {/* Square bracket icon [<] matching reference screenshot */}
                <div className="flex items-center text-xs font-mono font-bold leading-none select-none tracking-tighter">
                  {isCollapsed ? (
                    <span className="flex items-center font-semibold text-slate-300">
                      [<ChevronRight className="h-3.5 w-3.5 -mx-0.5 inline" />]
                    </span>
                  ) : (
                    <span className="flex items-center font-semibold text-slate-300">
                      [<ChevronLeft className="h-3.5 w-3.5 -mx-0.5 inline" />]
                    </span>
                  )}
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={12}
              className="bg-[#18191b] text-white text-xs px-2.5 py-1 rounded shadow-xl border border-white/10 font-medium"
            >
              {isCollapsed ? "Expand navigation" : "Collapse navigation"}
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}

/**
 * Reusable Sidebar Item supporting both Expanded (horizontal row)
 * and Collapsed (centered icon) states.
 */
export function SidebarItem({
  label,
  icon: Icon,
  active,
  collapsed,
  onClick,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center transition-all duration-150 cursor-pointer select-none rounded-lg",
        collapsed
          ? "justify-center h-10 py-1"
          : "gap-3 px-3 py-2 text-left h-9",
        active
          ? "bg-white/15 text-white font-semibold shadow-xs"
          : "text-slate-300 hover:bg-white/10 hover:text-white font-medium"
      )}
    >
      <Icon
        className={cn(
          "shrink-0 transition-colors",
          collapsed ? "h-5 w-5" : "h-4.5 w-4.5",
          active ? "text-white" : "text-slate-300 group-hover:text-white"
        )}
      />
      {!collapsed && (
        <span className="text-xs truncate tracking-tight leading-none">
          {label}
        </span>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
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

  return content;
}
