import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  LayoutGrid,
  LogOut,
  Mail,
  Palette,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
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
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { cn } from "@/lib/utils";
import { getStoredLayoutMode, setStoredLayoutMode, type ScreenLayoutMode } from "@/lib/useLayoutMode";
import { getStoredTrackingViewMode, setStoredTrackingViewMode, type TrackingViewMode } from "@/lib/useTrackingViewMode";

type UserModalKind =
  | "password"
  | "language"
  | "customisation"
  | "subuser"
  | "payment"
  | "wallet"
  | null;

const LANGUAGES = [
  { code: "en", name: "English (US)", native: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" },
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
    sidebarPrimary: "#1d4ed8",
    brand: "#1d4ed8",
    ring: "#1d4ed8",
    bgTint: "#f1f5f9",
  },
  {
    id: "theme-uffizio-blue",
    name: "Classic Blue",
    nav: "#111c38",
    sidebar: "#111c38",
    sidebarAccent: "#1a2a52",
    sidebarPrimary: "#0089FF",
    brand: "#0089FF",
    ring: "#0089FF",
    bgTint: "#f8faff",
  },
  {
    id: "theme-midnight-sky",
    name: "Midnight Sky",
    nav: "#0a0f1d",
    sidebar: "#0a0f1d",
    sidebarAccent: "#172554",
    sidebarPrimary: "#38bdf8",
    brand: "#38bdf8",
    ring: "#38bdf8",
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
    sidebarPrimary: "#10b981",
    brand: "#10b981",
    ring: "#10b981",
    bgTint: "#f0fdf4",
  },
  {
    id: "theme-olive-moss",
    name: "Olive Lime",
    nav: "#1a2e05",
    sidebar: "#1a2e05",
    sidebarAccent: "#365314",
    sidebarPrimary: "#84cc16",
    brand: "#84cc16",
    ring: "#84cc16",
    bgTint: "#f7fee7",
  },
  {
    id: "theme-amber-gold",
    name: "Amber Gold",
    nav: "#1c1917",
    sidebar: "#1c1917",
    sidebarAccent: "#292524",
    sidebarPrimary: "#f59e0b",
    brand: "#f59e0b",
    ring: "#f59e0b",
    bgTint: "#fffbeb",
  },
];

export type UiElementStyle = "compact" | "rounded";

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
  root.style.setProperty("--primary", theme.brand);
  root.style.setProperty("--nav-active", theme.brand);
  localStorage.setItem("trakzee-active-theme-id", theme.id);
}

export function applyUiStyle(style: UiElementStyle) {
  const root = document.documentElement;
  root.setAttribute("data-ui-style", style);
  localStorage.setItem("trakzee-ui-style", style);
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

interface Subuser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Dispatch Manager" | "Safety Officer" | "Viewer";
  status: "active" | "inactive";
  branch: string;
}

const INITIAL_SUBUSERS: Subuser[] = [
  {
    id: "sub-1",
    name: "Rajesh Sharma",
    email: "rajesh.ops@hpcompany.com",
    phone: "+91 98765 43210",
    role: "Dispatch Manager",
    status: "active",
    branch: "Valsad",
  },
  {
    id: "sub-2",
    name: "Suresh Patel",
    email: "suresh.safety@hpcompany.com",
    phone: "+91 98234 56789",
    role: "Safety Officer",
    status: "active",
    branch: "Surat",
  },
  {
    id: "sub-3",
    name: "Amit Desai",
    email: "amit.ops@hpcompany.com",
    phone: "+91 98111 22334",
    role: "Viewer",
    status: "active",
    branch: "Ahmedabad",
  },
];

/**
 * Standard Modal Shell matching the Trakzee 2.0 Design System:
 * - 45px header with card background and bottom border
 * - Rounded 2xl container with shadow-2xl and backdrop blur overlay
 * - Consistent p-5 padding for content body
 * - Standardized footer toolbar with neutral Cancel button and #155dfc primary CTA
 */
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
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer !rounded-none"
      />
      <div
        className={cn(
          "relative z-10 w-full animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl border border-border/80 bg-background text-foreground shadow-2xl duration-150 flex flex-col max-h-[90vh]",
          maxWidth,
        )}
      >
        <header className="flex h-[56px] items-center justify-between border-b border-border/70 px-5 bg-card/60 select-none shrink-0">
          <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <button
            type="button"
            aria-label={"Close " + title}
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 min-h-0 overflow-y-auto p-5 text-xs text-foreground custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

