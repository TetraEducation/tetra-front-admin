import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'

import PlatformSidebar from '@/components/PlatformSidebar'
import TenantSidebar from '@/components/TenantSidebar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  
  // Páginas de login que NÃO devem mostrar sidebar
  const isLoginPage = location.pathname === '/login/' || location.pathname === '/administrative-panel/'
  
  // Determinar qual sidebar mostrar baseado na rota
  const isPlatformRoute = location.pathname.startsWith('/administrative-panel') && !isLoginPage
  const isTenantRoute = location.pathname.startsWith('/admin') || location.pathname === '/'

  return (
    <>
      {!isLoginPage && (
        <>
          {isPlatformRoute && <PlatformSidebar />}
          {isTenantRoute && <TenantSidebar />}
          {location.pathname === '/' && <TenantSidebar />}
        </>
      )}
      <Outlet />
    </>
  )
}
