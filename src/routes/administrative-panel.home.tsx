import { createFileRoute } from "@tanstack/react-router";
import { AdministrativeHome } from "@/app/platform/pages/AdministrativeHome";

export const Route = createFileRoute("/administrative-panel/home")({
  component: AdministrativeHome,
});
