import { createFileRoute } from "@tanstack/react-router";
import { ObjectSettingPage } from "@/components/setting/ObjectSettingPage";

export const Route = createFileRoute("/setting")({
  head: () => ({
    meta: [
      { title: "Object Setup — Fleet Command" },
      {
        name: "description",
        content:
          "Configure an object: branch, GPS tracker, device type, IMEI, SIM numbers, timezone and distance counters.",
      },
      { property: "og:title", content: "Object Setup — Fleet Command" },
      {
        property: "og:description",
        content:
          "Configure branch, tracker, device type, IMEI, SIM and distance settings.",
      },
    ],
  }),
  component: ObjectSettingPage,
});
