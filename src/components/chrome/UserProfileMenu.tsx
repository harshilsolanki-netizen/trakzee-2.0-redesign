import React, { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  LayoutGrid,
  LogIn,
  LogOut,
  Mail,
  Palette,
  RotateCcw,
  Search,
  Shield,
  Star,
  Trash2,
  UserCheck,
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
import { useAuth } from "@/auth/AuthContext";

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

export type SubuserTier = "admin" | "reseller" | "company";

export interface HierarchicalSubuser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: "Admin-Subuser" | "Reseller-Subuser" | "Company-Subuser";
  parentAccountName: string;
  parentAccountType: "Admin" | "Reseller" | "Company";
  role: string;
  status: "active" | "inactive";
  branch?: string;
}

export const HIERARCHICAL_SUBUSERS: HierarchicalSubuser[] = [
  // 1. Admin Subusers
  {
    id: "sub-admin-1",
    name: "Uffizio Demo Subuser",
    email: "present@uffizio.com",
    phone: "+91 99000 11223",
    type: "Admin-Subuser",
    parentAccountName: "Uffizio Demo Account",
    parentAccountType: "Admin",
    role: "System Administrator",
    status: "active",
    branch: "HQ - Ahmedabad",
  },
  {
    id: "sub-admin-2",
    name: "Master Admin Ops",
    email: "admin.ops@uffizio.com",
    phone: "+91 99000 44556",
    type: "Admin-Subuser",
    parentAccountName: "Uffizio Demo Account",
    parentAccountType: "Admin",
    role: "Global Operations",
    status: "active",
    branch: "HQ - Ahmedabad",
  },

  // 2. Reseller Subusers
  {
    id: "sub-reseller-1",
    name: "Marketing Lead",
    email: "marketing@reseller.com",
    phone: "+91 98700 12345",
    type: "Reseller-Subuser",
    parentAccountName: "Uffizio Reseller",
    parentAccountType: "Reseller",
    role: "Marketing Manager",
    status: "active",
    branch: "Surat Hub",
  },
  {
    id: "sub-reseller-2",
    name: "Global Tech Partner",
    email: "resellerdemo@globaltech.com",
    phone: "+91 98700 67890",
    type: "Reseller-Subuser",
    parentAccountName: "Uffizio Reseller",
    parentAccountType: "Reseller",
    role: "Senior Reseller Partner",
    status: "active",
    branch: "Mumbai Central",
  },
  {
    id: "sub-reseller-3",
    name: "Sahaj Tech Support",
    email: "resellerdemo2@sahaj.com",
    phone: "+91 98700 54321",
    type: "Reseller-Subuser",
    parentAccountName: "Uffizio Reseller",
    parentAccountType: "Reseller",
    role: "Technical Support",
    status: "active",
    branch: "Pune Region",
  },
  {
    id: "sub-reseller-4",
    name: "Integration Test Engineer",
    email: "device.test@uffizio.com",
    phone: "+91 98700 99887",
    type: "Reseller-Subuser",
    parentAccountName: "Device Integration Testing",
    parentAccountType: "Reseller",
    role: "Hardware QA Lead",
    status: "active",
    branch: "Bangalore Lab",
  },

  // 3. Company Subusers
  {
    id: "sub-company-1",
    name: "Rajesh Sharma",
    email: "rajesh.ops@hpcompany.com",
    phone: "+91 98765 43210",
    type: "Company-Subuser",
    parentAccountName: "HP Company",
    parentAccountType: "Company",
    role: "Dispatch Manager",
    status: "active",
    branch: "Valsad",
  },
  {
    id: "sub-company-2",
    name: "Suresh Patel",
    email: "suresh.safety@hpcompany.com",
    phone: "+91 98234 56789",
    type: "Company-Subuser",
    parentAccountName: "HP Company",
    parentAccountType: "Company",
    role: "Safety Officer",
    status: "active",
    branch: "Surat",
  },
  {
    id: "sub-company-3",
    name: "Amit Desai",
    email: "amit.ops@hpcompany.com",
    phone: "+91 98111 22334",
    type: "Company-Subuser",
    parentAccountName: "HP Company",
    parentAccountType: "Company",
    role: "Fleet Viewer",
    status: "active",
    branch: "Ahmedabad",
  },
  {
    id: "sub-company-4",
    name: "7Sys Coordinator",
    email: "7sys@demo.com",
    phone: "+91 98111 77889",
    type: "Company-Subuser",
    parentAccountName: "Device Integration Testing",
    parentAccountType: "Company",
    role: "Fleet Coordinator",
    status: "active",
    branch: "Delhi Logistics",
  },
  {
    id: "sub-company-5",
    name: "Eagle Logistics Ops",
    email: "ops@eaglescope.com",
    phone: "+91 98111 99001",
    type: "Company-Subuser",
    parentAccountName: "Eagle Scope Logistics",
    parentAccountType: "Company",
    role: "Transport Supervisor",
    status: "active",
    branch: "Vadodara Hub",
  },
];

