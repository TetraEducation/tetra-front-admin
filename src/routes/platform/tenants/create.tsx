import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/platform/tenants/create')({
  component: CreateTenant,
})

function CreateTenant() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Criar Novo Tenant
      </h1>
      <p className="text-gray-600">
        Formulário para criar um novo tenant na plataforma.
      </p>
    </div>
  )
}
