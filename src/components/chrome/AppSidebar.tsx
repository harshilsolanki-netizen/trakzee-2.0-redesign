import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Cloud,
  FileText,
  Grid2x2,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  Pin,
  PinOff,
  Settings,
  ShoppingCart,
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
          "relative flex shrink-0 flex-col items-center bg-[#070D1E] dark:bg-[#070D1E] select-none z-30 transition-all duration-300 ease-in-out border-r border-white/5",
          isCollapsed ? "w-[60px] px-1.5 pt-2.5 pb-2" : "w-[68px] px-1.5 pt-2.5 pb-2"
        )}
      >
        {/* Brand Logo Header: Circular white pill with uffizio script logo matching reference */}
        <div className="flex items-center justify-center mb-2.5 w-full">
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

        {/* Navigation Items (Stacked Vertical Column) */}
        <div className="flex-1 w-full flex flex-col items-center gap-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar py-0.5">
          {/* 1. Favourites (Star with golden fill) */}
          <FavoritesMenu collapsed={isCollapsed} />

          {/* 2. Dashboard */}
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="w-full flex justify-center"
            aria-label="Dashboard"
          >
            {({ isActive }) => (
              <SidebarItem
                label="Dashboard"
                icon={LayoutDashboard}
                active={isActive}
              />
            )}
          </Link>

          {/* 3. Tracking (Active highlighted in reference with vivid electric blue pill) */}
          <Link
            to="/tracking"
            activeOptions={{ exact: false }}
            className="w-full flex justify-center"
            aria-label="Tracking"
          >
            {({ isActive }) => (
              <SidebarItem
                label="Tracking"
                icon={MapPin}
                active={isActive}
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
              <div key={id} className="w-full flex justify-center">
                <SidebarItem
                  label={item.label}
                  icon={item.icon}
                  onClick={() => runItem(item)}
                />
              </div>
            );
          })}

          {/* 7. More Actions Popover */}
          <div className="w-full flex justify-center">
            <Popover open={moreOpen} onOpenChange={setMoreOpen}>
              <PopoverTrigger asChild>
                <div className="w-full flex justify-center">
                  <SidebarItem
                    label="More"
                    icon={Grid2x2}
                    active={moreOpen}
                    onClick={() => setMoreOpen(!moreOpen)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                side="right"
                align="end"
                sideOffset={14}
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
                className="flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer h-7 w-full py-1"
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
 * Reusable Sidebar Item strictly matching reference images (media_1791780432803.png & media_1791780446490.png):
 * - Rounded pill container
 * - Icon on top, Label text below
 * - Active state: Vibrant electric blue (#0089FF) pill background with glow shadow, pure white icon and bold text
 * - Inactive state: Subtle slate icon and text, hover state with soft translucent white background
 */
export function SidebarItem({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer select-none",
        active
          ? "bg-[#0089FF] text-white shadow-lg shadow-[#0089FF]/35"
          : "text-slate-400 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 transition-transform duration-200 shrink-0",
          active ? "text-white scale-105" : "text-slate-400 group-hover:text-white group-hover:scale-105"
        )}
      />
      <span
        className={cn(
          "text-[10px] leading-tight tracking-tight mt-1 transition-colors text-center truncate max-w-full px-0.5",
          active ? "font-semibold text-white" : "font-medium text-slate-400 group-hover:text-white"
        )}
      >
        {label}
      </span>
    </button>
  );
}
