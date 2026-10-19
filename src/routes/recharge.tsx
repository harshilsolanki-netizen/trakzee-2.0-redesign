import { createFileRoute } from "@tanstack/react-router";
import { RechargePage } from "@/components/recharge/RechargePage";

export const Route = createFileRoute("/recharge")({
  head: () => ({
    meta: [
      { title: "Recharge — Trakzee" },
      {
        name: "description",
        content: "Renew vehicle services and manage fleet object subscriptions.",
      },
      { property: "og:title", content: "Recharge — Trakzee" },
      {
        property: "og:description",
        content: "Renew vehicle services and manage fleet object subscriptions.",
      },
    ],
  }),
  component: RechargePage,
});
