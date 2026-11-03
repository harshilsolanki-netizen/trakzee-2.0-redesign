import { createFileRoute } from "@tanstack/react-router";
import { TemperatureDashboardPage } from "@/components/dashboard/temperature/TemperatureDashboardPage";

export const Route = createFileRoute("/temperature-dashboard")({
  head: () => ({
    meta: [
      { title: "Temperature Dashboard — Trakzee" },
      {
        name: "description",
        content:
          "Real-time cold chain telemetry, multi-sensor temperature radial gauges, and humidity monitoring.",
      },
      {
        property: "og:title",
        content: "Temperature Dashboard — Trakzee",
      },
      {
        property: "og:description",
        content:
          "Real-time cold chain telemetry, multi-sensor temperature radial gauges, and humidity monitoring.",
      },
    ],
  }),
  component: TemperatureDashboardPage,
});
