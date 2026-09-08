import { createFileRoute } from "@tanstack/react-router";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { TabStrip } from "@/components/dashboard/TabStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fleet Safety Dashboard — Fleet Command" },
      {
        name: "description",
        content:
          "Fleet average score, driver score distribution, risky drivers, event highlights and live camera status in one dashboard.",
      },
      {
        property: "og:title",
        content: "Fleet Safety Dashboard — Fleet Command",
      },
      {
        property: "og:description",
        content:
          "Driver scores, event distribution and camera health across your whole fleet.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-card dark:bg-slate-900 flex flex-col">
      <TabStrip />
      <div className="flex-1 min-h-0 p-4">
        <DashboardGrid />
      </div>
    </div>
  );
}
