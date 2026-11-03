import { createFileRoute } from "@tanstack/react-router";
import { FuelDashboardPage } from "@/components/dashboard/fuel/FuelDashboardPage";

export const Route = createFileRoute("/fuel-dashboard")({
  head: () => ({
    meta: [
      { title: "Fuel Dashboard — Trakzee" },
      {
        name: "description",
        content:
          "Real-time fleet fuel level telemetry, capacitive probe radial gauges, and tank capacity monitoring.",
      },
      {
        property: "og:title",
        content: "Fuel Dashboard — Trakzee",
      },
      {
        property: "og:description",
        content:
          "Real-time fleet fuel level telemetry, capacitive probe radial gauges, and tank capacity monitoring.",
      },
    ],
  }),
  component: FuelDashboardPage,
});
