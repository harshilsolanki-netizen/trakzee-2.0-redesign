import { createFileRoute, redirect } from "@tanstack/react-router";
import { ZioPanel } from "@/components/zio/ZioPanel";

export const Route = createFileRoute("/zio")({
  beforeLoad: () => {
    try {
      if (
        typeof window !== "undefined" &&
        localStorage.getItem("trakzee-active-app-id") === "roster-management"
      ) {
        throw redirect({ to: "/report", search: { type: "stoppage" } });
      }
    } catch (e) {
      if (e && typeof e === "object" && "to" in e) throw e;
    }
  },
  head: () => ({
    meta: [
      { title: "Zio AI Assistant — Fleet Safety & Telematics" },
      {
        name: "description",
        content:
          "Ask Zio AI questions about fleet safety scores, efficiency ratings, risk indicators, and driving telemetry.",
      },
    ],
  }),
  component: ZioFullscreenPage,
});

function ZioFullscreenPage() {
  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] w-full flex-col bg-[#F0F0F0] rounded-tl-[24px] overflow-hidden">
      <ZioPanel mode="fullscreen" className="rounded-tl-[24px]" />
    </div>
  );
}
