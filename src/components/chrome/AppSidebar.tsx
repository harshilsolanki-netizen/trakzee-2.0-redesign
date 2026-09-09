import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
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
  Sparkles,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { toast } from "sonner";
import { ChartsMenu } from "@/components/chrome/ChartsMenu";
import { FavoritesMenu } from "@/components/chrome/FavoritesMenu";
import { ReportsMenu } from "@/components/chrome/ReportsMenu";
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
import { cn } from "@/lib/utils";

const NAV_TOP = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/tracking", label: "Tracking", icon: MapPin, exact: false },
] as const;

const NAV_BOTTOM = [
  { to: "/setting", label: "Setting", icon: Settings, exact: false },
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

function SideItem({
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
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className="group flex w-full flex-col items-center gap-1 py-1 cursor-pointer select-none"
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md transition-all duration-200",
              active
                ? "bg-[#0089FF] text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 group-hover:bg-white/10 group-hover:text-white",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span
            className={cn(
              "text-[10px] leading-tight tracking-tight transition-colors",
              active
                ? "font-semibold text-white"
                : "font-medium text-slate-400 group-hover:text-white",
            )}
          >
            {label}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={8}
        className="font-semibold text-xs"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar() {
  const { pinnedMoreItems, toggleMorePin } = useDashboard();
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
      <aside className="flex w-[68px] shrink-0 flex-col items-center gap-1 bg-sidebar px-2 pt-2.5 pb-2 select-none z-30">
        {/* Brand Logo with circular white badge matching reference image */}
        <Link
          to="/"
          aria-label="Home"
          className="mb-1 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white shadow-md shadow-black/20 hover:scale-105 transition-all duration-200"
        >
          <span className="text-[11px] font-black italic tracking-tighter text-slate-900 lowercase font-serif">
            uffizio
          </span>
        </Link>

        {/* Favorite Tab ABOVE all available options */}
        <FavoritesMenu />

        {/* Primary Nav Links: Dashboard, Tracking */}
        {NAV_TOP.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            className="w-full"
            aria-label={item.label}
          >
            {({ isActive }) => (
              <SideItem label={item.label} icon={item.icon} active={isActive} />
            )}
          </Link>
        ))}

        {/* Reports cascading menu */}
        <ReportsMenu />

        {/* Charts cascading menu */}
        <ChartsMenu />

        {/* Bottom Nav Links: Setting */}
        {NAV_BOTTOM.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            className="w-full"
            aria-label={item.label}
          >
            {({ isActive }) => (
              <SideItem label={item.label} icon={item.icon} active={isActive} />
            )}
          </Link>
        ))}

        {/* Pinned Extra Items */}
        {pinnedMoreItems.map((id) => {
          const item = MORE_ITEMS.find((m) => m.id === id);
          if (!item) return null;
          return (
            <SideItem
              key={id}
              label={item.label}
              icon={item.icon}
              onClick={() => runItem(item)}
            />
          );
        })}

        {/* More Actions Popover */}
        <div className="w-full">
          <Popover open={moreOpen} onOpenChange={setMoreOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="More options"
                className="group flex w-full flex-col items-center gap-1 py-1 cursor-pointer select-none"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                    moreOpen
                      ? "bg-[#0089FF] text-white shadow-md shadow-blue-500/25"
                      : "text-slate-400 group-hover:bg-white/10 group-hover:text-white",
                  )}
                >
                  <Grid2x2 className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "text-[10px] leading-tight tracking-tight transition-colors",
                    moreOpen
                      ? "font-semibold text-white"
                      : "font-medium text-slate-400 group-hover:text-white",
                  )}
                >
                  More
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="end"
              className="w-64 p-3 bg-popover/95 backdrop-blur-xl border border-border shadow-2xl rounded-xl"
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
                          : "border-border/60 hover:bg-muted/60 text-muted-foreground hover:text-foreground",
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
                      wasPinned ? "Removed from menu" : "Pinned to menu",
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
      </aside>
    </TooltipProvider>
  );
}
