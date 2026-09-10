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
          className="fixed top-[45px] bottom-0 left-0 sm:left-[68px] right-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
        />
      ) : null}
      <aside
        aria-hidden={!open}
        aria-label="Dashboard configuration"
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[420px] xl:max-w-[430px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* 1. Header matching Side Panel Design System */}
        <header className="flex h-[56px] items-center justify-between border-b border-border px-5 bg-background select-none shrink-0">
          <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
            {isCreateMode ? "Create Dashboard Tab" : "Dashboard Configuration"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close configuration"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* 2. Body Content */}
        <div className="min-h-0 flex-1 flex flex-col p-5 space-y-4 overflow-y-auto">
          {/* TAB NAME */}
          <div className="space-y-1.5 shrink-0">
            <label className="block text-xs font-semibold text-foreground">
              Tab Name
            </label>
            <input
              autoFocus={isCreateMode}
              value={tabName}
              onChange={(e) => setTabName(e.target.value)}
              placeholder="Enter tab name..."
              className="h-8 w-full rounded-md border border-input/80 bg-background px-3 text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] focus:outline-none focus:text-foreground transition-all"
            />
          </div>

          {/* LAYOUT CONFIGURATION Header & Active Badge & Search Input */}
          <div className="space-y-3 pt-3 border-t border-border/60 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <label className="block text-xs font-semibold text-foreground">
                Layout Configuration
              </label>
              <span className="rounded-full bg-[#0089FF]/10 text-[#0089FF] px-2.5 py-0.5 font-semibold text-[10px]">
                {selectedWidgets.length} Active
              </span>
            </div>

            {/* Search Widgets */}
            <div className="relative shrink-0">
              <div className="flex h-8 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Widgets..."
                  className="h-full flex-1 bg-transparent text-xs font-medium text-muted-foreground placeholder:font-normal placeholder:italic placeholder:text-muted-foreground/60 focus:outline-none focus:text-foreground"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-0.5 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* 1. VIDEO TELEMATICS Category Checklist */}
            <div className="space-y-1.5 shrink-0">
              <span className="block text-xs font-semibold text-foreground">
                Video Telematics
              </span>
              <div className="space-y-0.5 rounded-lg border border-border/80 bg-card p-1.5 shadow-2xs">
                {videoTelematicsWidgets.map((w) => {
                  const isChecked = selectedWidgets.includes(w.id);
                  return (
                    <label
                      key={w.id}
                      className={cn(
                        "flex items-center gap-2.5 py-1.5 px-2.5 rounded-md text-xs cursor-pointer select-none transition-colors",
                        isChecked
                          ? "bg-[#0089FF]/10 text-foreground font-semibold"
                          : "text-foreground font-medium hover:bg-muted/60",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleWidget(w.id)}
                        className="rounded border-input text-brand cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                      />
                      <span className="truncate flex-1">
                        {w.title}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. ACTIVITY Category Checklist */}
            <div className="space-y-1.5 shrink-0">
              <span className="block text-xs font-semibold text-foreground">
                Activity
              </span>
              <div className="space-y-0.5 rounded-lg border border-border/80 bg-card p-1.5 shadow-2xs">
                {activityWidgets.map((w) => {
                  const isChecked = selectedWidgets.includes(w.id);
                  return (
                    <label
                      key={w.id}
                      className={cn(
                        "flex items-center gap-2.5 py-1.5 px-2.5 rounded-md text-xs cursor-pointer select-none transition-colors",
                        isChecked
                          ? "bg-[#0089FF]/10 text-foreground font-semibold"
                          : "text-foreground font-medium hover:bg-muted/60",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleWidget(w.id)}
                        className="rounded border-input text-brand cursor-pointer h-3.5 w-3.5 accent-[#0089FF]"
                      />
                      <span className="truncate flex-1">
                        {w.title}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Standardized Drawer Footer matching Side Panel Design System (56px) */}
        <footer className="flex h-[56px] items-center justify-between border-t border-border bg-background px-5 shrink-0 select-none">
          <button
            type="button"
            onClick={() => {
              if (isCreateMode) {
                setTabName("");
                setSelectedWidgets([]);
              } else if (editingTab) {
                setTabName(editingTab.name);
                setSelectedWidgets(editingTab.widgets);
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-input/80 bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 rounded-md border border-input/80 bg-background px-3 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="h-8 rounded-md bg-[#155dfc] px-4 text-xs font-medium text-white shadow-xs transition-colors hover:bg-[#124ecf] cursor-pointer active:scale-98"
            >
              Apply & Load
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}
