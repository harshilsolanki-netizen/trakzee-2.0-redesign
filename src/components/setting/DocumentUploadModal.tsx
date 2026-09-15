import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileText, Save, UploadCloud, Plus } from "lucide-react";
import { toast } from "sonner";

export type VehicleDocument = {
  id: string;
  name: string;
  type: string;
  docNumber: string;
  issueDate: string;
  expiryDate: string;
  alertDays: number;
  fileName: string;
  fileSize: string;
  status: "Valid" | "Expiring Soon" | "Expired";
};

export function DocumentUploadModal({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (doc: VehicleDocument) => void;
}) {
  const [docType, setDocType] = useState("Insurance Policy");
  const [docName, setDocName] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [issueDate, setIssueDate] = useState("2025-01-01");
  const [expiryDate, setExpiryDate] = useState("2026-12-31");
  const [alertDays, setAlertDays] = useState(30);
  const [selectedFile, setSelectedFile] = useState<string>("policy_doc_2026.pdf");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      toast.error("Document Title is required");
      return;
    }
    const newDoc: VehicleDocument = {
      id: `doc-${Date.now()}`,
      name: docName,
      type: docType,
      docNumber: docNumber || "DOC-889102",
      issueDate,
      expiryDate,
      alertDays,
      fileName: selectedFile,
      fileSize: "1.4 MB",
      status: "Valid",
    };
    onSave(newDoc);
    toast.success(`Document "${docName}" attached successfully`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden border border-[#DFE3EB] dark:border-slate-800 bg-background shadow-2xl rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE3EB] dark:border-slate-800 bg-background select-none">
          <DialogTitle className="text-[16px] font-bold text-[#1D3B7A] dark:text-blue-400">
            Add Document
          </DialogTitle>
          <DialogDescription className="sr-only">
            Attach vehicle compliance and regulatory documents
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Document Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="h-9 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs text-foreground focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
              >
                <option value="Insurance Policy">Insurance Policy</option>
                <option value="Registration Certificate (RC)">
                  Registration Certificate (RC)
                </option>
                <option value="Pollution Under Control (PUC)">
                  Pollution Under Control (PUC)
                </option>
                <option value="National Transport Permit">
                  National Transport Permit
                </option>
                <option value="Road Fitness Certificate">
                  Road Fitness Certificate
                </option>
                <option value="Driver Authorization Letter">
                  Driver Authorization Letter
                </option>
                <option value="Hazardous Goods Certificate">
                  Hazardous Goods Certificate
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Document Number / ID
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="e.g. POL-992381-X"
                className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground font-mono focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Document Title / Label <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. Commercial Comprehensive Insurance 2026"
              className="h-9 w-full rounded-md border border-input/80 bg-background px-3 text-xs text-foreground focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="h-9 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs text-foreground focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Expiry Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="h-9 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs text-foreground focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Alert Before
              </label>
              <select
                value={alertDays}
                onChange={(e) => setAlertDays(Number(e.target.value))}
                className="h-9 w-full rounded-md border border-input/80 bg-background px-2.5 text-xs text-foreground focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 focus:outline-none"
              >
                <option value={7}>7 Days</option>
                <option value={15}>15 Days</option>
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
              </select>
            </div>
          </div>

          {/* File Drag Drop upload area */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Attachment File (PDF, PNG, JPG)
            </label>
            <div className="border-2 border-dashed border-[#DFE3EB] dark:border-slate-700 rounded-lg p-4 text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
              <UploadCloud className="mx-auto h-7 w-7 text-[#0089FF] mb-1" />
              <p className="text-xs font-semibold text-foreground">
                Click to browse or drag & drop certificate
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Current file: <span className="font-mono font-semibold text-[#0089FF]">{selectedFile}</span> (1.4 MB)
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DFE3EB] dark:border-slate-800 select-none">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8 rounded-md border border-input/80 bg-background px-4 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#0089FF] hover:bg-[#0070d6] px-4 text-xs font-semibold text-white cursor-pointer shadow-xs transition-all active:scale-98"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Document</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
