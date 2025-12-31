import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";

import PlatformSidebar from "@/components/PlatformSidebar";
import TenantSidebar from "@/components/TenantSidebar";
import { useSession } from "@/auth/useSession";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <SidebarProvider>
      <RootContent />
    </SidebarProvider>
  );
}

function RootContent() {
  const location = useLocation();
  const { isRestoring } = useSession();
  const { isCollapsed, setActiveSidebar, activeSidebar } = useSidebar();

  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isAdminHost = hostname === 'admin.tetraeducacao.com.br';

  // Atualiza o título da página baseado na rota
  useEffect(() => {
    if (location.pathname.startsWith("/administrative")) {
      document.title = "Painel Administrativo | Tetra Educação";
    } else if (
      location.pathname === "/login" ||
      location.pathname === "/login/"
    ) {
      document.title = "Login | Tetra Educação";
    } else {
      document.title = "Tetra Educação";
    }
  }, [location.pathname]);

  // Páginas que NÃO devem mostrar sidebar
  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/login/" ||
    location.pathname === "/administrative" ||
    location.pathname === "/administrative/";

  // Determinar qual sidebar mostrar baseado na rota E hostname
  const isPlatformRoute =
    isAdminHost || // Se for admin.tetraeducacao.com.br, sempre é plataforma
    (location.pathname.startsWith("/administrative") && !isLoginPage);
  const isTenantRoute =
    !isPlatformRoute &&
    (location.pathname.startsWith("/admin") || location.pathname === "/") &&
    !isLoginPage;

  useEffect(() => {
    if (isPlatformRoute) {
      setActiveSidebar("platform");
    } else if (isTenantRoute) {
      setActiveSidebar("tenant");
    } else {
      setActiveSidebar(null);
    }
  }, [isPlatformRoute, isTenantRoute, setActiveSidebar]);

  // Determina se deve mostrar sidebar
  const showSidebar = isPlatformRoute || isTenantRoute;

  // Margem dinâmica baseada no estado da sidebar
  // Tenant: w-16 (collapsed) ou w-72 (expanded)
  // Platform: sempre w-72
  const sidebarMargin = showSidebar
    ? isCollapsed && activeSidebar !== null
      ? "ml-16"
      : "ml-72"
    : "";

  // Mostra loading enquanto restaura sessão
  if (isRestoring) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Restaurando sessão...</p>
        </div>
      </div>
    );
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

      {/* Main content with dynamic sidebar spacing */}
      <div
        className={`transition-all duration-500 ease-in-out ${sidebarMargin}`}
      >
        <Outlet />
      </div>
    </>
  );
}
