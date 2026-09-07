import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/dashboard/store";
import { WIDGET_CATALOG, type WidgetId } from "@/dashboard/widgets";
import { cn } from "@/lib/utils";

export type DashboardConfigTarget =
  { mode: "create" } | { mode: "edit"; tabId?: string };

export function DashboardConfigDrawer({
  target,
  onClose,
}: {
  target: DashboardConfigTarget | null;
  onClose: () => void;
}) {
  const { tabs, activeTab, addTab, renameTab, setTabWidgets, setActiveTab } =
    useDashboard();

  const isCreateMode = target?.mode === "create";
  const editingTab =
    target && target.mode === "edit"
      ? (tabs.find((t) => t.id === target.tabId) ?? activeTab)
      : null;

  const [tabName, setTabName] = useState("");
  const [selectedWidgets, setSelectedWidgets] = useState<WidgetId[]>([]);
  const [query, setQuery] = useState("");

  // Sync state whenever target changes or opens
  useEffect(() => {
    if (!target) return;
    setQuery("");

    if (target.mode === "create") {
      // Way 1: Create New Tab — Ask user to enter name, NO pre-selected widgets
      setTabName("");
      setSelectedWidgets([]);
    } else {
      // Way 2: Pre-built / Existing Tab — Show only current name and previous selections made
      const current = tabs.find((t) => t.id === target.tabId) ?? activeTab;
      setTabName(current?.name ?? "Overview");
      setSelectedWidgets(current?.widgets ?? []);
    }
  }, [target, tabs, activeTab]);

  // Video Telematics Widgets
  const videoTelematicsWidgets = useMemo(
    () =>
      WIDGET_CATALOG.filter(
        (w) =>
          w.category === "VIDEO TELEMATICS" &&
          (query === "" ||
            w.title.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [query],
  );

  // Activity Widgets
  const activityWidgets = useMemo(
    () =>
      WIDGET_CATALOG.filter(
        (w) =>
          w.category === "ACTIVITY" &&
          (query === "" ||
            w.title.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [query],
  );

  const toggleWidget = (id: WidgetId) => {
    setSelectedWidgets((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id],
    );
  };

  const handleApply = () => {
    const cleanName = tabName.trim();
    if (!cleanName) {
      toast.error("Please enter a tab name");
      return;
    }

    if (isCreateMode) {
      const newId = addTab(cleanName);
      setTabWidgets(newId, selectedWidgets);
      setActiveTab(newId);
      toast.success('"' + cleanName + '" tab created and loaded', {
        description: selectedWidgets.length + " active widgets configured",
      });
    } else if (editingTab) {
      renameTab(editingTab.id, cleanName);
      setTabWidgets(editingTab.id, selectedWidgets);
      toast.success('"' + cleanName + '" updated and loaded', {
        description: selectedWidgets.length + " active widgets configured",
      });
    }

    onClose();
  };

  const open = !!target;

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close configuration"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20"
        />
      ) : null}
      <aside
        aria-hidden={!open}
        aria-label="Dashboard configuration"
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen w-full max-w-[430px] flex-col border-l border-border bg-surface shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* Unified Top Header Banner (45px height) */}
        <header className="flex h-[45px] items-center justify-between bg-nav px-4 text-nav-foreground select-none shrink-0 border-b border-white/10">
          <h2 className="text-sm font-semibold">Dashboard configuration</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close configuration"
            className="rounded-md p-1 text-nav-foreground/80 transition-colors duration-150 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Body Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-3">
          {/* TAB NAME */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-muted-foreground">
              Tab Name
            </label>
            <input
              autoFocus={isCreateMode}
              value={tabName}
              onChange={(e) => setTabName(e.target.value)}
              placeholder="Enter tab name..."
              className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
            />
          </div>

          {/* LAYOUT CONFIGURATION Header & Active Badge & Search Input */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Layout Configuration
              </span>
              <span className="rounded-full bg-brand/10 text-brand px-2 py-0.5 font-bold text-[10px]">
                {selectedWidgets.length + " Active"}
              </span>
            </div>

            <div className="relative">
              <div className="flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-2 focus-within:ring-1 focus-within:ring-brand">
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Widgets..."
                  className="h-7 flex-1 bg-transparent text-xs focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-0.5 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 1. VIDEO TELEMATICS Category Checklist */}
          <div className="space-y-1.5 pt-1">
            <span className="block text-xs font-semibold text-muted-foreground">
              Video Telematics
            </span>
            <div className="space-y-0.5 rounded-md border border-border bg-card p-1">
              {videoTelematicsWidgets.map((w) => {
                const isChecked = selectedWidgets.includes(w.id);
                return (
                  <label
                    key={w.id}
                    className="flex items-center gap-2 py-1 px-2 rounded-md text-xs text-foreground hover:bg-muted cursor-pointer select-none transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleWidget(w.id)}
                      className="rounded border-input text-brand focus:ring-brand"
                    />
                    <span
                      className={cn(
                        "truncate flex-1",
                        isChecked
                          ? "font-medium text-foreground"
                          : "text-foreground/85",
                      )}
                    >
                      {w.title}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. ACTIVITY Category Checklist */}
          <div className="space-y-1.5 pt-1">
            <span className="block text-xs font-semibold text-muted-foreground">
              Activity
            </span>
            <div className="space-y-0.5 rounded-md border border-border bg-card p-1">
              {activityWidgets.map((w) => {
                const isChecked = selectedWidgets.includes(w.id);
                return (
                  <label
                    key={w.id}
                    className="flex items-center gap-2 py-1 px-2 rounded-md text-xs text-foreground hover:bg-muted cursor-pointer select-none transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleWidget(w.id)}
                      className="rounded border-input text-brand focus:ring-brand"
                    />
                    <span
                      className={cn(
                        "truncate flex-1",
                        isChecked
                          ? "font-medium text-foreground"
                          : "text-foreground/85",
                      )}
                    >
                      {w.title}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-end gap-2 border-t border-border bg-surface-muted/30 px-3 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted cursor-pointer shadow-2xs"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="rounded-md bg-brand px-4 py-1.5 text-xs font-semibold text-brand-foreground shadow-sm transition-colors duration-150 hover:bg-[#124ecf] cursor-pointer"
          >
            Apply & load
          </button>
        </footer>
      </aside>
    </>
  );
}
