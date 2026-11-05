import { createFileRoute } from "@tanstack/react-router";
import { CloudDownloadPage } from "@/components/cloud/CloudDownloadPage";

export const Route = createFileRoute("/cloud-download")({
  head: () => ({
    meta: [
      { title: "Cloud Download — Trakzee" },
      {
        name: "description",
        content: "Cloud download queue, travel summary exports, and video telematics.",
      },
    ],
  }),
  component: CloudDownloadPage,
});
