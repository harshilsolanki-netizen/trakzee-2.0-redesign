import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export function RosterManagementPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/report", search: { type: "stoppage" } as any });
  }, [navigate]);

  return null;
}