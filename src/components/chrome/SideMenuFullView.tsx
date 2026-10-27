import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FullViewItem {
  id: string;
  name: string;
  category?: string;
  to?: string;
  badge?: string;
}

export interface FullViewCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  countLabel: string;
  description: string;
  items: FullViewItem[];
  primaryActionLabel?: string;
}

interface SideMenuFullViewProps {
  title: string;
  subtitle?: string;
  collapsed?: boolean;
  categories: FullViewCategory[];
  activeItemId?: string;
  onSelectItem: (item: FullViewItem) => void;
  onConfigureModule?: (category: FullViewCategory) => void;
  onClose: () => void;
  searchPlaceholder?: string;
}

export function SideMenuFullView({
  title,
  subtitle,
  collapsed = false,
  categories,
  activeItemId,
  onSelectItem,
  onConfigureModule,
  onClose,
  searchPlaceholder = "Search categories, reports, metrics...",
}: SideMenuFullViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Filter categories and sub-items based on search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;

    return categories
      .map((cat) => {
        const matchesCategory =
          cat.label.toLowerCase().includes(q) ||
          cat.description.toLowerCase().includes(q);

        const matchingItems = cat.items.filter((item) =>
          item.name.toLowerCase().includes(q)
        );

        if (matchesCategory || matchingItems.length > 0) {
          return {
            ...cat,
            // If query matches items, highlight matching items; if category matches, keep all
            items: matchingItems.length > 0 ? matchingItems : cat.items,
          };
        }
        return null;
      })
      .filter(Boolean) as FullViewCategory[];
  }, [categories, searchQuery]);

  // Total available items count
  const totalItemsCount = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.items.length, 0);
  }, [categories]);

  return (
    <>
      {/* Backdrop for outside click dismiss with blur effect covering the 10px margin area */}
      <div
        className={cn(
          "fixed inset-0 top-[45px] z-40 bg-black/50 backdrop-blur-sm transition-all animate-in fade-in duration-200",
          collapsed ? "left-[60px]" : "left-[200px]"
        )}
        onClick={onClose}
      />

      {/* Floating Full View Panel with 10px spacing from top (55px = 45px header + 10px), bottom (10px), right (10px), and left (70px/210px = sidebar + 10px) */}
      <div
        aria-label={`${title} Full View`}
        className={cn(
          "fixed top-[55px] bottom-[10px] right-[10px] z-50 flex flex-col rounded-2xl border border-slate-700/60 bg-[#070D1E]/98 p-0 text-slate-100 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 overflow-hidden select-none animate-in fade-in slide-in-from-left-2 duration-150",
          collapsed ? "left-[70px]" : "left-[210px]"
        )}
      >
      {/* 1. Standard Top Bar matching Application Chrome */}
      <header className="h-14 border-b border-slate-800/80 px-6 sm:px-8 flex items-center justify-between shrink-0 bg-[#070D1E]/95 backdrop-blur-md sticky top-0 z-20 gap-4">
        {/* Left: Module Title & Categories Count */}
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {title}
          </h1>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full shrink-0">
            {categories.length} Categories · {totalItemsCount} Reports
          </span>
        </div>

        {/* Center: Live Search Bar */}
        <div className="relative flex-1 max-w-md hidden sm:flex items-center">
          <div className="relative w-full flex items-center rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-1.5 focus-within:border-[#0089FF] focus-within:ring-2 focus-within:ring-[#0089FF]/20 transition-all">
            <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-full flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Clean Borderless Close Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            aria-label="Close Full View"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Search Bar fallback */}
      <div className="sm:hidden px-4 py-2 border-b border-slate-800/80 bg-slate-950/60">
        <div className="relative w-full flex items-center rounded-lg border border-slate-700/70 bg-slate-900 px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-full flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Scrollable Canvas with 5-Column Responsive Grid */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 lg:p-6 custom-scrollbar">
        {filteredCategories.length === 0 ? (
          <div className="py-20 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-600 mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">
              No categories or reports found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with another keyword or clear the search input.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              const isExpanded = Boolean(expandedCategories[cat.id]);
              const visibleItems = isExpanded
                ? cat.items
                : cat.items.slice(0, 4);
              const remainingCount = cat.items.length - 4;

              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-slate-800/90 bg-[#0C152B]/85 hover:border-slate-700/80 transition-all duration-200 p-4 sm:p-4.5 flex flex-col justify-between shadow-2xl backdrop-blur-md group"
                >
                  {/* Card Content */}
                  <div>
                    {/* Header: Icon Squircle + Title + Subtitle */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl border border-slate-700/60 bg-slate-800/40 flex items-center justify-center shrink-0 text-[#0089FF] group-hover:scale-105 group-hover:bg-[#0089FF]/10 transition-all duration-200 shadow-sm">
                        <Icon className="h-5 w-5 stroke-[1.8]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-sm font-bold text-white tracking-tight truncate">
                          {cat.label}
                        </h2>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                          {cat.countLabel}
                        </p>
                      </div>
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-xs text-slate-400 leading-snug mt-2.5 mb-3 line-clamp-2 min-h-[32px]">
                      {cat.description}
                    </p>

                    {/* Sub-items List with Right Chevron */}
                    <div className="space-y-0.5">
                      {visibleItems.map((item) => {
                        const isSelected = item.id === activeItemId;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelectItem(item)}
                            className={cn(
                              "flex w-full items-center justify-between py-1.5 px-2 -mx-2 rounded-lg text-xs transition-all duration-150 group/item cursor-pointer text-left",
                              isSelected
                                ? "bg-blue-600/25 text-[#0089FF] font-semibold border border-blue-500/30"
                                : "text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium"
                            )}
                          >
                            <span className="truncate pr-2">{item.name}</span>
                            <ChevronRight
                              className={cn(
                                "h-3.5 w-3.5 shrink-0 transition-transform duration-150",
                                isSelected
                                  ? "text-[#0089FF]"
                                  : "text-slate-500 group-hover/item:text-[#0089FF] group-hover/item:translate-x-0.5"
                              )}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Expand / Collapse Toggle if > 4 items */}
                    {remainingCount > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(cat.id)}
                        className="mt-2 text-xs font-semibold text-slate-400 hover:text-[#0089FF] flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                      >
                        {isExpanded ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp className="h-3.5 w-3.5" />
                          </>
                        ) : (
                          <>
                            <span>+ {remainingCount} more items...</span>
                            <ChevronDown className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
