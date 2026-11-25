import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/roster-management")({
  beforeLoad: () => {
    throw redirect({
      to: "/report",
      search: { type: "stoppage" },
    });
  },
  component: () => null,
});