import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Globe,
  MapPin,
  MessageCircle,
  CreditCard,
  Building2,
  ExternalLink,
  Truck,
  Wrench,
  Shield,
  FileText,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const APP_ICONS: Record<string, LucideIcon> = {
  Globe,
  MapPin,
  MessageCircle,
  CreditCard,
  Building2,
  ExternalLink,
  Truck,
  Wrench,
  Shield,
  FileText,
  LayoutGrid,
};

const COLOR_PRESETS = [
  { label: "Blue", value: "#0089FF" },
  { label: "Emerald", value: "#10B981" },
  { label: "Green", value: "#22C55E" },
  { label: "Amber", value: "#F59E0B" },
  { label: "Rose", value: "#F43F5E" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Indigo", value: "#6366F1" },
];

const CATEGORY_PRESETS = [
  "Navigation",
  "Chat",
  "Toll & FASTag",
  "ERP & Finance",
  "Maintenance",
  "Tools",
  "Other",
];

interface AddThirdPartyAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (app: {
    name: string;
    url: string;
    category: string;
    iconName: string;
    color: string;
  }) => void;
}

export function AddThirdPartyAppModal({
  open,
  onOpenChange,
  onAdd,
}: AddThirdPartyAppModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Navigation");
  const [iconName, setIconName] = useState("Globe");
  const [color, setColor] = useState("#0089FF");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter an app name");
      return;
    }
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    onAdd({
      name: name.trim(),
      url: url.trim(),
      category,
      iconName,
      color,
    });

    // Reset and close
    setName("");
    setUrl("");
    setCategory("Navigation");
    setIconName("Globe");
    setColor("#0089FF");
    setError(null);
    onOpenChange(false);
  };

  const SelectedIcon = APP_ICONS[iconName] || Globe;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-xl border border-border/80 bg-background shadow-2xl z-50">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-xs"
                style={{ backgroundColor: color }}
              >
                <SelectedIcon className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-foreground">
                  Add Third-Party App
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Add an external portal or web application to open directly
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Form Body */}
          <div className="px-5 py-4 space-y-3.5 text-xs">
            {error && (
              <div className="p-2 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-200 dark:border-rose-900/50">
                {error}
              </div>
            )}

            {/* App Name */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                App Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. FASTag Portal, SAP ERP, Google Maps"
                className="w-full h-8.5 px-3 rounded-lg border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>

            {/* App URL */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                URL / Web Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                placeholder="https://example.com"
                className="w-full h-8.5 px-3 rounded-lg border border-input bg-background text-foreground text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_PRESETS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors cursor-pointer",
                      category === cat
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Select Icon
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(APP_ICONS).map((nameKey) => {
                  const IconComponent = APP_ICONS[nameKey];
                  const isSelected = iconName === nameKey;
                  return (
                    <button
                      key={nameKey}
                      type="button"
                      onClick={() => setIconName(nameKey)}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-md border transition-all cursor-pointer",
                        isSelected
                          ? "border-primary bg-primary text-white shadow-xs"
                          : "border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      title={nameKey}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Accent Picker */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Theme Color
              </label>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={cn(
                      "h-5 w-5 rounded-full border-2 transition-transform cursor-pointer",
                      color === c.value
                        ? "scale-110 border-foreground shadow-xs ring-2 ring-primary/40"
                        : "border-transparent opacity-80 hover:opacity-100"
                    )}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-5 py-3 border-t border-border/60 bg-muted/20 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8 px-3 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              Add App
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
