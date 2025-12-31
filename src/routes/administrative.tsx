import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AdministrativePlatformLayout } from "@/app/platform/components/AdministrativePlatformLayout";
import { AdminGuard } from '@/auth/AdminGuard';

export const Route = createFileRoute('/administrative')({
  component: RouteComponent,
})

function RouteComponent() {
  // Não aplica guard na rota raiz /administrative (página de login)
  // Guard será aplicado nas sub-rotas (home, etc)
  return (
    <AdministrativePlatformLayout>
      <Outlet />
    </AdministrativePlatformLayout>
  )
}

