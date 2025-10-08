import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/platform/')({
  component: PlatformIndex,
})

function PlatformIndex() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Platform Dashboard
          </h1>
          <p className="text-gray-600">
            Bem-vindo à área da plataforma. Aqui você pode gerenciar tenants e configurações.
          </p>
        </div>
      </div>
    </div>
  )
}
