import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Verifica se está em um domínio de tenant ou admin
    const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
    
    // Se for admin.tetraeducacao.com.br → redireciona para painel administrativo
    if (hostname === 'admin.tetraeducacao.com.br') {
      throw redirect({ to: '/administrative' })
    }
    
    // Se for qualquer outro domínio .tetraeducacao.com.br → redireciona para /login (tenant)
    if (hostname && hostname.includes('.tetraeducacao.com.br')) {
      throw redirect({ to: '/login' })
    }
    
    // Se for localhost, mantém a tela padrão do React (apenas para desenvolvimento)
    return {}
  },
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <h1 className="text-4xl font-bold mb-4">Tetra Educação</h1>
        <p className="text-xl">Sistema de Gestão Educacional</p>
        <p className="text-sm mt-4 opacity-70">Desenvolvimento Local</p>
      </header>
    </div>
  )
}