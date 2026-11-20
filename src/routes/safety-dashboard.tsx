import { createFileRoute } from "@tanstack/react-router";
import { SafetyDashboardPage } from "@/components/dashboard/safety/SafetyDashboardPage";

export const Route = createFileRoute("/safety-dashboard")({
  head: () => ({
    meta: [
      { title: "Safety Dashboard – Trakzee" },
      {
        name: "description",
        content:
          "Real-time safety alerts dashboard with vehicle tracking, alert management, and safe reach confirmation.",
      },
      {
        property: "og:title",
        content: "Safety Dashboard – Trakzee",
      },
      {
        property: "og:description",
        content:
          "Monitor critical, high, medium alerts and safe reach confirmations across your fleet.",
      },
    ],
  }),
  component: SafetyDashboardPage,
});
