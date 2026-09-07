import { Car, MapPin, TriangleAlert, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
}[] = [
  {
    key: "high",
    label: "High",
    count: 26,
    className: "bg-danger/10 text-danger",
  },
  {
    key: "medium",
    label: "Medium",
    count: 7,
    className: "bg-warning/10 text-warning",
  },
  {
    key: "low",
    label: "Low",
    count: 21,
    className: "bg-success/10 text-success",
  },
];

const SEV_BAR: Record<Severity, string> = {
  high: "bg-danger",
  medium: "bg-warning",
  low: "bg-success",
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

  const rows = cleared
    ? []
    : ALERTS.filter((a) => !severity || a.severity === severity);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-[380px] flex-col gap-0 p-0 sm:max-w-[380px]"
      >
        <SheetHeader className="space-y-0 border-b border-border p-0">
          <SheetTitle className="sr-only">Notifications</SheetTitle>
          <div className="flex items-center gap-1 px-3 pt-3">
            {(["notification", "announcements"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-t-md px-3 py-2 text-sm capitalize transition-colors duration-150",
                  tab === t
                    ? "border-b-2 border-primary font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </SheetHeader>

        {tab === "notification" ? (
          <>
            <div className="grid grid-cols-3 border-b border-border">
              {COUNTS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() =>
                    setSeverity((s) => (s === c.key ? null : c.key))
                  }
                  className={cn(
                    "py-3 text-center transition-opacity duration-150 hover:opacity-80",
                    c.className,
                    severity && severity !== c.key ? "opacity-40" : "",
                  )}
                >
                  <span className="block text-lg font-semibold">{c.count}</span>
                  <span className="block text-[11px]">{c.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-xs text-muted-foreground">01-04-2025</span>
              <button
                type="button"
                onClick={() => {
                  setCleared(true);
                  toast("Notifications cleared", {
                    action: { label: "Undo", onClick: () => setCleared(false) },
                  });
                }}
                className="rounded-md border border-input px-2 py-1 text-xs font-medium transition-colors hover:bg-muted"
              >
                Clear All
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3">
              {rows.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  No notifications to show.
                </p>
              ) : (
                rows.map((a) => (
                  <article
                    key={a.id}
                    className="relative overflow-hidden rounded-md border border-border bg-surface p-3"
                  >
                    <span
                      className={cn(
                        "absolute top-0 right-0 h-2 w-8 rounded-bl",
                        SEV_BAR[a.severity],
                      )}
                    />
                    <div className="flex items-center justify-between pr-9">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                        <Car className="h-3.5 w-3.5" /> {a.vehicle}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {a.time}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" /> {a.driver}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground">
                      <TriangleAlert className="h-3.5 w-3.5" /> {a.type}
                    </p>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      Company{" "}
                      <span className="text-foreground">{a.company}</span> ·
                      Branch <span className="text-foreground">{a.branch}</span>
                    </p>
                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => toast.success(`Tracking ${a.vehicle}`)}
                        className="rounded-md border border-input py-1.5 text-xs font-medium transition-colors hover:bg-muted"
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
                        className="flex items-center justify-center gap-1.5 rounded-md border border-input py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                      >
                        <MapPin className="h-3.5 w-3.5" /> View Location
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
            <article className="rounded-md border border-border bg-surface p-3">
              <p className="text-sm font-medium text-foreground">
                Scheduled maintenance
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Reporting services will be briefly unavailable on Sunday
                02:00–03:00 IST.
              </p>
            </article>
            <article className="rounded-md border border-border bg-surface p-3">
              <p className="text-sm font-medium text-foreground">
                New widget: Event Heatmap
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add it to any dashboard tab from the tab configuration panel.
              </p>
            </article>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