export interface SubuserTreeNode {
  id: string;
  name: string;
  type: "account" | "subuser";
  accountType?: "Admin" | "Reseller" | "Company";
  subuserType?: "Admin-Subuser" | "Reseller-Subuser" | "Company-Subuser";
  email?: string;
  phone?: string;
  role?: string;
  status?: "active" | "inactive";
  branch?: string;
  subuserId?: string;
  children?: SubuserTreeNode[];
}

export const ADMIN_TREE_DATA: SubuserTreeNode[] = [
  {
    id: "acc-admin-uffizio",
    name: "Uffizio Demo Account",
    type: "account",
    accountType: "Admin",
    children: [
      {
        id: "sub-admin-1",
        name: "Uffizio Demo Subuser",
        type: "subuser",
        subuserType: "Admin-Subuser",
        email: "present@uffizio.com",
        phone: "+91 99000 11223",
        role: "System Administrator",
        status: "active",
        branch: "HQ - Ahmedabad",
        subuserId: "sub-admin-1",
      },
      {
        id: "sub-admin-2",
        name: "Master Admin Ops",
        type: "subuser",
        subuserType: "Admin-Subuser",
        email: "admin.ops@uffizio.com",
        phone: "+91 99000 44556",
        role: "Global Operations",
        status: "active",
        branch: "HQ - Ahmedabad",
        subuserId: "sub-admin-2",
      },
    ],
  },
];

export const RESELLER_TREE_DATA: SubuserTreeNode[] = [
  {
    id: "acc-admin-uffizio",
    name: "Uffizio Demo Account",
    type: "account",
    accountType: "Admin",
    children: [
      {
        id: "acc-reseller-uffizio",
        name: "Uffizio Reseller",
        type: "account",
        accountType: "Reseller",
        children: [
          {
            id: "sub-reseller-1",
            name: "Marketing Lead",
            type: "subuser",
            subuserType: "Reseller-Subuser",
            email: "marketing@reseller.com",
            phone: "+91 98700 12345",
            role: "Marketing Manager",
            status: "active",
            branch: "Surat Hub",
            subuserId: "sub-reseller-1",
          },
          {
            id: "sub-reseller-2",
            name: "Global Tech Partner",
            type: "subuser",
            subuserType: "Reseller-Subuser",
            email: "resellerdemo@globaltech.com",
            phone: "+91 98700 67890",
            role: "Senior Reseller Partner",
            status: "active",
            branch: "Mumbai Central",
            subuserId: "sub-reseller-2",
          },
          {
            id: "sub-reseller-3",
            name: "Sahaj Tech Support",
            type: "subuser",
            subuserType: "Reseller-Subuser",
            email: "resellerdemo2@sahaj.com",
            phone: "+91 98700 54321",
            role: "Technical Support",
            status: "active",
            branch: "Pune Region",
            subuserId: "sub-reseller-3",
          },
        ],
      },
      {
        id: "acc-reseller-device-test",
        name: "Device Integration Testing",
        type: "account",
        accountType: "Reseller",
        children: [
          {
            id: "sub-reseller-4",
            name: "Integration Test Engineer",
            type: "subuser",
            subuserType: "Reseller-Subuser",
            email: "device.test@uffizio.com",
            phone: "+91 98700 99887",
            role: "Hardware QA Lead",
            status: "active",
            branch: "Bangalore Lab",
            subuserId: "sub-reseller-4",
          },
        ],
      },
    ],
  },
];

