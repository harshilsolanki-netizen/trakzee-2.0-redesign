import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export interface ActiveCloudDownload {
  id: string; // task id e.g. "CD-8841" or "export-all"
  taskName: string; // e.g. "Travel Summary"
  fileName: string; // e.g. "travel_summary_CD-8841.csv"
  fileSize: string; // e.g. "2.8 MB"
  progress: number; // 0 to 100
  status: "idle" | "downloading" | "completed" | "error";
  startedAt: number;
}

export interface CloudDownloadTaskPayload {
  id: string;
  company?: string;
  branch?: string;
  plateNo?: string;
  channelNo?: string;
  task: string;
  startTime?: string;
  endTime?: string;
  requestedBy?: string;
  requestedTime?: string;
  status?: string;
  completionTime?: string;
  fileSize?: string;
  fileFormat?: string;
}

interface CloudDownloadContextType {
  activeDownload: ActiveCloudDownload | null;
  isDownloading: boolean;
  progress: number;
  startDownload: (task: CloudDownloadTaskPayload) => void;
  startExportAll: (tasks: CloudDownloadTaskPayload[]) => void;
  cancelDownload: () => void;
  recentDownloads: ActiveCloudDownload[];
}

const CloudDownloadContext = createContext<CloudDownloadContextType | undefined>(
  undefined
);

function generateCsvForTask(task: CloudDownloadTaskPayload): string {
  const csvHeader =
    "ID,Company,Branch,Plate No,Channel No,Task,Start Time,End Time,Requested By,Completion Time,Status\n";
  const csvRow = `"${task.id}","${task.company || "HP Company"}","${task.branch || "--"}","${task.plateNo || "--"}","${task.channelNo || "--"}","${task.task}","${task.startTime || ""}","${task.endTime || ""}","${task.requestedBy || ""}","${task.completionTime || ""}","${task.status || "Completed"}"\n\n`;
  const telemetryHeader =
    "Timestamp,Vehicle,Velocity (km/h),Status,Latitude,Longitude,Fuel (%),Engine Temp\n";
  const plate = task.plateNo && task.plateNo !== "--" ? task.plateNo : "HR55AC5305";
  const sampleTelemetry = [
    `04/11/2026 09:00:00,${plate},45,Running,20.5937,78.9629,82,88C`,
    `04/11/2026 09:10:00,${plate},54,Running,20.6012,78.9710,81,89C`,
    `04/11/2026 09:20:00,${plate},62,Running,20.6150,78.9830,79,90C`,
    `04/11/2026 09:30:00,${plate},0,Stopped,20.6280,78.9950,79,84C`,
  ].join("\n");

  return csvHeader + csvRow + telemetryHeader + sampleTelemetry;
}

