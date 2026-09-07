import { createFileRoute } from "@tanstack/react-router";
import { TrackingPage } from "@/components/tracking/TrackingPage";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Live Tracking — Fleet Command" },
      {
        name: "description",
        content:
          "Track every vehicle live: running, idle and stopped objects with fuel, battery and trip detail.",
      },
      { property: "og:title", content: "Live Tracking — Fleet Command" },
      {
        property: "og:description",
        content: "Track every vehicle live with fuel, battery and trip detail.",
      },
    ],
  }),
  component: TrackingPage,
});