export const COMPANY_TREE_DATA: SubuserTreeNode[] = [
  {
    id: "acc-reseller-uffizio",
    name: "Uffizio Reseller",
    type: "account",
    accountType: "Reseller",
    children: [
      {
        id: "acc-company-hp",
        name: "HP Company",
        type: "account",
        accountType: "Company",
        children: [
          {
            id: "sub-company-1",
            name: "Rajesh Sharma",
            type: "subuser",
            subuserType: "Company-Subuser",
            email: "rajesh.ops@hpcompany.com",
            phone: "+91 98765 43210",
            role: "Dispatch Manager",
            status: "active",
            branch: "Valsad",
            subuserId: "sub-company-1",
          },
          {
            id: "sub-company-2",
            name: "Suresh Patel",
            type: "subuser",
            subuserType: "Company-Subuser",
            email: "suresh.safety@hpcompany.com",
            phone: "+91 98234 56789",
            role: "Safety Officer",
            status: "active",
            branch: "Surat",
            subuserId: "sub-company-2",
          },
          {
            id: "sub-company-3",
            name: "Amit Desai",
            type: "subuser",
            subuserType: "Company-Subuser",
            email: "amit.ops@hpcompany.com",
            phone: "+91 98111 22334",
            role: "Fleet Viewer",
            status: "active",
            branch: "Ahmedabad",
            subuserId: "sub-company-3",
          },
        ],
      },
      {
        id: "acc-company-eagle",
        name: "Eagle Scope Logistics",
        type: "account",
        accountType: "Company",
        children: [
          {
            id: "sub-company-5",
            name: "Eagle Logistics Ops",
            type: "subuser",
            subuserType: "Company-Subuser",
            email: "ops@eaglescope.com",
            phone: "+91 98111 99001",
            role: "Transport Supervisor",
            status: "active",
            branch: "Vadodara Hub",
            subuserId: "sub-company-5",
          },
        ],
      },
    ],
  },
  {
    id: "acc-reseller-device-test",
    name: "Device Integration Testing",
    type: "account",
    accountType: "Reseller",
    children: [
      {
        id: "acc-company-device-test",
        name: "Device Integration Testing (Company)",
        type: "account",
        accountType: "Company",
        children: [
          {
            id: "sub-company-4",
            name: "7Sys Coordinator",
            type: "subuser",
            subuserType: "Company-Subuser",
            email: "7sys@demo.com",
            phone: "+91 98111 77889",
            role: "Fleet Coordinator",
            status: "active",
            branch: "Delhi Logistics",
            subuserId: "sub-company-4",
          },
        ],
      },
    ],
  },
];

export function countAllSubusers(nodes: SubuserTreeNode[]): number {
  let count = 0;
  for (const node of nodes) {
    if (node.type === "subuser") {
      count++;
    }
    if (node.children && node.children.length > 0) {
      count += countAllSubusers(node.children);
    }
  }
  return count;
}

export function getAllSubusersFromTree(nodes: SubuserTreeNode[]): HierarchicalSubuser[] {
  const list: HierarchicalSubuser[] = [];
  function traverse(node: SubuserTreeNode) {
    if (node.type === "subuser" && node.subuserId) {
      const match = HIERARCHICAL_SUBUSERS.find((s) => s.id === node.subuserId);
      if (match && !list.some((s) => s.id === match.id)) {
        list.push(match);
      }
    }
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  for (const n of nodes) {
    traverse(n);
  }
  return list;
}

export function filterSubuserTree(
  nodes: SubuserTreeNode[],
  search: string,
): SubuserTreeNode[] {
  const q = search.trim().toLowerCase();
  if (!q) return nodes;

  function filterNode(node: SubuserTreeNode): SubuserTreeNode | null {
    if (node.type === "subuser") {
      const matches =
        node.name.toLowerCase().includes(q) ||
        (node.email && node.email.toLowerCase().includes(q)) ||
        (node.role && node.role.toLowerCase().includes(q)) ||
        (node.branch && node.branch.toLowerCase().includes(q)) ||
        (node.subuserType && node.subuserType.toLowerCase().includes(q));
      return matches ? node : null;
    }

    const accountMatches =
      node.name.toLowerCase().includes(q) ||
      (node.accountType && node.accountType.toLowerCase().includes(q));

    const filteredChildren = (node.children || [])
      .map(filterNode)
      .filter((n): n is SubuserTreeNode => n !== null);

    if (accountMatches) {
      return node;
    }

    if (filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      };
    }

    return null;
  }

  return nodes.map(filterNode).filter((n): n is SubuserTreeNode => n !== null);
}

