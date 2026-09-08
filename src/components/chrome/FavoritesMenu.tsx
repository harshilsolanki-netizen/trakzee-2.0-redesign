import { useNavigate, useLocation } from "@tanstack/react-router";
import {
  Bookmark,
  ChevronRight,
  Folder,
  FolderOpen,
  Search,
  Star,
  Trash2,
  X,
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
  const { favorites = [], toggleFavorite } = useDashboard();
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const safeFavorites = Array.isArray(favorites) ? favorites : [];

  const allFavoriteItems = useMemo(() => {
    return safeFavorites.map(findReport).filter(Boolean) as ReportItem[];
  }, [safeFavorites]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allFavoriteItems;
    return allFavoriteItems.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q),
    );
  }, [allFavoriteItems, query]);

  // Group by category
  const categorized = useMemo(() => {
    const map = new Map<string, ReportItem[]>();
    for (const item of filteredItems) {
      const cat = item.category || "General";
      map.set(cat, [...(map.get(cat) ?? []), item]);
    }
    return [...map.entries()];
  }, [filteredItems]);

  const handleSelectFavorite = (item: ReportItem) => {
    setOpen(false);
    if (item.to.startsWith("/charts")) {
      navigate({
        to: "/charts",
        search: { chart: item.id } as Record<string, unknown>,
      });
    } else {
      navigate({
        to: "/report",
        search: { type: item.id } as Record<string, unknown>,
      });
    }
  };

  const hasFavorites = safeFavorites.length > 0 || allFavoriteItems.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Favourites"
          className="group flex w-full flex-col items-center gap-1 py-1 cursor-pointer select-none relative"
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 relative",
              open
                ? "bg-[#0089FF] text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40"
                : hasFavorites
                  ? "text-amber-400 hover:bg-white/10 hover:text-amber-300"
                  : "text-slate-400 group-hover:bg-white/10 group-hover:text-white",
            )}
          >
            <Star
              className={cn(
                "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                hasFavorites ? "fill-amber-400 text-amber-400" : "text-slate-400",
              )}
            />
          </div>
          <span
            className={cn(
              "text-[10px] leading-tight tracking-tight transition-colors",
              open
                ? "font-bold text-white"
                : hasFavorites
                  ? "font-bold text-amber-400 group-hover:text-amber-300"
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
        className="w-[300px] sm:w-[320px] overflow-hidden rounded-xl border border-slate-700/70 bg-[#0c1424]/98 p-0 text-slate-100 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Bar */}
        <div className="border-b border-slate-800/80 bg-slate-950/60 p-2">
          <div className="relative flex items-center rounded-lg border border-slate-700/60 bg-slate-900/80 px-2.5 py-1.5 focus-within:border-blue-500 transition-all">
            <Search className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search favourites..."
              className="h-full flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-slate-400 hover:text-slate-200 cursor-pointer p-0.5 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Content list */}
        {!hasFavorites ? (
          <div className="flex flex-col items-center justify-center p-6 text-center bg-[#0c1424]">
            <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-100">
              No Favourites Added
            </p>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed max-w-[220px]">
              Click the star icon in any report header to add it here.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No favourites matching &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="max-h-[360px] overflow-y-auto overscroll-contain p-2 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800">
            {categorized.map(([category, items]) => (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{category}</span>
                </div>
                <div className="space-y-0.5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-all bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800/40 hover:border-slate-700/60"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectFavorite(item)}
                        className="flex flex-1 items-center gap-2.5 min-w-0 text-left cursor-pointer"
                      >
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                          {item.name}
                        </span>
                      </button>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          title={`Remove ${item.name} from favourites`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                            toast.success(`${item.name} removed from favourites`);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectFavorite(item)}
                          className="p-1 text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Open report"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
      title={active ? "Remove from favourites" : "Add to favourites"}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(reportId);
        toast.success(
          active
            ? `${item?.name ?? "Report"} removed from favourites`
            : `★ ${item?.name ?? "Report"} added to Favourites`,
          {
            description: active
              ? undefined
              : `Access directly anytime from the sidebar Favourites menu.`,
          },
        );
      }}
      className={cn(
        "rounded-md p-1.5 transition-all duration-150 hover:bg-amber-500/10 hover:scale-110 active:scale-95 cursor-pointer",
        className,
      )}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-all duration-150",
          active
            ? "fill-amber-400 text-amber-400 drop-shadow-xs"
            : "text-muted-foreground hover:text-amber-400",
        )}
      />
    </button>
  );
}
