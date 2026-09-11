import { createFileRoute } from "@tanstack/react-router";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { TabStrip } from "@/components/dashboard/TabStrip";
import { useDashboard } from "@/dashboard/store";
import { cn } from "@/lib/utils";

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
  const { visibleTabs, activeTab } = useDashboard();
  const isFirstTabActive =
    visibleTabs.length > 0 && activeTab?.id === visibleTabs[0]?.id;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F1F5F9] dark:bg-slate-950">
      <TabStrip />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-white dark:bg-slate-900">
        <div className="flex-1 min-h-0 p-4">
          <DashboardGrid />
        </div>
      </div>
    </div>
  );
}