function SubuserTreeItem({
  node,
  depth = 0,
  selectedSubuserId,
  defaultSubuserId,
  activeSessionSubuserId,
  appliedViewSubuserId,
  collapsedAccountIds,
  onToggleCollapse,
  onSelectSubuser,
  onDoubleClickSubuser,
  searchActive,
}: {
  node: SubuserTreeNode;
  depth?: number;
  selectedSubuserId: string;
  defaultSubuserId: string;
  activeSessionSubuserId: string | null;
  appliedViewSubuserId: string | null;
  collapsedAccountIds: Record<string, boolean>;
  onToggleCollapse: (id: string) => void;
  onSelectSubuser: (id: string) => void;
  onDoubleClickSubuser: (id: string) => void;
  searchActive: boolean;
}) {
  if (node.type === "account") {
    const isCollapsed = !searchActive && !!collapsedAccountIds[node.id];
    const subuserCount = countAllSubusers(node.children || []);

    const accountBadgeStyle =
      node.accountType === "Admin"
        ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800"
        : node.accountType === "Reseller"
        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
        : "bg-sky-50 text-[#0089FF] dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800";

    return (
      <div className="select-none">
        {/* Account Parent Header Row */}
        <div
          onClick={() => onToggleCollapse(node.id)}
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors group select-none",
            depth === 0
              ? "bg-muted/70 hover:bg-muted border border-border/70 font-semibold"
              : "hover:bg-muted/40 font-medium",
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            {/* Chevron toggle button */}
            <div className="h-5 w-5 rounded-md flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-transform shrink-0">
              {isCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>

            {/* Account Name */}
            <span className="text-xs text-foreground font-bold truncate">
              {node.name}
            </span>

            {/* Subuser Count [ N ] */}
            <span className="text-[11px] font-semibold text-muted-foreground px-1.5 py-0.5 rounded-md bg-background/90 border border-border/60 shrink-0">
              [ {subuserCount} ]
            </span>
          </div>

          {/* Account Role Badge on Right */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                accountBadgeStyle,
              )}
            >
              {node.accountType}
            </span>
          </div>
        </div>

        {/* Child Nodes (indented with tree guideline) */}
        {!isCollapsed && node.children && node.children.length > 0 && (
          <div className="border-l-2 border-border/70 ml-4.5 pl-3 py-1 space-y-1 my-1">
            {node.children.map((child) => (
              <SubuserTreeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedSubuserId={selectedSubuserId}
                defaultSubuserId={defaultSubuserId}
                activeSessionSubuserId={activeSessionSubuserId}
                appliedViewSubuserId={appliedViewSubuserId}
                collapsedAccountIds={collapsedAccountIds}
                onToggleCollapse={onToggleCollapse}
                onSelectSubuser={onSelectSubuser}
                onDoubleClickSubuser={onDoubleClickSubuser}
                searchActive={searchActive}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Subuser Child Row (Leaf)
  const isSelected = selectedSubuserId === node.id;
  const isDefault = defaultSubuserId === node.id;
  const isActiveSession = activeSessionSubuserId === node.id;
  const isAppliedView = appliedViewSubuserId === node.id;

  const typeBadgeStyle =
    node.subuserType === "Admin-Subuser"
      ? "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800"
      : node.subuserType === "Reseller-Subuser"
      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      : "bg-sky-50 text-[#0089FF] dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800";

  return (
    <div
      onClick={() => onSelectSubuser(node.id)}
      onDoubleClick={() => onDoubleClickSubuser(node.id)}
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all select-none group border",
        isSelected
          ? "bg-[#0089FF]/8 hover:bg-[#0089FF]/12 border-[#0089FF]/50 shadow-2xs"
          : "bg-card/40 hover:bg-muted/50 border-transparent hover:border-border/60",
      )}
    >
      {/* Left: Radio + Subuser Name (single clean line, no avatar, no subtext, no active dot) */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Custom Radio Button */}
        <div
          className={cn(
            "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-all",
            isSelected
              ? "border-[#0089FF] bg-[#0089FF]"
              : "border-muted-foreground/40 group-hover:border-[#0089FF]/60 bg-background",
          )}
        >
          {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
        </div>

        {/* Subuser Name */}
        <span
          className={cn(
            "font-semibold text-xs truncate",
            isSelected ? "text-[#0089FF]" : "text-foreground",
          )}
        >
          {node.name}
        </span>
      </div>

      {/* Right: Same alignment column as Admin / Reseller / Company */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Subuser Type Badge - in the same alignment of the Admin */}
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
            typeBadgeStyle,
          )}
        >
          {node.subuserType}
        </span>
      </div>
    </div>
  );
}

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

  const { logout, user } = useAuth();
  const userEmail = user?.email || "design.uffizio.com";
  const userName = "VK";

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

  // Subuser Hierarchical & Session State
  const [selectedTierTab, setSelectedTierTab] = useState<SubuserTier>("company");
  const [subuserSearch, setSubuserSearch] = useState("");
  const [defaultSubuserId, setDefaultSubuserId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("trakzee-default-subuser-id") || "sub-company-1";
    }
    return "sub-company-1";
  });
  const [activeSessionSubuserId, setActiveSessionSubuserId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("trakzee-active-subuser-id");
    }
    return null;
  });
  const [appliedViewSubuserId, setAppliedViewSubuserId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("trakzee-applied-view-subuser-id");
    }
    return null;
  });
  const [selectedSubuserId, setSelectedSubuserId] = useState<string>("sub-company-1");

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
    logout();
  };

  const handleSelectTheme = (themeId: string) => {
    setActiveThemeId(themeId);
    applyTheme(themeId);
    const theme = THEMES.find((t) => t.id === themeId);
    toast.success(`Applied "${theme?.name || "Theme"}" theme`);
  };

  const handleLoginAsSubuser = () => {
    if (!selectedSubuser) {
      toast.error("Please select a subuser to login as");
      return;
    }
    setActiveSessionSubuserId(selectedSubuser.id);
    localStorage.setItem("trakzee-active-subuser-id", selectedSubuser.id);
    toast.success(`Logged in as ${selectedSubuser.name} (${selectedSubuser.email})`);
    setActiveModal(null);
  };

  const handleApplyViewData = () => {
    if (!selectedSubuser) {
      toast.error("Please select a subuser to view data");
      return;
    }
    setAppliedViewSubuserId(selectedSubuser.id);
    localStorage.setItem("trakzee-applied-view-subuser-id", selectedSubuser.id);
    toast.info(`Viewing data filtered for ${selectedSubuser.name} (${selectedSubuser.parentAccountName})`);
    setActiveModal(null);
  };

  const handleSetAsDefault = () => {
    if (!selectedSubuser) {
      toast.error("Please select a subuser to set as default");
      return;
    }
    setDefaultSubuserId(selectedSubuser.id);
    localStorage.setItem("trakzee-default-subuser-id", selectedSubuser.id);
    toast.success(`Set ${selectedSubuser.name} as default subuser. Will auto-login on every session.`);
  };

  const handleClearImpersonation = () => {
    setActiveSessionSubuserId(null);
    setAppliedViewSubuserId(null);
    localStorage.removeItem("trakzee-active-subuser-id");
    localStorage.removeItem("trakzee-applied-view-subuser-id");
    toast.info("Returned to master account session");
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

  // Active Tree Data & Filtering
  const [collapsedAccountIds, setCollapsedAccountIds] = useState<Record<string, boolean>>({});

  const activeTreeData = useMemo(() => {
    if (selectedTierTab === "admin") return ADMIN_TREE_DATA;
    if (selectedTierTab === "reseller") return RESELLER_TREE_DATA;
    return COMPANY_TREE_DATA;
  }, [selectedTierTab]);

  const filteredTree = useMemo(() => {
    return filterSubuserTree(activeTreeData, subuserSearch);
  }, [activeTreeData, subuserSearch]);

  const totalVisibleSubusers = useMemo(() => {
    return countAllSubusers(filteredTree);
  }, [filteredTree]);

  const adminTabCount = useMemo(() => countAllSubusers(ADMIN_TREE_DATA), []);
  const resellerTabCount = useMemo(() => countAllSubusers(RESELLER_TREE_DATA), []);
  const companyTabCount = useMemo(() => countAllSubusers(COMPANY_TREE_DATA), []);

  const selectedSubuser = useMemo(() => {
    return (
      HIERARCHICAL_SUBUSERS.find((s) => s.id === selectedSubuserId) ||
      HIERARCHICAL_SUBUSERS[0] ||
      null
    );
  }, [selectedSubuserId]);

  const activeSessionSubuser = useMemo(() => {
    if (!activeSessionSubuserId) return null;
    return (
      HIERARCHICAL_SUBUSERS.find((s) => s.id === activeSessionSubuserId) || null
    );
  }, [activeSessionSubuserId]);

  // Ensure selected subuser matches the active tab's reachable subusers
  useEffect(() => {
    const currentTabSubusers = getAllSubusersFromTree(activeTreeData);
    if (
      currentTabSubusers.length > 0 &&
      !currentTabSubusers.some((s) => s.id === selectedSubuserId)
    ) {
      setSelectedSubuserId(currentTabSubusers[0].id);
    }
  }, [selectedTierTab, activeTreeData, selectedSubuserId]);

  const isAllCollapsed = useMemo(() => {
    return Object.values(collapsedAccountIds).filter(Boolean).length > 0;
  }, [collapsedAccountIds]);

  const handleToggleExpandAll = () => {
    if (isAllCollapsed) {
      setCollapsedAccountIds({});
    } else {
      const allAccIds: Record<string, boolean> = {};
      const collect = (nodes: SubuserTreeNode[]) => {
        for (const n of nodes) {
          if (n.type === "account") {
            allAccIds[n.id] = true;
            if (n.children) collect(n.children);
          }
        }
      };
      collect(activeTreeData);
      setCollapsedAccountIds(allAccIds);
    }
  };

  const handleToggleAccount = (id: string) => {
    setCollapsedAccountIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
                {activeSessionSubuser ? activeSessionSubuser.name.slice(0, 2).toUpperCase() : userName}
              </div>
              <div className="min-w-0 flex-1 truncate">
                <div className="text-xs font-bold text-foreground truncate flex items-center gap-1.5">
                  <span>{activeSessionSubuser ? activeSessionSubuser.name : "HP Company Admin"}</span>
                  {activeSessionSubuser && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#0089FF]/10 text-[#0089FF]">
                      Subuser
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {activeSessionSubuser ? activeSessionSubuser.email : userEmail}
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
                setSubuserSearch("");
                setActiveModal("subuser");
              }}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-muted/80 rounded-md transition-colors select-none"
            >
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Set Subuser</span>
              </div>
              <div className="flex items-center gap-1.5">
                {activeSessionSubuser && (
                  <span className="text-[9.5px] font-bold text-[#0089FF] bg-[#0089FF]/10 px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
                <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                  {HIERARCHICAL_SUBUSERS.length}
                </span>
              </div>
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
          maxWidth="max-w-3xl"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-3.5">
            {/* Top Tier Navigation Tabs: Admin | Reseller | Company */}
            <div className="border-b border-border/70 pb-0 select-none">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* 1. Admin Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedTierTab("admin")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-xs font-bold cursor-pointer transition-all border-b-2 -mb-px !rounded-none focus:outline-none",
                    selectedTierTab === "admin"
                      ? "border-[#0089FF] text-[#0089FF]"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                  )}
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                      selectedTierTab === "admin"
                        ? "bg-[#0089FF] text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {adminTabCount}
                  </span>
                </button>

                {/* 2. Reseller Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedTierTab("reseller")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-xs font-bold cursor-pointer transition-all border-b-2 -mb-px !rounded-none focus:outline-none",
                    selectedTierTab === "reseller"
                      ? "border-[#0089FF] text-[#0089FF]"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                  )}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Reseller</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                      selectedTierTab === "reseller"
                        ? "bg-[#0089FF] text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {resellerTabCount}
                  </span>
                </button>

                {/* 3. Company Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedTierTab("company")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-xs font-bold cursor-pointer transition-all border-b-2 -mb-px !rounded-none focus:outline-none",
                    selectedTierTab === "company"
                      ? "border-[#0089FF] text-[#0089FF]"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                  )}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Company</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                      selectedTierTab === "company"
                        ? "bg-[#0089FF] text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {companyTabCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Search & Actions Toolbar */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 flex-1 items-center gap-2 rounded-xl border border-input/80 bg-background px-3 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input
                  value={subuserSearch}
                  onChange={(e) => setSubuserSearch(e.target.value)}
                  placeholder={`Search ${selectedTierTab} hierarchy by subuser name, email, or account...`}
                  className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
                />
                {subuserSearch && (
                  <button
                    type="button"
                    onClick={() => setSubuserSearch("")}
                    className="rounded-full p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Expand / Collapse All Toggle Button */}
              <button
                type="button"
                onClick={handleToggleExpandAll}
                title={isAllCollapsed ? "Expand All Branches" : "Collapse All Branches"}
                className="h-9 px-3 rounded-xl border border-border/80 bg-card hover:bg-muted/80 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 font-medium"
              >
                <ChevronsUpDown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {isAllCollapsed ? "Expand All" : "Collapse All"}
                </span>
              </button>

              {/* Refresh / Reset button */}
              <button
                type="button"
                onClick={() => {
                  setSubuserSearch("");
                  setCollapsedAccountIds({});
                  toast.info("Subuser directory refreshed");
                }}
                title="Refresh subuser list"
                className="h-9 w-9 rounded-xl border border-border/80 bg-card hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Hierarchical Subusers Tree View */}
            <div className="rounded-xl border border-border/80 bg-card/60 p-2.5 shadow-2xs max-h-[380px] overflow-y-auto custom-scrollbar space-y-1.5">
              {filteredTree.map((node) => (
                <SubuserTreeItem
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedSubuserId={selectedSubuserId}
                  defaultSubuserId={defaultSubuserId}
                  activeSessionSubuserId={activeSessionSubuserId}
                  appliedViewSubuserId={appliedViewSubuserId}
                  collapsedAccountIds={collapsedAccountIds}
                  onToggleCollapse={handleToggleAccount}
                  onSelectSubuser={(id) => setSelectedSubuserId(id)}
                  onDoubleClickSubuser={(id) => {
                    setSelectedSubuserId(id);
                    handleLoginAsSubuser();
                  }}
                  searchActive={!!subuserSearch.trim()}
                />
              ))}

              {filteredTree.length === 0 && (
                <div className="p-8 text-center text-xs text-muted-foreground italic">
                  No accounts or subusers found matching &ldquo;{subuserSearch}&rdquo; in {selectedTierTab} tier
                </div>
              )}
            </div>

            {/* Footer Toolbar according to UX terminology & modal standard */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/70 mt-3 select-none">
              {/* Left: Dismiss / Exit Action */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="h-9 px-4 text-xs rounded-xl border border-border/80 bg-background hover:bg-muted text-foreground font-medium cursor-pointer transition-all active:scale-98 shadow-2xs"
                >
                  Cancel
                </button>

                {activeSessionSubuserId && (
                  <button
                    type="button"
                    onClick={handleClearImpersonation}
                    className="h-9 px-3 text-xs font-semibold rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-98"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Exit Subuser Session</span>
                  </button>
                )}
              </div>

              {/* Right: Positive Action CTAs grouped by hierarchy */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {/* 1. Default (Tertiary Action) */}
                <button
                  type="button"
                  onClick={handleSetAsDefault}
                  title="Make this subuser the default auto-login profile on every session"
                  disabled={!selectedSubuser}
                  className={cn(
                    "h-9 px-3.5 text-xs rounded-xl border font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98",
                    defaultSubuserId === selectedSubuser?.id
                      ? "border-amber-400 bg-amber-100/60 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                      : "border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100",
                    !selectedSubuser && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>
                    {defaultSubuserId === selectedSubuser?.id ? "Default Set" : "Default"}
                  </span>
                </button>

                {/* 2. Apply (View Data) (Secondary CTA) */}
                <button
                  type="button"
                  onClick={handleApplyViewData}
                  title="Scope and view data for this subuser without full credential session switch"
                  disabled={!selectedSubuser}
                  className={cn(
                    "h-9 px-3.5 text-xs rounded-xl border border-[#0089FF]/40 bg-sky-50 dark:bg-sky-950/40 text-[#0089FF] hover:bg-sky-100 font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98",
                    !selectedSubuser && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Apply (View Data)</span>
                </button>

                {/* 3. Login as Subuser (Primary CTA) */}
                <button
                  type="button"
                  onClick={handleLoginAsSubuser}
                  title="Login and switch session into this subuser account"
                  disabled={!selectedSubuser}
                  className={cn(
                    "h-9 px-4 text-xs rounded-xl bg-[#0089FF] hover:bg-[#0072D6] text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-98",
                    !selectedSubuser && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <LogIn className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Login as Subuser</span>
                </button>
              </div>
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
