import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AdministrativePlatformLayout } from "@/app/platform/components/AdministrativePlatformLayout";

export const Route = createFileRoute('/administrative-panel')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AdministrativePlatformLayout>
      <Outlet />
    </AdministrativePlatformLayout>
  )
}

