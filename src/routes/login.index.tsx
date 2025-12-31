// src/routes/login.index.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { TenantLogin } from "@/app/platform/pages/TenantLogin.tsx";

export const Route = createFileRoute("/login/")({
  beforeLoad: () => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
    
    // Se for admin.tetraeducacao.com.br → redireciona para painel administrativo
    // (caso alguém tente acessar /login diretamente no domínio admin)
    if (hostname === 'admin.tetraeducacao.com.br') {
      throw redirect({ to: '/administrative' })
    }
    
    return {}
  },
  component: TenantLogin,
});
