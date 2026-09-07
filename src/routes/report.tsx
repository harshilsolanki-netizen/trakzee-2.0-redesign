import { createFileRoute } from "@tanstack/react-router";
import { ReportPage } from "@/components/report/ReportPage";

type ReportSearchParams = {
  type?: string | undefined;
};

export const Route = createFileRoute("/report")({
  validateSearch: (search: Record<string, unknown>): ReportSearchParams => {
    const t = search["type"];
    return {
      type: typeof t === "string" ? t : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Fleet Reports — Trakzee" },
      {
        name: "description",
        content:
          "Fleet activity, temperature, driver jobs, and vehicle reports.",
      },
      { property: "og:title", content: "Fleet Reports — Trakzee" },
      {
        property: "og:description",
        content:
          "Fleet activity, temperature, driver jobs, and vehicle reports.",
      },
    ],
  }),
  component: ReportPage,
});
