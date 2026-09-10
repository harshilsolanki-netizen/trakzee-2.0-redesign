import { Car, MapPin, TriangleAlert, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Severity = "high" | "medium" | "low";

type Alert = {
  id: string;
  vehicle: string;
  driver: string;
  type: string;
  company: string;
  branch: string;
  time: string;
  severity: Severity;
};

const ALERTS: Alert[] = [
  {
    id: "a1",
    vehicle: "HR55AC5305",
    driver: "Rajesh Shetty",
    type: "Location IOS",
    company: "Uffizio Pvt Ltd",
    branch: "Valsad",
    time: "09:27 AM",
    severity: "high",
  },
  {
    id: "a2",
    vehicle: "HR55AC5305",
    driver: "Rajesh Shetty",
    type: "Harsh Braking",
    company: "Uffizio Pvt Ltd",
    branch: "Valsad",
    time: "09:21 AM",
    severity: "high",
  },
  {
    id: "a3",
    vehicle: "GJ15BQ1180",
    driver: "Amit Patel",
    type: "Overspeed",
    company: "Uffizio Pvt Ltd",
    branch: "Surat",
    time: "08:52 AM",
    severity: "medium",
  },
  {
    id: "a4",
    vehicle: "MH12KL9921",
    driver: "Sunil Rao",
    type: "Idle too long",
    company: "Uffizio Pvt Ltd",
    branch: "Pune",
    time: "08:14 AM",
    severity: "low",
  },
];

const COUNTS: {
  key: Severity;
  label: string;
  count: number;
  className: string;
  activeClass: string;
}[] = [
  {
    key: "high",
    label: "High",
    count: 26,
    className: "bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-400",
    activeClass: "ring-2 ring-red-500/40 font-bold",
  },
  {
    key: "medium",
    label: "Medium",
    count: 7,
    className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 dark:text-amber-400",
    activeClass: "ring-2 ring-amber-500/40 font-bold",
  },
  {
    key: "low",
    label: "Low",
    count: 21,
    className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400",
    activeClass: "ring-2 ring-emerald-500/40 font-bold",
  },
];

const SEV_BAR: Record<Severity, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

export function NotificationPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = useState<"notification" | "announcements">(
    "notification",
  );
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [cleared, setCleared] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const rows = cleared
    ? []
    : ALERTS.filter((a) => !severity || a.severity === severity);

  return (
    <>
      {/* Backdrop overlay matching standard application side drawers */}
      {open && (
        <button
          type="button"
          aria-label="Close notifications overlay"
          onClick={() => onOpenChange(false)}
          className="fixed top-[45px] bottom-0 left-0 sm:left-14 right-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer animate-in fade-in duration-200"
        />
      )}

      {/* Side drawer container positioned under TopBar */}
      <aside
        aria-hidden={!open}
        aria-label="Notifications panel"
        className={cn(
          "fixed right-0 top-[45px] bottom-0 z-40 flex w-full max-w-[390px] xl:max-w-[410px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        {/* Header with full-height tabs flush to bottom border (56px) */}
        <header className="flex h-[56px] items-center justify-between border-b border-border px-4 bg-background select-none shrink-0">
          <div className="flex items-center gap-6 h-full">
            {(["notification", "announcements"] as const).map((t) => {
              const isActive = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    "relative h-full flex items-center text-xs font-semibold capitalize transition-colors cursor-pointer select-none",
                    isActive
                      ? "text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground font-medium",
                  )}
                >
                  <span>{t}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#155dfc] rounded-t-full shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer focus:outline-none focus-visible:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {tab === "notification" ? (
          <>
            {/* Severity Counts Filter Row */}
            <div className="grid grid-cols-3 border-b border-border shrink-0">
              {COUNTS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() =>
                    setSeverity((s) => (s === c.key ? null : c.key))
                  }
                  className={cn(
                    "py-3 text-center transition-all duration-150 cursor-pointer",
                    c.className,
                    severity === c.key ? c.activeClass : "",
                    severity && severity !== c.key ? "opacity-35" : "",
                  )}
                >
                  <span className="block text-lg font-bold leading-tight">
                    {c.count}
                  </span>
                  <span className="block text-[11px] font-medium tracking-wide">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Date & Clear All Row */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted/20 shrink-0">
              <span className="text-xs font-medium text-muted-foreground">
                01-04-2025
              </span>
              <button
                type="button"
                onClick={() => {
                  setCleared(true);
                  toast("Notifications cleared", {
                    action: { label: "Undo", onClick: () => setCleared(false) },
                  });
                }}
                className="rounded-md border border-input/80 bg-background px-2.5 py-1 text-xs font-semibold text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs active:scale-98"
              >
                Clear All
              </button>
            </div>

            {/* Alerts List */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3.5">
              {rows.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No notifications to show.
                </div>
              ) : (
                rows.map((a) => (
                  <article
                    key={a.id}
                    className="relative overflow-hidden rounded-lg border border-border bg-card p-3 shadow-2xs transition-all hover:border-border/80 hover:shadow-xs"
                  >
                    <span
                      className={cn(
                        "absolute top-0 right-0 h-1.5 w-10 rounded-bl-md",
                        SEV_BAR[a.severity],
                      )}
                    />
                    <div className="flex items-center justify-between pr-8">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Car className="h-3.5 w-3.5 text-muted-foreground shrink-0" />{" "}
                        {a.vehicle}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {a.time}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="h-3.5 w-3.5 shrink-0" />
                        <span>{a.driver}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <TriangleAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>{a.type}</span>
                      </p>
                    </div>

                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Company{" "}
                      <span className="text-foreground font-medium">
                        {a.company}
                      </span>{" "}
                      · Branch{" "}
                      <span className="text-foreground font-medium">
                        {a.branch}
                      </span>
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => toast.success(`Tracking ${a.vehicle}`)}
                        className="rounded-md border border-input/80 bg-background py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted cursor-pointer active:scale-98 shadow-2xs"
                      >
                        Track
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(`${a.vehicle} · ${a.branch}`, {
                            description: "Opening last known location.",
                          })
                        }
                        className="flex items-center justify-center gap-1.5 rounded-md border border-input/80 bg-background py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted cursor-pointer active:scale-98 shadow-2xs"
                      >
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>View Location</span>
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </>
        ) : (
          /* Announcements tab */
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3.5">
            <article className="rounded-lg border border-border bg-card p-3.5 shadow-2xs">
              <p className="text-xs font-bold text-foreground">
                Scheduled maintenance
              </p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Reporting services will be briefly unavailable on Sunday
                02:00–03:00 IST.
              </p>
            </article>
            <article className="rounded-lg border border-border bg-card p-3.5 shadow-2xs">
              <p className="text-xs font-bold text-foreground">
                New widget: Event Heatmap
              </p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Add it to any dashboard tab from the tab configuration panel.
              </p>
            </article>
          </div>
        )}
      </aside>
    </>
  );
}
