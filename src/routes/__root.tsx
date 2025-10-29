import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Toaster } from 'sonner'

import PlatformSidebar from '@/components/PlatformSidebar'
import TenantSidebar from '@/components/TenantSidebar'
import { useSession } from '@/auth/useSession'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const { isRestoring } = useSession() // Gerenciamento de sessão
  
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

  // Mostra loading enquanto restaura sessão
  if (isRestoring) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Restaurando sessão...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Toast Notifications */}
      <Toaster 
        position="top-right" 
        richColors 
        expand={true}
        closeButton
        duration={5000}
      />
      
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
