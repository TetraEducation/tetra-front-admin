import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/platform/tenants/')({
  component: TenantsIndex,
})

function TenantsIndex() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Gerenciar Tenants
      </h1>
      <p className="text-gray-600">
        Aqui você pode visualizar e gerenciar todos os tenants da plataforma.
      </p>
    </div>
  )
}
