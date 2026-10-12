import {
  Eye,
  EyeOff,
  FolderPlus,
  GripVertical,
  MoreVertical,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Settings,
  SlidersHorizontal,
  SquarePen,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboard } from "@/dashboard/store";
import { cn } from "@/lib/utils";
import { DashboardFilterDrawer } from "./DashboardFilterDrawer";
import {
  DashboardConfigDrawer,
  type DashboardConfigTarget,
} from "./DashboardConfigDrawer";


export function TabStrip() {
  const {
    visibleTabs,
    hiddenTabs,
    activeTab,
    setActiveTab,
    renameTab,
    togglePin,
    hideTab,
    showTab,
    deleteTab,
    restoreTab,
    indexOfTab,
    reorderTabs,
    canHide,
    canDelete,
  } = useDashboard();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // + New Dropdown Popover State & Staged Hidden Tabs
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [stagedHiddenIds, setStagedHiddenIds] = useState<string[]>([]);

  // Filter Drawer State
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Configuration Drawer State (Supports "create" and "edit" modes)
  const [configTarget, setConfigTarget] =
    useState<DashboardConfigTarget | null>(null);

  useEffect(() => {
    if (renamingId) inputRef.current?.focus();
  }, [renamingId]);

  useEffect(() => {
    if (newMenuOpen) {
      setStagedHiddenIds(hiddenTabs.map((t) => t.id));
    }
  }, [newMenuOpen, hiddenTabs]);

  const startRename = (id: string, current: string) => {
    setRenamingId(id);
    setDraft(current);
  };

  const commitRename = () => {
    if (renamingId) renameTab(renamingId, draft);
    setRenamingId(null);
  };

  const doHide = (id: string, name: string) => {
    if (!hideTab(id)) {
      toast.error("At least one dashboard tab must stay visible");
      return;
    }
    toast('"' + name + '" hidden', {
      action: { label: "Undo", onClick: () => showTab(id) },
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const index = indexOfTab(pendingDelete);
    const removed = deleteTab(pendingDelete);
    setPendingDelete(null);
    if (!removed) {
      toast.error("The last dashboard tab can't be deleted");
      return;
    }
    toast('"' + removed.name + '" deleted', {
      action: { label: "Undo", onClick: () => restoreTab(removed, index) },
    });
  };

  const toggleStageHidden = (id: string) => {
    setStagedHiddenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSaveHidden = () => {
    const toUnhide = hiddenTabs.filter((t) => !stagedHiddenIds.includes(t.id));
    toUnhide.forEach((t) => showTab(t.id));

    if (toUnhide.length > 0) {
      setActiveTab(toUnhide[0]!.id);
      toast.success(
        toUnhide.map((t) => '"' + t.name + '"').join(", ") + " is now visible",
      );
    }

    setNewMenuOpen(false);
  };

  const handleCancelHidden = () => {
    setNewMenuOpen(false);
  };

  return (
    <div className="relative flex items-end justify-between h-[45px] pt-[10px] px-0 text-xs select-none shrink-0 bg-[#F1F5F9] dark:bg-slate-950 rounded-tl-lg">
      {/* Baseline border that runs across the entire strip under inactive tabs */}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-[#DFE3EB] dark:bg-slate-800 z-0" />

      {/* 1. Left Tab Bar */}
      <div className="relative z-10 flex min-w-0 flex-1 items-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-full pl-[10px]">
        {visibleTabs.map((tab, tabIndex) => {
          const isActive = tab.id === activeTab.id;
          const isFirstTab = tabIndex === 0;

          return (
            <div
              key={tab.id}
              draggable={renamingId !== tab.id}
              onDragStart={(e) => {
                setDragId(tab.id);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", tab.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragId && dragId !== tab.id) setOverId(tab.id);
              }}
              onDragLeave={() => setOverId((o) => (o === tab.id ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                const from = dragId ?? e.dataTransfer.getData("text/plain");
                if (from && from !== tab.id) reorderTabs(from, tab.id);
                setDragId(null);
                setOverId(null);
              }}
              onDragEnd={() => {
                setDragId(null);
                setOverId(null);
              }}
              className={cn(
                "group relative flex shrink-0 cursor-pointer items-center gap-2 text-xs transition-all duration-150 select-none",
                isActive
                  ? "h-[35px] px-4 rounded-t-lg bg-white dark:bg-slate-900 border-t border-l border-r border-[#DFE3EB] dark:border-slate-800 text-slate-800 dark:text-white font-semibold mb-[-1px] z-20 shadow-2xs"
                  : "h-[32px] px-3 rounded-t-md bg-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 font-medium mb-0 z-10",
                dragId === tab.id ? "opacity-40" : "",
                overId === tab.id ? "ring-2 ring-primary/40" : "",
              )}
            >
              {/* Left Inverted Concave Fillet for Active Tab */}
              {isActive && (
                <div className="absolute -left-[8px] bottom-0 w-[8px] h-[8px] overflow-hidden pointer-events-none z-20">
                  <svg className="w-full h-full" viewBox="0 0 8 8" fill="none">
                    <path
                      d="M 0 8 L 8 8 L 8 0 C 8 4.418 4.418 8 0 8 Z"
                      className="fill-white dark:fill-slate-900"
                    />
                    <path
                      d="M 0 8 C 4.418 8 8 4.418 8 0"
                      className="stroke-[#DFE3EB] dark:stroke-slate-800"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              )}

              {/* Right Inverted Concave Fillet for Active Tab */}
              {isActive && (
                <div className="absolute -right-[8px] bottom-0 w-[8px] h-[8px] overflow-hidden pointer-events-none z-20">
                  <svg className="w-full h-full" viewBox="0 0 8 8" fill="none">
                    <path
                      d="M 8 8 L 0 8 L 0 0 C 0 4.418 3.582 8 8 8 Z"
                      className="fill-white dark:fill-slate-900"
                    />
                    <path
                      d="M 8 8 C 3.582 8 0 4.418 0 0"
                      className="stroke-[#DFE3EB] dark:stroke-slate-800"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              )}

              {renamingId === tab.id ? (
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") setRenamingId(null);
                  }}
                  className="w-36 rounded border border-input px-1.5 py-0.5 text-xs focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none bg-background font-semibold"
                  aria-label="Tab name"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  onDoubleClick={() => startRename(tab.id, tab.name)}
                  className="whitespace-nowrap transition-colors cursor-pointer text-xs font-semibold"
                >
                  {tab.name}
                </button>
              )}
              {tab.pinned ? (
                <Pin className="h-3.5 w-3.5 shrink-0 text-[#0089FF] fill-[#0089FF] dark:text-blue-400 dark:fill-blue-400" />
              ) : null}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={tab.name + " options"}
                    className={cn(
                      "rounded p-0.5 transition-opacity cursor-pointer text-slate-400 hover:text-slate-700 hover:bg-slate-200/50",
                      isActive
                        ? "opacity-60 hover:opacity-100"
                        : "opacity-0 group-hover:opacity-100",
                    )}
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={4}
                  className="w-40 rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-1 text-xs shadow-xl z-50 animate-in fade-in-0 zoom-in-95"
                >
                  <DropdownMenuItem
                    onClick={() => startRename(tab.id, tab.name)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted/80 cursor-pointer font-medium"
                  >
                    <SquarePen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setActiveTab(tab.id);
                      setConfigTarget({ mode: "edit", tabId: tab.id });
                    }}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted/80 cursor-pointer font-medium"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => togglePin(tab.id)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted/80 cursor-pointer font-medium"
                  >
                    {tab.pinned ? (
                      <>
                        <PinOff className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Unpin</span>
                      </>
                    ) : (
                      <>
                        <Pin className="h-3.5 w-3.5 text-[#0089FF]" />
                        <span>Pin</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!canHide(tab.id)}
                    onClick={() => doHide(tab.id, tab.name)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted/80 cursor-pointer font-medium"
                  >
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      {canHide(tab.id) ? "Hide" : "Hide (last visible)"}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 border-t border-border/60" />
                  <DropdownMenuItem
                    disabled={!canDelete()}
                    onClick={() => setPendingDelete(tab.id)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 cursor-pointer font-semibold"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    <span>{canDelete() ? "Delete" : "Delete (last tab)"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}

        {/* Vertical divider line before + New */}
        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 shrink-0 self-center" />

        {/* + New Button with Dropdown Overlay */}
        <Popover open={newMenuOpen} onOpenChange={setNewMenuOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex shrink-0 items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#0089FF] hover:text-[#0070d6] hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer rounded-md self-center",
                newMenuOpen && "bg-slate-200/80",
              )}
            >
              <Plus className="h-3.5 w-3.5 text-[#0089FF] stroke-[2.2]" />
              <span>New</span>
              {hiddenTabs.length > 0 && (
                <span className="rounded-full bg-[#0089FF] px-1.5 text-[9px] font-bold text-white">
                  {hiddenTabs.length}
                </span>
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            sideOffset={6}
            className="w-60 overflow-hidden rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl animate-in fade-in-0 zoom-in-95 duration-100"
          >
            {/* 1. Create New Group Action (Matching Reference Image) */}
            <button
              type="button"
              onClick={() => {
                setNewMenuOpen(false);
                setConfigTarget({ mode: "create" });
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 hover:text-primary transition-colors cursor-pointer text-left"
            >
              <FolderPlus className="h-4 w-4 text-primary shrink-0" />
              <span>Create New Group</span>
            </button>

            {/* 2. Hidden Tabs Section */}
            <div className="mt-1.5 pt-2 border-t border-border/60">
              <span className="block px-2.5 pb-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Hidden Tabs
              </span>

              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {hiddenTabs.length > 0 ? (
                  hiddenTabs.map((tab) => {
                    const isStagedToBeHidden = stagedHiddenIds.includes(tab.id);
                    return (
                      <div
                        key={tab.id}
                        onClick={() => toggleStageHidden(tab.id)}
                        className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer select-none"
                      >
                        <span
                          className={cn(
                            "truncate",
                            !isStagedToBeHidden && "font-semibold text-primary",
                          )}
                        >
                          {tab.name}
                        </span>
                        <button
                          type="button"
                          aria-label={"Toggle visibility of " + tab.name}
                          className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          {isStagedToBeHidden ? (
                            <EyeOff className="h-3.5 w-3.5 opacity-60" />
                          ) : (
                            <Eye className="h-3.5 w-3.5 text-primary" />
                          )}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="px-2.5 py-2 text-[11px] text-muted-foreground italic">
                    No hidden tabs
                  </p>
                )}
              </div>
            </div>

            {/* 3. Action Footer Buttons: [ Save ] and [ Cancel ] (Matching Reference Image) */}
            <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveHidden}
                className="flex-1 py-1.5 px-3 rounded-md bg-[#0f172a] hover:bg-[#1e293b] text-white dark:bg-[#155dfc] dark:hover:bg-[#124ecf] text-xs font-semibold shadow-xs transition-all cursor-pointer text-center"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelHidden}
                className="flex-1 py-1.5 px-3 rounded-md bg-muted/60 hover:bg-muted text-foreground text-xs font-medium border border-border/50 transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 2. Right Toolbar: Matching Report Section CTA Design System & Grid Alignment */}
      <div className="relative z-10 flex items-center gap-2 shrink-0 pb-1.5 pr-3">
        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setFilterDrawerOpen(true)}
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted hover:border-[#0089FF]/50 cursor-pointer select-none shadow-2xs active:scale-98",
            filterDrawerOpen &&
              "bg-muted border-[#0089FF]/50 ring-2 ring-[#0089FF]/20",
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Filter</span>
        </button>

        {/* Configuration Button */}
        <button
          type="button"
          onClick={() => setConfigTarget({ mode: "edit", tabId: activeTab.id })}
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted hover:border-[#0089FF]/50 cursor-pointer select-none shadow-2xs active:scale-98",
            configTarget !== null &&
              "bg-muted border-[#0089FF]/50 ring-2 ring-[#0089FF]/20",
          )}
        >
          <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Configuration</span>
        </button>
      </div>

      {/* 3. Dashboard Filter Drawer */}
      <DashboardFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      />

      {/* 4. Dashboard Configuration Drawer (Controlled by target) */}
      <DashboardConfigDrawer
        target={configTarget}
        onClose={() => setConfigTarget(null)}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <AlertDialogContent className="text-xs">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">
              Delete this dashboard tab?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Its widget layout will be removed. You can undo right after
              deleting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="text-xs cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
