import { useState, useRef } from "react";
import { X, Upload, FileSpreadsheet, Download, CheckCircle2, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface UploadAddressModalProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess?: (file: File, company: string, format: string) => void;
}

export function UploadAddressModal({
  open,
  onClose,
  onUploadSuccess,
}: UploadAddressModalProps) {
  const [company, setCompany] = useState("Ha Company");
  const [fileFormat, setFileFormat] = useState("XLSX");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "xls" && ext !== "xlsx" && ext !== "csv") {
      toast.error("Invalid file format. Please upload an XLS, XLSX, or CSV file.");
      return;
    }
    setSelectedFile(file);
    toast.success(`Selected file: ${file.name}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadSample = () => {
    // Generate dummy sample CSV content for address upload
    const sampleCsv = `Address Name,Company,Address Type,Tolerance Radius (m),Latitude,Longitude,Description\n"Surat Central Depot","Ha Company","Logistics Hub",200,21.1702,72.8311,"Headquarters Depot"\n"Valsad Bank Branch","Ha Company","Financial / Bank",150,20.5937,72.9342,"Main Branch Office"`;
    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sample_address_import_template.${fileFormat.toLowerCase() === "csv" ? "csv" : "xlsx"}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sample template file downloaded!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select or drop an address spreadsheet file to upload.");
      return;
    }

    if (onUploadSuccess) {
      onUploadSuccess(selectedFile, company, fileFormat);
    }

    toast.success(`Successfully uploaded addresses from "${selectedFile.name}"!`);
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex h-14 items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Upload Addresses
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 stroke-[2]" />
          </button>
        </div>

        {/* Content Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Company Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Company / Branch <span className="text-rose-500">*</span>
            </label>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF]">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent className="z-[60]">
                <SelectItem value="All">All Companies</SelectItem>
                <SelectItem value="Ha Company">Ha Company</SelectItem>
                <SelectItem value="Surat Branch">Surat Branch</SelectItem>
                <SelectItem value="Valsad Hub">Valsad Hub</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Format Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              File Format <span className="text-rose-500">*</span>
            </label>
            <Select value={fileFormat} onValueChange={setFileFormat}>
              <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="z-[60]">
                <SelectItem value="XLSX">Excel Workbook (.xlsx)</SelectItem>
                <SelectItem value="XLS">Excel 97-2003 (.xls)</SelectItem>
                <SelectItem value="CSV">Comma Separated Values (.csv)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Drag & Drop File Upload Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Upload File <span className="text-rose-500">*</span></span>
              <span className="text-[10px] text-slate-400 font-normal">Supported: XLS, XLSX, CSV</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx,.csv"
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer text-center",
                  isDragging
                    ? "border-[#0089FF] bg-sky-50/50 dark:bg-sky-950/40"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:border-[#0089FF]/60 hover:bg-slate-100/60 dark:hover:bg-slate-900/60",
                )}
              >
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0089FF] shadow-2xs mb-2">
                  <Upload className="h-6 w-6 stroke-[2]" />
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Click to browse or drag & drop address file here
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Spreadsheet containing address names, types & coordinates
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 rounded-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-[#0089FF] border border-sky-200 dark:border-sky-800 shrink-0">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer shrink-0"
                  title="Remove selected file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Download Sample File Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Need format reference?
            </span>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="text-xs font-semibold text-[#0089FF] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Sample File</span>
            </button>
          </div>

          {/* Pinned Bottom Footer Action Bar */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl shadow-md shadow-[#0089FF]/25 transition-all cursor-pointer active:scale-95"
            >
              Upload Addresses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
