import { useNavigate, useLocation, useSearch } from "@tanstack/react-router";
import {
  Settings,
  ChevronRight,
  Search,
  Check,
  ArrowRight,
  X,
  Sliders,
  SlidersHorizontal,
  Layers,
  Sparkles,
  MapPin,
  Briefcase,
  CircleGauge,
  Truck,
  ShieldAlert,
  Wrench,
  CreditCard,
  Package,
  UploadCloud,
  ShieldCheck,
  Server,
  Fuel,
  Code2,
  Headphones,
  type ComponentType,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  SETTING_CATEGORIES,
  ALL_SETTINGS,
  SETTING_CATEGORY_GROUPS,
  type SettingCategoryNode,
  type SettingTreeItem,
} from "@/data/settings";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  general: Sliders,
  master: Layers,
  address_geofence: MapPin,
  job: Briefcase,
  tire: CircleGauge,
  trailer: Truck,
  block: ShieldAlert,
  technician: Wrench,
  billing: CreditCard,
  parts_master: Package,
  bulk_action: UploadCloud,
  compliance: ShieldCheck,
  customized: SlidersHorizontal,
  system: Server,
  fuel: Fuel,
  developers: Code2,
  cs: Headphones,
};

export function SettingsMenu({ collapsed }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const search = useSearch({ strict: false }) as {
    category?: string;
    tab?: string;
  };

  const isSettingsRoute = location.pathname.startsWith("/setting");
  const currentTab = search?.tab || "vehicle";
  const currentCategory = search?.category || "general";

  // Automatically switch active category to current category when opened
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      if (currentCategory && SETTING_CATEGORIES.some((c) => c.category === currentCategory)) {
        setActiveCategory(currentCategory);
      }
    }
  }, [open, currentCategory]);

  // Click outside and ESC listeners
  useEffect(() => {
    if (!open) return;
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectedCategoryNode: SettingCategoryNode = useMemo(() => {
    return (
      SETTING_CATEGORIES.find((c) => c.category === activeCategory) ??
      SETTING_CATEGORIES[0]!
    );
  }, [activeCategory]);

  // Global search across all setting items & descriptions
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_SETTINGS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const handleSelectSetting = (item: SettingTreeItem) => {
    setOpen(false);
    navigate({
      to: "/setting",
      search: {
        category: item.category,
        tab: item.id,
      } as Record<string, unknown>,
    });
  };

  return (
    <div className="w-full relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Setting"
        onClick={() => setOpen((prev) => !prev)}
        className="group flex w-full flex-col items-center gap-1 py-1 cursor-pointer select-none"
      >
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
            open || isSettingsRoute
              ? "bg-[#0089FF] text-white shadow-md shadow-blue-500/25"
              : "text-slate-400 group-hover:bg-white/10 group-hover:text-white",
          )}
        >
          <Settings className="h-5 w-5" />
        </div>
        <span
          className={cn(
            "text-[10px] leading-tight tracking-tight transition-colors",
            open || isSettingsRoute
              ? "font-semibold text-white"
              : "font-medium text-slate-400 group-hover:text-white",
          )}
        >
          Setting
        </span>
      </button>

      {open && (
        <>
          {/* Backdrop for outside click dismiss with blur effect */}
          <div
            className={cn("fixed inset-0 top-[45px] z-40 bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-200", collapsed ? "left-[60px]" : "left-[200px]")}
            onClick={() => setOpen(false)}
          />

          {/* Bottom-Anchored Flyout Panel with 10px bottom & left margin */}
          <div
            ref={menuRef}
            className={cn("fixed bottom-[10px] z-50 flex flex-col w-auto min-w-[460px] max-w-[500px] max-h-[calc(100vh-65px)] overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0B1736]/98 p-0 text-slate-100 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-left-2 duration-150", collapsed ? "left-[70px]" : "left-[210px]")}
          >
            {/* Top Search & Filter Header */}
            <div className="border-b border-slate-800/80 bg-slate-900/60 px-3 py-2.5">
              <div className="relative flex items-center rounded-lg border border-slate-700/60 bg-slate-950/60 px-2.5 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all">
                <Search className="h-3.5 w-3.5 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 60+ settings, master rules, configs..."
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
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800/60 border border-slate-700/50 px-1.5 py-0.5 rounded">
                    70+ Settings
                  </span>
                )}
              </div>
            </div>

            {/* Content Body: Instant Search Mode OR 2-Column Cascading Mode */}
            {searchQuery.trim() ? (
              /* Instant Search Results View */
              <div className="max-h-[68vh] min-h-[220px] overflow-y-auto overscroll-contain p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
                {searchResults.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    <Search className="mx-auto h-6 w-6 opacity-30 mb-2" />
                    No settings found matching &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  searchResults.map((item) => {
                    const isSelected =
                      item.id === currentTab && isSettingsRoute;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSetting(item)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-all group cursor-pointer",
                          isSelected
                            ? "bg-blue-600 text-white font-semibold shadow-md"
                            : "text-slate-200 hover:bg-slate-800/80 hover:text-white",
                        )}
                      >
                        <span className="font-medium truncate">{item.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={cn(
                              "text-[10px] font-medium px-2 py-0.5 rounded-full",
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-slate-800 text-slate-300 border border-slate-700/60",
                            )}
                          >
                            {item.categoryLabel}
                          </span>
                          {isSelected ? (
                            <Check className="h-3.5 w-3.5 text-white ml-1" />
                          ) : (
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 ml-1" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* 2-Column Categorized Cascading View */
              <div className="flex divide-x divide-slate-800/80 text-xs">
                {/* Left Column: Categories List with Groups */}
                <div className="flex w-[215px] flex-col py-2 max-h-[72vh] overflow-y-auto overscroll-contain space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                  {SETTING_CATEGORY_GROUPS.map((group) => (
                    <div key={group.groupLabel} className="space-y-0.5 px-1.5">
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {group.groupLabel}
                      </div>
                      {group.categoryKeys.map((catKey) => {
                        const cat = SETTING_CATEGORIES.find(
                          (c) => c.category === catKey,
                        );
                        if (!cat) return null;
                        const Icon = CATEGORY_ICONS[cat.category] || Sliders;
                        const isActive =
                          cat.category === selectedCategoryNode.category;

                        return (
                          <button
                            key={cat.category}
                            type="button"
                            onMouseEnter={() => setActiveCategory(cat.category)}
                            onClick={() => setActiveCategory(cat.category)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-all duration-100 cursor-pointer group",
                              isActive
                                ? "bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30 shadow-xs"
                                : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent",
                            )}
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <Icon
                                className={cn(
                                  "h-3.5 w-3.5 shrink-0 transition-colors",
                                  isActive
                                    ? "text-blue-400"
                                    : "text-slate-400 group-hover:text-slate-200",
                                )}
                              />
                              <span className="truncate">{cat.label}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={cn(
                                  "text-[10px] font-mono px-1.5 py-0.2 rounded transition-colors",
                                  isActive
                                    ? "bg-blue-500/30 text-blue-200"
                                    : "bg-slate-800/80 text-slate-400 group-hover:text-slate-300",
                                )}
                              >
                                {cat.items.length}
                              </span>
                              <ChevronRight
                                className={cn(
                                  "h-3 w-3 shrink-0 transition-transform",
                                  isActive
                                    ? "text-blue-400 translate-x-0.5"
                                    : "text-slate-600 opacity-40",
                                )}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Right Column: Sub-items List with Header & Precision Highlighting */}
                <div className="flex w-[245px] flex-col py-2 bg-slate-950/40 max-h-[72vh] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-800">
                  {/* Category Subtitle Header */}
                  <div className="px-3 pb-2 mb-1 border-b border-slate-800/60 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      {selectedCategoryNode.label} Configuration
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {selectedCategoryNode.items.length} items
                    </span>
                  </div>

                  {/* Sub-item List */}
                  <div className="space-y-0.5 px-1.5">
                    {selectedCategoryNode.items.map((item: SettingTreeItem) => {
                      const isSelected =
                        item.id === currentTab && isSettingsRoute;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectSetting(item)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-all duration-100 group cursor-pointer",
                            isSelected
                              ? "bg-blue-600 text-white font-semibold shadow-md"
                              : "text-slate-300 hover:bg-slate-800/70 hover:text-white",
                          )}
                        >
                          <span className="font-medium truncate">{item.name}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            {isSelected ? (
                              <Check className="h-3.5 w-3.5 text-white ml-1" />
                            ) : (
                              <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 ml-1" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Quick Status Bar */}
            <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/80 px-3 py-1.5 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-blue-400" />
                <span>17 Categories · 70+ Settings</span>
              </div>
              <span className="text-slate-400 font-mono">Click to open</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
