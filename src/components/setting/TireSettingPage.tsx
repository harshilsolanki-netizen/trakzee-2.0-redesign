import React, { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  CircleGauge,
  Truck,
  Plus,
  RotateCcw,
  Download,
  Upload,
  Copy,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Trash2,
  Edit2,
  SlidersHorizontal,
  RefreshCw,
  FileText,
  Info,
  Star,
  Camera,
  Layers,
  Calendar,
  DollarSign,
  CheckCircle2,
  MoreVertical,
  FileSpreadsheet,
  Sparkles,
  Eye,
  Settings,
  Radio,
  Image as ImageIcon,
  Wrench,
  AlertTriangle,
  ArrowDownToLine,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectDropdown, type DropdownOption } from "@/components/ui/select-dropdown";
import { cn } from "@/lib/utils";
import { useLayoutMode } from "@/lib/useLayoutMode";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ColumnConfigModal,
  type ColumnConfigItem,
  type ReportColumnSettings,
} from "@/components/report/ColumnConfigModal";

/* =========================================================================
   Tire Data Model & Realistic Mock Dataset
   ========================================================================= */

export type TireCondition = "New" | "Good" | "Retreaded" | "Repaired" | "Re-grooved" | "Worn" | "Critical";
export type TireStatus = "Mounted" | "In Stock" | "In Retread" | "Scrapped";

export interface TireItem {
  id: string;
  branch: string;
  company: string;
  tireBrand: string;
  tireModel: string;
  tireSerialNo: string;
  rfidTag: string;
  manufactureDate: string;
  tireCondition: TireCondition;
  treadPattern: string;
  size: string;
  tireStatus: TireStatus;
  tireDepth: number;
  purchaseDate: string;
  price: string;
  tirePredictedDistance: string;
  imagesCount: number;
  loadIndex: string;
  plyRating?: string;
  mountedVehicle?: string;
  position?: string;
  notes?: string;
}

export type TireFilterState = {
  companies: string[];
  branches: string[];
  brands: string[];
  conditions: string[];
  statuses: string[];
  company: string;
  branch: string;
  brand: string;
  condition: string;
  status: string;
};

export const COMPANY_OPTIONS = [
  "HP Company",
  "ABC Logistic",
  "Agrawal Industries",
  "17 april test company 1",
  "Global Logistics Inc",
  "Fleet Cargo West",
  "FastTrack Mobility",
  "Prime Fleet Solutions",
];

export const BRANCH_OPTIONS = [
  "Central Branch",
  "North Terminal",
  "West Hub",
  "South Depot",
  "HP Branch 8",
  "HP EV Branch 2",
  "Agrawal Industries",
  "17 april test company",
];

export const TIRE_BRAND_OPTIONS = [
  "Michelin",
  "Bridgestone",
  "Goodyear",
  "Continental",
  "Pirelli",
  "Yokohama",
  "Hankook",
  "Advance GL 662A",
  "Apollo",
  "MRF",
];

export const TIRE_MODEL_OPTIONS = [
  "General",
  "X Multi D",
  "R268 Ecopia",
  "Endurance RSA",
  "Conti EcoPlus HD3",
  "FH:01 Energy",
  "BluEarth 711T",
  "SmartFlex AH35",
  "X Line Energy D",
  "Duravis R-Drive",
  "KMAX D GEN-2",
];

export const TIRE_CONDITION_OPTIONS = [
  "New",
  "Good",
  "Retreaded",
  "Repaired",
  "Re-grooved",
  "Worn",
  "Critical",
];

export const TIRE_STATUS_OPTIONS = [
  "Mounted",
  "In Stock",
  "In Retread",
  "Scrapped",
];

export const TIRE_SIZE_OPTIONS = [
  "295/80 R22.5",
  "315/80 R22.5",
  "315/70 R22.5",
  "11R22.5",
  "12R22.5",
  "275/70 R22.5",
  "385/65 R22.5",
  "385/55 R22.5",
];

export const TREAD_PATTERN_OPTIONS = [
  "--Select--",
  "Drive Lug",
  "Steer Rib",
  "All-Position",
  "Trailer Rib",
  "Off-Road Block",
  "Highway All-Season",
];

export const LOAD_INDEX_OPTIONS = [
  "--Select--",
  "152/148M",
  "154/150L",
  "156/150K",
  "148/145L",
  "144/142M",
  "140/137L",
  "138/135M",
];

export const DEFAULT_TIRE_FILTERS: TireFilterState = {
  companies: [...COMPANY_OPTIONS],
  branches: [...BRANCH_OPTIONS],
  brands: [...TIRE_BRAND_OPTIONS],
  conditions: [...TIRE_CONDITION_OPTIONS],
  statuses: [...TIRE_STATUS_OPTIONS],
  company: "All",
  branch: "All",
  brand: "All",
  condition: "All",
  status: "All",
};

