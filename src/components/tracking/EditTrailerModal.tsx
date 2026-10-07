import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Trash2, Upload, Download, FileText, ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface AdditionalInfoRow {
  id: string;
  label: string;
  value: string;
}

export interface DocumentRow {
  id: string;
  type: string;
  name: string;
  fileName?: string;
  issueDate: string;
  expiryDate: string;
}

export interface TrailerItem {
  id: string;
  name: string;
  code: string;
  isAttached: boolean;
  vehicle: string;
  group?: string;
  subgroup?: string;
  allocationBasedOn?: string;
  description?: string;
  additionalInfo?: AdditionalInfoRow[];
  documents?: DocumentRow[];
}

interface EditTrailerModalProps {
  open: boolean;
  onClose: () => void;
  trailer: TrailerItem | null;
  availableVehicles?: Array<{ id: string; name: string; plateNumber?: string }>;
  onSaveTrailer: (updatedTrailer: TrailerItem) => void;
}

export function EditTrailerModal({
  open,
  onClose,
  trailer,
  availableVehicles = [
    { id: "v1", name: "MH 14 KQ 4446" },
    { id: "v2", name: "MH 14 KA 6985" },
    { id: "v3", name: "MH 14 KA 9125" },
    { id: "v4", name: "MH 12 QW 5286" },
    { id: "v5", name: "GJ 05 CU 1936" },
  ],
  onSaveTrailer,
}: EditTrailerModalProps) {
  const [activeTab, setActiveTab] = useState<"General" | "Additional Information" | "Document">("General");
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: "info" | "document";
    id: string;
    title: string;
  } | null>(null);

  // General Tab State (Matching media_1791357864447.png)
  const [company, setCompany] = useState("Company");
  const [branch, setBranch] = useState("Valsad");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [allocationBasedOn, setAllocationBasedOn] = useState("Manual");
  const [defaultObjectNumber, setDefaultObjectNumber] = useState("Unassigned");
  const [description, setDescription] = useState("");

  // Additional Information Tab State (Matching media_1791357885819.png)
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoRow[]>([
    { id: "info-1", label: "HP Label 1", value: "100" },
    { id: "info-2", label: "HP Label 2", value: "200" },
  ]);

  // Document Tab State (Matching media_1791357916527.png)
  const [documents, setDocuments] = useState<DocumentRow[]>([
    { id: "doc-1", type: "Insurance", name: "Insurance Policy", fileName: "Document_2.jpg", issueDate: "2026-09-01", expiryDate: "2026-09-20" },
    { id: "doc-2", type: "State Permit", name: "State Permit Pass", fileName: "State_Permit.jpg", issueDate: "2026-09-02", expiryDate: "2026-09-30" },
  ]);

  useEffect(() => {
    if (!open || !trailer) return;
    setActiveTab("General");
    setCompany(trailer.group || "Company");
    setBranch(trailer.subgroup || "Valsad");
    setName(trailer.name || "");
    setCode(trailer.code || "");
    setAllocationBasedOn(trailer.allocationBasedOn || "Manual");
    setDefaultObjectNumber(trailer.vehicle || "Unassigned");
    setDescription(trailer.description || "");

    if (trailer.additionalInfo && trailer.additionalInfo.length > 0) {
      setAdditionalInfo(trailer.additionalInfo);
    } else {
      setAdditionalInfo([
        { id: "info-1", label: "HP Label 1", value: "100" },
        { id: "info-2", label: "HP Label 2", value: "200" },
      ]);
    }

    if (trailer.documents && trailer.documents.length > 0) {
      setDocuments(trailer.documents);
    } else {
      setDocuments([
        { id: "doc-1", type: "Insurance", name: "Insurance Policy", fileName: "Document_2.jpg", issueDate: "2026-09-01", expiryDate: "2026-09-20" },
        { id: "doc-2", type: "State Permit", name: "State Permit Pass", fileName: "State_Permit.jpg", issueDate: "2026-09-02", expiryDate: "2026-09-30" },
      ]);
    }
  }, [open, trailer]);

  if (!open || !trailer) return null;

  const isEditing = Boolean(trailer.name);

  // Handlers for Additional Info
  const handleAddInfoRow = () => {
    setAdditionalInfo((prev) => [
      ...prev,
      { id: `info-${Date.now()}`, label: "", value: "" },
    ]);
  };

  const handleUpdateInfoRow = (id: string, field: "label" | "value", val: string) => {
    setAdditionalInfo((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: val } : row)),
    );
  };

  const handleDeleteInfoRow = (id: string) => {
    setAdditionalInfo((prev) => prev.filter((row) => row.id !== id));
  };

  // Handlers for Documents
  const handleAddDocumentRow = () => {
    setDocuments((prev) => [
      ...prev,
      {
        id: `doc-${Date.now()}`,
        type: "Insurance",
        name: "",
        fileName: "New_Document.pdf",
        issueDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
      },
    ]);
  };

  const handleUpdateDocumentRow = (id: string, field: keyof DocumentRow, val: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, [field]: val } : doc)),
    );
  };

  const handleDeleteDocumentRow = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Trailer Name is required");
      return;
    }

    const updated: TrailerItem = {
      ...trailer,
      name: name.trim(),
      code: code.trim(),
      group: company,
      subgroup: branch,
      vehicle: defaultObjectNumber,
      isAttached: defaultObjectNumber !== "Unassigned",
      allocationBasedOn,
      description,
      additionalInfo,
      documents,
    };

    onSaveTrailer(updated);
    toast.success(
      isEditing
        ? `Trailer "${name}" updated successfully!`
        : `Trailer "${name}" created successfully!`,
    );
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200 select-none overflow-hidden">
      {/* Centered Modal Container with exact 1700px width and 782px fixed height */}
      <div className="relative w-full max-w-[1700px] h-[782px] max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* 1. Modal Header Bar */}
        <div className="flex h-[56px] items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Back"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {isEditing ? "Edit Trailer" : "Add Trailer"}
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5 stroke-[2]" />
          </button>
        </div>

        {/* 2. Sub-header Navigation Tabs Bar */}
        <div className="flex h-[44px] items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 gap-8">
          {[
            { id: "General", label: "General" },
            { id: "Additional Information", label: "Additional Information" },
            { id: "Document", label: "Document" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "h-full flex items-center text-xs font-bold transition-all cursor-pointer border-b-2 relative -mb-px",
                  isActive
                    ? "border-[#0089FF] text-[#0089FF]"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 3. Modal Form Body Canvas */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0 bg-[#FAFBFC] dark:bg-slate-950 p-4 md:p-5 overflow-hidden">
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs p-5 overflow-y-auto custom-scrollbar flex flex-col">
            
            {/* Tab 1: General Parameters */}
            {activeTab === "General" && (
              <div className="space-y-3.5 py-1 max-w-3xl">
                {/* Reseller */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Reseller <span className="text-rose-500">*</span>
                  </label>
                  <div className="col-span-6">
                    <Select defaultValue="Select Reseller">
                      <SelectTrigger className="h-9 text-xs bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="Select Reseller" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <SelectItem value="Select Reseller">Select Reseller</SelectItem>
                        <SelectItem value="Uffizio Tech">Uffizio Tech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Company */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Company <span className="text-rose-500">*</span>
                  </label>
                  <div className="col-span-6">
                    <Select value={company} onValueChange={setCompany}>
                      <SelectTrigger className="h-9 text-xs bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <SelectItem value="Company">Company</SelectItem>
                        <SelectItem value="TKDN">TKDN</SelectItem>
                        <SelectItem value="Jaideep Test Account">Jaideep Test Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Branch */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Branch <span className="text-rose-500">*</span>
                  </label>
                  <div className="col-span-6">
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger className="h-9 text-xs bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <SelectItem value="Valsad">Valsad</SelectItem>
                        <SelectItem value="TKDN">TKDN</SelectItem>
                        <SelectItem value="VALSAD BRANCH">VALSAD BRANCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Trailer Name */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Trailer Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Trailer Name (e.g. Patch 209 Trailer 1)"
                      className="w-full h-9 px-3 text-xs bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF] transition-colors"
                    />
                  </div>
                </div>

                {/* Code */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Code <span className="text-rose-500">*</span>
                  </label>
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. PATCH209T01"
                      className="w-full h-9 px-3 font-mono text-xs bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF] transition-colors"
                    />
                  </div>
                </div>

                {/* Allocation Based On */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Allocation Based On
                  </label>
                  <div className="col-span-6">
                    <Select value={allocationBasedOn} onValueChange={setAllocationBasedOn}>
                      <SelectTrigger className="h-9 text-xs bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="Select Allocation Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Bluetooth Beacon">Bluetooth Beacon</SelectItem>
                        <SelectItem value="RFID Sensor">RFID Sensor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Default Object Number */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Default Object Number
                  </label>
                  <div className="col-span-6">
                    <Select value={defaultObjectNumber} onValueChange={setDefaultObjectNumber}>
                      <SelectTrigger className="h-9 text-xs bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="Select Default Object" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <SelectItem value="Unassigned">Select (Unassigned)</SelectItem>
                        {availableVehicles.map((v) => (
                          <SelectItem key={v.id} value={v.name}>
                            {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-12 items-start gap-4">
                  <label className="col-span-3 text-xs font-bold text-slate-700 dark:text-slate-300 pt-2">
                    Description
                  </label>
                  <div className="col-span-6">
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description..."
                      className="w-full p-2.5 text-xs bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF] transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Additional Information matching media_1791361265546.png */}
            {activeTab === "Additional Information" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Configured Metadata Attributes
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddInfoRow}
                    className="px-4 py-2 bg-[#0089FF] hover:bg-[#0070d6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#0089FF]/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Add Additional Info</span>
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3 w-1/2">LABEL</th>
                        <th className="px-4 py-3 w-1/2">VALUE</th>
                        <th className="px-4 py-3 w-16 text-center">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                      {additionalInfo.map((row) => (
                        <tr key={row.id}>
                          <td className="p-3">
                            <input
                              type="text"
                              value={row.label}
                              onChange={(e) => handleUpdateInfoRow(row.id, "label", e.target.value)}
                              placeholder="Label Name (e.g. Max Weight)"
                              className="w-full h-9 px-3 text-xs bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF]"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={row.value}
                              onChange={(e) => handleUpdateInfoRow(row.id, "value", e.target.value)}
                              placeholder="Value (e.g. 100)"
                              className="w-full h-9 px-3 text-xs bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF]"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmTarget({ type: "info", id: row.id, title: row.label || "Attribute" })}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                              title="Delete Row"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Document matching media_1791361273404.png */}
            {activeTab === "Document" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Trailer Compliance Documents
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddDocumentRow}
                    className="px-4 py-2 bg-[#0089FF] hover:bg-[#0070d6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#0089FF]/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Add Document</span>
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-2xs">
                  <table className="w-full text-left text-xs min-w-[750px]">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3">DOCUMENT TYPE</th>
                        <th className="px-4 py-3">DOCUMENT NAME</th>
                        <th className="px-4 py-3">UPLOAD DOCUMENT</th>
                        <th className="px-4 py-3">ISSUE DATE</th>
                        <th className="px-4 py-3">EXPIRY DATE</th>
                        <th className="px-4 py-3 text-center">DOWNLOAD</th>
                        <th className="px-4 py-3 text-center">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          {/* Type */}
                          <td className="p-3 w-40">
                            <Select
                              value={doc.type}
                              onValueChange={(val) => handleUpdateDocumentRow(doc.id, "type", val)}
                            >
                              <SelectTrigger className="h-9 text-xs bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <SelectItem value="Insurance">Insurance</SelectItem>
                                <SelectItem value="State Permit">State Permit</SelectItem>
                                <SelectItem value="Fitness Cert">Fitness Cert</SelectItem>
                                <SelectItem value="Registration">Registration</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>

                          {/* Name */}
                          <td className="p-3">
                            <input
                              type="text"
                              value={doc.name}
                              onChange={(e) => handleUpdateDocumentRow(doc.id, "name", e.target.value)}
                              placeholder="Document Name"
                              className="w-full h-9 px-3 text-xs bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF]"
                            />
                          </td>

                          {/* Upload */}
                          <td className="p-3 w-48">
                            <div className="flex items-center gap-2 p-1.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] text-slate-600 dark:text-slate-300">
                              <FileText className="h-4 w-4 text-[#0089FF] shrink-0" />
                              <span className="truncate flex-1 font-mono text-[10px]">{doc.fileName || "File.jpg"}</span>
                              <label className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer shrink-0">
                                <Upload className="h-3.5 w-3.5 text-slate-500" />
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleUpdateDocumentRow(doc.id, "fileName", e.target.files[0].name);
                                      toast.success(`Uploaded ${e.target.files[0].name}`);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </td>

                          {/* Issue Date */}
                          <td className="p-3 w-36">
                            <input
                              type="date"
                              value={doc.issueDate}
                              onChange={(e) => handleUpdateDocumentRow(doc.id, "issueDate", e.target.value)}
                              className="w-full h-9 px-2.5 text-[11px] font-mono bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF]"
                            />
                          </td>

                          {/* Expiry Date */}
                          <td className="p-3 w-36">
                            <input
                              type="date"
                              value={doc.expiryDate}
                              onChange={(e) => handleUpdateDocumentRow(doc.id, "expiryDate", e.target.value)}
                              className="w-full h-9 px-2.5 text-[11px] font-mono bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0089FF]"
                            />
                          </td>

                          {/* Download */}
                          <td className="p-3 text-center w-14">
                            <button
                              type="button"
                              onClick={() => toast.success(`Downloading ${doc.fileName}...`)}
                              className="p-2 text-[#0089FF] hover:bg-sky-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                              title="Download File"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-center w-14">
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmTarget({ type: "document", id: doc.id, title: doc.name || doc.type || "Document" })}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                              title="Delete Document"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 4. Footer Bar matching reference image media_1791361190770.png */}
          <div className="pt-3 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              Reset
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl shadow-md shadow-[#0089FF]/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Check className="h-4 w-4 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal styled 1:1 with Trakzee 2.0 Theme */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header Bar */}
            <div className="flex h-[52px] items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Delete Confirmation
              </h2>
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4 stroke-[2]" />
              </button>
            </div>

            {/* Body Content */}
            <div className="p-6">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  "{deleteConfirmTarget.title}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            {/* Footer Bar */}
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmTarget.type === "info") {
                    handleDeleteInfoRow(deleteConfirmTarget.id);
                    toast.success(`Deleted attribute "${deleteConfirmTarget.title}"`);
                  } else {
                    handleDeleteDocumentRow(deleteConfirmTarget.id);
                    toast.success(`Deleted document "${deleteConfirmTarget.title}"`);
                  }
                  setDeleteConfirmTarget(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
