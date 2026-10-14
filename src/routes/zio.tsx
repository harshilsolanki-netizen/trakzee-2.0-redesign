import { createFileRoute } from "@tanstack/react-router";
import { ZioPanel } from "@/components/zio/ZioPanel";

export const Route = createFileRoute("/zio")({
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
