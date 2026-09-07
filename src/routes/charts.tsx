import { createFileRoute } from "@tanstack/react-router";
import { ChartsPage } from "@/components/charts/ChartsPage";

type ChartsSearchParams = {
  chart?: string | undefined;
};

export const Route = createFileRoute("/charts")({
  validateSearch: (search: Record<string, unknown>): ChartsSearchParams => {
    const c = search["chart"];
    return {
      chart: typeof c === "string" ? c : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Fleet Charts & Analytics — Trakzee" },
      {
        name: "description",
        content:
          "Compare fleet activity, fuel, alerts, temperature, and sensor analytics across vehicles.",
      },
      { property: "og:title", content: "Fleet Charts & Analytics — Trakzee" },
      {
        property: "og:description",
        content:
          "Fleet activity, fuel, alerts, temperature, and sensor analytics.",
      },
    ],
  }),
  component: ChartsPage,
});
