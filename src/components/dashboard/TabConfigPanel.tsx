import { RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDashboard } from "@/dashboard/store";
import { WIDGET_CATALOG, type WidgetId } from "@/dashboard/widgets";

export type TabConfigTarget =
  { mode: "create" } | { mode: "edit"; tabId: string };

export function TabConfigPanel({
  target,
  onClose,
}: {
  target: TabConfigTarget | null;
  onClose: () => void;
}) {
  const { tabs, addTab, renameTab, setTabWidgets, setActiveTab } =
    useDashboard();
  const editing =
    target?.mode === "edit"
      ? tabs.find((t) => t.id === target.tabId)
      : undefined;

  const [name, setName] = useState("");
  const [picked, setPicked] = useState<WidgetId[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!target) return;
    setQuery("");
    if (target.mode === "edit") {
      setName(editing?.name ?? "");
      setPicked(editing?.widgets ?? []);
    } else {
      setName("");
      setPicked([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.mode, target?.mode === "edit" ? target.tabId : "create"]);

  const filtered = useMemo(
    () =>
      WIDGET_CATALOG.filter((w) =>
        w.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  const toggle = (id: WidgetId) =>
    setPicked((s) => (s.includes(id) ? s.filter((w) => w !== id) : [...s, id]));

  const apply = () => {
    const clean = name.trim();
    if (!clean) {
      toast.error("Enter a tab name");
      return;
    }
    if (target?.mode === "edit") {
      renameTab(target.tabId, clean);
      setTabWidgets(target.tabId, picked);
      toast.success(`"${clean}" updated`);
    } else {
      const id = addTab(clean);
      setTabWidgets(id, picked);
      setActiveTab(id);
      toast.success(`"${clean}" created`);
    }
    onClose();
  };

  return (
    <Sheet open={!!target} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="flex w-[340px] flex-col gap-0 p-0 sm:max-w-[340px]"
      >
        <SheetHeader className="space-y-2 border-b border-border p-4">
          <SheetTitle className="text-sm font-semibold">
            {target?.mode === "edit" ? "Edit Tab" : "New Tab"}
          </SheetTitle>
          <div className="space-y-1.5">
            <Label htmlFor="tab-name" className="text-xs font-semibold text-foreground">
              Tab Name
            </Label>
            <input
              id="tab-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tab name"
              className="h-9 w-full rounded-md border border-input bg-surface px-2.5 text-xs font-medium text-muted-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>
        </SheetHeader>

        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search widgets"
              placeholder="Search"
              className="h-9 w-full rounded-md border border-input bg-surface pr-9 pl-8 text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
            <button
              type="button"
              aria-label="Clear widget selection"
              onClick={() => setPicked([])}
              className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
            *If no space available, remove some widgets to add new ones.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">
            Select Widget
          </p>
          <p className="mb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Video Telematics
          </p>
          {filtered.length === 0 ? (
            <p className="py-4 text-xs text-muted-foreground">
              No widgets match “{query}”.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {filtered.map((w) => (
                <li key={w.id} className="flex items-start gap-2.5">
                  <Checkbox
                    id={`cfg-${w.id}`}
                    checked={picked.includes(w.id)}
                    onCheckedChange={() => toggle(w.id)}
                  />
                  <Label
                    htmlFor={`cfg-${w.id}`}
                    className="cursor-pointer leading-tight"
                  >
                    <span className="block text-sm font-medium text-foreground">
                      {w.title}
                    </span>
                    <span className="block text-[11px] font-normal text-muted-foreground">
                      {w.description}
                    </span>
                  </Label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-2 border-t border-border p-4">
          <button
            type="button"
            onClick={apply}
            className="flex-1 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-input py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
