import { useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  ChevronRight,
  Folder,
  FolderOpen,
  Star,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboard } from "@/dashboard/store";
import { findReport, type ReportItem } from "@/data/reports";
import { cn } from "@/lib/utils";

export function FavoritesMenu() {
  const { favorites, toggleFavorite } = useDashboard();
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = (
      favorites.map(findReport).filter(Boolean) as ReportItem[]
    ).filter(
      (i) =>
        q === "" ||
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q),
    );
    const map = new Map<string, ReportItem[]>();
    for (const item of items) {
      map.set(item.category, [...(map.get(item.category) ?? []), item]);
    }
    return [...map.entries()];
  }, [favorites, query]);

  const activeCategory = openCategory ?? grouped[0]?.[0] ?? null;
  const activeItems = grouped.find(([c]) => c === activeCategory)?.[1] ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Favourites"
          className="group flex w-full flex-col items-center gap-1 py-1 cursor-pointer select-none"
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
              open
                ? "bg-[#0089FF] text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 group-hover:bg-white/10 group-hover:text-white",
            )}
          >
            <Star className="h-5 w-5" />
          </div>
          <span
            className={cn(
              "text-[10px] leading-tight tracking-tight transition-colors",
              open
                ? "font-semibold text-white"
                : "font-medium text-slate-400 group-hover:text-white",
            )}
          >
            Favourites
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-auto overflow-hidden rounded-lg border border-sidebar-border bg-sidebar p-0 text-sidebar-foreground shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
      >
        {/* Header matching dark sidebar design */}
        <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-3.5 py-2.5">
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-sidebar-foreground">
              Favourites
            </span>
          </div>
          {favorites.length > 0 && (
            <span className="rounded bg-sidebar-accent px-2 py-0.5 text-[10px] font-semibold text-sidebar-foreground/80">
              {favorites.length} saved
            </span>
          )}
        </div>

        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center w-64 bg-sidebar">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-amber-400">
              <Bookmark className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-sidebar-foreground">
              No Favourites Yet
            </p>
            <p className="mt-1 text-[11px] text-nav-muted leading-snug">
              Click the star icon on any report to add it here for quick 1-click
              access.
            </p>
          </div>
        ) : (
          /* Clean 2-column menu layout matching ChartsMenu */
          <div className="flex divide-x divide-sidebar-border text-xs">
            {/* Left Column: Categories List */}
            <div className="flex w-[155px] flex-col py-1.5 bg-sidebar max-h-72 overflow-y-auto">
              {grouped.map(([category, items]) => {
                const isActive = category === activeCategory;
                return (
                  <button
                    key={category}
                    type="button"
                    onMouseEnter={() => setOpenCategory(category)}
                    onClick={() => setOpenCategory(category)}
                    className={cn(
                      "flex w-full items-center justify-between px-3.5 py-2 text-left transition-colors duration-75 cursor-pointer",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {isActive ? (
                        <FolderOpen className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <Folder className="h-3.5 w-3.5 text-nav-muted shrink-0" />
                      )}
                      <span className="truncate">{category}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-nav-muted">
                        {items.length}
                      </span>
                      <ChevronRight className="h-3 w-3 text-nav-muted opacity-60" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Favorited Items List */}
            <div className="flex w-[210px] flex-col py-1.5 bg-sidebar-accent max-h-72 overflow-y-auto">
              {activeItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between px-3 py-2 transition-colors duration-75 hover:bg-sidebar-primary/25"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate({ to: item.to });
                    }}
                    className="flex flex-1 min-w-0 items-center gap-2 text-left text-xs text-sidebar-foreground/90 hover:text-white cursor-pointer"
                  >
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </button>
                  <button
                    type="button"
                    title={`Remove ${item.name} from favourites`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                      toast.success(`${item.name} removed from favourites`);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-nav-muted hover:text-rose-400 transition-opacity cursor-pointer rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/** Star toggle used in report/page headers to bookmark a screen. */
export function FavoriteToggle({
  reportId,
  className,
}: {
  reportId: string;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useDashboard();
  const item = findReport(reportId);
  const active = isFavorite(reportId);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from favourites" : "Add to favourites"}
      onClick={() => {
        toggleFavorite(reportId);
        toast.success(
          active
            ? `${item?.name ?? "Report"} removed from favourites`
            : `${item?.name ?? "Report"} added to Favourites → ${item?.category ?? "General"}`,
        );
      }}
      className={cn(
        "rounded p-1.5 transition-colors duration-150 hover:bg-muted/50 cursor-pointer",
        className,
      )}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          active
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground hover:text-amber-400",
        )}
      />
    </button>
  );
}
