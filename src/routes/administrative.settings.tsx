// src/routes/administrative.settings.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/administrative/settings')({
  component: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Configurações</h1>
        <div className="bg-white rounded-xl shadow-md p-8">
          <p className="text-gray-600 text-lg">Página de configurações da plataforma em desenvolvimento...</p>
        </div>
      </div>
    </div>
  ),
})
