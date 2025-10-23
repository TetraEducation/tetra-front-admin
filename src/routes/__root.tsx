import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'

import PlatformSidebar from '@/components/PlatformSidebar'
import TenantSidebar from '@/components/TenantSidebar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  
  // Atualiza o título da página baseado na rota
  useEffect(() => {
    if (location.pathname.startsWith('/administrative-panel')) {
      document.title = 'Painel Administrativo | Tetra Educação'
    } else if (location.pathname === '/login' || location.pathname === '/login/') {
      document.title = 'Login | Tetra Educação'
    } else {
      document.title = 'Tetra Educação'
    }
  }, [location.pathname])
  
  // Páginas que NÃO devem mostrar sidebar
  const isLoginPage = 
    location.pathname === '/login' || 
    location.pathname === '/login/' || 
    location.pathname === '/administrative-panel' ||
    location.pathname === '/administrative-panel/'
  
  // Determinar qual sidebar mostrar baseado na rota
  // IMPORTANTE: Prioridade para Platform (verifica primeiro)
  const isPlatformRoute = location.pathname.startsWith('/administrative-panel') && !isLoginPage
  const isTenantRoute = !isPlatformRoute && (location.pathname.startsWith('/admin') || location.pathname === '/') && !isLoginPage
  
  // Determina se deve mostrar sidebar
  const showSidebar = isPlatformRoute || isTenantRoute

  return (
    <>
      {/* Renderiza APENAS UMA sidebar por vez */}
      {isPlatformRoute && <PlatformSidebar />}
      {isTenantRoute && <TenantSidebar />}
      
      {/* Main content with sidebar spacing */}
      <div className={`transition-all duration-500 ease-in-out ${showSidebar ? 'ml-72' : ''}`}>
        <Outlet />
      </div>
    </>
  )
}
