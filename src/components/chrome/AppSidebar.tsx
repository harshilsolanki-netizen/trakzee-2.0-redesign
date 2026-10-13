import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Cloud,
  FileText,
  Grid2x2,
  Home,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  Pin,
  PinOff,
  Settings,
  ShoppingCart,
  Sparkles,
  Star,
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
          {/* AI Navigation Tab */}
          <Link
            to="/zio"
            activeOptions={{ exact: false }}
            className="w-full flex"
            aria-label="AI"
          >
            {({ isActive }) => (
              <SidebarItem
                label="AI"
                icon={Sparkles}
                active={isActive}
                collapsed={isCollapsed}
              />
            )}
          </Link>

          {/* 1. Favourites */}
          <FavoritesMenu collapsed={isCollapsed} />

          {/* 2. Dashboard */}
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="w-full flex"
            aria-label="Dashboard"
          >
            {({ isActive }) => (
              <SidebarItem
                label="Dashboard"
                icon={LayoutDashboard}
                active={isActive}
                collapsed={isCollapsed}
              />
            )}
          </Link>

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

          {/* Pinned Extra Items */}
          {pinnedMoreItems.map((id) => {
            const item = MORE_ITEMS.find((m) => m.id === id);
            if (!item) return null;
            return (
              <div key={id} className="w-full flex">
                <SidebarItem
                  label={item.label}
                  icon={item.icon}
                  collapsed={isCollapsed}
                  onClick={() => runItem(item)}
                />
              </div>
            );
          })}

          {/* 7. More Actions Popover */}
          <div className="w-full flex">
            <Popover open={moreOpen} onOpenChange={setMoreOpen}>
              <PopoverTrigger asChild>
                <div className="w-full">
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
                side="right"
                align="end"
                sideOffset={isCollapsed ? 14 : 10}
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
      </aside>
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
  onClick,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const buttonEl = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full h-10 items-center rounded-xl px-2.5 transition-colors duration-200 cursor-pointer select-none overflow-hidden",
        active
          ? "bg-[#0089FF] text-white shadow-lg shadow-[#0089FF]/35 font-semibold"
          : "text-slate-400 hover:bg-white/10 hover:text-white font-medium"
      )}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200",
            active ? "text-white scale-105" : "text-slate-400 group-hover:text-white group-hover:scale-105"
          )}
        />
      </div>
      <div
        className={cn(
          "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
          collapsed
            ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none"
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
