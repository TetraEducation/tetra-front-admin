import { createFileRoute } from "@tanstack/react-router";
import { AdministrativeHome } from "@/app/platform/pages/AdministrativeHome";
import { AdminGuard } from "@/auth/AdminGuard";

export const Route = createFileRoute("/administrative/home")({
  component: () => (
    <AdminGuard>
      <AdministrativeHome />
    </AdminGuard>
  ),
});
