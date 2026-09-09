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
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
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
                      "flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all select-none",
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
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
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

              {/* 3-Column Grid of Native Software Layout Preview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto p-1 custom-scrollbar">
                {THEMES.map((theme) => {
                  const isSelected = activeThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleSelectTheme(theme.id)}
                      className={cn(
                        "group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-150 cursor-pointer bg-card shadow-2xs hover:shadow-md",
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
                        <div className="flex items-center gap-1">
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
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/70 mt-3">
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
                  const theme = THEMES.find((t) => t.id === activeThemeId);
                  toast.success(
                    `Saved "${theme?.name || "Theme"}" as active theme`,
                  );
                  setActiveModal(null);
                }}
                className="h-9 rounded-md bg-[#155dfc] px-6 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#124ecf] cursor-pointer active:scale-98"
              >
                Save Theme
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
                    <select
                      value={newSubuserRole}
                      onChange={(e) =>
                        setNewSubuserRole(e.target.value as Subuser["role"])
                      }
                      className="h-8 w-full rounded-md border border-input/80 bg-background px-2 text-xs font-semibold text-foreground focus-within:border-[#0089FF] focus:outline-none cursor-pointer"
                    >
                      <option value="Admin">Admin (Full Access)</option>
                      <option value="Dispatch Manager">
                        Dispatch Manager
                      </option>
                      <option value="Safety Officer">Safety Officer</option>
                      <option value="Viewer">Viewer (Read-only)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground">
                      Assigned Branch
                    </label>
                    <select
                      value={newSubuserBranch}
                      onChange={(e) => setNewSubuserBranch(e.target.value)}
                      className="h-8 w-full rounded-md border border-input/80 bg-background px-2 text-xs font-semibold text-foreground focus-within:border-[#0089FF] focus:outline-none cursor-pointer"
                    >
                      <option value="Valsad">Valsad</option>
                      <option value="Surat">Surat</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="All Branches">All Branches</option>
                    </select>
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
