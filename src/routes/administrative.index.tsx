import { createFileRoute } from "@tanstack/react-router";
import { AdministrativeLogin } from "@/app/platform/pages/AdministrativeLogin";

export const Route = createFileRoute("/administrative/")({
  component: AdministrativeLogin,
});
