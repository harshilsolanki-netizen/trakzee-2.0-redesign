import { createFileRoute } from "@tanstack/react-router";
import { ObjectSettingPage } from "@/components/setting/ObjectSettingPage";
import { AlertSettingPage } from "@/components/setting/AlertSettingPage";
import { TireSettingPage } from "@/components/setting/TireSettingPage";

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
          "Configure fleet objects, drivers, geofences, alerts, reminders, master rules, tires, and enterprise settings.",
      },
      {
        property: "og:title",
        content: "Fleet Settings & Configuration — Trakzee",
      },
      {
        property: "og:description",
        content:
          "Configure fleet objects, drivers, geofences, alerts, reminders, master rules, tires, and enterprise settings.",
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
  if (
    search.tab === "tire" ||
    search.tab === "add_tire" ||
    search.tab === "tire_management" ||
    search.tab === "tire_brand_size" ||
    search.category === "tire"
  ) {
    return <TireSettingPage />;
  }
  return <ObjectSettingPage initialAction={search.action} initialTab={search.tab} />;
}