function triggerBrowserDownload(fileName: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function CloudDownloadProvider({ children }: { children: ReactNode }) {
  const [activeDownload, setActiveDownload] =
    useState<ActiveCloudDownload | null>(null);
  const [recentDownloads, setRecentDownloads] = useState<ActiveCloudDownload[]>(
    []
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const completionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const cancelDownload = useCallback(() => {
    clearTimers();
    setActiveDownload(null);
    toast.info("Download cancelled", {
      description: "The download operation was stopped.",
    });
  }, [clearTimers]);

  const startDownload = useCallback(
    (task: CloudDownloadTaskPayload) => {
      clearTimers();

      const taskSlug = task.task.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const ext = task.fileFormat?.toLowerCase() || "csv";
      const fileName = `${taskSlug}_${task.id}.${ext}`;
      const fileSize = task.fileSize || "2.8 MB";

      const initialDownload: ActiveCloudDownload = {
        id: task.id,
        taskName: task.task,
        fileName,
        fileSize,
        progress: 0,
        status: "downloading",
        startedAt: Date.now(),
      };

      setActiveDownload(initialDownload);

      const totalDuration = 2400; // 2.4 seconds total simulation
      const intervalMs = 40; // ~25-60 fps smooth update
      let elapsed = 0;

      timerRef.current = setInterval(() => {
        elapsed += intervalMs;
        const normalized = Math.min(elapsed / totalDuration, 1);

        // Non-linear ease-out curve for natural, lively progress
        const eased = 1 - Math.pow(1 - normalized, 2.2);
        // Small random micro-fluctuation to feel like real data packets
        const jitter = (Math.random() - 0.5) * 1.5;
        const currentProgress = Math.min(
          99,
          Math.max(1, Math.round(eased * 100 + jitter))
        );

        if (elapsed < totalDuration) {
          setActiveDownload((prev) =>
            prev && prev.id === task.id
              ? { ...prev, progress: currentProgress }
              : prev
          );
        } else {
          // Reached 100%
          clearTimers();

          const completedDownload: ActiveCloudDownload = {
            id: task.id,
            taskName: task.task,
            fileName,
            fileSize,
            progress: 100,
            status: "completed",
            startedAt: initialDownload.startedAt,
          };

          setActiveDownload(completedDownload);
          setRecentDownloads((prev) => [
            completedDownload,
            ...prev.slice(0, 9),
          ]);

          // Actually trigger file download in browser
          const fileContent = generateCsvForTask(task);
          triggerBrowserDownload(fileName, fileContent);

          toast.success("Download Complete", {
            description: `${fileName} (${fileSize}) successfully saved.`,
          });

          // Keep 100% completed state visible for 2.4 seconds, then return to idle
          completionTimerRef.current = setTimeout(() => {
            setActiveDownload(null);
          }, 2400);
        }
      }, intervalMs);
    },
    [clearTimers]
  );

  const startExportAll = useCallback(
    (tasks: CloudDownloadTaskPayload[]) => {
      clearTimers();

      const todayStr = new Date().toISOString().slice(0, 10);
      const fileName = `cloud_downloads_${todayStr}.csv`;
      const fileSize = `${(tasks.length * 0.4 + 1.2).toFixed(1)} MB`;

      const initialDownload: ActiveCloudDownload = {
        id: "export-all",
        taskName: "Export All Tasks",
        fileName,
        fileSize,
        progress: 0,
        status: "downloading",
        startedAt: Date.now(),
      };

      setActiveDownload(initialDownload);

      const totalDuration = 2600;
      const intervalMs = 40;
      let elapsed = 0;

      timerRef.current = setInterval(() => {
        elapsed += intervalMs;
        const normalized = Math.min(elapsed / totalDuration, 1);
        const eased = 1 - Math.pow(1 - normalized, 2.2);
        const currentProgress = Math.min(99, Math.round(eased * 100));

        if (elapsed < totalDuration) {
          setActiveDownload((prev) =>
            prev && prev.id === "export-all"
              ? { ...prev, progress: currentProgress }
              : prev
          );
        } else {
          clearTimers();

          const completedDownload: ActiveCloudDownload = {
            id: "export-all",
            taskName: "Export All Tasks",
            fileName,
            fileSize,
            progress: 100,
            status: "completed",
            startedAt: initialDownload.startedAt,
          };

          setActiveDownload(completedDownload);
          setRecentDownloads((prev) => [
            completedDownload,
            ...prev.slice(0, 9),
          ]);

          // Generate combined CSV
          const csvHeader =
            "ID,Company,Branch,Plate No,Channel No,Task,Start Time,End Time,Requested By,Completion Time,Status\n";
          const rows = tasks
            .map(
              (t) =>
                `"${t.id}","${t.company || ""}","${t.branch || ""}","${t.plateNo || ""}","${t.channelNo || ""}","${t.task}","${t.startTime || ""}","${t.endTime || ""}","${t.requestedBy || ""}","${t.completionTime || ""}","${t.status || ""}"`
            )
            .join("\n");

          triggerBrowserDownload(fileName, csvHeader + rows);

          toast.success("Table Exported", {
            description: `${fileName} (${tasks.length} records) successfully saved.`,
          });

          completionTimerRef.current = setTimeout(() => {
            setActiveDownload(null);
          }, 2400);
        }
      }, intervalMs);
    },
    [clearTimers]
  );

  const isDownloading = activeDownload?.status === "downloading";
  const progress = activeDownload?.progress ?? 0;

  return (
    <CloudDownloadContext.Provider
      value={{
        activeDownload,
        isDownloading,
        progress,
        startDownload,
        startExportAll,
        cancelDownload,
        recentDownloads,
      }}
    >
      {children}
    </CloudDownloadContext.Provider>
  );
}

export function useCloudDownload() {
  const context = useContext(CloudDownloadContext);
  if (!context) {
    throw new Error(
      "useCloudDownload must be used within a CloudDownloadProvider"
    );
  }
  return context;
}
