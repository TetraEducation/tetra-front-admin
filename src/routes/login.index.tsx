// src/routes/login.index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { TenantLogin } from "@/app/platform/pages/TenantLogin.tsx";

export const Route = createFileRoute("/login/")({
  component: TenantLogin,
});