export const INITIAL_TIRES: TireItem[] = [
  {
    id: "tire-1",
    company: "HP Company",
    branch: "Central Branch",
    tireBrand: "Michelin",
    tireModel: "X Multi D",
    tireSerialNo: "MCH-98214-X",
    rfidTag: "RF-881290",
    manufactureDate: "12/04/2024",
    tireCondition: "New",
    treadPattern: "Drive Lug",
    size: "295/80 R22.5",
    tireStatus: "Mounted",
    tireDepth: 16.5,
    purchaseDate: "15/01/2025",
    price: "$450.00",
    tirePredictedDistance: "180,000 km",
    imagesCount: 2,
    loadIndex: "152/148M",
    plyRating: "16PR",
    mountedVehicle: "HP Boom Barrier Object",
    position: "Front-Left (Axle 1)",
  },
  {
    id: "tire-2",
    company: "HP Company",
    branch: "Central Branch",
    tireBrand: "Bridgestone",
    tireModel: "R268 Ecopia",
    tireSerialNo: "BRD-77102-K",
    rfidTag: "RF-339102",
    manufactureDate: "05/08/2024",
    tireCondition: "Good",
    treadPattern: "Steer Rib",
    size: "315/80 R22.5",
    tireStatus: "Mounted",
    tireDepth: 13.8,
    purchaseDate: "20/02/2025",
    price: "$420.00",
    tirePredictedDistance: "160,000 km",
    imagesCount: 1,
    loadIndex: "154/150L",
    plyRating: "18PR",
    mountedVehicle: "HP EV Object 37",
    position: "Front-Right (Axle 1)",
  },
  {
    id: "tire-3",
    company: "HP Company",
    branch: "Central Branch",
    tireBrand: "Goodyear",
    tireModel: "Endurance RSA",
    tireSerialNo: "GY-55109-R",
    rfidTag: "RF-441920",
    manufactureDate: "18/02/2024",
    tireCondition: "Good",
    treadPattern: "All-Position",
    size: "11R22.5",
    tireStatus: "In Stock",
    tireDepth: 14.0,
    purchaseDate: "10/11/2024",
    price: "$390.00",
    tirePredictedDistance: "150,000 km",
    imagesCount: 1,
    loadIndex: "148/145L",
    plyRating: "16PR",
  },
  {
    id: "tire-4",
    company: "HP Company",
    branch: "Central Branch",
    tireBrand: "Continental",
    tireModel: "Conti EcoPlus HD3",
    tireSerialNo: "CNT-88291-B",
    rfidTag: "RF-552109",
    manufactureDate: "22/06/2024",
    tireCondition: "New",
    treadPattern: "Drive Lug",
    size: "315/70 R22.5",
    tireStatus: "Mounted",
    tireDepth: 18.0,
    purchaseDate: "05/03/2025",
    price: "$480.00",
    tirePredictedDistance: "200,000 km",
    imagesCount: 3,
    loadIndex: "156/150K",
    plyRating: "18PR",
    mountedVehicle: "HP Cargo Transporter 12",
    position: "Rear-Left Outer (Axle 2)",
  },
  {
    id: "tire-5",
    company: "Agrawal Industries",
    branch: "Central Branch",
    tireBrand: "Pirelli",
    tireModel: "FH:01 Energy",
    tireSerialNo: "PIR-66231-M",
    rfidTag: "RF-992381",
    manufactureDate: "10/01/2024",
    tireCondition: "Retreaded",
    treadPattern: "Steer Rib",
    size: "295/80 R22.5",
    tireStatus: "Mounted",
    tireDepth: 10.2,
    purchaseDate: "12/08/2024",
    price: "$280.00",
    tirePredictedDistance: "110,000 km",
    imagesCount: 1,
    loadIndex: "152/148M",
    plyRating: "16PR",
    mountedVehicle: "Delivery Van #04",
    position: "Steer-Right",
  },
  {
    id: "tire-6",
    company: "Agrawal Industries",
    branch: "North Terminal",
    tireBrand: "Yokohama",
    tireModel: "BluEarth 711T",
    tireSerialNo: "YOK-33190-Q",
    rfidTag: "RF-118274",
    manufactureDate: "14/05/2024",
    tireCondition: "Good",
    treadPattern: "Trailer Rib",
    size: "385/65 R22.5",
    tireStatus: "Mounted",
    tireDepth: 12.5,
    purchaseDate: "18/09/2024",
    price: "$360.00",
    tirePredictedDistance: "140,000 km",
    imagesCount: 2,
    loadIndex: "160J",
    plyRating: "20PR",
    mountedVehicle: "Semi Trailer #19",
    position: "Trailer-Axle 1 Left",
  },
  {
    id: "tire-7",
    company: "Agrawal Industries",
    branch: "West Hub",
    tireBrand: "Hankook",
    tireModel: "SmartFlex AH35",
    tireSerialNo: "HNK-44218-N",
    rfidTag: "RF-773412",
    manufactureDate: "28/03/2024",
    tireCondition: "Worn",
    treadPattern: "All-Position",
    size: "275/70 R22.5",
    tireStatus: "In Stock",
    tireDepth: 5.8,
    purchaseDate: "14/06/2024",
    price: "$340.00",
    tirePredictedDistance: "90,000 km",
    imagesCount: 1,
    loadIndex: "148/145M",
    plyRating: "16PR",
  },
  {
    id: "tire-8",
    company: "Agrawal Industries",
    branch: "West Hub",
    tireBrand: "Michelin",
    tireModel: "X Line Energy D",
    tireSerialNo: "MCH-11204-P",
    rfidTag: "RF-661902",
    manufactureDate: "02/09/2024",
    tireCondition: "New",
    treadPattern: "Drive Lug",
    size: "295/80 R22.5",
    tireStatus: "Mounted",
    tireDepth: 17.2,
    purchaseDate: "12/01/2025",
    price: "$465.00",
    tirePredictedDistance: "190,000 km",
    imagesCount: 2,
    loadIndex: "152/148M",
    plyRating: "16PR",
    mountedVehicle: "HP Heavy Hauler 09",
    position: "Drive-Axle 1 Left Inner",
  },
  {
    id: "tire-9",
    company: "17 april test company 1",
    branch: "South Depot",
    tireBrand: "Bridgestone",
    tireModel: "Duravis R-Drive",
    tireSerialNo: "BRD-99014-T",
    rfidTag: "RF-224150",
    manufactureDate: "15/10/2023",
    tireCondition: "Critical",
    treadPattern: "Drive Lug",
    size: "315/80 R22.5",
    tireStatus: "In Retread",
    tireDepth: 3.4,
    purchaseDate: "05/02/2024",
    price: "$410.00",
    tirePredictedDistance: "75,000 km",
    imagesCount: 2,
    loadIndex: "156/150K",
    plyRating: "18PR",
  },
  {
    id: "tire-10",
    company: "17 april test company 1",
    branch: "South Depot",
    tireBrand: "Goodyear",
    tireModel: "KMAX D GEN-2",
    tireSerialNo: "GY-88123-A",
    rfidTag: "RF-994120",
    manufactureDate: "04/07/2024",
    tireCondition: "Good",
    treadPattern: "Drive Lug",
    size: "295/80 R22.5",
    tireStatus: "Mounted",
    tireDepth: 11.6,
    purchaseDate: "10/10/2024",
    price: "$400.00",
    tirePredictedDistance: "145,000 km",
    imagesCount: 1,
    loadIndex: "152/148M",
    plyRating: "16PR",
    mountedVehicle: "Utility Truck #07",
    position: "Rear-Right (Axle 2)",
  },
];

const PAGE_SIZES = [10, 20, 50, 100];

/* =========================================================================
   MultiSelectFilterPopover (Identical component matching AlertSettingPage)
   ========================================================================= */
export function MultiSelectFilterPopover({
  label,
  title,
  placeholder,
  options,
  selected,
  onChange,
}: {
  label: string;
  title: string;
  placeholder: string;
  options: string[];
  selected: string[];
  onChange: (newSelected: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draftSelected, setDraftSelected] = useState<string[]>(selected);

  // Sync draft whenever popover opens
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftSelected([...selected]);
      setSearch("");
    }
    setOpen(nextOpen);
  };

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search]);

  const isAllSelected = options.length > 0 && draftSelected.length === options.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setDraftSelected([]);
    } else {
      setDraftSelected([...options]);
    }
  };

  const toggleOption = (opt: string) => {
    setDraftSelected((prev) =>
      prev.includes(opt) ? prev.filter((item) => item !== opt) : [...prev, opt]
    );
  };

  const handleClear = () => {
    setDraftSelected([]);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleApply = () => {
    onChange(draftSelected);
    setOpen(false);
  };

  // Determine trigger label text
  const displayLabel = useMemo(() => {
    if (selected.length === 0) return "None";
    if (selected.length === options.length) return "All";
    if (selected.length === 1) return selected[0];
    return `${selected[0]} +${selected.length - 1}`;
  }, [selected, options]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium shrink-0 cursor-pointer hover:opacity-80 transition-opacity select-none text-xs py-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800",
            open && "bg-slate-100 dark:bg-slate-800"
          )}
        >
          <span className="text-slate-500 dark:text-slate-400 font-normal">{label}:</span>
          <span className="text-slate-900 dark:text-white font-semibold inline-flex items-center gap-1">
            <span className="max-w-[130px] truncate">{displayLabel}</span>
            <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400 opacity-80 shrink-0" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-68 p-0 text-xs bg-popover/95 backdrop-blur-md border border-border/80 shadow-lg rounded-lg z-50 overflow-hidden select-none"
      >
        {/* Header with Title & Selected Badge & Search */}
        <div className="p-3 px-4 border-b border-border/70 space-y-2 bg-muted/20">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span>{title}</span>
            <span className="text-[10px] font-semibold text-[#0089FF] bg-[#0089FF]/10 px-2 py-0.5 rounded-full">
              {draftSelected.length} selected
            </span>
          </div>

          <div className="flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2.5 focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Select All Checkbox Row */}
        <div className="px-4 py-1.5 border-b border-border/60 flex items-center justify-between bg-muted/10">
          <label className="flex items-center gap-2 cursor-pointer select-none w-full text-xs font-semibold text-foreground">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer"
            />
            <span>Select All</span>
          </label>
        </div>

        {/* Options List */}
        <div className="max-h-52 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
          {filteredOptions.map((opt) => {
            const checked = draftSelected.includes(opt);
            return (
              <label
                key={opt}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm hover:bg-muted cursor-pointer transition-colors text-xs select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(opt)}
                  className="h-3.5 w-3.5 rounded border-input text-brand focus:ring-brand accent-[#0089FF] cursor-pointer shrink-0"
                />
                <span
                  className={cn(
                    "text-foreground font-medium",
                    checked && "font-semibold text-foreground"
                  )}
                >
                  {opt}
                </span>
              </label>
            );
          })}
          {filteredOptions.length === 0 && (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No matching options found
            </div>
          )}
        </div>

        {/* Footer with Clear, Cancel, Apply Buttons */}
        <div className="p-2.5 px-4 border-t border-border/70 flex items-center justify-between bg-muted/20">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
          >
            Clear
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs rounded-md border border-border/80 bg-background hover:bg-muted font-medium text-foreground cursor-pointer transition-all active:scale-98 shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 text-xs rounded-md bg-[#0089FF] text-white hover:bg-[#0070d6] cursor-pointer font-semibold shadow-xs transition-all active:scale-98"
            >
              Apply
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const DEFAULT_TIRE_COLUMNS: ColumnConfigItem[] = [
  { id: "company", label: "Company", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 0 },
  { id: "branch", label: "Branch", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 1 },
  { id: "tireBrand", label: "Tire Brand", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 2 },
  { id: "tireModel", label: "Tire Model", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 3 },
  { id: "tireSerialNo", label: "Tire Serial No", showable: true, printable: true, sortable: true, sortPriority: 1, sortDir: "asc", pinned: true, originalIndex: 4 },
  { id: "rfidTag", label: "RFID Tag", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 5 },
  { id: "manufactureDate", label: "Manufacture Date", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 6 },
  { id: "tireCondition", label: "Tire Condition", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 7 },
  { id: "treadPattern", label: "Tread Pattern", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 8 },
  { id: "size", label: "Size", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 9 },
  { id: "tireStatus", label: "Tire Status", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 10 },
  { id: "tireDepth", label: "Tire Depth", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "desc", numeric: true, originalIndex: 11 },
  { id: "purchaseDate", label: "Purchase Date", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "asc", originalIndex: 12 },
  { id: "price", label: "Price", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "desc", numeric: true, originalIndex: 13 },
  { id: "tirePredictedDistance", label: "Predicted Distance", showable: true, printable: true, sortable: true, sortPriority: null, sortDir: "desc", numeric: true, originalIndex: 14 },
];

function IconButton({
  label,
  onClick,
  disabled,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={label}
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "toolbar-icon-btn inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-800 disabled:cursor-not-allowed group",
              className,
            )}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function renderTireCell(colId: string, row: TireItem) {
  let condBadge = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
  if (row.tireCondition === "Good") {
    condBadge = "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800";
  } else if (row.tireCondition === "Retreaded" || row.tireCondition === "Repaired" || row.tireCondition === "Re-grooved") {
    condBadge = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
  } else if (row.tireCondition === "Worn") {
    condBadge = "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800";
  } else if (row.tireCondition === "Critical") {
    condBadge = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
  }

  let statusBadge = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
  if (row.tireStatus === "In Stock") {
    statusBadge = "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800";
  } else if (row.tireStatus === "In Retread") {
    statusBadge = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
  } else if (row.tireStatus === "Scrapped") {
    statusBadge = "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  }

  switch (colId) {
    case "company":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap text-foreground font-semibold">
          {row.company}
        </td>
      );
    case "branch":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap text-foreground">
          {row.branch}
        </td>
      );
    case "tireBrand":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-semibold text-foreground">
          {row.tireBrand}
        </td>
      );
    case "tireModel":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap text-muted-foreground font-normal">
          {row.tireModel}
        </td>
      );
    case "tireSerialNo":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-semibold text-[#0089FF] hover:underline cursor-pointer">
          {row.tireSerialNo}
        </td>
      );
    case "rfidTag":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.rfidTag}
        </td>
      );
    case "manufactureDate":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.manufactureDate}
        </td>
      );
    case "tireCondition":
      return (
        <td key={colId} className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-800 text-center">
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border", condBadge)}>
            {row.tireCondition}
          </span>
        </td>
      );
    case "treadPattern":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap text-foreground">
          {row.treadPattern}
        </td>
      );
    case "size":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-foreground font-medium">
          {row.size}
        </td>
      );
    case "tireStatus":
      return (
        <td key={colId} className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-800 text-center">
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border", statusBadge)}>
            {row.tireStatus}
          </span>
        </td>
      );
    case "tireDepth":
      return (
        <td key={colId} className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-800 text-right font-mono font-bold text-foreground">
          {row.tireDepth.toFixed(1)} mm
        </td>
      );
    case "purchaseDate":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.purchaseDate}
        </td>
      );
    case "price":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-semibold text-foreground">
          {row.price}
        </td>
      );
    case "tirePredictedDistance":
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
          {row.tirePredictedDistance}
        </td>
      );
    default:
      return (
        <td key={colId} className="py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-800 whitespace-nowrap text-foreground">
          {String((row as any)[colId] ?? "—")}
        </td>
      );
  }
}

