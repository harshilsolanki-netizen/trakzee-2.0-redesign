import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/auth/LoginPage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Trakzee 2.0" },
      {
        name: "description",
        content: "Sign in to your Trakzee Fleet Command account.",
      },
      { property: "og:title", content: "Sign In — Trakzee 2.0" },
    ],
  }),
  component: LoginPage,
});