export function UserProfileMenu() {
  const [activeModal, setActiveModal] = useState<UserModalKind>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [langSearch, setLangSearch] = useState("");
  const [appSearch, setAppSearch] = useState("");
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    try {
      return (
        localStorage.getItem("trakzee-active-theme-id") || "theme-uffizio-blue"
      );
    } catch {
      return "theme-uffizio-blue";
    }
  });

  const [activeUiStyle, setActiveUiStyle] = useState<UiElementStyle>(() => {
    try {
      return (
        (localStorage.getItem("trakzee-ui-style") as UiElementStyle) || "compact"
      );
    } catch {
      return "compact";
    }
  });

  const [customisationTab, setCustomisationTab] = useState<"color" | "layout" | "ui" | "trackingView">("color");
  const [activeLayoutMode, setActiveLayoutMode] = useState<ScreenLayoutMode>(() => getStoredLayoutMode());
  const [draftLayoutMode, setDraftLayoutMode] = useState<ScreenLayoutMode>(activeLayoutMode);
  const [activeTrackingViewMode, setActiveTrackingViewMode] = useState<TrackingViewMode>(() => getStoredTrackingViewMode());
  const [draftTrackingViewMode, setDraftTrackingViewMode] = useState<TrackingViewMode>(activeTrackingViewMode);
  const [draftThemeId, setDraftThemeId] = useState<string>(activeThemeId);
  const [draftUiStyle, setDraftUiStyle] = useState<UiElementStyle>(activeUiStyle);

  const [userEmail] = useState("hpcompany@yopmail.com");
  const [userName] = useState("VK");

  // Load and apply saved theme and UI style on initial mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("trakzee-active-theme-id");
      if (savedTheme) {
        applyTheme(savedTheme);
        setActiveThemeId(savedTheme);
        setDraftThemeId(savedTheme);
      }
      const savedUi = localStorage.getItem("trakzee-ui-style") as UiElementStyle;
      if (savedUi) {
        applyUiStyle(savedUi);
        setActiveUiStyle(savedUi);
        setDraftUiStyle(savedUi);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (activeModal === "customisation") {
      setDraftThemeId(activeThemeId);
      setDraftUiStyle(activeUiStyle);
      setDraftLayoutMode(activeLayoutMode);
      setDraftTrackingViewMode(activeTrackingViewMode);
      setCustomisationTab("color");
    }
  }, [activeModal, activeThemeId, activeUiStyle, activeTrackingViewMode]);
  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Subuser State
  const [subusers, setSubusers] = useState<Subuser[]>(INITIAL_SUBUSERS);
  const [subuserSearch, setSubuserSearch] = useState("");
  const [isAddingSubuser, setIsAddingSubuser] = useState(false);
  const [newSubuserName, setNewSubuserName] = useState("");
  const [newSubuserEmail, setNewSubuserEmail] = useState("");
  const [newSubuserPhone, setNewSubuserPhone] = useState("");
  const [newSubuserRole, setNewSubuserRole] =
    useState<Subuser["role"]>("Dispatch Manager");
  const [newSubuserBranch, setNewSubuserBranch] = useState("Valsad");

  // Wallet State
  const [walletBalance, setWalletBalance] = useState(4850.0);
  const [topupAmount, setTopupAmount] = useState<number | string>(500);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill all required password fields");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
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

  const handleAddSubuser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubuserName.trim() || !newSubuserEmail.trim()) {
      toast.error("Please enter subuser name and email");
      return;
    }
    const created: Subuser = {
      id: `sub-${Date.now()}`,
      name: newSubuserName.trim(),
      email: newSubuserEmail.trim(),
      phone: newSubuserPhone.trim() || "+91 90000 00000",
      role: newSubuserRole,
      status: "active",
      branch: newSubuserBranch,
    };
    setSubusers([created, ...subusers]);
    setIsAddingSubuser(false);
    setNewSubuserName("");
    setNewSubuserEmail("");
    setNewSubuserPhone("");
    toast.success(`Subuser "${created.name}" created successfully`);
  };

  const handleDeleteSubuser = (id: string, name: string) => {
    setSubusers(subusers.filter((s) => s.id !== id));
    toast.info(`Subuser "${name}" removed`);
  };

  const handleTopup = () => {
    const num = Number(topupAmount);
    if (!num || num <= 0) {
      toast.error("Please enter a valid top-up amount");
      return;
    }
    setWalletBalance((prev) => prev + num);
    toast.success(`Wallet successfully recharged by $${num.toFixed(2)}`, {
      description: `New Available Balance: $${(walletBalance + num).toFixed(2)}`,
    });
    setActiveModal(null);
  };

  const filteredLanguages = useMemo(() => {
    const q = langSearch.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q),
    );
  }, [langSearch]);

  const filteredApps = useMemo(() => {
    const q = appSearch.trim().toLowerCase();
    if (!q) return APPLICATIONS;
    return APPLICATIONS.filter((a) => a.name.toLowerCase().includes(q));
  }, [appSearch]);

  const filteredSubusers = useMemo(() => {
    const q = subuserSearch.trim().toLowerCase();
    if (!q) return subusers;
    return subusers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.branch.toLowerCase().includes(q),
    );
  }, [subusers, subuserSearch]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="User account menu"
            className="flex items-center gap-1.5 rounded-full p-0.5 transition-transform duration-150 hover:opacity-90 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer select-none"
          >
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground shadow-xs">
              {userName}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-white/80 shrink-0" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-64 rounded-xl border border-border/80 bg-popover/98 backdrop-blur-xl p-1.5 text-xs text-foreground shadow-2xl animate-in fade-in-0 zoom-in-95 z-[90]"
        >
          {/* User Account Info Header */}
          <div className="px-3 py-2.5 mb-1 rounded-lg bg-muted/40 border border-border/40 select-none">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow-2xs">
                {userName}
              </div>
              <div className="min-w-0 flex-1 truncate">
                <div className="text-xs font-bold text-foreground truncate">
                  HP Company Admin
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {userEmail}
                </div>
              </div>
            </div>
          </div>

          <DropdownMenuGroup className="space-y-0.5">
            {/* 1. Change Password */}
            <DropdownMenuItem
              onClick={() => setActiveModal("password")}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none"
            >
              <KeyRound className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Change Password</span>
            </DropdownMenuItem>

            {/* 2. Change Language */}
            <DropdownMenuItem
              onClick={() => {
                setLangSearch("");
                setActiveModal("language");
              }}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Change Language</span>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">
                {selectedLanguage}
              </span>
            </DropdownMenuItem>

            {/* 3. Customisation */}
            <DropdownMenuItem
              onClick={() => setActiveModal("customisation")}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none"
            >
              <Palette className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Customisation</span>
            </DropdownMenuItem>

            {/* 4. Set Subuser */}
            <DropdownMenuItem
              onClick={() => {
                setIsAddingSubuser(false);
                setSubuserSearch("");
                setActiveModal("subuser");
              }}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none"
            >
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Set Subuser</span>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                {subusers.length}
              </span>
            </DropdownMenuItem>

            {/* 5. Applications Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center justify-between px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none">
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Applications</span>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                sideOffset={6}
                alignOffset={-4}
                className="w-64 max-h-[380px] p-1.5 text-xs rounded-xl border border-border/80 bg-popover/98 backdrop-blur-xl shadow-2xl z-[100] flex flex-col"
              >
                {/* Search Bar for Applications */}
                <div className="p-1 pb-1.5 border-b border-border/60 mb-1">
                  <div className="flex h-7 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
                    <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                    <input
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      placeholder="Search applications..."
                      className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                    />
                    {appSearch && (
                      <button
                        type="button"
                        onClick={() => setAppSearch("")}
                        className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-0.5 pr-0.5 custom-scrollbar">
                  {filteredApps.map((app) => (
                    <DropdownMenuItem
                      key={app.id}
                      onClick={() => toast.info(`Switching to ${app.name}`)}
                      className={cn(
                        "px-2.5 py-1.5 cursor-pointer text-xs transition-colors hover:bg-muted/80 rounded-md flex items-center justify-between select-none",
                        app.isPrimary &&
                          "font-bold text-[#0089FF] bg-[#0089FF]/10 hover:bg-[#0089FF]/15",
                      )}
                    >
                      <span className="truncate">{app.name}</span>
                      {app.isPrimary && (
                        <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0 ml-1.5" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  {filteredApps.length === 0 && (
                    <div className="p-3 text-center text-xs text-muted-foreground italic">
                      No applications found
                    </div>
                  )}
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* 6. Payment */}
            <DropdownMenuItem
              onClick={() => setActiveModal("payment")}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none"
            >
              <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Payment</span>
            </DropdownMenuItem>

            {/* 7. Wallet */}
            <DropdownMenuItem
              onClick={() => setActiveModal("wallet")}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none"
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Wallet</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                ${walletBalance.toFixed(0)}
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {/* Divider & Logout Section */}
          <div className="border-t border-border/60 my-1 pt-1">
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-md transition-colors select-none font-semibold"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ========================================================================= */}
      {/* 1. CHANGE PASSWORD MODAL                                                 */}
      {/* ========================================================================= */}
      {activeModal === "password" && (
        <ModalShell
          title="Change Password"
          maxWidth="max-w-md"
          onClose={() => setActiveModal(null)}
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 pr-9 text-xs font-semibold text-foreground shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] focus:outline-none transition-all placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded"
                >
                  {showCurrentPass ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 8 characters)"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 pr-9 text-xs font-semibold text-foreground shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] focus:outline-none transition-all placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded"
                >
                  {showNewPass ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="h-9 w-full rounded-md border border-input/80 bg-background px-3 pr-9 text-xs font-semibold text-foreground shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] focus:outline-none transition-all placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded"
                >
                  {showConfirmPass ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Security Tip Box */}
            <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1 select-none">
              <span className="text-[11px] font-bold text-foreground block">
                Password Guidelines
              </span>
              <ul className="text-[10.5px] text-muted-foreground space-y-0.5 list-disc list-inside">
                <li>Minimum 8 characters with at least 1 number</li>
                <li>Include a mix of uppercase and lowercase letters</li>
                <li>Special characters (!@#$%^&*) are recommended</li>
              </ul>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
              >
                Save Changes
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ========================================================================= */}
      {/* 2. CHANGE LANGUAGE MODAL                                                 */}
      {/* ========================================================================= */}
      {activeModal === "language" && (
        <ModalShell
          title="Change Language"
          maxWidth="max-w-lg"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-3.5">
            <p className="text-muted-foreground text-xs leading-relaxed">
              Select your preferred interface language for the Trakzee 2.0
              platform.
            </p>

            {/* Search Language */}
            <div className="flex h-8 items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                placeholder="Search languages..."
                className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
              />
              {langSearch && (
                <button
                  type="button"
                  onClick={() => setLangSearch("")}
                  className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Languages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredLanguages.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={cn(
                      "flex items-center justify-between p-3 !rounded-xl border text-left cursor-pointer transition-all select-none",
                      isSelected
                        ? "border-[#0089FF] bg-[#0089FF]/10 text-foreground ring-1 ring-[#0089FF] shadow-2xs"
                        : "border-border/80 bg-card hover:bg-muted/60 text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base">{lang.flag}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">
                          {lang.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {lang.native}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0089FF] text-white shrink-0">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
              {filteredLanguages.length === 0 && (
                <div className="col-span-2 p-6 text-center text-xs text-muted-foreground italic">
                  No languages found matching &ldquo;{langSearch}&rdquo;
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const current = LANGUAGES.find(
                    (l) => l.code === selectedLanguage,
                  );
                  toast.success(
                    `Language updated to ${current?.name || "English"}`,
                  );
                  setActiveModal(null);
                }}
                className="h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
              >
                Apply Language
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ========================================================================= */}
      {/* 3. CUSTOMISATION MODAL                                                   */}
      {/* ========================================================================= */}
      {activeModal === "customisation" && (
        <ModalShell
          title="Customisation"
          maxWidth="max-w-2xl"
          onClose={() => {
            applyTheme(activeThemeId);
            applyUiStyle(activeUiStyle);
            setActiveModal(null);
          }}
        >
          <div className="space-y-4">
            {/* Top Tab Bar: Color Theme | UI Elements */}
            <div className="flex items-center gap-6 border-b border-border/70 pb-0 select-none">
              <button
                type="button"
                role="tab"
                aria-selected={customisationTab === "color"}
                onClick={() => setCustomisationTab("color")}
                className={cn(
                  "pb-2.5 text-xs font-semibold cursor-pointer transition-all border-b-2 -mb-px !rounded-none line-tab focus:outline-none",
                  customisationTab === "color"
                    ? "border-[#0089FF] text-[#0089FF]"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                Color Theme
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={customisationTab === "layout"}
                onClick={() => setCustomisationTab("layout")}
                className={cn(
                  "pb-2.5 text-xs font-semibold cursor-pointer transition-all border-b-2 -mb-px !rounded-none line-tab focus:outline-none",
                  customisationTab === "layout"
                    ? "border-[#0089FF] text-[#0089FF]"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                View Mode
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={customisationTab === "ui"}
                onClick={() => setCustomisationTab("ui")}
                className={cn(
                  "pb-2.5 text-xs font-semibold cursor-pointer transition-all border-b-2 -mb-px !rounded-none line-tab focus:outline-none",
                  customisationTab === "ui"
                    ? "border-[#0089FF] text-[#0089FF]"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                UI Elements
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={customisationTab === "trackingView"}
                onClick={() => setCustomisationTab("trackingView")}
                className={cn(
                  "pb-2.5 text-xs font-semibold cursor-pointer transition-all border-b-2 -mb-px !rounded-none line-tab focus:outline-none",
                  customisationTab === "trackingView"
                    ? "border-[#0089FF] text-[#0089FF]"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                Live Tracking View
              </button>
            </div>

            {/* TAB 1: COLOR THEME */}
            {customisationTab === "color" && (
              <div className="space-y-3 animate-in fade-in-50 duration-150">
                <div>
                  <h3 className="font-bold text-xs text-foreground">
                    Select Color Theme
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Choose a color palette to personalize your application
                    chrome, navigation, and brand accents in real time.
                  </p>
                </div>

                {/* 3-Column Grid of 9 Color Theme Preview Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto p-1 custom-scrollbar">
                  {THEMES.map((theme) => {
                    const isSelected = draftThemeId === theme.id;
                    return (
                      <div
                        key={theme.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setDraftThemeId(theme.id);
                          applyTheme(theme.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setDraftThemeId(theme.id);
                            applyTheme(theme.id);
                          }
                        }}
                        className={cn(
                          "group relative flex flex-col overflow-hidden !rounded-xl theme-card-preview border text-left transition-all duration-150 cursor-pointer bg-card shadow-2xs hover:shadow-md select-none",
                          isSelected
                            ? "border-[#0089FF] ring-2 ring-[#0089FF]/30 shadow-sm"
                            : "border-border/80 hover:border-border",
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
                            <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0089FF] text-white shadow-xs z-10">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Theme Name & Color Swatch Pills */}
                        <div className="p-2.5 flex items-center justify-between bg-card">
                          <span
                            className={cn(
                              "font-bold text-xs",
                              isSelected ? "text-[#0089FF]" : "text-foreground",
                            )}
                          >
                            {theme.name}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-2xs"
                              style={{ backgroundColor: theme.nav }}
                              title="Top Navbar"
                            />
                            <span
                              className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-2xs"
                              style={{ backgroundColor: theme.brand }}
                              title="Brand Primary"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

                        {/* TAB: VIEW MODE */}
            {customisationTab === "layout" && (
              <div className="space-y-3.5 animate-in fade-in-50 duration-150">
                <div>
                  <h3 className="font-bold text-xs text-foreground">
                    Screen View Mode
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Choose how Reports and Settings screens are structured and presented.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* 1. Tabbed View Card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setDraftLayoutMode("tabs")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDraftLayoutMode("tabs");
                      }
                    }}
                    className={cn(
                      "relative rounded-xl border p-3.5 text-left cursor-pointer transition-all duration-150 bg-card hover:shadow-md select-none flex flex-col justify-between group",
                      draftLayoutMode === "tabs"
                        ? "border-[#0089FF] ring-2 ring-[#0089FF]/30 shadow-sm"
                        : "border-border/80 hover:border-border",
                    )}
                  >
                    {draftLayoutMode === "tabs" && (
                      <div className="absolute top-3 right-3 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0089FF] text-white shadow-xs z-10">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-foreground">Tabbed View</h4>
                        <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                          Multi-Tab
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                        Open multiple reports and settings in tabs for side-by-side comparison.
                      </p>

                      {/* Visual UI Mockup */}
                      <div className="mt-3 rounded-lg border border-border/70 bg-muted/20 p-2 overflow-hidden">
                        {/* Mini browser tab bar */}
                        <div className="flex items-center gap-1 border-b border-border/60 pb-1.5 px-0.5">
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-t bg-background border border-border/80 border-b-0 text-[9px] font-bold text-[#0089FF] shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0089FF]" />
                            <span>Daily Report</span>
                            <span className="text-[8px] text-muted-foreground ml-0.5">×</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-t bg-muted/50 text-[9px] text-muted-foreground">
                            <span>Tire Setting</span>
                            <span className="text-[8px] text-muted-foreground ml-0.5">×</span>
                          </div>
                          <div className="h-4 w-4 rounded flex items-center justify-center text-[10px] text-muted-foreground bg-muted/30">
                            +
                          </div>
                        </div>

                        {/* Mini table area */}
                        <div className="mt-1.5 space-y-1 p-1 bg-background rounded border border-border/40">
                          <div className="flex items-center justify-between gap-1">
                            <div className="h-1.5 w-12 rounded bg-muted-foreground/30" />
                            <div className="h-1.5 w-6 rounded bg-muted-foreground/20" />
                          </div>
                          <div className="space-y-0.5 pt-0.5">
                            <div className="h-1.5 w-full rounded bg-muted/70" />
                            <div className="h-1.5 w-full rounded bg-muted/50" />
                            <div className="h-1.5 w-4/5 rounded bg-muted/40" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/50 text-[10.5px] text-muted-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0089FF]" />
                      <span>Best for multi-tasking & comparing views</span>
                    </div>
                  </div>

                  {/* 2. Single Screen View Card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setDraftLayoutMode("single")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDraftLayoutMode("single");
                      }
                    }}
                    className={cn(
                      "relative rounded-xl border p-3.5 text-left cursor-pointer transition-all duration-150 bg-card hover:shadow-md select-none flex flex-col justify-between group",
                      draftLayoutMode === "single"
                        ? "border-[#0089FF] ring-2 ring-[#0089FF]/30 shadow-sm"
                        : "border-border/80 hover:border-border",
                    )}
                  >
                    {draftLayoutMode === "single" && (
                      <div className="absolute top-3 right-3 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0089FF] text-white shadow-xs z-10">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-foreground">Single Screen View</h4>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Focused
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                        Clean full-height screen with direct action CTAs and no tab bar.
                      </p>

                      {/* Visual UI Mockup */}
                      <div className="mt-3 rounded-lg border border-border/70 bg-muted/20 p-2 overflow-hidden">
                        {/* Mini single header toolbar */}
                        <div className="flex items-center justify-between border-b border-border/60 pb-1.5 px-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-sm bg-[#0089FF]" />
                            <span className="text-[9px] font-bold text-foreground">Tire Setting</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-3.5 px-1.5 rounded bg-[#0089FF] text-white text-[8px] font-bold flex items-center">
                              + Add Tire
                            </div>
                            <div className="h-3.5 px-1.5 rounded border border-border/80 bg-background text-[8px] text-muted-foreground flex items-center">
                              Import
                            </div>
                          </div>
                        </div>

                        {/* Mini full height table area */}
                        <div className="mt-1.5 space-y-1 p-1 bg-background rounded border border-border/40">
                          <div className="flex items-center justify-between gap-1">
                            <div className="h-1.5 w-16 rounded bg-muted-foreground/30" />
                            <div className="h-1.5 w-8 rounded bg-muted-foreground/20" />
                          </div>
                          <div className="space-y-0.5 pt-0.5">
                            <div className="h-1.5 w-full rounded bg-muted/70" />
                            <div className="h-1.5 w-full rounded bg-muted/50" />
                            <div className="h-1.5 w-full rounded bg-muted/40" />
                            <div className="h-1.5 w-full rounded bg-muted/30" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/50 text-[10.5px] text-muted-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>Maximized table height & streamlined actions</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: UI ELEMENTS */}
            {customisationTab === "ui" && (
              <div className="space-y-3 animate-in fade-in-50 duration-150">
                <div>
                  <h3 className="font-bold text-xs text-foreground">
                    UI Elements Style
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Choose how rounded UI elements appear across the application.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* 1. Compact Style Card */}
                  <div
                    onClick={() => {
                      setDraftUiStyle("compact");
                      applyUiStyle("compact");
                    }}
                    className={cn(
                      "relative rounded-xl border p-4 text-left cursor-pointer transition-all duration-150 bg-card hover:shadow-md select-none flex flex-col justify-between",
                      draftUiStyle === "compact"
                        ? "border-[#0089FF] ring-2 ring-[#0089FF]/30 shadow-sm"
                        : "border-border/80 hover:border-border",
                    )}
                  >
                    {/* Selected Check Badge */}
                    {draftUiStyle === "compact" && (
                      <div className="absolute top-3 right-3 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0089FF] text-white shadow-xs">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-bold text-foreground">Compact</h4>

                      {/* Interactive / Visual Preview Row (Minimal radius ~4px / rounded-md) */}
                      <div className="compact-preview flex flex-wrap items-center gap-2 mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-border/50">
                        <span className="inline-flex h-7 items-center justify-center px-3 !rounded-md bg-[#0089FF] text-white text-[11px] font-semibold shadow-2xs">
                          Button
                        </span>
                        <span className="inline-flex h-7 items-center px-2.5 !rounded-md border border-input bg-background text-[11px] font-medium text-muted-foreground shadow-2xs">
                          Input field
                        </span>
                        <span className="inline-flex h-7 items-center gap-1.5 px-2.5 !rounded-md border border-input bg-background text-[11px] font-medium text-muted-foreground shadow-2xs">
                          <span>Dropdown</span>
                          <ChevronDown className="h-3 w-3 opacity-60" />
                        </span>
                        <span className="inline-flex h-7 items-center px-2.5 !rounded-md bg-[#0089FF]/10 text-[#0089FF] text-[11px] font-bold">
                          Tag
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                      A clean and structured look with minimal radius. Best for data-dense views.
                    </p>
                  </div>

                  {/* 2. Rounded Style Card */}
                  <div
                    onClick={() => {
                      setDraftUiStyle("rounded");
                      applyUiStyle("rounded");
                    }}
                    className={cn(
                      "relative rounded-xl border p-4 text-left cursor-pointer transition-all duration-150 bg-card hover:shadow-md select-none flex flex-col justify-between",
                      draftUiStyle === "rounded"
                        ? "border-[#0089FF] ring-2 ring-[#0089FF]/30 shadow-sm"
                        : "border-border/80 hover:border-border",
                    )}
                  >
                    {/* Selected Check Badge */}
                    {draftUiStyle === "rounded" && (
                      <div className="absolute top-3 right-3 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0089FF] text-white shadow-xs">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-bold text-foreground">Rounded</h4>

                      {/* Interactive / Visual Preview Row (Pill rounded-full) */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-border/50">
                        <span className="inline-flex h-7 items-center justify-center px-3.5 rounded-full bg-[#0089FF] text-white text-[11px] font-semibold shadow-2xs">
                          Button
                        </span>
                        <span className="inline-flex h-7 items-center px-3 rounded-full border border-input bg-background text-[11px] font-medium text-muted-foreground shadow-2xs">
                          Input field
                        </span>
                        <span className="inline-flex h-7 items-center gap-1.5 px-3 rounded-full border border-input bg-background text-[11px] font-medium text-muted-foreground shadow-2xs">
                          <span>Dropdown</span>
                          <ChevronDown className="h-3 w-3 opacity-60" />
                        </span>
                        <span className="inline-flex h-7 items-center px-3 rounded-full bg-[#0089FF]/10 text-[#0089FF] text-[11px] font-bold">
                          Tag
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                      A softer and more modern look with rounded corners.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: LIVE TRACKING VIEW */}
            {customisationTab === "trackingView" && (
              <div className="space-y-3.5 animate-in fade-in-50 duration-150">
                <div>
                  <h3 className="font-bold text-xs text-foreground">
                    Live Tracking Explorer View
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Choose your preferred display layout for the left explorer panel across all live tracking tabs (Object, Job, Driver, Trailer, Address, Geofence, Beacon, Video).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* 1. Standard View Card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setDraftTrackingViewMode("standard")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDraftTrackingViewMode("standard");
                      }
                    }}
                    className={cn(
                      "relative rounded-xl border p-3.5 text-left cursor-pointer transition-all duration-150 bg-card hover:shadow-md select-none flex flex-col justify-between group",
                      draftTrackingViewMode === "standard"
                        ? "border-[#0089FF] ring-2 ring-[#0089FF]/30 shadow-sm"
                        : "border-border/80 hover:border-border",
                    )}
                  >
                    {draftTrackingViewMode === "standard" && (
                      <div className="absolute top-3 right-3 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0089FF] text-white shadow-xs z-10">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-foreground">Standard View</h4>
                        <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
                          Table & Cards
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                        Rich multi-column tabular rows with speed, driver info, addresses, and quick actions.
                      </p>

                      {/* Visual UI Mockup */}
                      <div className="mt-3 rounded-lg border border-border/70 bg-muted/20 p-2 overflow-hidden">
                        {/* Table Header mockup */}
                        <div className="flex items-center justify-between text-[8px] font-bold text-muted-foreground border-b border-border/60 pb-1 px-1 uppercase tracking-wider">
                          <span>Object / Name</span>
                          <span>Speed</span>
                          <span>Status</span>
                        </div>
                        {/* Table Rows mockup */}
                        <div className="space-y-1.5 pt-1.5">
                          <div className="flex items-center justify-between p-1 bg-background rounded border border-border/40 text-[9px]">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#008446]" />
                              <span className="font-semibold text-foreground truncate">Fuel - 1001</span>
                            </div>
                            <span className="font-bold text-[#008446]">107 km/h</span>
                          </div>
                          <div className="flex items-center justify-between p-1 bg-background rounded border border-border/40 text-[9px]">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#C70036]" />
                              <span className="font-semibold text-foreground truncate">BUS - 130003</span>
                            </div>
                            <span className="font-bold text-[#C70036]">0 km/h</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/50 text-[10.5px] text-muted-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0089FF]" />
                      <span>Best for full telemetry details & direct multi-column sorting</span>
                    </div>
                  </div>

                  {/* 2. Tree List / Hierarchical View Card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setDraftTrackingViewMode("tree")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDraftTrackingViewMode("tree");
                      }
                    }}
                    className={cn(
                      "relative rounded-xl border p-3.5 text-left cursor-pointer transition-all duration-150 bg-card hover:shadow-md select-none flex flex-col justify-between group",
                      draftTrackingViewMode === "tree"
                        ? "border-[#0089FF] ring-2 ring-[#0089FF]/30 shadow-sm"
                        : "border-border/80 hover:border-border",
                    )}
                  >
                    {draftTrackingViewMode === "tree" && (
                      <div className="absolute top-3 right-3 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0089FF] text-white shadow-xs z-10">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-foreground">Tree List / Hierarchical</h4>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Tree View
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                        Company & branch directory with tree hierarchy guide lines and hardware telemetry indicators.
                      </p>

                      {/* Visual UI Mockup Matching Reference Image media_1791543949532.png */}
                      <div className="mt-3 rounded-lg border border-border/70 bg-muted/20 p-2 overflow-hidden">
                        {/* Company Node */}
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-foreground">
                          <span className="text-[8px] text-muted-foreground">▼</span>
                          <span className="h-3.5 w-3.5 rounded bg-sky-100 text-[#0089FF] flex items-center justify-center text-[8px]">🏢</span>
                          <span>HP Company</span>
                        </div>
                        {/* Branch Node with indent */}
                        <div className="ml-3 pl-2 border-l border-slate-300 dark:border-slate-700 mt-1">
                          <div className="flex items-center gap-1 text-[8.5px] font-semibold text-foreground">
                            <span className="text-[8px] text-muted-foreground">▼</span>
                            <span>📁</span>
                            <span>HP Branch 1</span>
                          </div>
                          {/* Leaf Vehicle with icons */}
                          <div className="ml-3 pl-2 border-l border-slate-300 dark:border-slate-700 mt-1 space-y-1">
                            <div className="flex items-center justify-between p-0.5 bg-background rounded text-[8px]">
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#008446]" />
                                <span className="font-bold text-foreground truncate">E-Lock Pro</span>
                              </div>
                              <span className="font-bold text-[#008446]">80</span>
                            </div>
                            <div className="flex items-center justify-between p-0.5 bg-background rounded text-[8px]">
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#C70036]" />
                                <span className="font-bold text-foreground truncate">HP Bongo</span>
                              </div>
                              <span className="font-bold text-[#C70036]">0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/50 text-[10.5px] text-muted-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>Best for enterprise multi-branch fleet directory navigation</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-3">
              <button
                type="button"
                onClick={() => {
                  applyTheme(activeThemeId);
                  applyUiStyle(activeUiStyle);
                  setStoredLayoutMode(activeLayoutMode);
                  setStoredTrackingViewMode(activeTrackingViewMode);
                  setActiveModal(null);
                }}
                className="px-4 py-2 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveThemeId(draftThemeId);
                  setActiveUiStyle(draftUiStyle);
                  setActiveLayoutMode(draftLayoutMode);
                  setActiveTrackingViewMode(draftTrackingViewMode);
                  applyTheme(draftThemeId);
                  applyUiStyle(draftUiStyle);
                  setStoredLayoutMode(draftLayoutMode);
                  setStoredTrackingViewMode(draftTrackingViewMode);
                  toast.success(
                    `Saved customisation: ${draftTrackingViewMode === "tree" ? "Tree List View" : "Standard View"} enabled`,
                  );
                  setActiveModal(null);
                }}
                className="h-9 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-6 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
              >
                Save Changes
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ========================================================================= */}
      {/* 4. SET SUBUSER MODAL                                                     */}
      {/* ========================================================================= */}
      {activeModal === "subuser" && (
        <ModalShell
          title="Set Subuser"
          maxWidth="max-w-2xl"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex h-8 flex-1 max-w-sm items-center gap-1.5 rounded-md border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input
                  value={subuserSearch}
                  onChange={(e) => setSubuserSearch(e.target.value)}
                  placeholder="Search subusers by name, email, branch..."
                  className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
                />
                {subuserSearch && (
                  <button
                    type="button"
                    onClick={() => setSubuserSearch("")}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsAddingSubuser(!isAddingSubuser)}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#155dfc] px-3.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98 shrink-0"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>{isAddingSubuser ? "Cancel Form" : "Add Subuser"}</span>
              </button>
            </div>

            {/* Inline Add Subuser Form */}
            {isAddingSubuser && (
              <form
                onSubmit={handleAddSubuser}
                className="p-4 rounded-xl border border-[#0089FF]/40 bg-[#0089FF]/5 space-y-3 animate-in fade-in-0 duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-[#0089FF]" />
                    <span>Create New Subuser</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground">
                      Full Name *
                    </label>
                    <input
                      required
                      value={newSubuserName}
                      onChange={(e) => setNewSubuserName(e.target.value)}
                      placeholder="e.g. Ramesh Verma"
                      className="h-8 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-semibold text-foreground focus-within:border-[#0089FF] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={newSubuserEmail}
                      onChange={(e) => setNewSubuserEmail(e.target.value)}
                      placeholder="e.g. ramesh@hpcompany.com"
                      className="h-8 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs font-semibold text-foreground focus-within:border-[#0089FF] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground">
                      Role / Permission Level
                    </label>
                    <SelectDropdown
                      value={newSubuserRole}
                      options={[
                        "Admin",
                        "Dispatch Manager",
                        "Safety Officer",
                        "Viewer",
                      ]}
                      onChange={(val) =>
                        setNewSubuserRole(val as Subuser["role"])
                      }
                      triggerClassName="h-8"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground">
                      Assigned Branch
                    </label>
                    <SelectDropdown
                      value={newSubuserBranch}
                      options={[
                        "Valsad",
                        "Surat",
                        "Ahmedabad",
                        "Mumbai",
                        "All Branches",
                      ]}
                      onChange={setNewSubuserBranch}
                      triggerClassName="h-8"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingSubuser(false)}
                    className="px-3 py-1 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 text-xs rounded-md bg-[#155dfc] hover:bg-[#124ecf] text-white font-semibold shadow-xs cursor-pointer"
                  >
                    Save Subuser
                  </button>
                </div>
              </form>
            )}

            {/* Subusers List Container */}
            <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs divide-y divide-border/60 max-h-[340px] overflow-y-auto custom-scrollbar">
              {filteredSubusers.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 hover:bg-muted/40 transition-colors select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted border border-border/60 font-bold text-xs text-foreground">
                      {sub.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground truncate">
                          {sub.name}
                        </span>
                        <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.2 text-[9.5px]">
                          {sub.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3" />
                        <span>{sub.email}</span>
                        <span>·</span>
                        <span>{sub.branch}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-md border border-border/80 bg-background px-2.5 py-1 text-[11px] font-semibold text-foreground">
                      {sub.role}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteSubuser(sub.id, sub.name)
                      }
                      aria-label={`Delete ${sub.name}`}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredSubusers.length === 0 && (
                <div className="p-8 text-center text-xs text-muted-foreground italic">
                  No subusers found matching &ldquo;{subuserSearch}&rdquo;
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-3">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
              >
                Done
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ========================================================================= */}
      {/* 5. PAYMENT & BILLING MODAL                                               */}
      {/* ========================================================================= */}
      {activeModal === "payment" && (
        <ModalShell
          title="Payment & Billing"
          maxWidth="max-w-lg"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            {/* Current Plan Card */}
            <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2 select-none">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                  Current Subscription
                </span>
                <span className="rounded-full bg-[#0089FF]/10 text-[#0089FF] font-bold text-[10px] px-2.5 py-0.5">
                  Active
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-base font-bold text-foreground">
                  Enterprise Fleet Pro
                </div>
                <div className="text-xs font-bold text-foreground">
                  $1,240.00 / month
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Next renewal on 15 Oct 2026 · Includes 65 Active Vehicles & Video
                Telematics
              </p>
            </div>

            {/* Invoices List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">
                Recent Invoices
              </span>
              <div className="rounded-xl border border-border/80 bg-card overflow-hidden divide-y divide-border/60 select-none shadow-2xs">
                <div className="flex items-center justify-between p-3 text-xs">
                  <div>
                    <div className="font-bold text-foreground">INV-2026-0815</div>
                    <div className="text-[10px] text-muted-foreground">
                      15 Aug 2026 · Credit Card (•••• 4242)
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      $1,240.00 Paid
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        toast.success("Downloading invoice INV-2026-0815.pdf")
                      }
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                      title="Download PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 text-xs">
                  <div>
                    <div className="font-bold text-foreground">INV-2026-0715</div>
                    <div className="text-[10px] text-muted-foreground">
                      15 Jul 2026 · Credit Card (•••• 4242)
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      $1,240.00 Paid
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        toast.success("Downloading invoice INV-2026-0715.pdf")
                      }
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                      title="Download PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Opening billing management portal");
                  setActiveModal(null);
                }}
                className="h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
              >
                Manage Billing
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ========================================================================= */}
      {/* 6. WALLET MODAL                                                          */}
      {/* ========================================================================= */}
      {activeModal === "wallet" && (
        <ModalShell
          title="Wallet Balance"
          maxWidth="max-w-md"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            {/* Balance Card with Gradient */}
            <div className="p-4 rounded-xl border border-border/80 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-card dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-card text-center space-y-1 select-none shadow-2xs">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Available Wallet Balance
              </div>
              <div className="text-3xl font-extrabold text-[#0089FF] tracking-tight">
                ${walletBalance.toFixed(2)}
              </div>
              <div className="text-[10.5px] text-muted-foreground">
                Auto-debited for SMS alerts, FASTag tolls & Telematics APIs
              </div>
            </div>

            {/* Quick Top-up Amount Pills */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">
                Quick Top-up
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    className={cn(
                      "py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none",
                      Number(topupAmount) === amt
                        ? "border-[#0089FF] bg-[#0089FF]/10 text-[#0089FF] ring-1 ring-[#0089FF]"
                        : "border-border/80 bg-background hover:bg-muted text-foreground",
                    )}
                  >
                    +${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground">
                Custom Top-up Amount ($)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={10}
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="h-9 flex-1 rounded-md border border-input/80 bg-background px-3 text-xs font-semibold text-foreground shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTopup}
                className="h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
              >
                Recharge Wallet
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </>
  );
}