const TIRE_SEARCH_FIELDS = [
  { id: "all", label: "All fields" },
  { id: "brand", label: "Tire Brand" },
  { id: "model", label: "Tire Model" },
  { id: "serial", label: "Serial No" },
  { id: "rfid", label: "RFID Tag" },
  { id: "size", label: "Size" },
  { id: "company", label: "Company" },
  { id: "branch", label: "Branch" },
  { id: "status", label: "Status" },
  { id: "condition", label: "Condition" },
];

export function TireSettingPage() {
  const { isSingle } = useLayoutMode();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as {
    category?: string;
    tab?: string;
  };

  // View Mode: "list" (Table) vs "form" (Add/Edit Screen) vs "upload" (Bulk Upload Screen)
  const [viewMode, setViewMode] = useState<"list" | "form" | "upload">("list");

  // Main data state
  const [tires, setTires] = useState<TireItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("trakzee_tires_v1");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_TIRES;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("trakzee_tires_v1", JSON.stringify(tires));
    }
  }, [tires]);

  // Filters & Search
  const [columnSettings, setColumnSettings] = useState<ReportColumnSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("trakzee_tire_columns_v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.columns?.length) return parsed;
        }
      } catch {}
    }
    return {
      columns: DEFAULT_TIRE_COLUMNS,
      frozenColumnsCount: 1,
      detailDownloadMode: "multiple",
      detailScreenSetting: "summary",
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("trakzee_tire_columns_v1", JSON.stringify(columnSettings));
    }
  }, [columnSettings]);

  const [columnModalOpen, setColumnModalOpen] = useState(false);

  const visibleColumns = useMemo(() => {
    return (columnSettings.columns || DEFAULT_TIRE_COLUMNS).filter((c) => c.showable);
  }, [columnSettings.columns]);

  const [activeFilters, setActiveFilters] = useState<TireFilterState>(DEFAULT_TIRE_FILTERS);
  const [searchField, setSearchField] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Pagination
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Editing state & supporting modals
  const [editingTire, setEditingTire] = useState<TireItem | null>(null);

  const activeDrawerFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.companies.length < COMPANY_OPTIONS.length) count++;
    if (activeFilters.branches.length < BRANCH_OPTIONS.length) count++;
    if (activeFilters.brands.length < TIRE_BRAND_OPTIONS.length) count++;
    if (activeFilters.conditions.length < TIRE_CONDITION_OPTIONS.length) count++;
    if (activeFilters.statuses.length < TIRE_STATUS_OPTIONS.length) count++;
    return count;
  }, [activeFilters]);

  // Filter Logic
  const filteredTires = useMemo(() => {
    let list = tires;

    // Multi-select Company Filter
    if (activeFilters.companies.length < COMPANY_OPTIONS.length) {
      if (activeFilters.companies.length === 0) return [];
      const compSet = new Set(activeFilters.companies.map((c) => c.toLowerCase()));
      list = list.filter((item) => compSet.has(item.company.toLowerCase()));
    }

    // Multi-select Branch Filter
    if (activeFilters.branches.length < BRANCH_OPTIONS.length) {
      if (activeFilters.branches.length === 0) return [];
      const branchSet = new Set(activeFilters.branches.map((b) => b.toLowerCase()));
      list = list.filter((item) => branchSet.has(item.branch.toLowerCase()));
    }

    // Multi-select Brand Filter
    if (activeFilters.brands.length < TIRE_BRAND_OPTIONS.length) {
      if (activeFilters.brands.length === 0) return [];
      const brandSet = new Set(activeFilters.brands.map((b) => b.toLowerCase()));
      list = list.filter((item) => brandSet.has(item.tireBrand.toLowerCase()));
    }

    // Multi-select Condition Filter
    if (activeFilters.conditions.length < TIRE_CONDITION_OPTIONS.length) {
      if (activeFilters.conditions.length === 0) return [];
      const condSet = new Set(activeFilters.conditions.map((c) => c.toLowerCase()));
      list = list.filter((item) => condSet.has(item.tireCondition.toLowerCase()));
    }

    // Search Query
    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter((t) => {
      if (searchField === "brand") return t.tireBrand.toLowerCase().includes(q);
      if (searchField === "model") return t.tireModel.toLowerCase().includes(q);
      if (searchField === "serial") return t.tireSerialNo.toLowerCase().includes(q);
      if (searchField === "rfid") return t.rfidTag.toLowerCase().includes(q);
      if (searchField === "size") return t.size.toLowerCase().includes(q);
      if (searchField === "company") return t.company.toLowerCase().includes(q);
      if (searchField === "branch") return t.branch.toLowerCase().includes(q);
      if (searchField === "status") return t.tireStatus.toLowerCase().includes(q);
      if (searchField === "condition") return t.tireCondition.toLowerCase().includes(q);

      return (
        t.tireSerialNo.toLowerCase().includes(q) ||
        t.tireBrand.toLowerCase().includes(q) ||
        t.tireModel.toLowerCase().includes(q) ||
        t.company.toLowerCase().includes(q) ||
        t.branch.toLowerCase().includes(q) ||
        t.size.toLowerCase().includes(q) ||
        t.rfidTag.toLowerCase().includes(q)
      );
    });
  }, [tires, activeFilters, searchField, searchQuery]);

  // Paginated Slicing
  const totalPages = Math.max(1, Math.ceil(filteredTires.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTires.slice(start, start + pageSize);
  }, [filteredTires, currentPage, pageSize]);

  const firstRecord = filteredTires.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastRecord = Math.min(currentPage * pageSize, filteredTires.length);

  const openCreateForm = () => {
    setEditingTire(null);
    setViewMode("form");
  };

  const openEditForm = (item: TireItem) => {
    setEditingTire(item);
    setViewMode("form");
  };

  const openUploadView = () => {
    setViewMode("upload");
  };

  const handleSaveTireItem = (saved: TireItem) => {
    if (editingTire) {
      setTires((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
      toast.success(`Tire asset "${saved.tireSerialNo}" updated successfully`);
    } else {
      setTires((prev) => [saved, ...prev]);
      toast.success(`Tire asset "${saved.tireSerialNo}" created successfully`);
    }
    setViewMode("list");
  };

  const handleImportUploadedTires = (newTires: TireItem[]) => {
    setTires((prev) => [...newTires, ...prev]);
    setViewMode("list");
  };

  const handleCloneTire = (item: TireItem) => {
    const cloned: TireItem = {
      ...item,
      id: `tire-${Date.now()}`,
      tireSerialNo: `${item.tireSerialNo}-COPY`,
      rfidTag: `RF-${Math.floor(100000 + Math.random() * 900000)}`,
      tireStatus: "In Stock",
      mountedVehicle: "",
      position: "",
    };
    setTires((prev) => [cloned, ...prev]);
    toast.success(`Cloned tire serial: ${cloned.tireSerialNo}`);
  };

  const handleDeleteTire = (id: string) => {
    const item = tires.find((t) => t.id === id);
    if (!item) return;
    if (window.confirm(`Are you sure you want to delete tire "${item.tireSerialNo}"?`)) {
      setTires((prev) => prev.filter((t) => t.id !== id));
      toast.success(`Tire "${item.tireSerialNo}" deleted`);
    }
  };

  const handleResetTable = () => {
    setSearchQuery("");
    setSearchField("all");
    setActiveFilters(DEFAULT_TIRE_FILTERS);
    setCurrentPage(1);
    toast.success("Table filters and search reset");
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F0F0F0] dark:bg-slate-950 p-[10px]">
      <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-[#DFE3EB]/80 dark:border-slate-800 shadow-2xs">
      {/* 1. Top Header Strip (Tabbed vs Single Screen Mode) */}
      {!isSingle ? (
        <div className="relative flex items-end justify-between h-[45px] pt-[10px] px-0 select-none shrink-0 bg-[#F1F5F9] dark:bg-slate-950 rounded-tl-lg">
        {/* Baseline border that runs across the entire strip under inactive tabs */}
        <div className="absolute left-0 right-0 bottom-0 h-px bg-[#DFE3EB] dark:bg-slate-800 z-0" />

        {/* Tab bar list */}
        <div className="relative z-10 flex min-w-0 flex-1 items-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-full pl-[10px]">
          <div
            className="group relative flex shrink-0 cursor-pointer items-center gap-2 text-xs transition-all duration-150 select-none h-[35px] px-4 rounded-t-lg bg-white dark:bg-slate-900 border-t border-l border-r border-[#DFE3EB] dark:border-slate-800 text-slate-800 dark:text-white font-semibold mb-[-1px] z-20 shadow-2xs"
          >
            {/* Left Inverted Concave Fillet for Active Tab (curving into baseline) */}
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

            {/* Right Inverted Concave Fillet for Active Tab (curving into baseline) */}
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

            {/* Star Favorite Icon in List Mode / Back Button in Form or Upload Mode */}
            {viewMode !== "list" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode("list");
                }}
                className="p-0.5 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Back to Tire List"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
                className="p-0.5 rounded transition-colors cursor-pointer shrink-0 text-slate-400 hover:text-amber-400"
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Star
                  className={cn(
                    "h-3.5 w-3.5 transition-colors",
                    isFavorite ? "fill-amber-400 text-amber-400" : ""
                  )}
                />
              </button>
            )}

            {/* Tab Title */}
            <span className="truncate max-w-[180px] whitespace-nowrap text-xs">
              {viewMode === "form"
                ? editingTire
                  ? "Edit Tire"
                  : "Add Tire"
                : viewMode === "upload"
                ? "Tire Upload"
                : "Tire"}
            </span>
          </div>
        </div>
      </div>
      ) : (
        /* SINGLE SCREEN TITLE */
        <div className="relative z-20 flex items-center justify-between px-5 pt-5 pb-2.5 select-none shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            {viewMode === "form" || viewMode === "upload" ? (
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="p-1 -ml-1 rounded text-slate-700 dark:text-slate-200 hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Back to Tire List"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-1 -ml-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Star
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-400 stroke-[2]"
                  )}
                />
              </button>
            )}
            <h1 className="text-[24px] font-medium text-slate-900 dark:text-white tracking-tight">
              {viewMode === "form" ? (editingTire ? `Edit: ${editingTire.serialNo}` : "Add Tire") : viewMode === "upload" ? "Tire Upload" : "Tire"}
            </h1>
          </div>
        </div>
      )}

      {viewMode === "list" ? (
        <>
          {/* 2. Top Single-Row Filter & Utilities Toolbar (Identical Structure to Alert Screen) */}
          <div className="relative z-20 flex min-h-[42px] items-center justify-between gap-3 bg-white dark:bg-slate-900 px-5 pb-3.5 shrink-0 select-none">
            {/* Left: Multi-select Filter Pills */}
            <div className="flex items-center min-w-0 flex-1 overflow-x-auto scrollbar-none gap-3 text-xs select-none">
              {/* Company Filter Pill */}
              <MultiSelectFilterPopover
                label="Company"
                title="Select Company"
                placeholder="Search company..."
                options={COMPANY_OPTIONS}
                selected={activeFilters.companies}
                onChange={(companies) => {
                  setActiveFilters((prev) => ({ ...prev, companies }));
                  setCurrentPage(1);
                }}
              />

              {/* Divider 1 */}
              <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

              {/* Branch Filter Pill */}
              <MultiSelectFilterPopover
                label="Branch"
                title="Select Branch"
                placeholder="Search branch..."
                options={BRANCH_OPTIONS}
                selected={activeFilters.branches}
                onChange={(branches) => {
                  setActiveFilters((prev) => ({ ...prev, branches }));
                  setCurrentPage(1);
                }}
              />

              {/* Divider 2 */}
              <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

              {/* Tire Brand Filter Pill */}
              <MultiSelectFilterPopover
                label="Tire Brand"
                title="Select Tire Brand"
                placeholder="Search brand..."
                options={TIRE_BRAND_OPTIONS}
                selected={activeFilters.brands}
                onChange={(brands) => {
                  setActiveFilters((prev) => ({ ...prev, brands }));
                  setCurrentPage(1);
                }}
              />

              {/* Divider 3 */}
              <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

              {/* Condition Filter Pill */}
              <MultiSelectFilterPopover
                label="Condition"
                title="Select Tire Condition"
                placeholder="Search condition..."
                options={TIRE_CONDITION_OPTIONS}
                selected={activeFilters.conditions}
                onChange={(conditions) => {
                  setActiveFilters((prev) => ({ ...prev, conditions }));
                  setCurrentPage(1);
                }}
              />

              {/* Divider 4 */}
              <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

              {/* Filter Button (Matching Alert & Vehicle Screen) */}
              <button
                type="button"
                onClick={() => setFilterDrawerOpen((prev) => !prev)}
                aria-label="Open Filter Drawer"
                className="inline-flex h-7 items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer select-none shadow-2xs active:scale-98 shrink-0"
              >
                <SlidersHorizontal className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Filter</span>
                {activeDrawerFilterCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold leading-tight bg-[#0089FF] text-white">
                    {activeDrawerFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Right Toolbar: Search & + Tire */}
            <div className="flex items-center gap-2 ml-auto shrink-0 select-none">
              {/* Field Search */}
              <div className="relative flex h-7.5 items-center rounded-md border border-border/80 bg-background shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all overflow-hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      title="Select specific column to search"
                      className="flex h-full items-center gap-1 border-r border-border/60 bg-muted/30 px-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 select-none"
                    >
                      <span className="max-w-[76px] truncate">
                        {searchField === "all" ? "All fields" : selectedSearchFieldLabel}
                      </span>
                      <ChevronDown className="h-3 w-3 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="max-h-64 w-52 overflow-y-auto text-xs p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg z-50 select-none"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        setSearchField("all");
                        setCurrentPage(1);
                      }}
                      className={cn(
                        "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                        searchField === "all"
                          ? "bg-muted font-semibold text-foreground"
                          : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                      )}
                    >
                      <span>All fields</span>
                      {searchField === "all" && (
                        <Check className="h-3.5 w-3.5 text-[#0089FF]" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 -mx-1" />
                    {TIRE_SEARCH_FIELDS.filter((f) => f.id !== "all").map((f) => {
                      const isSelected = searchField === f.id;
                      return (
                        <DropdownMenuItem
                          key={f.id}
                          onClick={() => {
                            setSearchField(f.id);
                            setCurrentPage(1);
                          }}
                          className={cn(
                            "cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors select-none",
                            isSelected
                              ? "bg-muted font-semibold text-foreground"
                              : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                          )}
                        >
                          <span className="truncate">{f.label}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Search className="ml-2.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search in all fields..."
                  className="h-full w-32 sm:w-44 bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="mr-1.5 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Primary Action Button: + Tire */}
              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex h-7.5 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-3.5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tire</span>
              </button>

              <IconButton
                label="Column Settings"
                onClick={() => setColumnModalOpen(true)}
              >
                <Settings className="h-[18px] w-[18px] text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white stroke-[2.2] transition-colors" />
              </IconButton>
            </div>
          </div>

          {/* Horizontal divider with 20px space from left and right */}
          <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0 relative z-20 bg-white dark:bg-slate-900" />

          {/* Table & Inline Filter Area */}
          <div className="relative min-h-0 flex-1 flex overflow-hidden bg-white dark:bg-slate-900">
            {/* Table Scroll Area */}
            <div className="relative min-h-0 flex-1 overflow-auto overscroll-contain scroll-smooth pt-1 mx-5">
              <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10 shadow-xs">
                    <tr className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold tracking-wider text-[11px] uppercase border-b border-[#DFE3EB] dark:border-slate-700 select-none whitespace-nowrap h-[38px]">
                      <th className="py-2.5 px-3 text-center w-10 bg-white dark:bg-slate-900 border-r border-[#DFE3EB] dark:border-slate-700">
                        #
                      </th>
                      {visibleColumns.map((col) => {
                        const isRightAligned = col.id === "tireDepth" || col.id === "price" || col.numeric;
                        const isCenterAligned = col.id === "tireCondition" || col.id === "tireStatus";
                        return (
                          <th
                            key={col.id}
                            className={cn(
                              "py-2.5 px-3.5 border-r border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900",
                              isRightAligned && "text-right",
                              isCenterAligned && "text-center",
                              col.pinned && "bg-slate-50/80 dark:bg-slate-800/80",
                            )}
                          >
                            {col.label}
                          </th>
                        );
                      })}
                      <th className="py-2.5 px-3 text-center w-24 sticky right-0 bg-white dark:bg-slate-900 shadow-l">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFE3EB] dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                    {pageRows.map((row, idx) => {
                      const rowNum = (currentPage - 1) * pageSize + idx + 1;
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <td className="py-2.5 px-3 border-r border-[#DFE3EB] dark:border-slate-800 text-center font-semibold text-muted-foreground">
                            {rowNum}
                          </td>
                          {visibleColumns.map((col) => renderTireCell(col.id, row))}
                          <td className="py-2.5 px-3 text-center sticky right-0 bg-white dark:bg-slate-900 shadow-l">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditForm(row)}
                                className="p-1 rounded text-muted-foreground hover:text-[#0089FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Edit Tire"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCloneTire(row)}
                                className="p-1 rounded text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
                                title="Clone Tire Asset"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTire(row.id)}
                                className="p-1 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                title="Delete Tire Asset"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {pageRows.length === 0 && (
                      <tr>
                        <td colSpan={visibleColumns.length + 2} className="py-14 text-center text-xs text-muted-foreground">
                          No tire assets found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>

            {/* Inline Right-Side Filter Panel */}
            <TireFilterDrawer
              open={filterDrawerOpen}
              onClose={() => setFilterDrawerOpen(false)}
              filters={activeFilters}
              onApply={(nextFilters) => {
                setActiveFilters(nextFilters);
                setCurrentPage(1);
              }}
              onReset={() => {
                setActiveFilters(DEFAULT_TIRE_FILTERS);
                setCurrentPage(1);
              }}
              allTires={tires}
            />
          </div>

          {/* Horizontal divider with 20px space from left and right */}
          <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

          {/* Standard Application Bottom Frame with Centered HubSpot-Style Pagination & Operations */}
          <footer className="flex h-11 items-center justify-between px-5 bg-white dark:bg-slate-900 shrink-0 select-none">
            {/* Left: Total records */}
            <div className="flex items-center min-w-[140px]">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums select-none">
                {filteredTires.length.toLocaleString()} records
              </span>
            </div>

            {/* Center: Pagination */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Prev */}
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors px-1.5 py-1 rounded"
              >
                <ChevronLeft className="h-3.5 w-3.5 stroke-[2.2]" />
                <span>Prev</span>
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-0.5 sm:gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === currentPage;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={cn(
                        "h-6 min-w-[24px] px-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center",
                        isActive
                          ? "border border-slate-400 dark:border-slate-500 bg-transparent text-slate-900 dark:text-white font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Next */}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors px-1.5 py-1 rounded"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>

              {/* Page Size Selector */}
              <div className="ml-1 sm:ml-2">
                <Popover open={pageSizeOpen} onOpenChange={setPageSizeOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer select-none transition-colors px-1.5 py-1 rounded bg-transparent border-0 hover:bg-slate-100 dark:hover:bg-slate-800",
                        pageSizeOpen && "bg-slate-100 dark:bg-slate-800 text-black dark:text-white",
                      )}
                    >
                      <span>{pageSize} per page</span>
                      <ChevronDown className={cn("h-3 w-3 opacity-60 transition-transform", pageSizeOpen && "rotate-180")} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="center" sideOffset={6} className="w-32 p-1 rounded-lg border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg select-none z-50">
                    {PAGE_SIZES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setPageSize(s);
                          setCurrentPage(1);
                          setPageSizeOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-colors text-left select-none",
                          pageSize === s ? "bg-muted font-semibold text-foreground" : "text-foreground hover:bg-muted/80 hover:text-foreground font-medium",
                        )}
                      >
                        <span>{s} per page</span>
                        {pageSize === s && <Check className="h-3.5 w-3.5 text-[#0089FF]" />}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Right: Other Operations */}
            <div className="flex items-center gap-2 min-w-[140px] justify-end">
              {/* Reset Table (Circular Icon Only) */}
              <button
                type="button"
                onClick={handleResetTable}
                className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-full border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer active:scale-95"
                title="Reset Table"
              >
                <RotateCcw className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>

              {/* Bulk Upload Tire Screen (Circular Icon Only) */}
              <button
                type="button"
                onClick={openUploadView}
                className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-full border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer active:scale-95"
                title="Upload Tire Excel"
              >
                <Upload className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>

              {/* Download XLS (Label and Icon) */}
              <button
                type="button"
                onClick={() => toast.success("Exported Tire Inventory as XLS")}
                className="inline-flex h-7.5 items-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all cursor-pointer active:scale-98"
                title="Download Excel XLS"
              >
                <Download className="h-3.5 w-3.5 stroke-[2.2]" />
                <span>Download</span>
              </button>
            </div>
          </footer>
        </>
      ) : viewMode === "form" ? (
        /* In-Screen Add / Edit Tire Form View */
        <TireDetailFormView
          tire={editingTire}
          onSave={handleSaveTireItem}
          onCancel={() => setViewMode("list")}
        />
      ) : (
        /* In-Screen Tire Upload Form View */
        <TireUploadFormView
          onUploadSuccess={handleImportUploadedTires}
          onCancel={() => setViewMode("list")}
        />
      )}
      </div>

      {/* Column Settings Modal */}
      <ColumnConfigModal
        open={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        settings={columnSettings}
        onSave={(newSettings) => {
          setColumnSettings(newSettings);
          try {
            localStorage.setItem("trakzee_tire_columns_v1", JSON.stringify(newSettings));
          } catch {}
          setColumnModalOpen(false);
          toast.success("Column settings updated");
        }}
        hideDetailTab={true}
        hidePreferenceTab={true}
        hideTabs={true}
        defaultColumns={DEFAULT_TIRE_COLUMNS}
        title="Column Setting"
      />

      
    </div>
  );
}

/* =========================================================================
   Tire Filter Drawer (Right Side Panel matching Alert Screen Filter Panel)
   ========================================================================= */
export function TireFilterDrawer({
  open,
  onClose,
  filters,
  onApply,
  onReset,
  allTires,
}: {
  open: boolean;
  onClose: () => void;
  filters: TireFilterState;
  onApply: (nextFilters: TireFilterState) => void;
  onReset: () => void;
  allTires: TireItem[];
}) {
  const [draftCompany, setDraftCompany] = useState(
    filters.companies.length === 1
      ? filters.companies[0]
      : filters.companies.length === COMPANY_OPTIONS.length
      ? "All"
      : filters.company || "All"
  );
  const [draftBranch, setDraftBranch] = useState(
    filters.branches.length === 1
      ? filters.branches[0]
      : filters.branches.length === BRANCH_OPTIONS.length
      ? "All"
      : filters.branch || "All"
  );
  const [draftBrand, setDraftBrand] = useState(
    filters.brands.length === 1
      ? filters.brands[0]
      : filters.brands.length === TIRE_BRAND_OPTIONS.length
      ? "All"
      : filters.brand || "All"
  );
  const [draftCondition, setDraftCondition] = useState(
    filters.conditions.length === 1
      ? filters.conditions[0]
      : filters.conditions.length === TIRE_CONDITION_OPTIONS.length
      ? "All"
      : filters.condition || "All"
  );

  useEffect(() => {
    if (open) {
      setDraftCompany(
        filters.companies.length === 1
          ? filters.companies[0]
          : filters.companies.length === COMPANY_OPTIONS.length
          ? "All"
          : filters.company || "All"
      );
      setDraftBranch(
        filters.branches.length === 1
          ? filters.branches[0]
          : filters.branches.length === BRANCH_OPTIONS.length
          ? "All"
          : filters.branch || "All"
      );
      setDraftBrand(
        filters.brands.length === 1
          ? filters.brands[0]
          : filters.brands.length === TIRE_BRAND_OPTIONS.length
          ? "All"
          : filters.brand || "All"
      );
      setDraftCondition(
        filters.conditions.length === 1
          ? filters.conditions[0]
          : filters.conditions.length === TIRE_CONDITION_OPTIONS.length
          ? "All"
          : filters.condition || "All"
      );
    }
  }, [open, filters]);

  const companyOptions = useMemo(() => ["All", ...COMPANY_OPTIONS], []);
  const branchOptions = useMemo(() => ["All", ...BRANCH_OPTIONS], []);
  const brandOptions = useMemo(() => ["All", ...TIRE_BRAND_OPTIONS], []);
  const conditionOptions = useMemo(() => ["All", ...TIRE_CONDITION_OPTIONS], []);

  const handleDrawerApply = () => {
    onApply({
      company: draftCompany,
      branch: draftBranch,
      brand: draftBrand,
      condition: draftCondition,
      status: "All",
      companies: draftCompany === "All" ? [...COMPANY_OPTIONS] : [draftCompany],
      branches: draftBranch === "All" ? [...BRANCH_OPTIONS] : [draftBranch],
      brands: draftBrand === "All" ? [...TIRE_BRAND_OPTIONS] : [draftBrand],
      conditions: draftCondition === "All" ? [...TIRE_CONDITION_OPTIONS] : [draftCondition],
      statuses: [...TIRE_STATUS_OPTIONS],
    });
    onClose();
    toast.success("Filters applied successfully");
  };

  const handleDrawerReset = () => {
    setDraftCompany("All");
    setDraftBranch("All");
    setDraftBrand("All");
    setDraftCondition("All");
    onReset();
    onClose();
    toast.info("Filters reset to default");
  };

  if (!open) return null;

  return (
    <aside className="w-[320px] xl:w-[350px] shrink-0 border-l border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full z-10 select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <header className="flex h-11 items-center justify-between border-b border-[#DFE3EB] dark:border-slate-800 px-4 bg-white dark:bg-slate-900 select-none shrink-0">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
          Filter Options
        </h2>
        <button
          type="button"
          aria-label="Close filter"
          onClick={onClose}
          className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
        {/* 1. Company */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Company <span className="text-slate-400 font-normal">:</span>
          </label>
          <SelectDropdown
            value={draftCompany}
            options={companyOptions}
            onChange={(val) => {
              setDraftCompany(val);
              setDraftBranch("All");
            }}
            placeholder="Select Company"
          />
        </div>

        {/* 2. Branch */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Branch <span className="text-slate-400 font-normal">:</span>
          </label>
          <SelectDropdown
            value={draftBranch}
            options={branchOptions}
            onChange={setDraftBranch}
            placeholder="Select Branch"
          />
        </div>

        {/* 3. Tire Brand */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Tire Brand <span className="text-slate-400 font-normal">:</span>
          </label>
          <SelectDropdown
            value={draftBrand}
            options={brandOptions}
            onChange={setDraftBrand}
            placeholder="Select Tire Brand"
          />
        </div>

        {/* 4. Tire Condition */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Tire Condition <span className="text-slate-400 font-normal">:</span>
          </label>
          <SelectDropdown
            value={draftCondition}
            options={conditionOptions}
            onChange={setDraftCondition}
            placeholder="Select Tire Condition"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="flex h-12 items-center justify-between border-t border-[#DFE3EB] dark:border-slate-800 px-4 bg-white dark:bg-slate-900 select-none shrink-0">
        <button
          type="button"
          onClick={handleDrawerReset}
          className="h-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleDrawerApply}
          className="h-8 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs active:scale-98"
        >
          Apply
        </button>
      </footer>
    </aside>
  );
}

/* =========================================================================
   In-Screen Add / Edit Tire Detail Form View
   ========================================================================= */
export function TireDetailFormView({
  tire,
  onSave,
  onCancel,
}: {
  tire: TireItem | null;
  onSave: (saved: TireItem) => void;
  onCancel: () => void;
}) {
  const isEdit = Boolean(tire);

  // Form states with initial values matching reference media_1789705587171.png
  const [company, setCompany] = useState(tire?.company || "HP Company");
  const [branch, setBranch] = useState(tire?.branch || "Central Branch");
  const [tireBrand, setTireBrand] = useState(tire?.tireBrand || "Michelin");
  const [tireModel, setTireModel] = useState(tire?.tireModel || "General");
  const [tireSerialNo, setTireSerialNo] = useState(tire?.tireSerialNo || "");
  const [rfidTag, setRfidTag] = useState(tire?.rfidTag || "");
  const [manufactureDate, setManufactureDate] = useState(tire?.manufactureDate || "");
  const [size, setSize] = useState(tire?.size || "295/80 R22.5");
  const [treadPattern, setTreadPattern] = useState(tire?.treadPattern || "--Select--");
  const [purchaseDate, setPurchaseDate] = useState(tire?.purchaseDate || "");
  const [price, setPrice] = useState(tire?.price ? tire.price.replace(/[$,]/g, "") : "0");
  const [tireDepth, setTireDepth] = useState(tire?.tireDepth !== undefined ? String(tire.tireDepth) : "16.0");
  const [tirePredictedDistance, setTirePredictedDistance] = useState(
    tire?.tirePredictedDistance ? tire.tirePredictedDistance.replace(/[^0-9]/g, "") : "150000"
  );
  const [tireCondition, setTireCondition] = useState<TireCondition>(tire?.tireCondition || "New");
  const [loadIndex, setLoadIndex] = useState(tire?.loadIndex || "--Select--");
  const [plyRating, setPlyRating] = useState(tire?.plyRating || "");
  const [imageFileName, setImageFileName] = useState<string>(tire ? "tire_photo.jpg" : "");

  useEffect(() => {
    if (tire) {
      setCompany(tire.company);
      setBranch(tire.branch);
      setTireBrand(tire.tireBrand);
      setTireModel(tire.tireModel);
      setTireSerialNo(tire.tireSerialNo);
      setRfidTag(tire.rfidTag);
      setManufactureDate(tire.manufactureDate);
      setSize(tire.size);
      setTreadPattern(tire.treadPattern);
      setPurchaseDate(tire.purchaseDate);
      setPrice(tire.price ? tire.price.replace(/[$,]/g, "") : "0");
      setTireDepth(String(tire.tireDepth));
      setTirePredictedDistance(tire.tirePredictedDistance ? tire.tirePredictedDistance.replace(/[^0-9]/g, "") : "150000");
      setTireCondition(tire.tireCondition);
      setLoadIndex(tire.loadIndex);
      setPlyRating(tire.plyRating || "");
      setImageFileName("tire_photo.jpg");
    }
  }, [tire]);

  const handleReset = () => {
    if (tire) {
      setCompany(tire.company);
      setBranch(tire.branch);
      setTireBrand(tire.tireBrand);
      setTireModel(tire.tireModel);
      setTireSerialNo(tire.tireSerialNo);
      setRfidTag(tire.rfidTag);
      setManufactureDate(tire.manufactureDate);
      setSize(tire.size);
      setTreadPattern(tire.treadPattern);
      setPurchaseDate(tire.purchaseDate);
      setPrice(tire.price ? tire.price.replace(/[$,]/g, "") : "0");
      setTireDepth(String(tire.tireDepth));
      setTirePredictedDistance(tire.tirePredictedDistance ? tire.tirePredictedDistance.replace(/[^0-9]/g, "") : "150000");
      setTireCondition(tire.tireCondition);
      setLoadIndex(tire.loadIndex);
      setPlyRating(tire.plyRating || "");
      setImageFileName("tire_photo.jpg");
    } else {
      setCompany("HP Company");
      setBranch("Central Branch");
      setTireBrand("Michelin");
      setTireModel("General");
      setTireSerialNo("");
      setRfidTag("");
      setManufactureDate("");
      setSize("295/80 R22.5");
      setTreadPattern("--Select--");
      setPurchaseDate("");
      setPrice("0");
      setTireDepth("16.0");
      setTirePredictedDistance("150000");
      setTireCondition("New");
      setLoadIndex("--Select--");
      setPlyRating("");
      setImageFileName("");
    }
    toast.info("Form fields reset to default");
  };

  const handleSave = () => {
    if (!tireSerialNo.trim()) {
      toast.error("Please enter Tire Serial No");
      return;
    }
    if (!size.trim()) {
      toast.error("Please enter or select Size");
      return;
    }

    const payload: TireItem = {
      id: tire ? tire.id : `tire-${Date.now()}`,
      company,
      branch,
      tireBrand,
      tireModel: tireModel || "General",
      tireSerialNo: tireSerialNo.trim(),
      rfidTag: rfidTag.trim() || `RF-${Math.floor(100000 + Math.random() * 900000)}`,
      manufactureDate: manufactureDate || "01/01/2025",
      tireCondition,
      treadPattern: treadPattern === "--Select--" ? "Drive Lug" : treadPattern,
      size: size.trim(),
      tireStatus: tire?.tireStatus || "In Stock",
      tireDepth: parseFloat(tireDepth) || 15.0,
      purchaseDate: purchaseDate || "01/01/2025",
      price: `$${parseFloat(price) || 0}.00`,
      tirePredictedDistance: `${Number(tirePredictedDistance).toLocaleString()} km`,
      imagesCount: imageFileName ? 1 : (tire?.imagesCount || 1),
      loadIndex: loadIndex === "--Select--" ? "152/148M" : loadIndex,
      plyRating: plyRating.trim() || undefined,
      mountedVehicle: tire?.mountedVehicle || "",
      position: tire?.position || "",
      notes: tire?.notes || "",
    };

    onSave(payload);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-900">
      {/* Scrollable Form Body with Field-Beside-Value horizontal layout */}
      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-3.5 custom-scrollbar text-xs">
        
        {/* 1. Company */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Company <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={company}
              options={COMPANY_OPTIONS}
              onChange={setCompany}
              placeholder="Select Company"
            />
          </div>
        </div>

        {/* 2. Branch */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Branch <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={branch}
              options={BRANCH_OPTIONS}
              onChange={setBranch}
              placeholder="Select Branch"
            />
          </div>
        </div>

        {/* 3. Tire Brand */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Tire Brand <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={tireBrand}
              options={TIRE_BRAND_OPTIONS}
              onChange={setTireBrand}
              placeholder="Select Tire Brand"
            />
          </div>
        </div>

        {/* 4. Tire Model */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Tire Model
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={tireModel}
              options={TIRE_MODEL_OPTIONS}
              onChange={setTireModel}
              placeholder="Select Tire Model"
            />
          </div>
        </div>

        {/* 5. Tire Serial No */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Tire Serial No <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <input
              type="text"
              value={tireSerialNo}
              onChange={(e) => setTireSerialNo(e.target.value)}
              placeholder="e.g. MCH-98214-X"
              className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs transition-all focus:border-[#0089FF] focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 font-medium"
            />
          </div>
        </div>

        {/* 6. RFID Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            RFID Tag
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <input
              type="text"
              value={rfidTag}
              onChange={(e) => setRfidTag(e.target.value)}
              placeholder="e.g. RF-881290"
              className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs transition-all focus:border-[#0089FF] focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 font-medium font-mono"
            />
          </div>
        </div>

        {/* 7. Manufacture Date */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Manufacture Date
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <input
              type="date"
              value={manufactureDate}
              onChange={(e) => setManufactureDate(e.target.value)}
              className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs transition-all focus:border-[#0089FF] focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 font-medium cursor-pointer"
            />
          </div>
        </div>

        {/* 8. Size */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Size <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={size}
              options={TIRE_SIZE_OPTIONS}
              onChange={setSize}
              placeholder="Select Size"
            />
          </div>
        </div>

        {/* 9. Select Tread Pattern */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Select Tread Pattern
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={treadPattern}
              options={TREAD_PATTERN_OPTIONS}
              onChange={setTreadPattern}
              placeholder="Select Tread Pattern"
            />
          </div>
        </div>

        {/* 10. Tire Purchase Date */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Tire Purchase Date
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground shadow-2xs transition-all focus:border-[#0089FF] focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 font-medium cursor-pointer"
            />
          </div>
        </div>

        {/* 11. Price ($) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Price
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <div className="flex items-center rounded-md border border-input/80 bg-background shadow-2xs focus-within:border-[#0089FF] focus-within:ring-2 focus-within:ring-[#0089FF]/20 transition-all overflow-hidden">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="h-9 flex-1 bg-transparent px-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
              />
              <span className="px-3 text-xs font-semibold text-muted-foreground border-l border-border/70 bg-muted/30 h-9 flex items-center select-none shrink-0">
                ($)
              </span>
            </div>
          </div>
        </div>

        {/* 12. Tread Depth (mm) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Tread Depth <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <div className="flex items-center rounded-md border border-input/80 bg-background shadow-2xs focus-within:border-[#0089FF] focus-within:ring-2 focus-within:ring-[#0089FF]/20 transition-all overflow-hidden">
              <input
                type="number"
                step="0.1"
                value={tireDepth}
                onChange={(e) => setTireDepth(e.target.value)}
                placeholder="16.0"
                className="h-9 flex-1 bg-transparent px-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
              />
              <span className="px-3 text-xs font-semibold text-muted-foreground border-l border-border/70 bg-muted/30 h-9 flex items-center select-none shrink-0">
                (mm)
              </span>
            </div>
          </div>
        </div>

        {/* 13. Tire Predicted Distance (Km / Mile) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Tire Predicted Distance <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <div className="flex items-center rounded-md border border-input/80 bg-background shadow-2xs focus-within:border-[#0089FF] focus-within:ring-2 focus-within:ring-[#0089FF]/20 transition-all overflow-hidden">
              <input
                type="number"
                value={tirePredictedDistance}
                onChange={(e) => setTirePredictedDistance(e.target.value)}
                placeholder="150000"
                className="h-9 flex-1 bg-transparent px-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
              />
              <span className="px-3 text-xs font-semibold text-muted-foreground border-l border-border/70 bg-muted/30 h-9 flex items-center select-none shrink-0">
                (Km / Mile)
              </span>
            </div>
          </div>
        </div>

        {/* 14. Tire Condition */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Tire Condition <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              {(["New", "Retreaded", "Repaired", "Re-grooved"] as TireCondition[]).map((cond) => {
                const isSelected = tireCondition === cond;
                return (
                  <label
                    key={cond}
                    className="flex items-center gap-2 cursor-pointer select-none font-medium text-foreground hover:text-[#0089FF] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => setTireCondition(cond)}
                      className="h-4 w-4 rounded border-input text-[#0089FF] accent-[#0089FF] cursor-pointer"
                    />
                    <span>{cond}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* 15. Upload Image */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Upload Image <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <div className="flex items-center gap-3">
              <label className="inline-flex h-9 items-center justify-center rounded-md border border-input/80 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 text-xs font-semibold text-foreground cursor-pointer transition-all shadow-2xs active:scale-98 shrink-0">
                <Upload className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <span>Choose Files</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImageFileName(file.name);
                  }}
                />
              </label>
              <span className="text-xs text-muted-foreground truncate">
                {imageFileName || "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        {/* 16. Load Index */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Load Index <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={loadIndex}
              options={LOAD_INDEX_OPTIONS}
              onChange={setLoadIndex}
              placeholder="Select Load Index"
            />
          </div>
        </div>

        {/* 17. Ply Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Ply Rating
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <input
              type="text"
              value={plyRating}
              onChange={(e) => setPlyRating(e.target.value)}
              placeholder="e.g. 16PR"
              className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs transition-all focus:border-[#0089FF] focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Horizontal divider with 20px space from left and right */}
      <div className="mx-5 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0" />

      {/* Standard Bottom Footer Frame with Action Buttons */}
      <footer className="flex h-12 items-center justify-start gap-2.5 px-5 bg-white dark:bg-slate-900 shrink-0 select-none">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-[#DFE3EB] dark:border-slate-700 bg-background px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-[#0089FF]/40 transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-98"
        >
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Save</span>
        </button>
      </footer>
    </div>
  );
}

/* =========================================================================
   In-Screen Tire Upload Form View
   ========================================================================= */
export function TireUploadFormView({
  onUploadSuccess,
  onCancel,
}: {
  onUploadSuccess: (importedTires: TireItem[]) => void;
  onCancel: () => void;
}) {
  const [company, setCompany] = useState("HP Company");
  const [branch, setBranch] = useState("Central Branch");
  const [tireBrand, setTireBrand] = useState("Michelin");
  const [tireModel, setTireModel] = useState("General");
  const [excelFileName, setExcelFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReset = () => {
    setCompany("HP Company");
    setBranch("Central Branch");
    setTireBrand("Michelin");
    setTireModel("General");
    setExcelFileName("");
    toast.info("Upload fields reset to default");
  };

  const handleDownloadSampleFile = () => {
    const csvHeader = "Company,Branch,Tire Brand,Tire Model,Tire Serial No,RFID Tag,Manufacture Date,Tire Condition,Tread Pattern,Size,Tire Status,Tire Depth (mm),Purchase Date,Price ($),Predicted Distance (km),Load Index,Ply Rating\n";
    const sampleRows = [
      `"${company}","${branch}","${tireBrand}","${tireModel}","TR-9901-X","RF-102941","01/04/2024","New","Drive Lug","295/80 R22.5","In Stock","16.0","10/01/2025","420.00","180000","152/148M","16PR"`,
      `"${company}","${branch}","${tireBrand}","${tireModel}","TR-9902-Y","RF-102942","05/04/2024","Good","Steer Rib","315/80 R22.5","In Stock","14.5","15/01/2025","450.00","160000","154/150L","18PR"`,
    ].join("\n");

    const blob = new Blob([csvHeader + sampleRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tire_upload_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded sample tire upload template (CSV)");
  };

  const handleUploadSubmit = () => {
    if (!excelFileName) {
      toast.error("Please choose an Excel file to upload");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const timestamp = Date.now();
      const imported: TireItem[] = [
        {
          id: `tire-import-${timestamp}-1`,
          company,
          branch,
          tireBrand,
          tireModel: tireModel || "General",
          tireSerialNo: `IMP-${Math.floor(10000 + Math.random() * 90000)}-A`,
          rfidTag: `RF-${Math.floor(100000 + Math.random() * 900000)}`,
          manufactureDate: "15/02/2024",
          tireCondition: "New",
          treadPattern: "Drive Lug",
          size: "295/80 R22.5",
          tireStatus: "In Stock",
          tireDepth: 16.5,
          purchaseDate: "01/02/2025",
          price: "$440.00",
          tirePredictedDistance: "175,000 km",
          imagesCount: 1,
          loadIndex: "152/148M",
          plyRating: "16PR",
        },
        {
          id: `tire-import-${timestamp}-2`,
          company,
          branch,
          tireBrand,
          tireModel: tireModel || "General",
          tireSerialNo: `IMP-${Math.floor(10000 + Math.random() * 90000)}-B`,
          rfidTag: `RF-${Math.floor(100000 + Math.random() * 900000)}`,
          manufactureDate: "20/03/2024",
          tireCondition: "New",
          treadPattern: "Steer Rib",
          size: "315/80 R22.5",
          tireStatus: "In Stock",
          tireDepth: 15.8,
          purchaseDate: "05/02/2025",
          price: "$460.00",
          tirePredictedDistance: "185,000 km",
          imagesCount: 1,
          loadIndex: "154/150L",
          plyRating: "18PR",
        },
      ];

      setIsProcessing(false);
      toast.success(`Successfully imported ${imported.length} tires from ${excelFileName}`);
      onUploadSuccess(imported);
    }, 600);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-900">
      {/* Scrollable Form Body with Field-Beside-Value horizontal layout */}
      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-4 custom-scrollbar text-xs">
        
        {/* 1. Company */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Company :
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={company}
              options={COMPANY_OPTIONS}
              onChange={setCompany}
              placeholder="Select Company"
            />
          </div>
        </div>

        {/* 2. Branch */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Branch :
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={branch}
              options={BRANCH_OPTIONS}
              onChange={setBranch}
              placeholder="Select Branch"
            />
          </div>
        </div>

        {/* 3. Tire Brand */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Tire Brand :
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={tireBrand}
              options={TIRE_BRAND_OPTIONS}
              onChange={setTireBrand}
              placeholder="Select Tire Brand"
            />
          </div>
        </div>

        {/* 4. Tire Model */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Tire Model :
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <SelectDropdown
              value={tireModel}
              options={TIRE_MODEL_OPTIONS}
              onChange={setTireModel}
              placeholder="Select Tire Model"
            />
          </div>
        </div>

        {/* 5. Excel File */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Excel File :
          </label>
          <div className="w-80 sm:w-96 max-w-md">
            <div className="flex items-center gap-3">
              <label className="inline-flex h-9 items-center justify-center rounded-md border border-input/80 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 text-xs font-semibold text-foreground cursor-pointer transition-all shadow-2xs active:scale-98 shrink-0">
                <Upload className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <span>Choose File</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setExcelFileName(file.name);
                  }}
                />
              </label>
              <span className="text-xs text-muted-foreground truncate font-medium">
                {excelFileName || "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        {/* 6. Sample File */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-h-[36px]">
          <label className="w-36 sm:w-44 text-left text-xs font-semibold text-foreground shrink-0">
            Sample File :
          </label>
          <div className="w-80 sm:w-96 max-w-md flex items-center">
            <button
              type="button"
              onClick={handleDownloadSampleFile}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0089FF] hover:underline cursor-pointer transition-colors"
            >
              <ArrowDownToLine className="h-3.5 w-3.5" />
              <span>Download sample file</span>
            </button>
          </div>
        </div>

        
      </div>
    </div>
  );
}
