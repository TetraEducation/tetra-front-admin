import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Verifica se está em um domínio de tenant
    const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
    
    // Se for qualquer domínio .tetraeducacao.com.br, redireciona para /login
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