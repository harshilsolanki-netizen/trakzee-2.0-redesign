import { createFileRoute } from "@tanstack/react-router";
import { ObjectSettingPage } from "@/components/setting/ObjectSettingPage";
import { AlertSettingPage } from "@/components/setting/AlertSettingPage";

type SettingSearchParams = {
  category?: string;
  tab?: string;
};

export const Route = createFileRoute("/setting")({
  validateSearch: (search: Record<string, unknown>): SettingSearchParams => {
    return {
      category:
        typeof search["category"] === "string"
          ? search["category"]
          : undefined,
      tab: typeof search["tab"] === "string" ? search["tab"] : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Fleet Settings & Configuration — Trakzee" },
      {
        name: "description",
        content:
          "Configure fleet objects, drivers, geofences, alerts, reminders, master rules, and enterprise settings.",
      },
      {
        property: "og:title",
        content: "Fleet Settings & Configuration — Trakzee",
      },
      {
        property: "og:description",
        content:
          "Configure fleet objects, drivers, geofences, alerts, reminders, master rules, and enterprise settings.",
      },
    ],
  }),
  component: SettingRouteComponent,
});

function SettingRouteComponent() {
  const search = Route.useSearch();
  if (search.tab === "alert") {
    return <AlertSettingPage />;
  }
  return <ObjectSettingPage />;
}


