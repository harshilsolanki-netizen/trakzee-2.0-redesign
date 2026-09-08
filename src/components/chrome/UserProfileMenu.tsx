import React, { useEffect, useState } from "react";
import { Check, ChevronDown, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type UserModalKind =
  | "password"
  | "language"
  | "customisation"
  | "subuser"
  | "payment"
  | "wallet"
  | null;

const LANGUAGES = [
  { code: "en", name: "English (US)", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ru", name: "Russian", native: "Русский" },
];

export interface ThemeConfig {
  id: string;
  name: string;
  nav: string;
  sidebar: string;
  sidebarAccent: string;
  sidebarPrimary: string;
  brand: string;
  ring: string;
  bgTint: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "theme-navy-cobalt",
    name: "Navy Cobalt",
    nav: "#0f172a",
    sidebar: "#0f172a",
    sidebarAccent: "#1e293b",
    sidebarPrimary: "#2563eb",
    brand: "#2563eb",
    ring: "#2563eb",
    bgTint: "#f1f5f9",
  },
  {
    id: "theme-uffizio-blue",
    name: "Classic Blue",
    nav: "#111c38",
    sidebar: "#111c38",
    sidebarAccent: "#1a2a52",
    sidebarPrimary: "#155dfc",
    brand: "#155dfc",
    ring: "#155dfc",
    bgTint: "#f8faff",
  },
  {
    id: "theme-midnight-sky",
    name: "Midnight Sky",
    nav: "#172554",
    sidebar: "#172554",
    sidebarAccent: "#1e3a8a",
    sidebarPrimary: "#3b82f6",
    brand: "#3b82f6",
    ring: "#3b82f6",
    bgTint: "#eff6ff",
  },
  {
    id: "theme-indigo-slate",
    name: "Deep Indigo",
    nav: "#1e1b4b",
    sidebar: "#1e1b4b",
    sidebarAccent: "#312e81",
    sidebarPrimary: "#6366f1",
    brand: "#6366f1",
    ring: "#6366f1",
    bgTint: "#eef2ff",
  },
  {
    id: "theme-charcoal-dark",
    name: "Slate Carbon",
    nav: "#18181b",
    sidebar: "#18181b",
    sidebarAccent: "#27272a",
    sidebarPrimary: "#3b82f6",
    brand: "#2563eb",
    ring: "#2563eb",
    bgTint: "#f4f4f5",
  },
  {
    id: "theme-deep-teal",
    name: "Deep Teal",
    nav: "#042f2e",
    sidebar: "#042f2e",
    sidebarAccent: "#115e59",
    sidebarPrimary: "#0d9488",
    brand: "#0d9488",
    ring: "#0d9488",
    bgTint: "#f0fdfa",
  },
  {
    id: "theme-forest-green",
    name: "Forest Green",
    nav: "#052e16",
    sidebar: "#052e16",
    sidebarAccent: "#14532d",
    sidebarPrimary: "#16a34a",
    brand: "#16a34a",
    ring: "#16a34a",
    bgTint: "#f0fdf4",
  },
  {
    id: "theme-olive-moss",
    name: "Olive Lime",
    nav: "#1a2e05",
    sidebar: "#1a2e05",
    sidebarAccent: "#365314",
    sidebarPrimary: "#65a30d",
    brand: "#65a30d",
    ring: "#65a30d",
    bgTint: "#f7fee7",
  },
  {
    id: "theme-amber-gold",
    name: "Amber Gold",
    nav: "#1c1917",
    sidebar: "#1c1917",
    sidebarAccent: "#292524",
    sidebarPrimary: "#d97706",
    brand: "#d97706",
    ring: "#d97706",
    bgTint: "#fffbeb",
  },
  {
    id: "theme-warm-terracotta",
    name: "Warm Copper",
    nav: "#431407",
    sidebar: "#431407",
    sidebarAccent: "#7c2d12",
    sidebarPrimary: "#ea580c",
    brand: "#ea580c",
    ring: "#ea580c",
    bgTint: "#fff7ed",
  },
  {
    id: "theme-espresso-bronze",
    name: "Warm Bronze",
    nav: "#291509",
    sidebar: "#291509",
    sidebarAccent: "#451a03",
    sidebarPrimary: "#b45309",
    brand: "#b45309",
    ring: "#b45309",
    bgTint: "#fffbeb",
  },
  {
    id: "theme-crimson-rose",
    name: "Ruby Crimson",
    nav: "#4c0519",
    sidebar: "#4c0519",
    sidebarAccent: "#881337",
    sidebarPrimary: "#e11d48",
    brand: "#e11d48",
    ring: "#e11d48",
    bgTint: "#fff1f2",
  },
  {
    id: "theme-plum-berry",
    name: "Plum Berry",
    nav: "#500724",
    sidebar: "#500724",
    sidebarAccent: "#831843",
    sidebarPrimary: "#db2777",
    brand: "#db2777",
    ring: "#db2777",
    bgTint: "#fdf2f8",
  },
  {
    id: "theme-royal-violet",
    name: "Royal Violet",
    nav: "#4a044e",
    sidebar: "#4a044e",
    sidebarAccent: "#701a75",
    sidebarPrimary: "#c026d3",
    brand: "#c026d3",
    ring: "#c026d3",
    bgTint: "#fdf4ff",
  },
  {
    id: "theme-amethyst-purple",
    name: "Amethyst Purple",
    nav: "#3b0764",
    sidebar: "#3b0764",
    sidebarAccent: "#581c87",
    sidebarPrimary: "#9333ea",
    brand: "#9333ea",
    ring: "#9333ea",
    bgTint: "#faf5ff",
  },
];

export function applyTheme(themeId: string) {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[1];
  if (!theme) return;
  const root = document.documentElement;
  root.style.setProperty("--nav", theme.nav);
  root.style.setProperty("--sidebar", theme.sidebar);
  root.style.setProperty("--sidebar-accent", theme.sidebarAccent);
  root.style.setProperty("--sidebar-primary", theme.sidebarPrimary);
  root.style.setProperty("--brand", theme.brand);
  root.style.setProperty("--ring", theme.ring);
  localStorage.setItem("trakzee-active-theme-id", theme.id);
}

const APPLICATIONS = [
  { id: "hp-trakzee-premium", name: "HP Trakzee Premium", isPrimary: true },
  { id: "trakzee-standard", name: "Trakzee Standard" },
  { id: "hp-trakzee-mini", name: "HP Trakzee Mini" },
  { id: "smart-bus", name: "Smart Bus" },
  { id: "smart-waste-management", name: "Smart Waste Management" },
  { id: "ais-140", name: "AIS 140" },
  { id: "elexee", name: "Elexee" },
  { id: "ems", name: "EMS" },
  { id: "gridzee", name: "Gridzee" },
  { id: "logytrak", name: "LogyTrak" },
  { id: "petzee", name: "Petzee" },
  { id: "roster-management", name: "Roster Management" },
  { id: "stealth-tracer", name: "Stealth Tracer" },
  { id: "taskeye", name: "TaskEye" },
  { id: "trakride", name: "TrakRide" },
  { id: "trakzee-gsm", name: "Trakzee GSM" },
  { id: "trakzee-lite", name: "Trakzee Lite" },
  { id: "public-transportation", name: "Public Transportation" },
];

function ModalShell({
  title,
  onClose,
  children,
  maxWidth = "max-w-md",
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={"Close " + title}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
      />
      <div
        className={cn(
          "relative z-10 w-full animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl border border-border bg-surface text-foreground shadow-2xl duration-150",
          maxWidth,
        )}
      >
        <header className="flex h-[45px] items-center justify-between bg-nav px-4 text-nav-foreground shrink-0 border-b border-white/10 select-none">
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          <button
            type="button"
            aria-label={"Close " + title}
            onClick={onClose}
            className="rounded-md p-1 text-nav-foreground/80 transition-colors duration-150 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="max-h-[85vh] overflow-y-auto p-4 text-xs">
          {children}
        </div>
      </div>
    </div>
  );
}

export function UserProfileMenu() {
  const [activeModal, setActiveModal] = useState<UserModalKind>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    try {
      return (
        localStorage.getItem("trakzee-active-theme-id") || "theme-uffizio-blue"
      );
    } catch {
      return "theme-uffizio-blue";
    }
  });
  const [userEmail] = useState("hpcompany@yopmail.com");
  const [userName] = useState("VK");

  // Load and apply saved theme on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("trakzee-active-theme-id");
      if (saved) {
        applyTheme(saved);
        setActiveThemeId(saved);
      }
    } catch {}
  }, []);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill all required password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    toast.success("Password changed successfully");
    setActiveModal(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    toast.info("Logged out successfully", {
      description: `Signed out of ${userEmail}`,
    });
  };

  const handleSelectTheme = (themeId: string) => {
    setActiveThemeId(themeId);
    applyTheme(themeId);
    const theme = THEMES.find((t) => t.id === themeId);
    toast.success(`Applied "${theme?.name || "Theme"}" theme`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="User account menu"
            className="flex items-center gap-1 rounded-full p-0.5 transition-transform duration-150 hover:opacity-90 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
          >
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-foreground shadow-xs">
              {userName}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-white/80 shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56 rounded-lg border border-border/80 bg-surface p-1 text-xs text-foreground shadow-2xl animate-in fade-in-0 zoom-in-95 z-[90]"
        >
          <DropdownMenuGroup className="divide-y divide-border/40">
            {/* 1. Change Password */}
            <DropdownMenuItem
              onClick={() => setActiveModal("password")}
              className="px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded transition-colors"
            >
              <span>Change Password</span>
            </DropdownMenuItem>

            {/* 2. Change Language */}
            <DropdownMenuItem
              onClick={() => setActiveModal("language")}
              className="px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded transition-colors"
            >
              <span>Change Language</span>
            </DropdownMenuItem>

            {/* 3. Customisation */}
            <DropdownMenuItem
              onClick={() => setActiveModal("customisation")}
              className="px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded transition-colors"
            >
              <span>Customisation</span>
            </DropdownMenuItem>

            {/* 4. Set Subuser */}
            <DropdownMenuItem
              onClick={() => setActiveModal("subuser")}
              className="px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded transition-colors"
            >
              <span>Set Subuser</span>
            </DropdownMenuItem>

            {/* 5. Applications Submenu matching Reference Image */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center justify-between px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded transition-colors">
                <span>Applications</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                sideOffset={6}
                alignOffset={-4}
                className="w-56 max-h-[380px] overflow-y-auto p-1 text-xs rounded-lg border border-border/80 bg-popover/98 backdrop-blur-xl shadow-2xl z-[100] divide-y divide-border/40"
              >
                {APPLICATIONS.map((app) => (
                  <DropdownMenuItem
                    key={app.id}
                    onClick={() => toast.info(`Switching to ${app.name}`)}
                    className={cn(
                      "px-3 py-2 cursor-pointer text-xs transition-colors hover:bg-muted/80 rounded flex items-center justify-between",
                      app.isPrimary &&
                        "font-bold text-brand bg-brand/10 hover:bg-brand/15",
                    )}
                  >
                    <span>{app.name}</span>
                    {app.isPrimary && (
                      <Check className="h-3.5 w-3.5 text-brand shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* 6. Payment */}
            <DropdownMenuItem
              onClick={() => setActiveModal("payment")}
              className="px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded transition-colors"
            >
              <span>Payment</span>
            </DropdownMenuItem>

            {/* 7. Wallet */}
            <DropdownMenuItem
              onClick={() => setActiveModal("wallet")}
              className="px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded transition-colors"
            >
              <span>Wallet</span>
            </DropdownMenuItem>

            {/* 8. Logout & Email */}
            <div className="pt-1">
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex flex-col items-start px-3 py-2 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
              >
                <span className="font-bold text-xs text-foreground hover:text-rose-600 dark:hover:text-rose-400">
                  Logout
                </span>
                <span className="text-[11px] text-muted-foreground font-normal truncate max-w-[190px]">
                  {userEmail}
                </span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 1. Change Password Overlay */}
      {activeModal === "password" && (
        <ModalShell
          title="Change Password"
          onClose={() => setActiveModal(null)}
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="h-8 w-full rounded border border-input bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                New Password *
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 8 characters)"
                className="h-8 w-full rounded border border-input bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="h-8 w-full rounded border border-input bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
              />
            </div>
            <footer className="flex justify-end gap-2 pt-2 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-7.5 rounded border border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-7.5 rounded bg-brand px-4 text-xs font-semibold text-brand-foreground hover:opacity-90 cursor-pointer transition-colors shadow-xs"
              >
                Save
              </button>
            </footer>
          </form>
        </ModalShell>
      )}

      {/* 2. Change Language Overlay */}
      {activeModal === "language" && (
        <ModalShell
          title="Change Language"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-3">
            <p className="text-muted-foreground text-[11px]">
              Select your preferred language for the Trakzee platform interface.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded border text-left cursor-pointer transition-all",
                    selectedLanguage === lang.code
                      ? "border-brand bg-brand/10 text-brand font-semibold shadow-2xs"
                      : "border-border bg-surface hover:bg-muted text-foreground",
                  )}
                >
                  <div>
                    <div className="font-medium text-xs">{lang.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {lang.native}
                    </div>
                  </div>
                  {selectedLanguage === lang.code && (
                    <Check className="h-4 w-4 text-brand shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <footer className="flex justify-end gap-2 pt-2 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-7.5 rounded border border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success(
                    "Language updated to " +
                      LANGUAGES.find((l) => l.code === selectedLanguage)?.name,
                  );
                  setActiveModal(null);
                }}
                className="h-7.5 rounded bg-brand px-4 text-xs font-semibold text-brand-foreground hover:opacity-90 cursor-pointer transition-colors shadow-xs"
              >
                Save
              </button>
            </footer>
          </div>
        </ModalShell>
      )}

      {/* 3. Customisation Overlay with Software Native Theme Preview Cards & Live Theme Switcher */}
      {activeModal === "customisation" && (
        <ModalShell
          title="Customisation"
          maxWidth="max-w-xl"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h3 className="font-bold text-xs text-foreground">
                    Select Color Theme
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Choose a color palette to personalize your application
                    chrome, navigation, and brand accents in real time.
                  </p>
                </div>
              </div>

              {/* Responsive 3-Column Grid of Native Software Layout Preview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto p-1">
                {THEMES.map((theme) => {
                  const isSelected = activeThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleSelectTheme(theme.id)}
                      className={cn(
                        "group relative flex flex-col overflow-hidden rounded-lg border text-left transition-all duration-150 cursor-pointer bg-surface hover:shadow-md",
                        isSelected
                          ? "border-brand ring-2 ring-brand/40 shadow-sm"
                          : "border-border hover:border-border/80",
                      )}
                    >
                      {/* Software Miniature App Chrome Preview */}
                      <div
                        className="h-20 w-full p-1.5 flex flex-col gap-1 border-b border-border/50 relative overflow-hidden"
                        style={{ backgroundColor: theme.bgTint }}
                      >
                        {/* Top Bar Preview */}
                        <div
                          className="h-3.5 w-full rounded flex items-center justify-between px-1.5 shadow-2xs"
                          style={{ backgroundColor: theme.nav }}
                        >
                          <div className="h-1 w-6 rounded-full bg-white/70" />
                          <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: theme.brand }}
                          />
                        </div>

                        {/* App Body Split Preview: Left Sidebar + Content Area */}
                        <div className="flex-1 flex gap-1 min-h-0">
                          {/* Sidebar Preview */}
                          <div
                            className="w-4 h-full rounded flex flex-col items-center gap-0.5 py-0.5"
                            style={{ backgroundColor: theme.sidebar }}
                          >
                            <div
                              className="h-1 w-2.5 rounded-full"
                              style={{ backgroundColor: theme.sidebarPrimary }}
                            />
                            <div className="h-1 w-2 rounded-full bg-white/30" />
                            <div className="h-1 w-2 rounded-full bg-white/30" />
                          </div>

                          {/* Main Content Area Preview */}
                          <div className="flex-1 bg-white dark:bg-slate-800 rounded p-1 flex flex-col justify-between shadow-2xs border border-black/5">
                            <div className="flex items-center justify-between">
                              <div className="h-1 w-8 rounded-full bg-slate-300 dark:bg-slate-600" />
                              <div
                                className="h-2 px-1 rounded text-[7px] font-bold text-white flex items-center"
                                style={{ backgroundColor: theme.brand }}
                              >
                                CTA
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
                              <div className="h-1 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
                            </div>
                          </div>
                        </div>

                        {/* Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white shadow-xs z-10">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Theme Name & Color Swatch Pills */}
                      <div className="p-2 flex items-center justify-between bg-surface">
                        <span
                          className={cn(
                            "font-semibold text-xs",
                            isSelected ? "text-brand" : "text-foreground",
                          )}
                        >
                          {theme.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span
                            className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: theme.nav }}
                            title="Navigation Color"
                          />
                          <span
                            className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: theme.brand }}
                            title="Brand Primary Color"
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <footer className="flex justify-end gap-2 pt-2 border-t border-border mt-3">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-7.5 rounded border border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const theme = THEMES.find((t) => t.id === activeThemeId);
                  toast.success(
                    `Saved "${theme?.name || "Theme"}" as active theme`,
                  );
                  setActiveModal(null);
                }}
                className="h-7.5 rounded bg-brand px-4 text-xs font-semibold text-brand-foreground hover:opacity-90 cursor-pointer transition-colors shadow-xs"
              >
                Save Theme
              </button>
            </footer>
          </div>
        </ModalShell>
      )}

      {/* 4. Set Subuser Overlay */}
      {activeModal === "subuser" && (
        <ModalShell
          title="Set Subuser"
          maxWidth="max-w-lg"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-[11px]">
                Manage role access and permission levels for secondary accounts.
              </p>
              <button
                type="button"
                onClick={() => toast.success("Subuser creation form opened")}
                className="inline-flex items-center gap-1 rounded bg-brand px-2.5 py-1 text-[11px] font-semibold text-white hover:opacity-90 cursor-pointer"
              >
                <UserPlus className="h-3 w-3" />
                <span>+ Add Subuser</span>
              </button>
            </div>

            <div className="divide-y divide-border border rounded-md overflow-hidden">
              <div className="flex items-center justify-between p-2.5 bg-surface hover:bg-muted/50 transition-colors">
                <div>
                  <div className="font-semibold text-xs text-foreground">
                    Rajesh Sharma
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    rajesh.ops@hpcompany.com · Dispatch Manager
                  </div>
                </div>
                <span className="rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 text-[10px]">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-surface hover:bg-muted/50 transition-colors">
                <div>
                  <div className="font-semibold text-xs text-foreground">
                    Suresh Patel
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    suresh.safety@hpcompany.com · Safety Officer
                  </div>
                </div>
                <span className="rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 text-[10px]">
                  Active
                </span>
              </div>
            </div>

            <footer className="flex justify-end gap-2 pt-2 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-7.5 rounded bg-brand px-4 text-xs font-semibold text-brand-foreground hover:opacity-90 cursor-pointer transition-colors shadow-xs"
              >
                Done
              </button>
            </footer>
          </div>
        </ModalShell>
      )}

      {/* 5. Payment & Billing Overlay */}
      {activeModal === "payment" && (
        <ModalShell
          title="Payment & Invoicing"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-border bg-surface-muted/40">
              <div className="text-[11px] text-muted-foreground font-medium">
                Subscription Plan
              </div>
              <div className="text-base font-bold text-foreground">
                Enterprise Fleet Pro
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Renews on 15 Oct 2026 · 65 Active Vehicles
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                Recent Invoices
              </div>
              <div className="divide-y divide-border border rounded-md">
                <div className="flex items-center justify-between p-2 text-xs">
                  <span>INV-2026-0815</span>
                  <span className="font-semibold text-foreground">
                    $1,240.00 (Paid)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 text-xs">
                  <span>INV-2026-0715</span>
                  <span className="font-semibold text-foreground">
                    $1,240.00 (Paid)
                  </span>
                </div>
              </div>
            </div>

            <footer className="flex justify-end gap-2 pt-2 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-7.5 rounded bg-brand px-4 text-xs font-semibold text-brand-foreground hover:opacity-90 cursor-pointer transition-colors shadow-xs"
              >
                Close
              </button>
            </footer>
          </div>
        </ModalShell>
      )}

      {/* 6. Wallet Overlay */}
      {activeModal === "wallet" && (
        <ModalShell title="Wallet Balance" onClose={() => setActiveModal(null)}>
          <div className="space-y-3.5">
            <div className="p-4 rounded-lg border border-border bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 text-center">
              <div className="text-[11px] text-muted-foreground font-medium">
                Available Balance
              </div>
              <div className="text-2xl font-bold text-foreground text-brand">
                $4,850.00
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Used for SMS, FASTag, and API requests
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Top-up Amount ($)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  defaultValue={500}
                  className="h-8 flex-1 rounded border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Wallet recharged by $500.00");
                    setActiveModal(null);
                  }}
                  className="h-8 rounded bg-brand px-4 text-xs font-semibold text-brand-foreground hover:opacity-90 cursor-pointer shadow-xs"
                >
                  Recharge
                </button>
              </div>
            </div>

            <footer className="flex justify-end gap-2 pt-2 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-7.5 rounded border border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                Close
              </button>
            </footer>
          </div>
        </ModalShell>
      )}
    </>
  );
}
