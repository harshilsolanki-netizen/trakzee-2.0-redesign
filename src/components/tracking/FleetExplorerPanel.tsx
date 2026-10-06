import {
  Activity,
  AlertTriangle,
  ArrowUpDown,
  Bell,
  Box,
  Briefcase,
  Calendar,
  Caravan,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  Edit3,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  Hash,
  Info,
  Key,
  Layers,
  Lock,
  MapPin,
  Mic,
  MoreVertical,
  Navigation,
  Package,
  Paperclip,
  Phone,
  Play,
  Plus,
  PlusCircle,
  Power,
  Radio,
  RotateCcw,
  RotateCw,
  Route,
  Scale,
  Search,
  Settings,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  ThumbsUp,
  Timer,
  Trash2,
  TrendingUp,
  Truck,
  Upload,
  User,
  UserCheck,
  Video,
  Weight,
  Wifi,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { STATUS_META, type FleetObject, type ObjectStatus } from "@/data/fleet";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type TrackingTab =
  | "object"
  | "jobs"
  | "driver"
  | "address"
  | "geofence"
  | "health"
  | "trailer"
  | "beacon"
  | "video_telematics";

export function FleetExplorerPanel({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  checkedVehicleIds,
  onToggleCheckVehicle,
  onToggleCheckGroup,
  onToggleCheckAll,
  checkedGeofenceIds = ["g-1", "g-2", "g-3", "g-4", "g-5"],
  onToggleCheckGeofence,
  onToggleCheckAllGeofences,
  selectedGeofenceId,
  onSelectGeofence,
  onOpenDashcam,
  onOpenSettings,
  onOpenTelemetry,
  onCloseTelemetry,
  onTraceVehicle,
  onOpenAddVehicle,
  onOpenAddAddress,
  onOpenUploadAddress,
  onToggleCollapse,
  selectedColumns = [
    "ignition",
    "gps",
    "speed",
    "last_updated",
    "driver",
    "address",
    "live_streaming",
    "immobilize",
  ],
  onStartResize,
  onResetWidth,
  style,
  className,
}: {
  vehicles: FleetObject[];
  selectedVehicleId: string;
  onSelectVehicle: (id: string) => void;
  checkedVehicleIds: string[];
  onToggleCheckVehicle: (id: string) => void;
  onToggleCheckGroup: (ids: string[]) => void;
  onToggleCheckAll: () => void;
  checkedGeofenceIds?: string[];
  onToggleCheckGeofence?: (id: string) => void;
  onToggleCheckAllGeofences?: (checked: boolean) => void;
  selectedGeofenceId?: string | null;
  onSelectGeofence?: (id: string) => void;
  onOpenDashcam: (vehicle: FleetObject) => void;
  onOpenSettings: () => void;
  onOpenTelemetry: (vehicle: FleetObject, isHealthOnly?: boolean, selectedJob?: any) => void;
  onCloseTelemetry?: () => void;
  onTraceVehicle: (vehicle: FleetObject) => void;
  onOpenAddVehicle?: () => void;
  onOpenAddAddress?: (initialData?: any) => void;
  onOpenUploadAddress?: () => void;
  onToggleCollapse?: () => void;
  selectedColumns?: string[];
  onStartResize?: () => void;
  onResetWidth?: () => void;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<TrackingTab>("object");
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<ObjectStatus | "all">("all");
  const [activeDriverStatus, setActiveDriverStatus] = useState<string>("all");
  const [activeJobStatus, setActiveJobStatus] = useState<string>("all");
  const [selectedHealthCategory, setSelectedHealthCategory] = useState<
    "all" | "safety" | "efficiency" | "risk" | "discipline"
  >("all");
  const [healthSearch, setHealthSearch] = useState("");
  const [healthSortOrder, setHealthSortOrder] = useState<"asc" | "desc">("desc");

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    Company: false,
    Indonesia: false,
    Thailand: false,
    Valsad: false,
    Itriangle: false,
    Ruptela: false,
    "Shivam Test": false,
  });

  // Driver Tab collapse & action menu states
  const [collapsedDriverBranches, setCollapsedDriverBranches] = useState<Record<string, boolean>>({});
  const [collapsedDriverSubgroups, setCollapsedDriverSubgroups] = useState<Record<string, boolean>>({});
  const [openDriverMenuId, setOpenDriverMenuId] = useState<string | null>(null);
  const [openStatusSubmenuId, setOpenStatusSubmenuId] = useState<string | null>(null);

  // Job & Checkpoint Left Panel Detail View state
  const [selectedJobDetail, setSelectedJobDetail] = useState<{
    id: string;
    code: string;
    title: string;
    status: string;
    statusType: string;
    object: string;
    objectState?: string;
    driver?: string;
    rep?: string;
    route?: string;
    estimatedStart?: string;
    actualStart?: string;
    estimatedEnd?: string;
    actualEnd?: string;
    checkpoints?: Array<{
      index: number;
      status: "Visited" | "Upcoming" | "Missed";
      type: string;
      vehicle: string;
      estArrival: string;
      actArrival: string;
      checkpointName: string;
      address: string;
      collector: string;
      qty?: string;
      weight?: string;
    }>;
  } | null>(null);

  const [checkpointSearch, setCheckpointSearch] = useState("");
  const [activeCheckpointFilter, setActiveCheckpointFilter] = useState<"all" | "visited" | "upcoming" | "missed">("all");

  const getJobCheckpoints = (item: any) => {
    if (item.checkpoints && item.checkpoints.length > 0) return item.checkpoints;
    const vehicleName = item.object || item.code || "Test SCM Object";
    const driverName = item.rep || item.driver || "Sukesh Gupta";
    return [
      {
        index: 1,
        status: "Visited" as const,
        type: "Planned",
        vehicle: vehicleName,
        estArrival: "30/09/2026 11:03 PM",
        actArrival: "28/09/2026 01:13 PM",
        checkpointName: "Pune Checkpoint",
        address: "SHRI SOMESHWAR S.S.K. LTD(81), Pune",
        collector: driverName,
        qty: "120 Units",
        weight: "4.5 T",
      },
      {
        index: 2,
        status: "Missed" as const,
        type: "Planned",
        vehicle: vehicleName,
        estArrival: "30/09/2026 11:40 PM",
        actArrival: "01/10/2026 12:40 AM",
        checkpointName: "Solapur Plant",
        address: "VISHNU LAXMI CO-OP GRAPE DISTILLERY LTD., Solapur",
        collector: driverName,
        qty: "80 Units",
        weight: "3.2 T",
      },
      {
        index: 3,
        status: "Upcoming" as const,
        type: "Planned",
        vehicle: vehicleName,
        estArrival: "01/10/2026 03:00 PM",
        actArrival: "01/10/2026 03:15 PM",
        checkpointName: "Dharampur Depot",
        address: "Dharampur Rd, opp. S.T. Workshop, Abrama, Valsad, Gujarat 396002",
        collector: "Sukesh Gupta",
        qty: "50 Units",
        weight: "2.0 T",
      },
      {
        index: 4,
        status: "Upcoming" as const,
        type: "Planned",
        vehicle: vehicleName,
        estArrival: "01/10/2026 06:00 PM",
        actArrival: "--",
        checkpointName: "Surat Logistics Hub",
        address: "Plot 42, GIDC Industrial Estate, Surat, Gujarat 395008",
        collector: "John Doe",
        qty: "150 Units",
        weight: "5.8 T",
      },
    ];
  };

  // Job Tab collapse & expand details states
  const [collapsedJobBranches, setCollapsedJobBranches] = useState<Record<string, boolean>>({});
  const [collapsedJobSubgroups, setCollapsedJobSubgroups] = useState<Record<string, boolean>>({});
  const [expandedJobIds, setExpandedJobIds] = useState<Record<string, boolean>>({});

  // Dynamic Job Dataset state (8 Total Jobs & 96 Checkpoints matching reference image 1:1)
  const [jobData, setJobData] = useState([
    {
      branch: "HP Company",
      count: 8,
      visitedCount: 32,
      upcomingCount: 47,
      missedCount: 17,
      totalCount: 96,
      subgroups: [
        {
          name: "HP Branch 1",
          count: 8,
          jobs: [
            {
              id: "j-50284",
              code: "#50284",
              title: "TEST SCM",
              status: "Completed With Error",
              statusType: "completed",
              object: "Test SCM Object",
              objectState: "Unloaded",
              quantity: 0,
              weight: 0,
              violation: 0,
              convoy: "--",
              route: "Route 1",
              rep: "John Doe",
              repCount: 1,
              representatives: [{ name: "John Doe", phone: "+91 98765 43210" }],
              verified: true,
              details: {
                shipmentNo: "SHP-50284-A",
                invoiceNo: "INV-99201",
                consigneeNo: "CNS-10482",
                quantity: "120 Units",
                product: "Test SCM Material",
              },
            },
            {
              id: "j-50285",
              code: "#50285",
              title: "Test SCM job",
              status: "Failed",
              statusType: "fail",
              object: "Test SCM Object",
              objectState: "Unloaded",
              quantity: 0,
              weight: 0,
              violation: 0,
              convoy: "--",
              route: "Route 2",
              rep: "Alex Vance",
              repCount: 1,
              representatives: [{ name: "Alex Vance", phone: "+91 98123 45678" }],
              verified: false,
              details: {
                shipmentNo: "SHP-50285-B",
                invoiceNo: "INV-99202",
                consigneeNo: "CNS-10483",
                quantity: "80 Units",
                product: "SCM Industrial Batch",
              },
            },
            {
              id: "j-50286",
              code: "#50286",
              title: "Test scm job",
              status: "Completed With Error",
              statusType: "completed",
              object: "Test SCM Object",
              objectState: "Loaded",
              quantity: 0,
              weight: 0,
              violation: 0,
              convoy: "--",
              route: "Route 1",
              rep: "Sarah Smith",
              repCount: 2,
              representatives: [
                { name: "Sarah Smith", phone: "+91 98765 43210" },
                { name: "Alex Vance", phone: "+91 98123 45678" },
              ],
              verified: true,
              details: {
                shipmentNo: "SHP-50286-C",
                invoiceNo: "INV-99203",
                consigneeNo: "CNS-10484",
                quantity: "200 Units",
                product: "Petroleum Drums",
              },
            },
            {
              id: "j-50287",
              code: "#50287",
              title: "TEST SCM 001",
              status: "Completed With Error",
              statusType: "completed",
              object: "Test SCM Object",
              objectState: "Loaded",
              quantity: 0,
              weight: 0,
              violation: 0,
              convoy: "--",
              route: "Route 3",
              rep: "Mike Johnson",
              repCount: 3,
              representatives: [
                { name: "Mike Johnson", phone: "+91 97654 32109" },
                { name: "John Doe", phone: "+91 98765 43210" },
                { name: "Sarah Smith", phone: "+91 98123 45678" },
              ],
              verified: true,
              details: {
                shipmentNo: "SHP-50287-D",
                invoiceNo: "INV-99204",
                consigneeNo: "CNS-10485",
                quantity: "150 Units",
                product: "SCM Component A",
              },
            },
            {
              id: "j-50288",
              code: "#50288",
              title: "Patch 210 Address Test",
              status: "Running",
              statusType: "running",
              object: "HP Object 11",
              objectState: "In Transit",
              quantity: 0,
              weight: 0,
              violation: 0,
              convoy: "--",
              route: "Route 4",
              rep: "David Miller",
              repCount: 1,
              representatives: [{ name: "David Miller", phone: "+91 99887 76655" }],
              verified: true,
              details: {
                shipmentNo: "SHP-50288-E",
                invoiceNo: "INV-99205",
                consigneeNo: "CNS-10486",
                quantity: "300 Units",
                product: "High-value Freight",
              },
            },
            {
              id: "j-50265",
              code: "#50265",
              title: "HP All Day Automatic Dispatch",
              status: "Running",
              statusType: "running",
              object: "HP Object 4",
              objectState: "In Transit",
              quantity: 0,
              weight: 0,
              violation: 0,
              convoy: "--",
              route: "Route 1",
              rep: "Emily Davis",
              repCount: 2,
              representatives: [
                { name: "Emily Davis", phone: "+91 96543 21098" },
                { name: "Chris Taylor", phone: "+91 95432 10987" },
              ],
              verified: true,
              details: {
                shipmentNo: "SHP-50265-F",
                invoiceNo: "INV-99206",
                consigneeNo: "CNS-10487",
                quantity: "500 Units",
                product: "Automated Parcel Freight",
              },
            },
            {
              id: "j-50264",
              code: "#50264",
              title: "HP All Day Automatic Route",
              status: "Running",
              statusType: "running",
              object: "HP Object 3",
              objectState: "In Transit",
              quantity: 0,
              weight: 0,
              violation: 0,
              convoy: "HP",
              route: "Route 2",
              rep: "Robert Wilson",
              repCount: 3,
              representatives: [
                { name: "Robert Wilson", phone: "+91 94321 09876" },
                { name: "David Miller", phone: "+91 99887 76655" },
                { name: "Emily Davis", phone: "+91 96543 21098" },
              ],
              verified: true,
              details: {
                shipmentNo: "SHP-50264-G",
                invoiceNo: "INV-99207",
                consigneeNo: "CNS-10488",
                quantity: "410 Units",
                product: "HP Standard Cargo",
              },
            },
            {
              id: "j-50262",
              code: "#50262",
              title: "HP All Day Weekly Maintenance",
              status: "Upcoming",
              statusType: "upcoming",
              object: "HP Object 2",
              objectState: "Loaded",
              quantity: 0,
              weight: 0,
              violation: 0,
              convoy: "HP",
              route: "Route 5",
              rep: "Chris Taylor",
              repCount: 1,
              representatives: [{ name: "Chris Taylor", phone: "+91 95432 10987" }],
              verified: false,
              details: {
                shipmentNo: "SHP-50262-H",
                invoiceNo: "INV-99208",
                consigneeNo: "CNS-10489",
                quantity: "90 Units",
                product: "Maintenance Equipment",
              },
            },
          ],
        },
      ],
    },
  ]);

  // Compute dynamic Job status counts
  const jobCounts = useMemo(() => {
    let running = 0;
    let completed = 0;
    let upcoming = 0;
    let fail = 0;
    let total = 0;

    for (const grp of jobData) {
      for (const sub of grp.subgroups) {
        for (const j of sub.jobs) {
          total++;
          if (j.statusType === "running") running++;
          else if (j.statusType === "completed") completed++;
          else if (j.statusType === "upcoming") upcoming++;
          else if (j.statusType === "fail") fail++;
        }
      }
    }

    return { running, completed, upcoming, fail, total };
  }, [jobData]);

  // Handler to toggle job verification state
  const toggleVerifyJob = (id: string) => {
    setJobData((prev) =>
      prev.map((grp) => ({
        ...grp,
        subgroups: grp.subgroups.map((sub) => ({
          ...sub,
          jobs: sub.jobs.map((j) => {
            if (j.id === id) {
              const nextStatus = !j.verified;
              toast.success(nextStatus ? `Job ${j.code} Verified` : `Job ${j.code} marked for verification review`);
              return { ...j, verified: nextStatus };
            }
            return j;
          }),
        })),
      })),
    );
  };

  // Dynamic Driver Dataset state
  const [driverData, setDriverData] = useState([
    {
      branch: "Surya Travels",
      count: 5,
      subgroups: [
        {
          name: "Kalwa",
          count: 5,
          drivers: [
            { id: "d-1", name: "Prabhu Jadhav", vehicle: "MH 14 KQ 4446", status: "Allocated Via", type: "Default", driverStatus: "Available", allocated: true, isRunning: true },
            { id: "d-2", name: "Shrikant Waghmare", vehicle: "MH 14 KA 6985", status: "Allocated Via", type: "Default", driverStatus: "Available", allocated: true, isRunning: true },
            { id: "d-3", name: "Vishal Gaikwad", vehicle: "MH 14 KA 9125", status: "Allocated Via", type: "Default", driverStatus: "Available", allocated: true, isRunning: false },
            { id: "d-4", name: "Kiran Ghodke", vehicle: "MH 12 QW 5286", status: "Allocated Via", type: "Default", driverStatus: "Available", allocated: true, isRunning: false },
            { id: "d-5", name: "Ajinkya Bharge", vehicle: "MH 14 HU 4181", status: "Allocated Via", type: "Default", driverStatus: "Available", allocated: true, isRunning: false },
          ],
        },
      ],
    },
    {
      branch: "Abhay Travels",
      count: 5,
      subgroups: [
        {
          name: "Bhatrai",
          count: 5,
          drivers: [
            { id: "d-6", name: "Shivaji Yadav", vehicle: "GJ 05 CU 1936", status: "Allocated Via", type: "Default", driverStatus: "Available", allocated: true, isRunning: true },
            { id: "d-7", name: "Raymal Vasawa", vehicle: "GJ 21 OP 5624", status: "Allocated Via", type: "Default", driverStatus: "Available", allocated: true, isRunning: false },
            { id: "d-8", name: "Dilip Nayak", vehicle: "GJ 18 MP 8823", status: "Allocated Via", type: "Default", driverStatus: "Available", allocated: true, isRunning: false },
            { id: "d-9", name: "Hitesh Rathod", vehicle: "Unassigned", status: "Not Allocated", type: "Default", driverStatus: "Not available", allocated: false, isRunning: false },
            { id: "d-10", name: "Pushpendra Kushwa", vehicle: "Unassigned", status: "Not Allocated", type: "Default", driverStatus: "On Leave", allocated: false, isRunning: false },
          ],
        },
      ],
    },
  ]);

  // Compute dynamic Driver status counts
  const driverCounts = useMemo(() => {
    let available = 0;
    let notAvailable = 0;
    let onLeave = 0;
    let allocated = 0;
    let notAllocated = 0;
    let total = 0;

    for (const grp of driverData) {
      for (const sub of grp.subgroups) {
        for (const drv of sub.drivers) {
          total++;
          if (drv.driverStatus === "Available") available++;
          if (drv.driverStatus === "Not available") notAvailable++;
          if (drv.driverStatus === "On Leave") onLeave++;
          if (drv.allocated) allocated++;
          else notAllocated++;
        }
      }
    }

    return { available, notAvailable, onLeave, allocated, notAllocated, total };
  }, [driverData]);

  // Handler to update a driver's status
  const updateDriverStatus = (id: string, newStatus: string) => {
    setDriverData((prev) =>
      prev.map((grp) => ({
        ...grp,
        subgroups: grp.subgroups.map((sub) => ({
          ...sub,
          drivers: sub.drivers.map((drv) => {
            if (drv.id === id) {
              const isAlloc = newStatus === "Available";
              return {
                ...drv,
                driverStatus: newStatus,
                allocated: isAlloc,
                status: isAlloc ? "Allocated Via" : "Not Allocated",
                vehicle: isAlloc ? (drv.vehicle === "Unassigned" ? "GJ 01 XX 9999" : drv.vehicle) : "Unassigned",
              };
            }
            return drv;
          }),
        })),
      })),
    );
    toast.success(`Driver status updated to "${newStatus}"`);
  };

  // Dynamic Address Dataset state (1:1 with reference screenshot media_1791281186715.png)
  const [addressData, setAddressData] = useState([
    {
      group: "Ha Company",
      checked: true,
      subgroups: [
        {
          name: "HS - Bank Branch",
          checked: true,
          addresses: [
            { id: "a-1", name: "HS - Bank", checked: true, category: "Financial / Bank" },
            { id: "a-2", name: "Zin - AI Studio", checked: true, category: "Tech Hub" },
            { id: "a-3", name: "Vortex - Safety Operations Hub", checked: false, category: "Safety" },
            { id: "a-4", name: "Aegis - Security Assessment Area", checked: false, category: "Security" },
            { id: "a-5", name: "Sentinel - Emergency Response Zone", checked: false, category: "Emergency" },
            { id: "a-6", name: "Fortress - Threat Analysis Division", checked: false, category: "Analysis" },
            { id: "a-7", name: "Haven - Cautionary Measures Facility", checked: false, category: "Facility" },
            { id: "a-8", name: "Outpost - Hazard Evaluation Grounds", checked: false, category: "Evaluation" },
            { id: "a-9", name: "Nexus - High-Risk Operations Center", checked: false, category: "High-Risk" },
            { id: "a-10", name: "Bastion - Vulnerability Assessment Zone", checked: false, category: "Assessment" },
            { id: "a-11", name: "Beacon - Warning Response Area", checked: false, category: "Warning" },
            { id: "a-12", name: "Pinnacle - Alert Management Zone", checked: false, category: "Alert" },
            { id: "a-13", name: "Horizon - Unsafe Assessment Grounds", checked: false, category: "Grounds" },
            { id: "a-14", name: "Elysium - Threat Monitoring Area", checked: false, category: "Monitoring" },
            { id: "a-15", name: "Apex - Risk Evaluation Zone", checked: false, category: "Risk" },
            { id: "a-16", name: "Citadel - Dangerous Territory Hub", checked: false, category: "Territory" },
            { id: "a-17", name: "Crisis Point - Emergency Zone", checked: false, category: "Emergency" },
            { id: "a-18", name: "Peril Point - Risk Assessment Zone", checked: false, category: "Assessment" },
            { id: "a-19", name: "Hazard Haven - Safety Zone", checked: false, category: "Safety" },
            { id: "a-20", name: "Unsafe Haven - Risk Management Zone", checked: false, category: "Management" },
            { id: "a-21", name: "Alpha Base - Danger Zone", checked: false, category: "Base" },
          ],
        },
      ],
    },
  ]);

  const [collapsedAddressGroups, setCollapsedAddressGroups] = useState<Record<string, boolean>>({});

  const isAddressAllChecked = useMemo(() => {
    return addressData.every((g) =>
      g.subgroups.every((s) => s.addresses.every((item) => item.checked)),
    );
  }, [addressData]);

  const toggleAllAddresses = (checked: boolean) => {
    setAddressData((prev) =>
      prev.map((g) => ({
        ...g,
        subgroups: g.subgroups.map((s) => ({
          ...s,
          addresses: s.addresses.map((item) => ({ ...item, checked })),
        })),
      })),
    );
  };

  // Dynamic Geofence Dataset state (1:1 with reference screenshot media_1791282117663.png)
  const [geofenceData, setGeofenceData] = useState([
    {
      group: "Ha Company",
      checked: true,
      subgroups: [
        {
          name: "Ha Company Geofences",
          checked: true,
          geofences: [
            { id: "g-1", name: "HS - Bank", checked: true, category: "Financial / Bank", type: "Polygon Zone" },
            { id: "g-2", name: "Zin - AI Studio", checked: true, category: "Tech Hub", type: "Circular Zone" },
            { id: "g-3", name: "Vortex - Safety Operations Hub", checked: true, category: "Safety Operations", type: "Polygon Zone" },
            { id: "g-4", name: "Aegis - Security Assessment Area", checked: true, category: "Security Area", type: "Polygon Zone" },
            { id: "g-5", name: "Sentinel - Emergency Response Zone", checked: true, category: "Emergency Response", type: "Circular Zone" },
            { id: "g-6", name: "Fortress - Threat Analysis Division", checked: false, category: "Threat Analysis", type: "Polygon Zone" },
            { id: "g-7", name: "Haven - Cautionary Measures Facility", checked: false, category: "Cautionary Facility", type: "Circular Zone" },
            { id: "g-8", name: "Outpost - Hazard Evaluation Grounds", checked: false, category: "Hazard Evaluation", type: "Polygon Zone" },
            { id: "g-9", name: "Nexus - High-Risk Operations Center", checked: false, category: "Operations Center", type: "Polygon Zone" },
            { id: "g-10", name: "Bastion - Vulnerability Assessment Zone", checked: false, category: "Vulnerability Zone", type: "Circular Zone" },
            { id: "g-11", name: "Beacon - Warning Response Area", checked: false, category: "Warning Response", type: "Polygon Zone" },
            { id: "g-12", name: "Pinnacle - Alert Management Zone", checked: false, category: "Alert Management", type: "Circular Zone" },
            { id: "g-13", name: "Horizon - Unsafe Assessment Grounds", checked: false, category: "Assessment Grounds", type: "Polygon Zone" },
            { id: "g-14", name: "Elysium - Threat Monitoring Area", checked: false, category: "Threat Monitoring", type: "Polygon Zone" },
            { id: "g-15", name: "Apex - Risk Evaluation Zone", checked: false, category: "Risk Evaluation", type: "Circular Zone" },
            { id: "g-16", name: "Citadel - Dangerous Territory Hub", checked: false, category: "Dangerous Hub", type: "Polygon Zone" },
            { id: "g-17", name: "Crisis Point - Emergency Zone", checked: false, category: "Emergency Zone", type: "Circular Zone" },
            { id: "g-18", name: "Peril Point - Risk Assessment Zone", checked: false, category: "Risk Assessment", type: "Polygon Zone" },
            { id: "g-19", name: "Hazard Haven - Safety Zone", checked: false, category: "Safety Zone", type: "Polygon Zone" },
            { id: "g-20", name: "Unsafe Haven - Risk Management Zone", checked: false, category: "Risk Management", type: "Circular Zone" },
            { id: "g-21", name: "Alpha Base - Danger Zone", checked: false, category: "Danger Zone", type: "Polygon Zone" },
          ],
        },
      ],
    },
  ]);

  const [collapsedGeofenceGroups, setCollapsedGeofenceGroups] = useState<Record<string, boolean>>({});

  const isGeofenceAllChecked = useMemo(() => {
    return geofenceData.every((g) =>
      g.subgroups.every((s) => s.geofences.every((item) => item.checked)),
    );
  }, [geofenceData]);

  const toggleAllGeofences = (checked: boolean) => {
    setGeofenceData((prev) =>
      prev.map((g) => ({
        ...g,
        subgroups: g.subgroups.map((s) => ({
          ...s,
          geofences: s.geofences.map((item) => ({ ...item, checked })),
        })),
      })),
    );
  };

  // Local vehicles state
  const [localVehicles, setLocalVehicles] = useState<FleetObject[]>(vehicles);
  useEffect(() => {
    setLocalVehicles(vehicles);
  }, [vehicles]);

  const filteredHealthVehicles = useMemo(() => {
    const q = healthSearch.trim().toLowerCase();
    const list = localVehicles.filter((v) => {
      const matchesQuery =
        q === "" ||
        v.name.toLowerCase().includes(q) ||
        v.branch.toLowerCase().includes(q) ||
        v.imei.toLowerCase().includes(q) ||
        (v.plateNumber && v.plateNumber.toLowerCase().includes(q));

      if (!matchesQuery) return false;
      if (selectedHealthCategory === "safety") return v.speed <= 80;
      if (selectedHealthCategory === "efficiency") return v.status === "running" || v.status === "idle";
      if (selectedHealthCategory === "risk") return v.status === "stopped" || v.status === "nodata";
      if (selectedHealthCategory === "discipline") return v.battery !== undefined && v.battery > 50;
      return true;
    });

    return list.sort((a, b) => {
      const idxA = localVehicles.indexOf(a);
      const idxB = localVehicles.indexOf(b);
      const scoreA = 75 + ((idxA * 7 + 13) % 23);
      const scoreB = 75 + ((idxB * 7 + 13) % 23);
      return healthSortOrder === "asc" ? scoreA - scoreB : scoreB - scoreA;
    });
  }, [localVehicles, healthSearch, selectedHealthCategory, healthSortOrder]);

  // Reload Animation State
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Master Filter Options matching reference image
  const ALL_FILTER_COMPANIES = useMemo(
    () => [
      "Agrawal Industries",
      "BSJ",
      "Bhavya Test Account",
      "Company",
      "Indonesia",
      "Thailand",
      "Valsad",
      "Itriangle",
      "Ruptela",
      "Shivam Test",
    ],
    [],
  );

  // Filter Popover State (Report Overlay Style matching Image 3)
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>("Group(s)");
  const [selectedGroups, setSelectedGroups] = useState<string[]>(["All"]);
  const [tempSelectedGroups, setTempSelectedGroups] = useState<string[]>([]);

  const ALL_ADDRESS_CATEGORIES = [
    "Airport",
    "ATM",
    "Bank",
    "Bus Stop",
    "Collection Address",
    "Construction Site",
    "Customer Address",
    "Embassy",
    "Financial / Bank",
    "Ground",
    "Logistics Hub",
    "Safety Zone",
    "Tech Hub",
    "Warehouse / Plant",
  ];

  const [selectedAddressCategories, setSelectedAddressCategories] = useState<string[]>([
    "Airport",
    "ATM",
    "Bank",
    "Bus Stop",
    "Collection Address",
    "Construction Site",
    "Customer Address",
    "Embassy",
    "Financial / Bank",
    "Ground",
    "Logistics Hub",
    "Safety Zone",
    "Tech Hub",
    "Warehouse / Plant",
  ]);
  const [addressCategorySearch, setAddressCategorySearch] = useState("");

  // Sync draft filter when filter popover opens
  useEffect(() => {
    if (filterOpen) {
      setTempSelectedGroups(
        selectedGroups.includes("All") ? ALL_FILTER_COMPANIES : selectedGroups,
      );
      setFilterSearch("");
    }
  }, [filterOpen, selectedGroups, ALL_FILTER_COMPANIES]);

  // Sort Popover State (Report Overlay Style matching Image 3)
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSortCategory, setActiveSortCategory] = useState<"Sorting" | "Order">("Sorting");
  const [sortField, setSortField] = useState<"number" | "name" | "status" | "last_updated" | "ignition" | "power" | "driver">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [tempSortField, setTempSortField] = useState<"number" | "name" | "status" | "last_updated" | "ignition" | "power" | "driver">("name");
  const [tempSortDirection, setTempSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (sortOpen) {
      setTempSortField(sortField);
      setTempSortDirection(sortDirection);
    }
  }, [sortOpen, sortField, sortDirection]);

  // Handler for Reloading Objects
  const handleReload = () => {
    setIsRefreshing(true);
    toast.success("Object status refreshed", {
      description: `Synchronized ${localVehicles.length} vehicles with live telemetry.`,
    });
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  // Handler for Adding New Object
  const handleAddObjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjectForm.name.trim()) {
      toast.error("Object Name is required");
      return;
    }
    const newId = `veh-${Date.now()}`;
    const newObj: FleetObject = {
      id: newId,
      name: newObjectForm.name.trim(),
      branch: newObjectForm.branch || "Company",
      imei: newObjectForm.imei.trim() || `864201${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: newObjectForm.status,
      speed: newObjectForm.status === "running" ? 48 : 0,
      address: "Central Logistics Hub, Gate 2",
      lastUpdated: "Just now",
      ignition: newObjectForm.status === "running" || newObjectForm.status === "idle",
      gps: true,
      driver: "Assigned Driver",
      plateNumber: newObjectForm.plateNumber.trim() || "GJ 01 XX 9999",
      battery: 98,
    };
    setLocalVehicles((prev) => [newObj, ...prev]);
    toast.success("New Object Added Successfully!", {
      description: `${newObj.name} has been added to ${newObj.branch}.`,
    });
    setNewObjectForm({
      name: "",
      imei: "",
      branch: "Company",
      model: "Teltonika FMB920",
      plateNumber: "",
      status: "running",
    });
    setAddObjectOpen(false);
  };

  // Summary counts
  const counts = useMemo(() => {
    return {
      running: localVehicles.filter((v) => v.status === "running").length || 21,
      idle: localVehicles.filter((v) => v.status === "idle").length || 1,
      stopped: localVehicles.filter((v) => v.status === "stopped").length || 21,
      inactive: localVehicles.filter((v) => v.status === "inactive").length || 67,
      nodata: localVehicles.filter((v) => v.status === "nodata").length || 14,
      total: localVehicles.length || 124,
    };
  }, [localVehicles]);

  // Filter & Sort vehicles
  const filteredVehicles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return localVehicles
      .filter((v) => {
        const matchesStatus =
          activeStatus === "all" || v.status === activeStatus;
        const matchesQuery =
          q === "" ||
          v.name.toLowerCase().includes(q) ||
          v.branch.toLowerCase().includes(q) ||
          v.imei.toLowerCase().includes(q) ||
          (v.driver && v.driver.toLowerCase().includes(q)) ||
          (v.address && v.address.toLowerCase().includes(q)) ||
          (v.plateNumber && v.plateNumber.toLowerCase().includes(q));
        const matchesGroup =
          selectedGroups.includes("All") ||
          selectedGroups.some(
            (g) =>
              v.branch.toLowerCase().includes(g.toLowerCase()) ||
              (g === "Trucks" && (v.name.toLowerCase().includes("truck") || v.name.toLowerCase().includes("volvo") || v.name.toLowerCase().includes("scania")))
          );
        return matchesStatus && matchesQuery && matchesGroup;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "name") {
          cmp = a.name.localeCompare(b.name);
        } else if (sortField === "number") {
          cmp = a.imei.localeCompare(b.imei);
        } else if (sortField === "status") {
          cmp = a.status.localeCompare(b.status);
        } else if (sortField === "last_updated") {
          cmp = (a.lastUpdated || "").localeCompare(b.lastUpdated || "");
        } else if (sortField === "ignition") {
          cmp = (a.ignition ? 1 : 0) - (b.ignition ? 1 : 0);
        } else if (sortField === "power") {
          cmp = (a.battery ?? 0) - (b.battery ?? 0);
        } else if (sortField === "driver") {
          cmp = (a.driver || "").localeCompare(b.driver || "");
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
  }, [localVehicles, activeStatus, query, selectedGroups, sortField, sortDirection]);

  // Group by branch
  const branchGroups = useMemo(() => {
    const map = new Map<string, FleetObject[]>();
    for (const v of filteredVehicles) {
      const list = map.get(v.branch) ?? [];
      list.push(v);
      map.set(v.branch, list);
    }
    return [...map.entries()];
  }, [filteredVehicles]);

  const allChecked =
    vehicles.length > 0 &&
    vehicles.every((v) => checkedVehicleIds.includes(v.id));

  const toggleCollapseAll = () => {
    const allCollapsed = Object.values(collapsedGroups).every(Boolean);
    const next: Record<string, boolean> = {};
    for (const key of Object.keys(collapsedGroups)) {
      next[key] = !allCollapsed;
    }
    setCollapsedGroups(next);
  };

  return (
    <div
      style={style}
      className={cn(
        "flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg select-none relative transition-all duration-75",
        className,
      )}
    >
      {/* 1. Top Modern Tab Bar Header (Trakzee 2.0 Style) */}
      <div className="flex h-11 items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 select-none rounded-t-2xl">
        {selectedJobDetail ? (
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setSelectedJobDetail(null)}
                className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100 hover:text-[#0089FF] dark:hover:text-[#0089FF] text-xs font-extrabold transition-all cursor-pointer shrink-0 active:scale-95 py-1 uppercase tracking-wide"
                title="Back to Jobs List"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2.5] text-slate-600 dark:text-slate-400" />
                <span>{selectedJobDetail.object || "TEST SCM OBJECT"}</span>
              </button>

              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border leading-none shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                Running since . 8 hrs 22 min
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                onClick={onOpenSettings}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-colors cursor-pointer"
                title="Settings"
              >
                <Settings className="h-4 w-4 stroke-[2.2]" />
              </button>
            </div>
          </div>
        ) : activeTab === "health" ? (
          /* Textual Back Button with Chevron ONLY when in Health Score mode */
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setActiveTab("object")}
              className="flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-[#0089FF] dark:hover:text-[#0089FF] text-xs font-bold transition-colors cursor-pointer shrink-0 active:scale-95 py-1 px-1"
              title="Back to Fleet Explorer"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
              <span>Back</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth flex-1 min-w-0 pr-1">
            {[
              { id: "object", label: "Object", icon: Navigation },
              { id: "jobs", label: "Jobs", icon: Briefcase },
              { id: "driver", label: "Driver", icon: User },
              { id: "address", label: "Address", icon: MapPin },
              { id: "geofence", label: "Geofence", icon: Shield },
              { id: "trailer", label: "Trailer", icon: Truck },
              { id: "beacon", label: "Beacon", icon: Radio },
              { id: "video_telematics", label: "Video Telematics", icon: Video },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComp = tab.icon;

              if (isActive) {
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as TrackingTab)}
                    className="h-8 flex items-center gap-1.5 px-3 rounded-lg bg-[#0089FF] hover:bg-[#0070d6] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0 active:scale-98"
                  >
                    <IconComp className="h-3.5 w-3.5 stroke-[2.2] fill-current shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              }

              return (
                <TooltipProvider key={tab.id} delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setActiveTab(tab.id as TrackingTab)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shrink-0"
                      >
                        <IconComp className="h-4 w-4 stroke-[2]" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {tab.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}

        {/* Right Action Buttons (Object & Column Settings) - Hidden when on Health tab */}
        {activeTab !== "health" && (
          <div className="flex items-center gap-0.5">
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0089FF] transition-colors cursor-pointer"
                  >
                    <Settings className="h-4 w-4 stroke-[2.2]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  Object & Column Settings
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* Sleek Floating Right-Edge Collapse Handle (Centered vertically with the top 44px tab header bar) */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setTimeout(() => {
              onToggleCollapse();
            }, 0);
          }}
          className="absolute left-full top-[2px] z-50 flex h-10 w-5 items-center justify-center rounded-r-xl border border-l-0 border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-600 dark:text-slate-300 shadow-md hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#0089FF] dark:hover:text-[#0089FF] transition-all cursor-pointer active:scale-95 pointer-events-auto"
          title="Collapse Fleet Explorer"
        >
          <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
        </button>
      )}

      {/* Interactive Cursor Drag-to-Resize Handle Bar */}
      {onStartResize && (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartResize();
          }}
          onDoubleClick={() => {
            if (onResetWidth) onResetWidth();
          }}
          title="Drag to resize panel (Double-click to reset to 630px default width)"
          className="absolute top-0 bottom-0 -right-2.5 w-5 z-40 flex items-center justify-center cursor-col-resize group select-none pointer-events-auto"
        >
          <div className="h-16 w-1 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-[#0089FF] group-active:bg-[#0089FF] group-hover:w-1.5 transition-all shadow-xs flex flex-col items-center justify-center gap-1">
            <div className="w-0.5 h-0.5 rounded-full bg-white dark:bg-slate-900" />
            <div className="w-0.5 h-0.5 rounded-full bg-white dark:bg-slate-900" />
            <div className="w-0.5 h-0.5 rounded-full bg-white dark:bg-slate-900" />
          </div>
        </div>
      )}

      {/* 2. Segmented Status KPI Counter Bars */}
      {(activeTab === "jobs" && !selectedJobDetail) ? (
        <div className="px-2 py-1.5 bg-slate-50/50 dark:bg-slate-950/40 select-none shrink-0">
          <div className="grid grid-cols-5 gap-1.5">
            {/* Running */}
            <button
              type="button"
              onClick={() =>
                setActiveJobStatus(
                  activeJobStatus === "running" ? "all" : "running",
                )
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeJobStatus === "running"
                  ? "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/25 font-bold scale-[1.02]"
                  : "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeJobStatus === "running"
                      ? "bg-white animate-pulse"
                      : "bg-emerald-500",
                  )}
                />
                <span className="text-xs font-black tabular-nums leading-none">
                  {jobCounts.running}
                </span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5",
                  activeJobStatus === "running"
                    ? "text-emerald-100"
                    : "text-emerald-700/80 dark:text-emerald-400/80",
                )}
              >
                Running
              </span>
            </button>

            {/* Completed */}
            <button
              type="button"
              onClick={() =>
                setActiveJobStatus(
                  activeJobStatus === "completed" ? "all" : "completed",
                )
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeJobStatus === "completed"
                  ? "bg-[#0089FF] text-white border-sky-600 shadow-md shadow-sky-500/25 font-bold scale-[1.02]"
                  : "bg-sky-50/70 dark:bg-sky-950/30 border-sky-200/60 dark:border-sky-800/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100/80 dark:hover:bg-sky-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeJobStatus === "completed"
                      ? "bg-white"
                      : "bg-[#0089FF]",
                  )}
                />
                <span className="text-xs font-black tabular-nums leading-none">
                  {jobCounts.completed}
                </span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5",
                  activeJobStatus === "completed"
                    ? "text-sky-100"
                    : "text-sky-700/80 dark:text-sky-400/80",
                )}
              >
                Completed
              </span>
            </button>

            {/* Upcoming */}
            <button
              type="button"
              onClick={() =>
                setActiveJobStatus(
                  activeJobStatus === "upcoming" ? "all" : "upcoming",
                )
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeJobStatus === "upcoming"
                  ? "bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 font-bold scale-[1.02]"
                  : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeJobStatus === "upcoming"
                      ? "bg-white"
                      : "bg-amber-500",
                  )}
                />
                <span className="text-xs font-black tabular-nums leading-none">
                  {jobCounts.upcoming}
                </span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5",
                  activeJobStatus === "upcoming"
                    ? "text-amber-100"
                    : "text-amber-700/80 dark:text-amber-400/80",
                )}
              >
                Upcoming
              </span>
            </button>

            {/* Fail */}
            <button
              type="button"
              onClick={() =>
                setActiveJobStatus(
                  activeJobStatus === "fail" ? "all" : "fail",
                )
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeJobStatus === "fail"
                  ? "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/25 font-bold scale-[1.02]"
                  : "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100/80 dark:hover:bg-rose-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeJobStatus === "fail" ? "bg-white" : "bg-rose-500",
                  )}
                />
                <span className="text-xs font-black tabular-nums leading-none">
                  {jobCounts.fail}
                </span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5",
                  activeJobStatus === "fail"
                    ? "text-rose-100"
                    : "text-rose-700/80 dark:text-rose-400/80",
                )}
              >
                Fail
              </span>
            </button>

            {/* Total */}
            <button
              type="button"
              onClick={() => setActiveJobStatus("all")}
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeJobStatus === "all"
                  ? "bg-slate-700 text-white border-slate-800 shadow-md shadow-slate-700/25 font-bold scale-[1.02]"
                  : "bg-slate-100/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80",
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeJobStatus === "all" ? "bg-white" : "bg-slate-500",
                  )}
                />
                <span className="text-xs font-black tabular-nums leading-none">
                  {jobCounts.total}
                </span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5",
                  activeJobStatus === "all"
                    ? "text-slate-200"
                    : "text-slate-600 dark:text-slate-400",
                )}
              >
                Total
              </span>
            </button>
          </div>
        </div>
      ) : activeTab === "driver" ? (
        <div className="px-2 py-1.5 bg-slate-50/50 dark:bg-slate-950/40 select-none shrink-0">
          <div className="grid grid-cols-6 gap-1.5">
            {/* Allocated */}
            <button
              type="button"
              onClick={() =>
                setActiveDriverStatus(
                  activeDriverStatus === "allocated" ? "all" : "allocated",
                )
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeDriverStatus === "allocated"
                  ? "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/25 font-bold scale-[1.02]"
                  : "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeDriverStatus === "allocated"
                      ? "bg-white"
                      : "bg-emerald-500",
                  )}
                />
                <span className="text-xs font-black tabular-nums leading-none">
                  {driverCounts.allocated}
                </span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5",
                  activeDriverStatus === "allocated"
                    ? "text-emerald-100"
                    : "text-emerald-700/80 dark:text-emerald-400/80",
                )}
              >
                Allocated
              </span>
            </button>

            {/* Not Allocated */}
            <button
              type="button"
              onClick={() =>
                setActiveDriverStatus(
                  activeDriverStatus === "not_allocated"
                    ? "all"
                    : "not_allocated",
                )
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeDriverStatus === "not_allocated"
                  ? "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/25 font-bold scale-[1.02]"
                  : "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100/80 dark:hover:bg-rose-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeDriverStatus === "not_allocated"
                      ? "bg-white"
                      : "bg-rose-500",
                  )}
                />
                <span className="text-xs font-black tabular-nums leading-none">
                  {driverCounts.notAllocated}
                </span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5",
                  activeDriverStatus === "not_allocated"
                    ? "text-rose-100"
                    : "text-rose-700/80 dark:text-rose-400/80",
                )}
              >
                Not Alloc
              </span>
            </button>

            {/* Available */}
            <button
              type="button"
              onClick={() =>
                setActiveDriverStatus(
                  activeDriverStatus === "available" ? "all" : "available",
                )
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeDriverStatus === "available"
                  ? "bg-[#0089FF] text-white border-sky-600 shadow-md shadow-sky-500/25 font-bold scale-[1.02]"
                  : "bg-sky-50/70 dark:bg-sky-950/30 border-sky-200/60 dark:border-sky-800/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100/80 dark:hover:bg-sky-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeDriverStatus === "available"
                      ? "bg-white"
                      : "bg-[#0089FF]",
                  )}
                />
                <span className="text-xs font-black tabular-nums leading-none">
                  {driverCounts.available}
                </span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5",
                  activeDriverStatus === "available"
                    ? "text-sky-100"
                    : "text-sky-700/80 dark:text-sky-400/80",
                )}
              >
                Available
              </span>
            </button>

            {/* Not Available */}
            <button
              type="button"
              onClick={() =>
                setActiveDriverStatus(
                  activeDriverStatus === "not_available"
                    ? "all"
                    : "not_available",
                )
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeDriverStatus === "not_available"
                  ? "bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 font-bold scale-[1.02]"
                  : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeDriverStatus === "not_available"
                      ? "bg-white"
                      : "bg-amber-500",
                  )}
                />
                <span className="text-xs font-black tabular-nums leading-none">
                  {driverCounts.notAvailable}
                </span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5",
                  activeDriverStatus === "not_available"
                    ? "text-amber-100"
                    : "text-amber-700/80 dark:text-amber-400/80",
                )}
              >
                Not Avail
              </span>
            </button>

            {/* On Leave */}
            <button
              type="button"
              onClick={() =>
                setActiveDriverStatus(
                  activeDriverStatus === "on_leave" ? "all" : "on_leave",
                )
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeDriverStatus === "on_leave"
                  ? "bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-500/25 font-bold scale-[1.02]"
                  : "bg-purple-50/70 dark:bg-purple-950/30 border-purple-200/60 dark:border-purple-800/40 text-purple-800 dark:text-purple-300 hover:bg-purple-100/80 dark:hover:bg-purple-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeDriverStatus === "on_leave"
                      ? "bg-white"
                      : "bg-purple-500",
                  )}
                />
                <span className="text-xs font-black tabular-nums leading-none">
                  {driverCounts.onLeave}
                </span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5",
                  activeDriverStatus === "on_leave"
                    ? "text-purple-100"
                    : "text-purple-700/80 dark:text-purple-400/80",
                )}
              >
                On Leave
              </span>
            </button>

            {/* Total */}
            <button
              type="button"
              onClick={() => setActiveDriverStatus("all")}
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeDriverStatus === "all"
                  ? "bg-slate-700 text-white border-slate-800 shadow-md shadow-slate-700/25 font-bold scale-[1.02]"
                  : "bg-slate-100/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80",
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeDriverStatus === "all"
                      ? "bg-white"
                      : "bg-slate-500",
                  )}
                />
                <span className="text-xs font-black tabular-nums leading-none">
                  {driverCounts.total}
                </span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5",
                  activeDriverStatus === "all"
                    ? "text-slate-200"
                    : "text-slate-600 dark:text-slate-400",
                )}
              >
                Total
              </span>
            </button>
          </div>
        </div>
      ) : (activeTab === "jobs" && !selectedJobDetail) ? (
        <div className="px-2 py-1.5 bg-slate-50/50 dark:bg-slate-950/40 select-none shrink-0 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="grid grid-cols-5 gap-1.5">
            {/* Running */}
            <button
              type="button"
              onClick={() => setActiveJobStatus(activeJobStatus === "running" ? "all" : "running")}
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeJobStatus === "running"
                  ? "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/25 font-bold scale-[1.02]"
                  : "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", activeJobStatus === "running" ? "bg-white animate-pulse" : "bg-emerald-500")} />
                <span className="text-xs font-black tabular-nums leading-none">{jobCounts.running}</span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5", activeJobStatus === "running" ? "text-emerald-100" : "text-emerald-700/80 dark:text-emerald-400/80")}>
                Running
              </span>
            </button>

            {/* Completed */}
            <button
              type="button"
              onClick={() => setActiveJobStatus(activeJobStatus === "completed" ? "all" : "completed")}
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeJobStatus === "completed"
                  ? "bg-[#0089FF] text-white border-sky-600 shadow-md shadow-sky-500/25 font-bold scale-[1.02]"
                  : "bg-sky-50/70 dark:bg-sky-950/30 border-sky-200/60 dark:border-sky-800/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100/80 dark:hover:bg-sky-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", activeJobStatus === "completed" ? "bg-white" : "bg-[#0089FF]")} />
                <span className="text-xs font-black tabular-nums leading-none">{jobCounts.completed}</span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5", activeJobStatus === "completed" ? "text-sky-100" : "text-sky-700/80 dark:text-sky-400/80")}>
                Completed
              </span>
            </button>

            {/* Upcoming */}
            <button
              type="button"
              onClick={() => setActiveJobStatus(activeJobStatus === "upcoming" ? "all" : "upcoming")}
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeJobStatus === "upcoming"
                  ? "bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 font-bold scale-[1.02]"
                  : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", activeJobStatus === "upcoming" ? "bg-white" : "bg-amber-500")} />
                <span className="text-xs font-black tabular-nums leading-none">{jobCounts.upcoming}</span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5", activeJobStatus === "upcoming" ? "text-amber-100" : "text-amber-700/80 dark:text-amber-400/80")}>
                Upcoming
              </span>
            </button>

            {/* Fail */}
            <button
              type="button"
              onClick={() => setActiveJobStatus(activeJobStatus === "fail" ? "all" : "fail")}
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeJobStatus === "fail"
                  ? "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/25 font-bold scale-[1.02]"
                  : "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100/80 dark:hover:bg-rose-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", activeJobStatus === "fail" ? "bg-white" : "bg-rose-500")} />
                <span className="text-xs font-black tabular-nums leading-none">{jobCounts.fail}</span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5", activeJobStatus === "fail" ? "text-rose-100" : "text-rose-700/80 dark:text-rose-400/80")}>
                Fail
              </span>
            </button>

            {/* Total */}
            <button
              type="button"
              onClick={() => setActiveJobStatus("all")}
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeJobStatus === "all"
                  ? "bg-[#223344] text-white border-slate-700 shadow-md font-bold scale-[1.02]"
                  : "bg-slate-100/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80",
              )}
            >
              <div className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", activeJobStatus === "all" ? "bg-white" : "bg-slate-400")} />
                <span className="text-xs font-black tabular-nums leading-none">{jobCounts.total}</span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5", activeJobStatus === "all" ? "text-slate-200" : "text-slate-600 dark:text-slate-400")}>
                Total
              </span>
            </button>
          </div>
        </div>
      ) : activeTab === "object" ? (
        <div className="px-2 py-1.5 bg-slate-50/50 dark:bg-slate-950/40 select-none shrink-0">
          <div className="grid grid-cols-6 gap-1.5">
            {/* Running */}
            <button
              type="button"
              onClick={() =>
                setActiveStatus(activeStatus === "running" ? "all" : "running")
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeStatus === "running"
                  ? "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/25 font-bold scale-[1.02]"
                  : "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus === "running" ? "bg-white animate-pulse" : "bg-emerald-500")} />
                <span className="text-xs font-black tabular-nums leading-none">
                  {counts.running}
                </span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "running" ? "text-emerald-100" : "text-emerald-700/80 dark:text-emerald-400/80")}>
                Running
              </span>
            </button>

            {/* Idle */}
            <button
              type="button"
              onClick={() =>
                setActiveStatus(activeStatus === "idle" ? "all" : "idle")
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeStatus === "idle"
                  ? "bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 font-bold scale-[1.02]"
                  : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus === "idle" ? "bg-white" : "bg-amber-500")} />
                <span className="text-xs font-black tabular-nums leading-none">
                  {counts.idle}
                </span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "idle" ? "text-amber-100" : "text-amber-700/80 dark:text-amber-400/80")}>
                Idle
              </span>
            </button>

            {/* Stopped */}
            <button
              type="button"
              onClick={() =>
                setActiveStatus(activeStatus === "stopped" ? "all" : "stopped")
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeStatus === "stopped"
                  ? "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/25 font-bold scale-[1.02]"
                  : "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100/80 dark:hover:bg-rose-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus === "stopped" ? "bg-white" : "bg-rose-500")} />
                <span className="text-xs font-black tabular-nums leading-none">
                  {counts.stopped}
                </span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "stopped" ? "text-rose-100" : "text-rose-700/80 dark:text-rose-400/80")}>
                Stopped
              </span>
            </button>

            {/* Inactive */}
            <button
              type="button"
              onClick={() =>
                setActiveStatus(activeStatus === "inactive" ? "all" : "inactive")
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeStatus === "inactive"
                  ? "bg-indigo-500 text-white border-indigo-600 shadow-md shadow-indigo-500/25 font-bold scale-[1.02]"
                  : "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-800/40 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus === "inactive" ? "bg-white" : "bg-indigo-500")} />
                <span className="text-xs font-black tabular-nums leading-none">
                  {counts.inactive}
                </span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "inactive" ? "text-indigo-100" : "text-indigo-700/80 dark:text-indigo-400/80")}>
                Inactive
              </span>
            </button>

            {/* NoData */}
            <button
              type="button"
              onClick={() =>
                setActiveStatus(activeStatus === "nodata" ? "all" : "nodata")
              }
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeStatus === "nodata"
                  ? "bg-slate-600 text-white border-slate-700 shadow-md shadow-slate-600/25 font-bold scale-[1.02]"
                  : "bg-slate-100/80 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/40 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus === "nodata" ? "bg-white" : "bg-slate-400")} />
                <span className="text-xs font-black tabular-nums leading-none">
                  {counts.nodata}
                </span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "nodata" ? "text-slate-200" : "text-slate-500 dark:text-slate-400")}>
                No Data
              </span>
            </button>

            {/* Total */}
            <button
              type="button"
              onClick={() => setActiveStatus("all")}
              className={cn(
                "flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border",
                activeStatus === "all"
                  ? "bg-[#0089FF] text-white border-[#0070d6] shadow-md shadow-[#0089FF]/25 font-bold scale-[1.02]"
                  : "bg-sky-50/70 dark:bg-sky-950/30 border-sky-200/60 dark:border-sky-800/40 text-[#0089FF] dark:text-sky-300 hover:bg-sky-100/80 dark:hover:bg-sky-900/50",
              )}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-black tabular-nums leading-none">
                  {counts.total}
                </span>
              </div>
              <span className={cn("text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5", activeStatus === "all" ? "text-sky-100" : "text-[#0089FF]")}>
                Total
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {/* 3. Search & Action Toolbar */}
      {activeTab !== "health" && !(activeTab === "jobs" && selectedJobDetail) && (
        <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 p-2 bg-white dark:bg-slate-900 shrink-0">
        {/* Select All Checkbox (Hidden on Health, Driver, and Jobs tabs) */}
        {activeTab !== "health" && activeTab !== "driver" && activeTab !== "jobs" && (
          <input
            type="checkbox"
            checked={
              activeTab === "geofence"
                ? isGeofenceAllChecked
                : activeTab === "address"
                ? isAddressAllChecked
                : allChecked
            }
            onChange={(e) => {
              if (activeTab === "geofence") {
                toggleAllGeofences(e.target.checked);
              } else if (activeTab === "address") {
                toggleAllAddresses(e.target.checked);
              } else if (onToggleCheckAll) {
                onToggleCheckAll(e);
              }
            }}
            title={
              activeTab === "geofence"
                ? "Select / Deselect all geofences on map"
                : activeTab === "address"
                ? "Select / Deselect all addresses on map"
                : "Select / Deselect all vehicles on map"
            }
            className="h-[12px] w-[12px] rounded border-slate-200 dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0 ml-0.5"
          />
        )}

        {/* Search input */}
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              activeTab === "geofence"
                ? "Search by Geofence Name, Zone, Group, etc."
                : activeTab === "address"
                ? "Search by Address Name, Category, Group, etc."
                : "Search by IMEI, VIN, Registration, Object Model, SIM Number, etc."
            }
            className="h-8 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/40 pl-3 pr-8 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] focus:bg-white dark:focus:bg-slate-900 transition-colors"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-1.5 p-0.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <Search className="absolute right-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          )}
        </div>

        {/* Action Toolbar Icons (Hidden on Health tab) */}
        {activeTab !== "health" && (
          <div className="flex items-center gap-1.5 shrink-0 text-slate-600 dark:text-slate-400">
          {/* 1. Reload Button with Latest UI Trend Spring Rotation & Sonar Pulse Animation */}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === "geofence") {
                      toast.success("Geofences reloaded successfully");
                    } else if (activeTab === "address") {
                      toast.success("Addresses reloaded successfully");
                    } else {
                      handleReload();
                    }
                  }}
                  className={cn(
                    "group relative h-8 w-8 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/50 transition-all duration-300 shadow-2xs cursor-pointer active:scale-90 toolbar-action-btn overflow-hidden",
                    isRefreshing && "bg-sky-50 dark:bg-sky-950/70 text-[#0089FF] border-[#0089FF] shadow-[0_0_12px_rgba(0,137,255,0.35)]",
                  )}
                >
                  {/* Sonar Ripple Pulse Ring on Refresh */}
                  {isRefreshing && (
                    <span className="absolute inset-0 rounded-xl bg-[#0089FF]/30 animate-ping pointer-events-none" />
                  )}

                  <RotateCw
                    className={cn(
                      "h-3.5 w-3.5 stroke-[2.2] transition-transform duration-500 ease-out group-hover:rotate-180",
                      isRefreshing && "animate-spin text-[#0089FF] duration-700",
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                {activeTab === "geofence" ? "Reload / Refresh Geofence List" : activeTab === "address" ? "Reload / Refresh Address List" : "Refresh Live Telemetry"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 2. Add Object / Add Address / Add Geofence Button (Hidden on Driver and Jobs tabs) */}
          {activeTab !== "driver" && activeTab !== "jobs" && (
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "geofence") {
                        toast.info("Opening Add Geofence modal...");
                      } else if (activeTab === "address") {
                        if (onOpenAddAddress) onOpenAddAddress();
                        else toast.info("Opening Add Address modal...");
                      } else if (onOpenAddVehicle) {
                        onOpenAddVehicle();
                      }
                    }}
                    className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40 transition-all shadow-2xs cursor-pointer active:scale-95 toolbar-action-btn"
                  >
                    <PlusCircle className="h-3.5 w-3.5 stroke-[2.2]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                  {activeTab === "geofence" ? "Add Geofence" : activeTab === "address" ? "Add Address" : "Add New Object Page"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* 3. Upload Address Button (Address Tab) */}
          {activeTab === "address" && (
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenUploadAddress) onOpenUploadAddress();
                      else toast.info("Opening Upload Address (CSV/XLS)...");
                    }}
                    className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40 transition-all shadow-2xs cursor-pointer active:scale-95 toolbar-action-btn"
                  >
                    <Upload className="h-3.5 w-3.5 stroke-[2.2]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                  Upload Address
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* 4. Filter Popover (2-Tier Cascading Flyout Menu matching media_1789991076156.png & Report Overlay media_1789989587865.png) */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "h-7 w-7 flex items-center justify-center rounded-lg border transition-all shadow-2xs cursor-pointer active:scale-95 toolbar-action-btn",
                        filterOpen
                          ? "bg-sky-50 dark:bg-sky-950/60 text-[#0089FF] border-[#0089FF]/50 shadow-xs"
                          : "border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40",
                      )}
                    >
                      <Filter className="h-3.5 w-3.5 stroke-[2.2]" />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                  {activeTab === "geofence" ? "Geofence Filter" : activeTab === "address" ? "Filter Address" : "Filter Options"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent
              align="end"
              sideOffset={6}
              className="w-auto p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl text-xs z-50 select-none overflow-hidden"
            >
              {activeTab === "address" ? (
                <div className="w-72 p-3.5 bg-white dark:bg-slate-900 flex flex-col gap-3 shrink-0">
                  {/* Header Title & Selected Count Badge */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      Select Address
                    </span>
                    <span className="text-[10px] font-bold text-[#0089FF] bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-full">
                      {selectedAddressCategories.length} selected
                    </span>
                  </div>

                  {/* Search Input Bar */}
                  <div className="relative flex items-center">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={addressCategorySearch}
                      onChange={(e) => setAddressCategorySearch(e.target.value)}
                      placeholder="Search categories..."
                      className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF]"
                    />
                    {addressCategorySearch && (
                      <button
                        type="button"
                        onClick={() => setAddressCategorySearch("")}
                        className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Scrollable Checkboxes List */}
                  <div className="space-y-0.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                    {/* Select All Checkbox */}
                    <label className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer text-slate-800 dark:text-slate-200 text-xs font-semibold select-none">
                      <input
                        type="checkbox"
                        checked={selectedAddressCategories.length === ALL_ADDRESS_CATEGORIES.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAddressCategories([...ALL_ADDRESS_CATEGORIES]);
                          } else {
                            setSelectedAddressCategories([]);
                          }
                        }}
                        className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer"
                      />
                      <span>Select All</span>
                    </label>

                    <div className="border-t border-slate-200/80 dark:border-slate-800 my-1" />

                    {/* Filtered Category Checkboxes */}
                    {ALL_ADDRESS_CATEGORIES
                      .filter((cat) => cat.toLowerCase().includes(addressCategorySearch.toLowerCase()))
                      .map((cat) => {
                        const isChecked = selectedAddressCategories.includes(cat);
                        return (
                          <label
                            key={cat}
                            className={cn(
                              "flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer text-xs select-none transition-colors",
                              isChecked
                                ? "text-[#0089FF] font-semibold bg-sky-50/60 dark:bg-sky-950/40"
                                : "text-slate-700 dark:text-slate-300"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAddressCategories((prev) => [...prev, cat]);
                                } else {
                                  setSelectedAddressCategories((prev) => prev.filter((c) => c !== cat));
                                }
                              }}
                              className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer"
                            />
                            <span>{cat}</span>
                          </label>
                        );
                      })}
                  </div>

                  {/* Footer Action Buttons Bar: Save & Reset */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAddressCategories([...ALL_ADDRESS_CATEGORIES]);
                        toast.info("Reset address category filter");
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition-all cursor-pointer"
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFilterOpen(false);
                        toast.success(`Address filter updated (${selectedAddressCategories.length} categories)`);
                      }}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl shadow-md shadow-[#0089FF]/20 transition-all cursor-pointer active:scale-95"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex divide-x divide-[#DFE3EB] dark:divide-slate-800">
                {/* Primary Category List (Left Panel) */}
                <div className="w-48 p-2 space-y-0.5 bg-slate-50/70 dark:bg-slate-950/60 shrink-0">
                  {[
                    { label: "Company - Branch", hasSub: false },
                    { label: "Device Type", hasSub: false },
                    { label: "Mode", hasSub: false },
                    { label: "Group(s)", hasSub: true },
                    { label: "Reminder", hasSub: true },
                    { label: "Type(s)", hasSub: true },
                    { label: "Validity", hasSub: true },
                    { label: "SoC", hasSub: true },
                    { label: "Soil", hasSub: true },
                    { label: "Charging State", hasSub: true },
                  ].map((item) => {
                    const isActive = activeFilterCategory === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setActiveFilterCategory(item.label)}
                        onMouseEnter={() => setActiveFilterCategory(item.label)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer",
                          isActive
                            ? "bg-white dark:bg-slate-800 text-[#0089FF] font-bold shadow-xs border border-slate-200/80 dark:border-slate-700/80"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60",
                        )}
                      >
                        <span>{item.label}</span>
                        {item.hasSub && (
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 transition-transform",
                              isActive ? "text-[#0089FF] translate-x-0.5" : "text-slate-400",
                            )}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Secondary Submenu Panel matching Report Overlay media_1789989587865.png */}
                <div className="w-72 p-3 flex flex-col justify-between bg-white dark:bg-slate-900 shrink-0">
                  <div>
                    {/* Header with Title and Selected Count Badge */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        Select {activeFilterCategory.replace(/\(s\)/g, "")}
                      </span>
                      <span className="text-[10px] font-bold text-[#0089FF] bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-full">
                        {tempSelectedGroups.length} selected
                      </span>
                    </div>

                    {/* Search Input Box */}
                    <div className="relative flex items-center mb-2.5">
                      <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                      <input
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                        placeholder={`Search ${activeFilterCategory.toLowerCase()}...`}
                        className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] transition-colors"
                      />
                      {filterSearch && (
                        <button
                          type="button"
                          onClick={() => setFilterSearch("")}
                          className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Checkbox Options List */}
                    <div className="space-y-0.5 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                      {/* Select All Row */}
                      <label className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer text-slate-800 dark:text-slate-200 text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={
                            activeFilterCategory === "Group(s)"
                              ? tempSelectedGroups.length === 4
                              : tempSelectedGroups.length >= 8
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (activeFilterCategory === "Group(s)") {
                                setTempSelectedGroups(["All", "Trucks", "Camera device", "abc"]);
                              } else {
                                setTempSelectedGroups(ALL_FILTER_COMPANIES);
                              }
                            } else {
                              setTempSelectedGroups([]);
                            }
                          }}
                          className="h-[12px] w-[12px] rounded border-slate-200 dark:border-slate-700 text-[#0089FF] accent-[#0089FF]"
                        />
                        <span>Select All</span>
                      </label>

                      <div className="border-t border-slate-200/50 dark:border-slate-800/80 my-1" />

                      {/* Items */}
                      {(activeFilterCategory === "Group(s)"
                        ? ["Trucks", "Camera device", "abc"]
                        : activeFilterCategory === "Company - Branch"
                        ? ALL_FILTER_COMPANIES
                        : ["Default Option 1", "Default Option 2", "Default Option 3"]
                      )
                        .filter((item) =>
                          item.toLowerCase().includes(filterSearch.toLowerCase()),
                        )
                        .map((item) => {
                          const isChecked = tempSelectedGroups.includes(item);
                          return (
                            <label
                              key={item}
                              className={cn(
                                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer text-xs select-none transition-colors",
                                isChecked
                                  ? "text-[#0089FF] font-semibold bg-sky-50/50 dark:bg-sky-950/30"
                                  : "text-slate-700 dark:text-slate-300",
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  setTempSelectedGroups((prev) =>
                                    prev.includes(item)
                                      ? prev.filter((x) => x !== item)
                                      : [...prev, item],
                                  );
                                }}
                                className="h-[12px] w-[12px] rounded border-slate-200 dark:border-slate-700 text-[#0089FF] accent-[#0089FF]"
                              />
                              <span className="truncate">{item}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>

                  {/* Action Buttons Bar matching Report Overlay Footer */}
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setTempSelectedGroups([])}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer px-1"
                    >
                      Clear
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFilterOpen(false)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-98"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGroups(
                            tempSelectedGroups.length === 0 ? ["All"] : tempSelectedGroups,
                          );
                          setFilterOpen(false);
                          toast.success("Filter Applied!");
                        }}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-lg shadow-xs transition-all cursor-pointer active:scale-98"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </PopoverContent>
          </Popover>

          {/* 4. Calendar Action (Jobs Tab) / Sorting Popover (Object Tab) */}
          {activeTab === "jobs" ? (
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => toast.info("Opening Date Range Picker...")}
                    className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40 transition-all shadow-2xs cursor-pointer active:scale-95 toolbar-action-btn"
                  >
                    <Calendar className="h-3.5 w-3.5 stroke-[2.2]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-semibold">
                  Select Date Range / Calendar
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : activeTab !== "driver" && activeTab !== "address" && (
            <Popover open={sortOpen} onOpenChange={setSortOpen}>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "h-7 w-7 flex items-center justify-center rounded-lg border transition-all shadow-2xs cursor-pointer active:scale-95 toolbar-action-btn",
                          sortOpen
                            ? "bg-sky-50 dark:bg-sky-950/60 text-[#0089FF] border-[#0089FF]/50 shadow-xs"
                            : "border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40",
                        )}
                      >
                        <ArrowUpDown className="h-3.5 w-3.5 stroke-[2.2]" />
                      </button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-semibold text-xs bg-slate-900 text-white border-slate-800">
                    {activeTab === "geofence" ? "Sorting" : "Sorting / Order"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            <PopoverContent
              align="end"
              sideOffset={6}
              className="w-auto p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl text-xs z-50 overflow-hidden select-none"
            >
              <div className="flex divide-x divide-[#DFE3EB] dark:divide-slate-800">
                {/* Left Category Menu (Sorting / Order) */}
                <div className="w-36 p-2 space-y-0.5 bg-slate-50/70 dark:bg-slate-950/60 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveSortCategory("Sorting")}
                    onMouseEnter={() => setActiveSortCategory("Sorting")}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer",
                      activeSortCategory === "Sorting"
                        ? "bg-white dark:bg-slate-800 text-[#0089FF] font-bold shadow-xs border border-slate-200/80 dark:border-slate-700/80"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60",
                    )}
                  >
                    <span>Sorting</span>
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-transform",
                        activeSortCategory === "Sorting" ? "text-[#0089FF] translate-x-0.5" : "text-slate-400",
                      )}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSortCategory("Order")}
                    onMouseEnter={() => setActiveSortCategory("Order")}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer",
                      activeSortCategory === "Order"
                        ? "bg-white dark:bg-slate-800 text-[#0089FF] font-bold shadow-xs border border-slate-200/80 dark:border-slate-700/80"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60",
                    )}
                  >
                    <span>Order</span>
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-transform",
                        activeSortCategory === "Order" ? "text-[#0089FF] translate-x-0.5" : "text-slate-400",
                      )}
                    />
                  </button>
                </div>

                {/* Right Options Flyout Panel */}
                <div className="w-56 p-3 flex flex-col justify-between bg-white dark:bg-slate-900 shrink-0">
                  <div className="space-y-1">
                    {activeSortCategory === "Sorting" ? (
                      [
                        { label: "Object Number", key: "number" },
                        { label: "Object Name", key: "name" },
                        { label: "Status", key: "status" },
                        { label: "Last Updated Date Time", key: "last_updated" },
                        { label: "Ignition", key: "ignition" },
                        { label: "Power", key: "power" },
                        { label: "Driver", key: "driver" },
                      ].map((item) => {
                        const isSelected = tempSortField === item.key;
                        return (
                          <label
                            key={item.key}
                            onClick={() => setTempSortField(item.key as any)}
                            className={cn(
                              "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-xs select-none",
                              isSelected && "bg-sky-50/70 dark:bg-sky-950/40 text-[#0089FF] font-bold",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-[12px] w-[12px] rounded border-slate-200 dark:border-slate-700 text-[#0089FF] accent-[#0089FF]"
                            />
                            <span>{item.label}</span>
                          </label>
                        );
                      })
                    ) : (
                      [
                        { label: "Ascending", key: "asc" },
                        { label: "Descending", key: "desc" },
                      ].map((item) => {
                        const isSelected = tempSortDirection === item.key;
                        return (
                          <label
                            key={item.key}
                            onClick={() => setTempSortDirection(item.key as any)}
                            className={cn(
                              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-xs select-none",
                              isSelected && "bg-sky-50/70 dark:bg-sky-950/40 text-[#0089FF] font-bold",
                            )}
                          >
                            <input
                              type="radio"
                              name="sortDirRadioFlyout"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-3.5 w-3.5 text-[#0089FF] accent-[#0089FF]"
                            />
                            <span>{item.label}</span>
                          </label>
                        );
                      })
                    )}
                  </div>

                  {/* Footer Bar */}
                  <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setTempSortField("name");
                        setTempSortDirection("asc");
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer px-1"
                    >
                      Reset
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSortOpen(false)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-98"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSortField(tempSortField);
                          setSortDirection(tempSortDirection);
                          setSortOpen(false);
                          toast.success(`Sorted by ${tempSortField} (${tempSortDirection})`);
                        }}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-lg shadow-xs transition-all cursor-pointer active:scale-98"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          )}
          </div>
        )}
      </div>
      )}

      {/* Structured Table Column Header Bar */}
      {activeTab === "object" && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none shrink-0 overflow-x-hidden">
          <div className="w-[210px] shrink-0 truncate flex items-center gap-1 pl-1">
            <button
              type="button"
              onClick={toggleCollapseAll}
              title="Collapse / Expand All Groups"
              className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <span>Object / Name</span>
          </div>
          {selectedColumns.includes("speed") && (
            <div className="w-[50px] shrink-0 text-right">Speed</div>
          )}
          {(selectedColumns.includes("ignition") || selectedColumns.includes("gps")) && (
            <div className="w-[48px] shrink-0 text-center">Status</div>
          )}
          {(selectedColumns.includes("driver") || selectedColumns.includes("driver_mobile")) && (
            <div
              className={cn(
                "shrink-0 truncate",
                selectedColumns.includes("driver") && selectedColumns.includes("driver_mobile")
                  ? "w-[140px]"
                  : "w-[125px]"
              )}
            >
              Driver Info
            </div>
          )}
          {selectedColumns.includes("address") && (
            <div className="flex-1 min-w-[140px] truncate">Location / Address</div>
          )}
          <div className="w-[75px] shrink-0 text-right pr-1">Actions</div>
        </div>
      )}

      {/* 5. Hierarchical Object Tree & Custom Tab Views */}
      <div
        className={cn(
          "flex-1 min-h-0 flex flex-col text-xs rounded-b-2xl",
          activeTab === "health" ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden",
          activeTab === "object" && "divide-y divide-[#DFE3EB]/60 dark:divide-slate-800/60"
        )}
      >
        {activeTab === "object" && (
          <div>
            {/* Branches Groups */}
            <div className="divide-y divide-[#DFE3EB]/40 dark:divide-slate-800/40">
              {branchGroups.map(([branch, branchVehicles]) => {
                const isGroupCollapsed = collapsedGroups[branch] ?? false;
                const groupIds = branchVehicles.map((v) => v.id);
                const isGroupAllChecked =
                  groupIds.length > 0 &&
                  groupIds.every((id) => checkedVehicleIds.includes(id));
                const isGroupSomeChecked =
                  groupIds.some((id) => checkedVehicleIds.includes(id)) &&
                  !isGroupAllChecked;

                return (
                  <div key={branch}>
                    {/* Top Level Branch Header */}
                    <div className="flex items-center justify-between pl-2.5 pr-3 py-1.5 bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={isGroupAllChecked}
                          ref={(el) => {
                            if (el) el.indeterminate = isGroupSomeChecked;
                          }}
                          onChange={() => onToggleCheckGroup(groupIds)}
                          className="h-[12px] w-[12px] rounded border-slate-200 dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCollapsedGroups((prev) => ({
                              ...prev,
                              [branch]: !prev[branch],
                            }))
                          }
                          className="flex items-center gap-1 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-[#0089FF] cursor-pointer flex-1 truncate"
                        >
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-500 transition-transform duration-150",
                              isGroupCollapsed && "-rotate-90",
                            )}
                          />
                          <span className="truncate">{branch}</span>
                        </button>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0 font-semibold">
                        [{branchVehicles.length}]
                      </span>
                    </div>

                    {/* Level 2: Vehicle Rows in this Branch */}
                    {!isGroupCollapsed && (
                      <div className="divide-y divide-[#DFE3EB]/40 dark:divide-slate-800/40">
                        {branchVehicles.map((v) => {
                          const isSelected = v.id === selectedVehicleId;
                          const isChecked = checkedVehicleIds.includes(v.id);

                          return (
                            <div
                              key={v.id}
                              onClick={() => {
                                onSelectVehicle(v.id);
                                onOpenTelemetry(v);
                              }}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer select-none min-h-[46px] overflow-hidden",
                                isSelected
                                  ? "bg-sky-50/90 dark:bg-sky-950/50"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                              )}
                            >
                              {/* Col 1: Checkbox + Sleek Status Dot + Name & Timestamp */}
                              <div className="flex items-center gap-1.5 shrink-0 w-[210px] pl-4">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    onToggleCheckVehicle(v.id);
                                  }}
                                  className="h-[12px] w-[12px] rounded border-slate-200 dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                                />

                                {/* Sleek Status Dot Indicator */}
                                <span
                                  title={`Status: ${v.status.toUpperCase()}`}
                                  className={cn(
                                    "h-2 w-2 rounded-full shrink-0 shadow-2xs",
                                    v.status === "running"
                                      ? "bg-emerald-500 ring-2 ring-emerald-500/20"
                                      : v.status === "idle"
                                        ? "bg-amber-500 ring-2 ring-amber-500/20"
                                        : v.status === "stopped"
                                          ? "bg-rose-500 ring-2 ring-rose-500/20"
                                          : "bg-indigo-500 ring-2 ring-indigo-500/20",
                                  )}
                                />

                                {/* Name & Timestamp */}
                                <div className="flex flex-col min-w-0 truncate">
                                  <span className="truncate text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100">
                                    {v.name}
                                  </span>
                                  {selectedColumns.includes("last_updated") && (
                                    <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-0.5">
                                      {v.timestamp || "21-09-2026 03:03:09 PM"}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Col 2: Speed */}
                              {selectedColumns.includes("speed") && (
                                <div className="shrink-0 w-[50px] text-right font-mono font-bold text-xs text-slate-700 dark:text-slate-300 tabular-nums">
                                  <span className={v.speed > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                                    {v.speed}
                                  </span>
                                </div>
                              )}

                              {/* Col 3: Ignition & GPS Status Icons */}
                              {(selectedColumns.includes("ignition") || selectedColumns.includes("gps")) && (
                                <div className="flex items-center gap-1.5 shrink-0 w-[48px] justify-center">
                                  {selectedColumns.includes("ignition") && (
                                    <span title={"Ignition: " + (v.ignition !== false ? "ON" : "OFF")}>
                                      <Key
                                        className={cn(
                                          "h-3.5 w-3.5 stroke-[2.2]",
                                          v.ignition !== false
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-slate-400 dark:text-slate-500",
                                        )}
                                      />
                                    </span>
                                  )}
                                  {selectedColumns.includes("gps") && (
                                    <span title="GPS Signal Strong">
                                      <Wifi className="h-3.5 w-3.5 text-[#0089FF] dark:text-sky-400 stroke-[2.2]" />
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Col 4: Driver Name & Mobile Column */}
                              {(selectedColumns.includes("driver") || selectedColumns.includes("driver_mobile")) && (
                                <div
                                  className={cn(
                                    "shrink-0 truncate text-xs flex flex-col justify-center",
                                    selectedColumns.includes("driver") && selectedColumns.includes("driver_mobile")
                                      ? "w-[140px]"
                                      : "w-[125px]"
                                  )}
                                  title={`${v.driver || "No Driver"}${v.driverPhone ? ` (${v.driverPhone})` : ""}`}
                                >
                                  {selectedColumns.includes("driver") && selectedColumns.includes("driver_mobile") ? (
                                    <>
                                      <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate leading-tight">
                                        <User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 stroke-[2.2] shrink-0" />
                                        <span className="truncate">{v.driver || "Unassigned"}</span>
                                      </div>
                                      <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate leading-none mt-0.5">
                                        <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400 stroke-[2.2] shrink-0" />
                                        <span className="truncate">{v.driverPhone || "+91 98765 43210"}</span>
                                      </div>
                                    </>
                                  ) : selectedColumns.includes("driver_mobile") ? (
                                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
                                      <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2] shrink-0" />
                                      <span className="truncate">{v.driverPhone || "+91 98765 43210"}</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                                      <User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 stroke-[2.2] shrink-0" />
                                      <span className="truncate">{v.driver || "—"}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Col 5: Address / Location Column (2 Lines Layout) */}
                              {selectedColumns.includes("address") && (
                                <div
                                  className="flex-1 min-w-[140px] line-clamp-2 break-words leading-tight text-[10.5px] text-slate-600 dark:text-slate-400"
                                  title={v.address || v.branch}
                                >
                                  {v.address || `At ${v.branch} Location`}
                                </div>
                              )}

                              {/* Col 6: Action Ports */}
                              <div className="flex items-center gap-1.5 shrink-0 w-[75px] justify-end pr-1">
                                {selectedColumns.includes("live_streaming") && (
                                  <button
                                    type="button"
                                    title="Live Video Camera"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenDashcam(v);
                                    }}
                                    className="p-0.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
                                  >
                                    <Video className="h-3.5 w-3.5 stroke-[2.2]" />
                                  </button>
                                )}
                                {(selectedColumns.includes("immobilize") || selectedColumns.includes("elock")) && (
                                  <button
                                    type="button"
                                    title="Engine Lock / Immobilizer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenTelemetry(v);
                                    }}
                                    className="p-0.5 text-rose-500 dark:text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                                  >
                                    <Lock className="h-3.5 w-3.5 stroke-[2.2]" />
                                  </button>
                                )}
                                {(selectedColumns.includes("reports") || selectedColumns.includes("timeline_chart")) && (
                                  <button
                                    type="button"
                                    title="Trace on Map"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onTraceVehicle(v);
                                    }}
                                    className="p-0.5 text-[#0089FF] dark:text-sky-400 hover:text-[#0070d6] transition-colors cursor-pointer"
                                  >
                                    <Eye className="h-3.5 w-3.5 stroke-[2.2]" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  title="Telemetry Details"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenTelemetry(v);
                                  }}
                                  className="p-0.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                >
                                  <Info className="h-3.5 w-3.5 stroke-[2.2]" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reference-Matched Job Tab View (1:1 with media_1791178558557.png & 3D Page Flip Animation) */}
        {activeTab === "jobs" && (
          <div className="flex-1 min-h-0 relative [perspective:1200px] bg-white dark:bg-slate-900 overflow-hidden">
            <div
              className={cn(
                "w-full h-full relative transition-transform duration-700 ease-in-out [transform-style:preserve-3d]",
                selectedJobDetail ? "[transform:rotateY(-180deg)]" : "[transform:rotateY(0deg)]"
              )}
            >
              {/* FRONT FACE: Default Jobs List View */}
              <div className="absolute inset-0 flex flex-col min-h-0 bg-white dark:bg-slate-900 [backface-visibility:hidden]">
                {/* Jobs Tree List */}
                <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-200/60 dark:divide-slate-800/60 select-none">
                  {jobData.map((group) => {
                    const isBranchCollapsed = collapsedJobBranches[group.branch];

                    const filteredSubgroups = group.subgroups
                      .map((sub) => {
                        const filteredJobs = sub.jobs.filter((j) => {
                          let matchesStatus = true;
                          if (activeJobStatus === "running") matchesStatus = j.statusType === "running";
                          else if (activeJobStatus === "completed") matchesStatus = j.statusType === "completed";
                          else if (activeJobStatus === "upcoming") matchesStatus = j.statusType === "upcoming";
                          else if (activeJobStatus === "fail") matchesStatus = j.statusType === "fail";

                          const q = query.trim().toLowerCase();
                          const matchesQuery =
                            q === "" ||
                            j.code.toLowerCase().includes(q) ||
                            j.title.toLowerCase().includes(q) ||
                            j.object.toLowerCase().includes(q) ||
                            j.rep.toLowerCase().includes(q);

                          return matchesStatus && matchesQuery;
                        });

                        return { ...sub, jobs: filteredJobs };
                      })
                      .filter((sub) => sub.jobs.length > 0);

                    if (filteredSubgroups.length === 0) return null;

                    const branchTotalCount = filteredSubgroups.reduce(
                      (acc, sub) => acc + sub.jobs.length,
                      0,
                    );

                    return (
                      <div key={group.branch}>
                        {/* Level 1: Branch Header with Chevron Expand/Collapse */}
                        <button
                          type="button"
                          onClick={() =>
                            setCollapsedJobBranches((prev) => ({
                              ...prev,
                              [group.branch]: !prev[group.branch],
                            }))
                          }
                          className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-200/80 dark:bg-slate-800/80 border-b border-slate-300/60 dark:border-slate-700/60 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-300/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-1.5">
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 text-slate-600 dark:text-slate-300 transition-transform duration-200",
                                isBranchCollapsed && "-rotate-90",
                              )}
                            />
                            <span>{group.branch}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                            [{branchTotalCount}]
                          </span>
                        </button>

                        {/* Level 2: Subgroups */}
                        {!isBranchCollapsed &&
                          filteredSubgroups.map((sub) => {
                            const isSubCollapsed = collapsedJobSubgroups[sub.name];

                            return (
                              <div key={sub.name}>
                                {/* Subgroup Header with Chevron Expand/Collapse */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCollapsedJobSubgroups((prev) => ({
                                      ...prev,
                                      [sub.name]: !prev[sub.name],
                                    }))
                                  }
                                  className="w-full flex items-center justify-between px-4 py-1.5 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer text-left"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <ChevronDown
                                      className={cn(
                                        "h-3 w-3 text-slate-500 transition-transform duration-200",
                                        isSubCollapsed && "-rotate-90",
                                      )}
                                    />
                                    <span>{sub.name}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-500">
                                    [{sub.jobs.length}]
                                  </span>
                                </button>

                                {/* Job Item Rows - Matching Reference Image media_1791178558557.png 1:1 */}
                                {!isSubCollapsed && (
                                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {sub.jobs.map((job) => {
                                      const matchedVehicle = vehicles.find(
                                        (v) =>
                                          v.name.toLowerCase() === job.object.toLowerCase() ||
                                          v.name.toLowerCase().includes(job.object.toLowerCase()) ||
                                          job.object.toLowerCase().includes(v.name.toLowerCase())
                                      ) || vehicles[0];

                                      return (
                                        <div
                                          key={job.id}
                                          className="mx-2 my-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden select-none transition-all"
                                        >
                                          {/* LINE 1: JOB INFORMATION */}
                                          <div
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedJobDetail(null);
                                              if (onOpenTelemetry && matchedVehicle) {
                                                onOpenTelemetry(matchedVehicle, false, {
                                                  id: job.id,
                                                  code: job.code,
                                                  title: job.title,
                                                  status: job.status,
                                                  shipmentNo: `SHP-${job.code.replace("#", "")}-A`,
                                                  invoiceNo: "INV-99201",
                                                  consigneeNo: "CNS-10482",
                                                  quantity: `${job.quantity || 120} Units`,
                                                  product: "Test SCM Material",
                                                  isObjectHalt: false,
                                                });
                                              }
                                            }}
                                            className="px-3 py-2 bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200/70 dark:border-slate-800/60 flex items-center justify-between gap-2 cursor-pointer hover:bg-sky-50/60 dark:hover:bg-sky-950/30 transition-colors group/job"
                                          >
                                            {/* Left: Job Title, Code & Status */}
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                              <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                                                {job.title}
                                              </span>
                                              <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                                                {job.code}
                                              </span>
                                              <span
                                                className={cn(
                                                  "text-[10px] font-extrabold px-2 py-0.5 rounded-md border leading-none shrink-0",
                                                  job.status.toLowerCase().includes("completed")
                                                    ? "bg-sky-50 text-[#0089FF] border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800"
                                                    : job.statusType === "running"
                                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                                                      : job.statusType === "fail"
                                                        ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                                                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                                                )}
                                              >
                                                {job.status}
                                              </span>
                                            </div>

                                            {/* Right: Representative Popover & Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                              <Popover>
                                                <PopoverTrigger asChild>
                                                  <button
                                                    type="button"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center gap-1 px-1 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
                                                    title={`Click to view ${job.representatives?.length || job.repCount || 1} assigned representatives`}
                                                  >
                                                    <User
                                                      className="h-3.5 w-3.5 stroke-[2.2] text-emerald-600 dark:text-emerald-400 shrink-0"
                                                    />
                                                    <span className="text-[11px] font-extrabold font-mono text-slate-700 dark:text-slate-300">
                                                      {job.representatives?.length || job.repCount || 1}
                                                    </span>
                                                  </button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                  align="end"
                                                  side="bottom"
                                                  sideOffset={6}
                                                  className="w-56 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl text-xs select-none z-50 animate-in fade-in-50 zoom-in-95"
                                                >
                                                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5 px-1 mb-1.5">
                                                    <div className="flex items-center gap-1.5 font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                                                      <User className="h-3.5 w-3.5 text-[#0089FF] shrink-0" />
                                                      <span>Representative</span>
                                                    </div>
                                                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-[#0089FF] border border-sky-200 dark:border-sky-800">
                                                      [{job.representatives?.length || job.repCount || 1}]
                                                    </span>
                                                  </div>
                                                  <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                                                    {(job.representatives || [{ name: job.rep, phone: "+91 98765 43210" }]).map((repObj, idx) => {
                                                      const repName = typeof repObj === "string" ? repObj : repObj.name;
                                                      const repPhone = typeof repObj === "string" ? "+91 98765 43210" : repObj.phone;
                                                      const initials = repName
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("");

                                                      return (
                                                        <div
                                                          key={idx}
                                                          className="flex items-center gap-2 px-1 py-1.5 rounded-md hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors"
                                                        >
                                                          <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0 font-extrabold text-xs">
                                                            {initials}
                                                          </div>
                                                          <div className="flex flex-col min-w-0 flex-1">
                                                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate leading-tight">
                                                              {repName}
                                                            </span>
                                                            <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium truncate leading-none mt-0.5">
                                                              <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400 stroke-[2] shrink-0" />
                                                              <span className="truncate">{repPhone}</span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </PopoverContent>
                                              </Popover>

                                              <div className="flex items-center gap-1 text-slate-400">
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    toast.info(`Configuring route for ${job.code}`);
                                                  }}
                                                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer hover:text-slate-700 dark:hover:text-slate-200"
                                                  title="Job Route & Configuration"
                                                >
                                                  <SlidersHorizontal className="h-3.5 w-3.5 stroke-[2]" />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    toast.success(`Attachment downloaded for ${job.code}`);
                                                  }}
                                                  className="p-1 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400"
                                                  title="Download Attachment Document"
                                                >
                                                  <Paperclip className="h-3.5 w-3.5 stroke-[2]" />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    toast.success(`Job ${job.code} link copied to clipboard!`);
                                                  }}
                                                  className="p-1 hover:bg-purple-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                                                  title="Share Job"
                                                >
                                                  <Share2 className="h-3.5 w-3.5 stroke-[2]" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Light Inset Separator Line (10px Left & Right Margin) */}
                                          

                                          {/* LINE 2: VEHICLE & OBJECT INFORMATION */}
                                          <div
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedJobDetail({
                                                id: job.id,
                                                code: job.code,
                                                title: job.title,
                                                object: job.object,
                                                status: job.status,
                                              });
                                              if (onOpenTelemetry && matchedVehicle) {
                                                onOpenTelemetry(matchedVehicle, false, {
                                                  id: job.id,
                                                  code: job.code,
                                                  title: job.title,
                                                  object: job.object,
                                                  isObjectHalt: true,
                                                  qrCode: "QR-8849201",
                                                  itemQuantity: `${job.quantity || 120} Pcs`,
                                                  weight: job.weight || "2.4 Ton",
                                                  load: "92% Capacity",
                                                  permissibleHalt: "02:00:00",
                                                  actualHalt: "03:45:12",
                                                });
                                              } else if (matchedVehicle) {
                                                onSelectVehicle(matchedVehicle.id);
                                              }
                                            }}
                                            className="px-3 py-2 flex items-center justify-between gap-2 cursor-pointer group/veh hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-colors"
                                            title={`Click to view object checkpoints and halt details for ${job.object}`}
                                          >
                                            {/* Left: Vehicle Dot, Name & Object State */}
                                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                              <span className="h-2 w-2 rounded-full shrink-0 bg-emerald-500 ring-2 ring-emerald-500/20" />
                                              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover/veh:text-[#0089FF] dark:group-hover/veh:text-sky-400 transition-colors truncate">
                                                {job.object}
                                              </span>
                                              <span
                                                className={cn(
                                                  "text-[9.5px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0",
                                                  job.objectState === "Loaded"
                                                    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60"
                                                    : job.objectState === "Unloaded"
                                                      ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60"
                                                      : "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/60"
                                                )}
                                              >
                                                {job.objectState || "Unloaded"}
                                              </span>
                                            </div>

                                            {/* Right: Quantity, Weight, Violation, Convoy Icons Pill Container */}
                                            <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 shrink-0 select-none">
                                              <div className="flex items-center gap-1" title="Quantity">
                                                <Package className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
                                                <span className="text-[11px] font-bold">{job.quantity}</span>
                                              </div>
                                              <span className="text-slate-300 dark:text-slate-700 font-normal">|</span>
                                              <div className="flex items-center gap-1" title="Weight">
                                                <Weight className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
                                                <span className="text-[11px] font-bold">{job.weight}</span>
                                              </div>
                                              <span className="text-slate-300 dark:text-slate-700 font-normal">|</span>
                                              <div className="flex items-center gap-1" title="Violations & Alerts">
                                                <ShieldAlert className={cn("h-3.5 w-3.5 stroke-[2]", job.violation > 0 ? "text-rose-500" : "text-rose-500/80")} />
                                                <span className={cn("text-[11px] font-bold", job.violation > 0 ? "text-rose-600" : "text-slate-600 dark:text-slate-300")}>
                                                  {job.violation}
                                                </span>
                                              </div>
                                              <span className="text-slate-300 dark:text-slate-700 font-normal">|</span>
                                              <div className="flex items-center gap-1" title="Convoy Group">
                                                <Caravan className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
                                                <span className="text-[11px] font-bold">{job.convoy}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BACK FACE: Flipped Object Checkpoint Details View (1:1 with media_1791279242339.png) */}
              <div className="absolute inset-0 flex flex-col min-h-0 bg-white dark:bg-slate-900 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                {/* 1. Status KPI Pills Summary Bar (Standard Application Component: h-[39.25px] 2-tier Grid Tabs) */}
                <div className="px-2 py-1.5 bg-slate-50/50 dark:bg-slate-950/40 select-none shrink-0 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="grid grid-cols-4 gap-1.5">
                    {/* 1 UPCOMING */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobDetail(null);
                        setActiveJobStatus("upcoming");
                      }}
                      className="flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-900/50"
                    >
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span className="text-xs font-black tabular-nums leading-none">1</span>
                      </div>
                      <span className="text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5 text-amber-700/80 dark:text-amber-400/80">
                        Upcoming
                      </span>
                    </button>

                    {/* 3 RUNNING */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobDetail(null);
                        setActiveJobStatus("running");
                      }}
                      className="flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50"
                    >
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black tabular-nums leading-none">3</span>
                      </div>
                      <span className="text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5 text-emerald-700/80 dark:text-emerald-400/80">
                        Running
                      </span>
                    </button>

                    {/* 1 MISSED */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobDetail(null);
                        setActiveJobStatus("fail");
                      }}
                      className="flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100/80 dark:hover:bg-rose-900/50"
                    >
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        <span className="text-xs font-black tabular-nums leading-none">1</span>
                      </div>
                      <span className="text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5 text-rose-700/80 dark:text-rose-400/80">
                        Missed
                      </span>
                    </button>

                    {/* 8 CHECKPOINTS */}
                    <button
                      type="button"
                      className="flex flex-col items-center justify-center h-[39.25px] px-0.5 rounded-lg transition-all duration-150 cursor-pointer select-none border bg-[#223344] text-white border-slate-700 shadow-md font-bold scale-[1.02]"
                    >
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-xs font-black tabular-nums leading-none">8</span>
                      </div>
                      <span className="text-[9px] font-extrabold tracking-wide uppercase leading-tight mt-0.5 truncate max-w-full px-0.5 text-slate-200">
                        Checkpoints
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Search Bar (Matching Reference Screenshot media_1791277916068.png 1:1) */}
                <div className="px-3 py-2 border-b border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shrink-0">
                  <div className="relative flex items-center">
                    <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 stroke-[2]" />
                    <input
                      type="text"
                      placeholder="Search by IMEI, VIN, Registration, Object Mode, SIM Number, etc."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0089FF]"
                    />
                  </div>
                </div>

                {/* 3. Time Info Block Frame & Separate Distance/Duration Bar (1:1 matching media_1791280229928.png) */}
                <div className="px-3 py-2 bg-white dark:bg-slate-900 shrink-0 space-y-2">
                  {/* Top Block Frame: Actual & Estimated Start/End Grid inside Frame */}
                  <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/30 p-2.5 shadow-2xs">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {/* Left Side: Actual Start & End */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            Actual Start
                          </span>
                          <span className="font-bold text-[#223344] dark:text-slate-200 font-mono">05-11-2025 08:00 AM</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                            Actual End
                          </span>
                          <span className="font-bold text-[#223344] dark:text-slate-200 font-mono">--</span>
                        </div>
                      </div>

                      {/* Right Side: Estimated Start & End */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0089FF] shrink-0" />
                            Estimated Start
                          </span>
                          <span className="font-bold text-[#223344] dark:text-slate-200 font-mono">05-11-2025 08:00 AM</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0089FF] shrink-0" />
                            Estimated End
                          </span>
                          <span className="font-bold text-[#223344] dark:text-slate-200 font-mono">05-11-2025 06:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Separate Distance & Duration Pill Bar */}
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-[#0089FF] stroke-[2]" />
                      <span>1000 km - 88%</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
                      <span>12 hrs 22 min</span>
                    </div>
                  </div>
                </div>

                {/* 4. Table of Checkpoints inside Dedicated Card Frame (1:1 matching media_1791280487243.png) */}
                <div className="flex-1 min-h-0 px-3 pb-3">
                  <div className="h-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col shadow-2xs">
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                      <table className="w-full text-left text-[11px] select-none border-collapse">
                        <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider z-10 backdrop-blur-xs">
                          <tr>
                            <th className="py-2 px-2.5">Index</th>
                            <th className="py-2 px-2">Status</th>
                            <th className="py-2 px-2">Type</th>
                            <th className="py-2 px-2">Est. Arrival</th>
                            <th className="py-2 px-2">Act. Arrival</th>
                            <th className="py-2 px-2">Checkpoint</th>
                            <th className="py-2 px-2">Address</th>
                            <th className="py-2 px-2.5">Driver</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                          {[
                            { idx: "01", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "02", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "03", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "04", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "05", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "06", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "07", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "08", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "09", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "10", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "11", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "12", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                            { idx: "13", status: "Visited", type: "Planned", estDate: "02-10-2026", estTime: "03:00 PM", actDate: "02-10-2026", actTime: "03:15 PM", chkLine1: "Croma,", chkLine2: "Valsad", addr: "Dharampur Rd, opp. S.T. Workshop, Abr...", drvLine1: "Sukesh", drvLine2: "Gupta" },
                          ].map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/40">
                              <td className="py-1.5 px-2.5 font-mono font-bold text-slate-700 dark:text-slate-300 align-top">{r.idx}</td>
                              <td className="py-1.5 px-2 align-top">
                                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                  {r.status}
                                </span>
                              </td>
                              <td className="py-1.5 px-2 text-slate-500 align-top">{r.type}</td>
                              <td className="py-1.5 px-2 font-mono text-[10.5px] text-slate-600 dark:text-slate-400 leading-tight align-top">
                                <div>{r.estDate}</div>
                                <div>{r.estTime}</div>
                              </td>
                              <td className="py-1.5 px-2 font-mono text-[10.5px] text-slate-600 dark:text-slate-400 leading-tight align-top">
                                <div>{r.actDate}</div>
                                <div>{r.actTime}</div>
                              </td>
                              <td className="py-1.5 px-2 font-bold text-[11px] text-slate-800 dark:text-slate-200 leading-tight align-top">
                                <div>{r.chkLine1}</div>
                                <div>{r.chkLine2}</div>
                              </td>
                              <td className="py-1.5 px-2 text-slate-500 text-[10.5px] leading-tight truncate max-w-[130px] align-top" title={r.addr}>
                                {r.addr}
                              </td>
                              <td className="py-1.5 px-2.5 font-medium text-[11px] text-slate-700 dark:text-slate-300 leading-tight align-top">
                                <div>{r.drvLine1}</div>
                                <div>{r.drvLine2}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

                {/* Reference-Matched Driver Tab View (1:1 with media_1790833871737.png & media_1790835635015.png) */}
        {activeTab === "driver" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Drivers Tree List */}
            <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[#DFE3EB]/40 dark:divide-slate-800/40 select-none">
              {driverData.map((group) => {
                const isBranchCollapsed = collapsedDriverBranches[group.branch];

                // Filter subgroups and drivers based on active status & query search
                const filteredSubgroups = group.subgroups
                  .map((sub) => {
                    const filteredDrivers = sub.drivers.filter((drv) => {
                      // Filter by status button
                      let matchesStatus = true;
                      if (activeDriverStatus === "available") matchesStatus = drv.driverStatus === "Available";
                      else if (activeDriverStatus === "not_available") matchesStatus = drv.driverStatus === "Not available";
                      else if (activeDriverStatus === "on_leave") matchesStatus = drv.driverStatus === "On Leave";
                      else if (activeDriverStatus === "allocated") matchesStatus = drv.allocated;
                      else if (activeDriverStatus === "not_allocated") matchesStatus = !drv.allocated;
                      else if (activeDriverStatus === "running") matchesStatus = drv.isRunning;

                      // Filter by query search
                      const q = query.trim().toLowerCase();
                      const matchesQuery =
                        q === "" ||
                        drv.name.toLowerCase().includes(q) ||
                        drv.vehicle.toLowerCase().includes(q) ||
                        group.branch.toLowerCase().includes(q) ||
                        sub.name.toLowerCase().includes(q);

                      return matchesStatus && matchesQuery;
                    });

                    return { ...sub, drivers: filteredDrivers };
                  })
                  .filter((sub) => sub.drivers.length > 0);

                if (filteredSubgroups.length === 0) return null;

                const branchTotalCount = filteredSubgroups.reduce(
                  (acc, sub) => acc + sub.drivers.length,
                  0,
                );

                return (
                  <div key={group.branch}>
                    {/* Level 1: Branch Header with Chevron Expand/Collapse */}
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsedDriverBranches((prev) => ({
                          ...prev,
                          [group.branch]: !prev[group.branch],
                        }))
                      }
                      className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-200/80 dark:bg-slate-800/80 border-b border-slate-300/60 dark:border-slate-700/60 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-300/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-1.5">
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 text-slate-600 dark:text-slate-300 transition-transform duration-200",
                            isBranchCollapsed && "-rotate-90",
                          )}
                        />
                        <span>{group.branch}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                        [{branchTotalCount}]
                      </span>
                    </button>

                    {/* Level 2: Subgroups */}
                    {!isBranchCollapsed &&
                      filteredSubgroups.map((sub) => {
                        const isSubCollapsed = collapsedDriverSubgroups[sub.name];

                        return (
                          <div key={sub.name}>
                            {/* Subgroup Header with Chevron Expand/Collapse */}
                            <button
                              type="button"
                              onClick={() =>
                                setCollapsedDriverSubgroups((prev) => ({
                                  ...prev,
                                  [sub.name]: !prev[sub.name],
                                }))
                              }
                              className="w-full flex items-center justify-between px-4 py-1.5 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-1.5">
                                <ChevronDown
                                  className={cn(
                                    "h-3 w-3 text-slate-500 transition-transform duration-200",
                                    isSubCollapsed && "-rotate-90",
                                  )}
                                />
                                <span>{sub.name}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500">
                                [{sub.drivers.length}]
                              </span>
                            </button>

                            {/* Driver Rows */}
                            {!isSubCollapsed && (
                              <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
                                {sub.drivers.map((drv) => {
                                  // Determine status dot & name color based on selected tab or driver status
                                  let ringColor = "ring-2 ring-emerald-500/20";
                                  let dotColor = "bg-emerald-500";
                                  let nameColor = "text-[#0089FF] dark:text-sky-400";

                                  if (activeDriverStatus === "allocated") {
                                    ringColor = "ring-2 ring-emerald-500/20";
                                    dotColor = "bg-emerald-500";
                                    nameColor = "text-emerald-600 dark:text-emerald-400";
                                  } else if (activeDriverStatus === "not_allocated") {
                                    ringColor = "ring-2 ring-rose-500/20";
                                    dotColor = "bg-rose-500";
                                    nameColor = "text-rose-600 dark:text-rose-400";
                                  } else if (activeDriverStatus === "available") {
                                    ringColor = "ring-2 ring-sky-500/20";
                                    dotColor = "bg-[#0089FF]";
                                    nameColor = "text-[#0089FF] dark:text-sky-400";
                                  } else if (activeDriverStatus === "not_available") {
                                    ringColor = "ring-2 ring-amber-500/20";
                                    dotColor = "bg-amber-500";
                                    nameColor = "text-amber-600 dark:text-amber-400";
                                  } else if (activeDriverStatus === "on_leave") {
                                    ringColor = "ring-2 ring-purple-500/20";
                                    dotColor = "bg-purple-600";
                                    nameColor = "text-purple-600 dark:text-purple-400";
                                  } else {
                                    if (drv.allocated) {
                                      ringColor = "ring-2 ring-emerald-500/20";
                                      dotColor = "bg-emerald-500";
                                      nameColor = "text-emerald-600 dark:text-emerald-400";
                                    } else if (drv.driverStatus === "Not available") {
                                      ringColor = "ring-2 ring-amber-500/20";
                                      dotColor = "bg-amber-500";
                                      nameColor = "text-amber-600 dark:text-amber-400";
                                    } else if (drv.driverStatus === "On Leave") {
                                      ringColor = "ring-2 ring-purple-500/20";
                                      dotColor = "bg-purple-600";
                                      nameColor = "text-purple-600 dark:text-purple-400";
                                    } else {
                                      ringColor = "ring-2 ring-rose-500/20";
                                      dotColor = "bg-rose-500";
                                      nameColor = "text-rose-600 dark:text-rose-400";
                                    }
                                  }

                                  return (
                                    <div
                                      key={drv.id}
                                      className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer select-none"
                                    >
                                      {/* Col 1: Status Dot (Identical size & styling to Object Panel) + Name & Plate */}
                                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                        <span
                                          className={cn(
                                            "h-2 w-2 rounded-full shrink-0 mt-1 shadow-2xs",
                                            ringColor,
                                            dotColor,
                                          )}
                                        />
                                        <div className="flex flex-col min-w-0 truncate">
                                          <span className={cn("font-bold text-xs truncate leading-tight", nameColor)}>
                                            {drv.name}
                                          </span>
                                          <span className="text-[10px] font-mono font-extrabold text-slate-700 dark:text-slate-300 truncate leading-none mt-1">
                                            {drv.vehicle}
                                          </span>
                                        </div>
                                      </div>

                                    {/* Col 2: Allocation Status */}
                                    <div className="w-28 text-center text-xs text-slate-700 dark:text-slate-300 font-medium shrink-0">
                                      {drv.status}
                                    </div>

                                    {/* Col 3: Type */}
                                    <div className="w-20 text-center text-xs text-slate-700 dark:text-slate-300 font-medium shrink-0">
                                      {drv.type}
                                    </div>

                                    {/* Col 4: Action 3 Dots Icon Menu (Matching media_1790835635015.png 1:1) */}
                                    <div className="w-8 flex justify-end shrink-0 relative">
                                      <Popover
                                        open={openDriverMenuId === drv.id}
                                        onOpenChange={(open) => {
                                          if (!open) {
                                            setOpenDriverMenuId(null);
                                            setOpenStatusSubmenuId(null);
                                          } else {
                                            setOpenDriverMenuId(drv.id);
                                          }
                                        }}
                                      >
                                        <PopoverTrigger asChild>
                                          <button
                                            type="button"
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                          >
                                            <MoreVertical className="h-4 w-4" />
                                          </button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          align="end"
                                          sideOffset={4}
                                          className="w-40 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl text-xs z-50 select-none"
                                        >
                                          {/* Allocate Option */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenDriverMenuId(null);
                                              toast.success(`Allocating ${drv.name}...`, {
                                                description: `Vehicle: ${drv.vehicle}`,
                                              });
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#0089FF] font-medium transition-colors cursor-pointer"
                                          >
                                            <span>Allocate</span>
                                          </button>

                                          {/* Change Status Option (Matching media_1790835635015.png) */}
                                          <div className="relative">
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenStatusSubmenuId(
                                                  openStatusSubmenuId === drv.id ? null : drv.id,
                                                );
                                              }}
                                              onMouseEnter={() => setOpenStatusSubmenuId(drv.id)}
                                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#0089FF] font-medium transition-colors cursor-pointer"
                                            >
                                              <span>Change Status</span>
                                              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                            </button>

                                            {/* Submenu Popover Flyout (Available, Not available, On Leave) */}
                                            {openStatusSubmenuId === drv.id && (
                                              <div className="absolute left-full top-0 ml-1 w-36 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl text-xs z-50 space-y-0.5">
                                                {/* Available */}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    updateDriverStatus(drv.id, "Available");
                                                    setOpenDriverMenuId(null);
                                                    setOpenStatusSubmenuId(null);
                                                  }}
                                                  className={cn(
                                                    "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#0089FF] font-medium transition-colors cursor-pointer",
                                                    drv.driverStatus === "Available" && "bg-sky-50 dark:bg-slate-800 text-[#0089FF] font-bold",
                                                  )}
                                                >
                                                  <span className="h-2 w-2 rounded-full bg-[#0089FF] shrink-0" />
                                                  <span>Available</span>
                                                </button>

                                                {/* Not available */}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    updateDriverStatus(drv.id, "Not available");
                                                    setOpenDriverMenuId(null);
                                                    setOpenStatusSubmenuId(null);
                                                  }}
                                                  className={cn(
                                                    "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-800 hover:text-amber-600 font-medium transition-colors cursor-pointer",
                                                    drv.driverStatus === "Not available" && "bg-amber-50 dark:bg-slate-800 text-amber-600 font-bold",
                                                  )}
                                                >
                                                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                                                  <span>Not available</span>
                                                </button>

                                                {/* On Leave */}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    updateDriverStatus(drv.id, "On Leave");
                                                    setOpenDriverMenuId(null);
                                                    setOpenStatusSubmenuId(null);
                                                  }}
                                                  className={cn(
                                                    "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800 hover:text-purple-600 font-medium transition-colors cursor-pointer",
                                                    drv.driverStatus === "On Leave" && "bg-purple-50 dark:bg-slate-800 text-purple-600 font-bold",
                                                  )}
                                                >
                                                  <span className="h-2 w-2 rounded-full bg-purple-600 shrink-0" />
                                                  <span>On Leave</span>
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </div>
                                );
                              })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>

            {/* Clean Export Action Footer Bar (Without "Export Report:" Label, as requested) */}
            <div className="shrink-0 p-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 select-none">
              <button
                type="button"
                onClick={() =>
                  toast.success("Exporting Driver List to XLS (.xlsx)...", {
                    description: `${driverCounts.allocated} allocated drivers generated.`,
                  })
                }
                className="h-8 px-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white border border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-600 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95 group"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
                <span>XLS</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  toast.success("Exporting Driver List to PDF...", {
                    description: "Printable driver allocation report generated.",
                  })
                }
                className="h-8 px-4 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-600 dark:hover:bg-rose-600 text-rose-700 dark:text-rose-300 hover:text-white border border-rose-200/80 dark:border-rose-800/60 hover:border-rose-600 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95 group"
              >
                <FileText className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 group-hover:text-white transition-colors" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* Reference-Matched Address Tab View (1:1 with media_1791281186715.png) */}
        {activeTab === "address" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-slate-900">
            {/* Address Tree List */}
            <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[#DFE3EB]/40 dark:divide-slate-800/40 select-none custom-scrollbar">
              {addressData.map((group) => {
                const isGroupCollapsed = collapsedAddressGroups[group.group];

                const filteredSubgroups = group.subgroups
                  .map((sub) => {
                    const filteredAddresses = sub.addresses.filter((addr) => {
                      const q = query.trim().toLowerCase();
                      const matchesQuery =
                        q === "" ||
                        addr.name.toLowerCase().includes(q) ||
                        addr.category.toLowerCase().includes(q) ||
                        group.group.toLowerCase().includes(q);
                      const matchesCategory =
                        selectedAddressCategories.length === ALL_ADDRESS_CATEGORIES.length ||
                        selectedAddressCategories.some(
                          (cat) =>
                            cat.toLowerCase() === addr.category.toLowerCase() ||
                            (cat.includes("Bank") && addr.category.includes("Bank")),
                        );
                      return matchesQuery && matchesCategory;
                    });
                    return { ...sub, addresses: filteredAddresses };
                  })
                  .filter((sub) => sub.addresses.length > 0);

                if (filteredSubgroups.length === 0) return null;

                const groupTotalCount = filteredSubgroups.reduce(
                  (acc, sub) => acc + sub.addresses.length,
                  0,
                );

                const isAllGroupChecked = filteredSubgroups.every((sub) =>
                  sub.addresses.every((a) => a.checked),
                );

                return (
                  <div key={group.group}>
                    {/* Group Header Row */}
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200/70 dark:border-slate-700/60 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isAllGroupChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setAddressData((prev) =>
                              prev.map((g) => {
                                if (g.group === group.group) {
                                  return {
                                    ...g,
                                    checked,
                                    subgroups: g.subgroups.map((sub) => ({
                                      ...sub,
                                      checked,
                                      addresses: sub.addresses.map((a) => ({
                                        ...a,
                                        checked,
                                      })),
                                    })),
                                  };
                                }
                                return g;
                              }),
                            );
                          }}
                          className="h-[12px] w-[12px] rounded border-slate-300 text-[#0089FF] accent-[#0089FF] cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCollapsedAddressGroups((prev) => ({
                              ...prev,
                              [group.group]: !prev[group.group],
                            }))
                          }
                          className="flex items-center gap-1.5 cursor-pointer hover:text-[#0089FF] transition-colors"
                        >
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                              isGroupCollapsed && "-rotate-90",
                            )}
                          />
                          <span>{group.group}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                          [{groupTotalCount}]
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCollapsedAddressGroups((prev) => ({
                              ...prev,
                              [group.group]: !prev[group.group],
                            }))
                          }
                          className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {isGroupCollapsed ? <Plus className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Address Items */}
                    {!isGroupCollapsed &&
                      filteredSubgroups.map((sub) => (
                        <div key={sub.name} className="divide-y divide-slate-100 dark:divide-slate-800/40">
                          {sub.addresses.map((addr) => (
                            <div
                              key={addr.id}
                              className={cn(
                                "flex items-center justify-between px-3 py-1.5 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 group/addr select-none",
                                addr.checked && "bg-sky-50/40 dark:bg-sky-950/20"
                              )}
                            >
                              {/* Left: Checkbox + Dot/Pin Icon + Name */}
                              <div className="flex items-center gap-2 min-w-0 flex-1 pl-1">
                                <input
                                  type="checkbox"
                                  checked={addr.checked}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setAddressData((prev) =>
                                      prev.map((g) => ({
                                        ...g,
                                        subgroups: g.subgroups.map((s) => ({
                                          ...s,
                                          addresses: s.addresses.map((a) =>
                                            a.id === addr.id ? { ...a, checked } : a,
                                          ),
                                        })),
                                      })),
                                    );
                                  }}
                                  className="h-[12px] w-[12px] rounded border-slate-300 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                                />

                                <span
                                  className={cn(
                                    "h-2 w-2 rounded-full shrink-0",
                                    addr.checked ? "bg-[#0089FF] ring-2 ring-sky-500/20" : "bg-slate-400"
                                  )}
                                />

                                <span
                                  className={cn(
                                    "truncate font-medium text-xs",
                                    addr.checked
                                      ? "text-[#0089FF] dark:text-sky-400 font-semibold"
                                      : "text-slate-800 dark:text-slate-200"
                                  )}
                                  title={addr.name}
                                >
                                  {addr.name}
                                </span>
                              </div>

                              {/* Right Actions: Locate Pin, Edit Pencil, Delete Trash */}
                              <div className="flex items-center gap-2 shrink-0 text-slate-400">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.info(`Locating address "${addr.name}" on map...`);
                                  }}
                                  className="p-1 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                  title="Locate Address on Map"
                                >
                                  <MapPin className="h-3.5 w-3.5 stroke-[2]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onOpenAddAddress) {
                                      onOpenAddAddress({
                                        id: addr.id,
                                        reseller: "Device Integration Testing",
                                        company: "Ha Company",
                                        name: addr.name,
                                        addressType: addr.category || "Financial / Bank",
                                        tolerance: 200,
                                        description: "Configured custom address location",
                                        lat: 21.1702,
                                        lng: 72.8311,
                                      });
                                    } else {
                                      toast.success(`Editing address configuration for "${addr.name}"`);
                                    }
                                  }}
                                  className="p-1 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                  title="Edit Address"
                                >
                                  <Edit3 className="h-3.5 w-3.5 stroke-[2]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAddressData((prev) =>
                                      prev.map((g) => ({
                                        ...g,
                                        subgroups: g.subgroups.map((s) => ({
                                          ...s,
                                          addresses: s.addresses.filter((a) => a.id !== addr.id),
                                        })),
                                      })),
                                    );
                                    toast.error(`Address "${addr.name}" deleted`);
                                  }}
                                  className="p-1 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                  title="Delete Address"
                                >
                                  <Trash2 className="h-3.5 w-3.5 stroke-[2]" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Geofences Tab View (1:1 with reference screenshot media_1791282117663.png) */}
        {activeTab === "geofence" && (
          <div className="py-1">
            <div className="divide-y divide-[#DFE3EB]/60 dark:divide-slate-800/60 select-none">
              {geofenceData.map((groupData) => {
                const isGroupCollapsed = collapsedGeofenceGroups[groupData.group] ?? false;
                const filteredSubgroups = groupData.subgroups
                  .map((sub) => ({
                    ...sub,
                    geofences: sub.geofences.filter(
                      (g) =>
                        query.trim() === "" ||
                        g.name.toLowerCase().includes(query.trim().toLowerCase()) ||
                        g.category.toLowerCase().includes(query.trim().toLowerCase()) ||
                        g.type.toLowerCase().includes(query.trim().toLowerCase()),
                    ),
                  }))
                  .filter((sub) => sub.geofences.length > 0);

                const totalGeofencesInGroup = groupData.subgroups.reduce(
                  (acc, sub) => acc + sub.geofences.length,
                  0,
                );

                const allGeofencesChecked = groupData.subgroups.every((sub) =>
                  sub.geofences.every((g) => g.checked),
                );
                const someGeofencesChecked =
                  groupData.subgroups.some((sub) =>
                    sub.geofences.some((g) => g.checked),
                  ) && !allGeofencesChecked;

                return (
                  <div key={groupData.group} className="divide-y divide-[#DFE3EB]/40 dark:divide-slate-800/40">
                    {/* Top Level Branch Header */}
                    <div className="flex items-center justify-between pl-2.5 pr-3 py-1.5 bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={allGeofencesChecked}
                          ref={(el) => {
                            if (el) el.indeterminate = someGeofencesChecked;
                          }}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setGeofenceData((prev) =>
                              prev.map((g) =>
                                g.group === groupData.group
                                  ? {
                                      ...g,
                                      subgroups: g.subgroups.map((s) => ({
                                        ...s,
                                        geofences: s.geofences.map((item) => ({
                                          ...item,
                                          checked,
                                        })),
                                      })),
                                    }
                                  : g,
                              ),
                            );
                          }}
                          className="h-[12px] w-[12px] rounded border-slate-300 dark:border-slate-700 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCollapsedGeofenceGroups((prev) => ({
                              ...prev,
                              [groupData.group]: !prev[groupData.group],
                            }))
                          }
                          className="flex items-center gap-1 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-[#0089FF] cursor-pointer flex-1 truncate"
                        >
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-500 transition-transform duration-150",
                              isGroupCollapsed && "-rotate-90",
                            )}
                          />
                          <span className="truncate">{groupData.group}</span>
                        </button>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0 font-semibold">
                        [{totalGeofencesInGroup}]
                      </span>
                    </div>

                    {/* Geofence Items */}
                    {!isGroupCollapsed &&
                      filteredSubgroups.map((sub) => (
                        <div key={sub.name} className="divide-y divide-slate-100 dark:divide-slate-800/40">
                          {sub.geofences.map((geo) => {
                            const isChecked = checkedGeofenceIds.includes(geo.id);

                            return (
                              <div
                                key={geo.id}
                                className={cn(
                                  "flex items-center justify-between px-3 py-1.5 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 group/geo select-none min-h-[36px]",
                                  isChecked && "bg-sky-50/40 dark:bg-sky-950/20",
                                )}
                              >
                                {/* Left: Checkbox + Status Dot + Name */}
                                <div className="flex items-center gap-2 min-w-0 flex-1 pl-1">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      if (onToggleCheckGeofence) {
                                        onToggleCheckGeofence(geo.id);
                                      }
                                      setGeofenceData((prev) =>
                                        prev.map((g) => ({
                                          ...g,
                                          subgroups: g.subgroups.map((s) => ({
                                            ...s,
                                            geofences: s.geofences.map((item) =>
                                              item.id === geo.id ? { ...item, checked: !isChecked } : item,
                                            ),
                                          })),
                                        })),
                                      );
                                    }}
                                    className="h-[12px] w-[12px] rounded border-slate-300 text-[#0089FF] accent-[#0089FF] cursor-pointer shrink-0"
                                  />

                                  <span
                                    className={cn(
                                      "h-2 w-2 rounded-full shrink-0 transition-all",
                                      isChecked
                                        ? "bg-[#0089FF] ring-2 ring-sky-500/20 shadow-xs"
                                        : "border border-slate-400 bg-transparent dark:border-slate-500",
                                    )}
                                  />

                                  <span
                                    className={cn(
                                      "truncate text-xs transition-colors cursor-pointer",
                                      isChecked
                                        ? "text-[#0089FF] dark:text-sky-400 font-bold"
                                        : "text-slate-700 dark:text-slate-300 font-medium",
                                    )}
                                    title={geo.name}
                                    onClick={() => {
                                      if (!isChecked && onToggleCheckGeofence) {
                                        onToggleCheckGeofence(geo.id);
                                      }
                                      if (onSelectGeofence) {
                                        onSelectGeofence(geo.id);
                                      }
                                      toast.info(`Focusing map on geofence "${geo.name}"`);
                                    }}
                                  >
                                    {geo.name}
                                  </span>
                                </div>

                                {/* Right Actions: Locate Pin, Edit Pencil, Delete Trash */}
                                <div className="flex items-center gap-2 shrink-0 text-slate-400">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isChecked && onToggleCheckGeofence) {
                                        onToggleCheckGeofence(geo.id);
                                      }
                                      if (onSelectGeofence) {
                                        onSelectGeofence(geo.id);
                                      }
                                      toast.info(`Focusing map on geofence "${geo.name}"`);
                                    }}
                                    className="p-1 hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                    title="Locate Geofence on Map"
                                  >
                                    <MapPin className="h-3.5 w-3.5 stroke-[2]" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.success(`Editing geofence configuration for "${geo.name}"`);
                                    }}
                                    className="p-1 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                    title="Edit Geofence"
                                  >
                                    <Edit3 className="h-3.5 w-3.5 stroke-[2]" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setGeofenceData((prev) =>
                                        prev.map((g) => ({
                                          ...g,
                                          subgroups: g.subgroups.map((s) => ({
                                            ...s,
                                            geofences: s.geofences.filter((item) => item.id !== geo.id),
                                          })),
                                        })),
                                      );
                                      toast.error(`Geofence "${geo.name}" deleted`);
                                    }}
                                    className="p-1 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                    title="Delete Geofence"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 stroke-[2]" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Routes Tab View */}
        {activeTab === "route" && (
          <div className="p-3 space-y-2">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Active Freight Routes (3)</span>
              <span className="text-[10px] text-[#0089FF]">Live Dispatch</span>
            </div>
            {[
              { name: "Express Corridor A-1", origin: "Valsad", dest: "Surat", dist: "92 km", status: "Optimal" },
              { name: "Java Highway 1", origin: "Jakarta", dest: "Bandung", dist: "154 km", status: "Heavy Traffic" },
              { name: "Thai Inter-City 4", origin: "Bangkok", dest: "Chonburi", dist: "88 km", status: "Clear" },
            ].map((r, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-[#0089FF] cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{r.name}</div>
                    <div className="text-[10px] text-slate-500">{r.origin} ➔ {r.dest} ({r.dist})</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-500/20">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Landmarks Tab View */}
        {activeTab === "landmark" && (
          <div className="p-3 space-y-2">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Landmarks & POIs (4)</span>
              <span className="text-[10px] text-[#0089FF]">Custom POI</span>
            </div>
            {[
              { name: "Valsad Refueling Station #2", category: "Fuel Station", city: "Valsad" },
              { name: "Central Service Center", category: "Maintenance Depot", city: "Jakarta" },
              { name: "Bangkok Cargo Terminal", category: "Warehouse", city: "Bangkok" },
              { name: "Highway Rest Stop 14", category: "Rest Area", city: "Surat" },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-[#0089FF] cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{p.name}</div>
                    <div className="text-[10px] text-slate-500">{p.category} · {p.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Cameras Tab View */}
        {activeTab === "camera" && (
          <div className="p-3 space-y-2">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Live Video Telematics Cameras</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">● LIVE</span>
            </div>
            {filteredVehicles.slice(0, 6).map((v) => (
              <div
                key={v.id}
                onClick={() => onOpenDashcam(v)}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-[#0089FF] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                    <Video className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{v.name}</div>
                    <div className="text-[10px] text-slate-500">Dual AI Camera (DMS + ADAS)</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded bg-[#0089FF] text-white text-[10px] font-bold hover:bg-[#0070d6] transition-colors cursor-pointer"
                >
                  Stream Live
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Live Alerts Tab View */}
        {activeTab === "alerts" && (
          <div className="p-3 space-y-2">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Recent Live Fleet Alerts</span>
              <span className="text-[10px] text-rose-500 font-mono font-bold">Real-Time</span>
            </div>
            {[
              { type: "Overspeeding Warning", vehicle: "Fuel - 1001", speed: "107 km/h", time: "2 mins ago", sev: "high" },
              { type: "Harsh Braking Event", vehicle: "BUS - 130003", speed: "135 km/h", time: "8 mins ago", sev: "high" },
              { type: "Geofence Exit", vehicle: "Temperature - 12394", speed: "150 km/h", time: "14 mins ago", sev: "med" },
              { type: "Low Battery Level", vehicle: "Scania - 1004", speed: "102 km/h", time: "22 mins ago", sev: "low" },
            ].map((a, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-rose-500 cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "p-2 rounded-md border",
                    a.sev === "high" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800" : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800"
                  )}>
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{a.type}</div>
                    <div className="text-[10px] text-slate-500">{a.vehicle} · {a.speed}</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{a.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* Health Score Full View (Matching media_1790577972357.png & media_1790579625204.png) */}
        {activeTab === "health" && (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-white dark:bg-slate-900">
            {/* 1. Category Filters Header Bar */}
            <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 grid grid-cols-4 gap-1.5 shrink-0">
              {/* Safety */}
              <button
                type="button"
                onClick={() => {
                  setSelectedHealthCategory(selectedHealthCategory === "safety" ? "all" : "safety");
                  if (onCloseTelemetry) onCloseTelemetry();
                }}
                className={cn(
                  "py-1.5 px-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none",
                  selectedHealthCategory === "safety"
                    ? "bg-[#10B981] text-white border-emerald-600 shadow-md shadow-emerald-500/20 font-bold"
                    : "bg-[#EBF9F0] dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60 text-slate-800 dark:text-slate-100 hover:bg-emerald-100/80"
                )}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <div className={cn("h-4 w-4 rounded-full flex items-center justify-center shrink-0", selectedHealthCategory === "safety" ? "bg-white text-[#10B981]" : "bg-[#10B981] text-white")}>
                    <ShieldCheck className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs truncate">Safety</span>
                </div>
                <span className={cn("font-extrabold text-xs font-mono ml-1 shrink-0", selectedHealthCategory === "safety" ? "text-white" : "text-[#10B981]")}>85</span>
              </button>

              {/* Efficiency */}
              <button
                type="button"
                onClick={() => {
                  setSelectedHealthCategory(selectedHealthCategory === "efficiency" ? "all" : "efficiency");
                  if (onCloseTelemetry) onCloseTelemetry();
                }}
                className={cn(
                  "py-1.5 px-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none",
                  selectedHealthCategory === "efficiency"
                    ? "bg-[#D97706] text-white border-amber-600 shadow-md shadow-amber-500/20 font-bold"
                    : "bg-[#FFFBEB] dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/60 text-slate-800 dark:text-slate-100 hover:bg-amber-100/80"
                )}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <Timer className={cn("h-3.5 w-3.5 shrink-0 stroke-[2.2]", selectedHealthCategory === "efficiency" ? "text-white" : "text-[#D97706]")} />
                  <span className="text-xs truncate">Efficiency</span>
                </div>
                <span className={cn("font-extrabold text-xs font-mono ml-1 shrink-0", selectedHealthCategory === "efficiency" ? "text-white" : "text-[#D97706]")}>72</span>
              </button>

              {/* Risk */}
              <button
                type="button"
                onClick={() => {
                  setSelectedHealthCategory(selectedHealthCategory === "risk" ? "all" : "risk");
                  if (onCloseTelemetry) onCloseTelemetry();
                }}
                className={cn(
                  "py-1.5 px-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none",
                  selectedHealthCategory === "risk"
                    ? "bg-[#EF4444] text-white border-rose-600 shadow-md shadow-rose-500/20 font-bold"
                    : "bg-[#FEF2F2] dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-800/60 text-slate-800 dark:text-slate-100 hover:bg-rose-100/80"
                )}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <AlertTriangle className={cn("h-3.5 w-3.5 shrink-0 stroke-white", selectedHealthCategory === "risk" ? "text-white fill-white stroke-[#EF4444]" : "text-[#EF4444] fill-[#EF4444]")} />
                  <span className="text-xs truncate">Risk</span>
                </div>
                <span className={cn("font-extrabold text-xs font-mono ml-1 shrink-0", selectedHealthCategory === "risk" ? "text-white" : "text-[#EF4444]")}>15</span>
              </button>

              {/* Discipline */}
              <button
                type="button"
                onClick={() => {
                  setSelectedHealthCategory(selectedHealthCategory === "discipline" ? "all" : "discipline");
                  if (onCloseTelemetry) onCloseTelemetry();
                }}
                className={cn(
                  "py-1.5 px-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none",
                  selectedHealthCategory === "discipline"
                    ? "bg-[#0089FF] text-white border-sky-600 shadow-md shadow-sky-500/20 font-bold"
                    : "bg-[#F0F9FF] dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-800/60 text-slate-800 dark:text-slate-100 hover:bg-sky-100/80"
                )}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <ThumbsUp className={cn("h-3.5 w-3.5 shrink-0 fill-current", selectedHealthCategory === "discipline" ? "text-white" : "text-[#0089FF]")} />
                  <span className="text-xs truncate">Discipline</span>
                </div>
                <span className={cn("font-extrabold text-xs font-mono ml-1 shrink-0", selectedHealthCategory === "discipline" ? "text-white" : "text-[#0089FF]")}>98</span>
              </button>
            </div>

            {/* 2. Search & Info Sub-Header (Matching media_1790577972357.png) */}
            <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={healthSearch}
                    onChange={(e) => setHealthSearch(e.target.value)}
                    placeholder="Search by IMEI, Registration, Object Model..."
                    className="w-full h-8 pl-8 pr-8 rounded-lg bg-slate-100 dark:bg-slate-800 border-0 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0089FF]"
                  />
                  {healthSearch && (
                    <button
                      type="button"
                      onClick={() => setHealthSearch("")}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Ascending / Descending Sort Button Beside Search Input (Matching media_1790577972357.png) */}
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          const nextOrder = healthSortOrder === "asc" ? "desc" : "asc";
                          setHealthSortOrder(nextOrder);
                          toast.success(
                            `Sorted by Health Score (${nextOrder === "asc" ? "Ascending" : "Descending"})`,
                          );
                        }}
                        className={cn(
                          "h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-[#0089FF] dark:hover:text-[#0089FF] hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-[#0089FF]/40 transition-all cursor-pointer shrink-0 active:scale-95",
                          healthSortOrder === "asc" && "text-[#0089FF] border-[#0089FF]/60 bg-sky-50 dark:bg-sky-950/40",
                        )}
                        title="Sort Ascending / Descending"
                      >
                        <ArrowUpDown className="h-3.5 w-3.5 stroke-[2.2]" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs font-semibold">
                      Sort {healthSortOrder === "asc" ? "Descending (High to Low)" : "Ascending (Low to High)"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="px-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Based on {filteredHealthVehicles.length} eligible vehicles
              </div>
            </div>

            {/* 3. Full View Vehicle Health Score List (Matching media_1790577972357.png) */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredHealthVehicles.map((v, i) => {
                const score = 75 + ((i * 7 + 13) % 23);
                const isSelected = v.id === selectedVehicleId;

                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      onSelectVehicle(v.id);
                      onOpenTelemetry(v, true);
                    }}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer select-none",
                      isSelected && "bg-sky-50/80 dark:bg-sky-950/40"
                    )}
                  >
                    {/* Left: Status dot + Name & IMEI */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pl-1">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full shrink-0 shadow-2xs ml-0.5",
                          v.status === "running"
                            ? "bg-emerald-500"
                            : v.status === "idle"
                              ? "bg-amber-500"
                              : v.status === "stopped"
                                ? "bg-rose-500"
                                : "bg-indigo-500"
                        )}
                      />
                      <div className="flex flex-col min-w-0 truncate">
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate">
                          {v.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">
                          IMEI: {v.imei}
                        </span>
                      </div>
                    </div>

                    {/* Right: Score Pill Badge + Chevron */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border tabular-nums shadow-2xs",
                          score >= 80
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-500/20"
                            : score >= 60
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-500/20"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-500/20"
                        )}
                      >
                        {score}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 stroke-[2]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pinned Bottom Vehicle Health Scores Footer Bar (Visible ONLY on Object tab) */}
      {activeTab === "object" && (
        <div className="shrink-0 border-t border-[#DFE3EB] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-2 py-1.5 flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar select-none rounded-b-2xl">
          {/* Safety Score */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("health");
              setSelectedHealthCategory("safety");
              if (onCloseTelemetry) onCloseTelemetry();
            }}
            className={cn(
              "flex-1 min-w-[76px] h-[39.25px] px-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs",
              activeTab === "health" && selectedHealthCategory === "safety"
                ? "bg-[#10B981] text-white border-emerald-600 shadow-md shadow-emerald-500/20 font-bold"
                : "bg-[#EBF9F0] dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/50 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50"
            )}
            title="View Safety Health Scores"
          >
            <div className={cn("h-4 w-4 rounded-full flex items-center justify-center shrink-0 shadow-2xs", activeTab === "health" && selectedHealthCategory === "safety" ? "bg-white text-[#10B981]" : "bg-[#10B981] text-white")}>
              <ShieldCheck className="h-2.5 w-2.5 stroke-[3]" />
            </div>
            <span className={cn("text-xs font-semibold", activeTab === "health" && selectedHealthCategory === "safety" ? "text-white" : "text-slate-800 dark:text-slate-100")}>Safety</span>
            <span className={cn("font-extrabold text-xs font-mono ml-0.5", activeTab === "health" && selectedHealthCategory === "safety" ? "text-white" : "text-[#10B981]")}>85</span>
          </button>

          {/* Efficiency Score */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("health");
              setSelectedHealthCategory("efficiency");
              if (onCloseTelemetry) onCloseTelemetry();
            }}
            className={cn(
              "flex-1 min-w-[82px] h-[39.25px] px-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs",
              activeTab === "health" && selectedHealthCategory === "efficiency"
                ? "bg-[#D97706] text-white border-amber-600 shadow-md shadow-amber-500/20 font-bold"
                : "bg-[#FFFBEB] dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/50 hover:bg-amber-100/70 dark:hover:bg-amber-900/50"
            )}
            title="View Efficiency Health Scores"
          >
            <Timer className={cn("h-4 w-4 shrink-0 stroke-[2.2]", activeTab === "health" && selectedHealthCategory === "efficiency" ? "text-white" : "text-[#D97706]")} />
            <span className={cn("text-xs font-semibold", activeTab === "health" && selectedHealthCategory === "efficiency" ? "text-white" : "text-slate-800 dark:text-slate-100")}>Efficiency</span>
            <span className={cn("font-extrabold text-xs font-mono ml-0.5", activeTab === "health" && selectedHealthCategory === "efficiency" ? "text-white" : "text-[#D97706]")}>72</span>
          </button>

          {/* Risk Score */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("health");
              setSelectedHealthCategory("risk");
              if (onCloseTelemetry) onCloseTelemetry();
            }}
            className={cn(
              "flex-1 min-w-[68px] h-[39.25px] px-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs",
              activeTab === "health" && selectedHealthCategory === "risk"
                ? "bg-[#EF4444] text-white border-rose-600 shadow-md shadow-rose-500/20 font-bold"
                : "bg-[#FEF2F2] dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/50 hover:bg-rose-100/70 dark:hover:bg-rose-900/50"
            )}
            title="View Risk Health Scores"
          >
            <AlertTriangle className={cn("h-4 w-4 shrink-0 stroke-white", activeTab === "health" && selectedHealthCategory === "risk" ? "text-white fill-white stroke-[#EF4444]" : "text-[#EF4444] fill-[#EF4444]")} />
            <span className={cn("text-xs font-semibold", activeTab === "health" && selectedHealthCategory === "risk" ? "text-white" : "text-slate-800 dark:text-slate-100")}>Risk</span>
            <span className={cn("font-extrabold text-xs font-mono ml-0.5", activeTab === "health" && selectedHealthCategory === "risk" ? "text-white" : "text-[#EF4444]")}>15</span>
          </button>

          {/* Discipline Score */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("health");
              setSelectedHealthCategory("discipline");
              if (onCloseTelemetry) onCloseTelemetry();
            }}
            className={cn(
              "flex-1 min-w-[88px] h-[39.25px] px-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs",
              activeTab === "health" && selectedHealthCategory === "discipline"
                ? "bg-[#0089FF] text-white border-sky-600 shadow-md shadow-sky-500/20 font-bold"
                : "bg-[#F0F9FF] dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-800/50 hover:bg-sky-100/70 dark:hover:bg-sky-900/50"
            )}
            title="View Route Discipline Scores"
          >
            <ThumbsUp className={cn("h-4 w-4 shrink-0 fill-current", activeTab === "health" && selectedHealthCategory === "discipline" ? "text-white" : "text-[#0089FF]")} />
            <span className={cn("text-xs font-semibold", activeTab === "health" && selectedHealthCategory === "discipline" ? "text-white" : "text-slate-800 dark:text-slate-100")}>Discipline</span>
            <span className={cn("font-extrabold text-xs font-mono ml-0.5", activeTab === "health" && selectedHealthCategory === "discipline" ? "text-white" : "text-[#0089FF]")}>98</span>
          </button>
        </div>
      )}
    </div>
  );
}
