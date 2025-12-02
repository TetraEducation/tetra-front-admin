import { createFileRoute } from "@tanstack/react-router";
import { TenantGuard } from "@/auth/TenantGuard";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <TenantGuard>
      <AdminDashboard />
    </TenantGuard>
  ),
});

function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Dashboard do Tenant
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Membros</h3>
          <p className="text-3xl font-bold text-emerald-600">1,234</p>
          <p className="text-sm text-gray-500">Total de membros</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Grupos</h3>
          <p className="text-3xl font-bold text-blue-600">56</p>
          <p className="text-sm text-gray-500">Grupos ativos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Matrículas</h3>
          <p className="text-3xl font-bold text-purple-600">892</p>
          <p className="text-sm text-gray-500">Matrículas ativas</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Produtos</h3>
          <p className="text-3xl font-bold text-orange-600">24</p>
          <p className="text-sm text-gray-500">Produtos disponíveis</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Resumo Recente
        </h2>
        <p className="text-gray-600">
          Aqui você pode ver um resumo das atividades recentes do seu tenant.
        </p>
      </div>
    </div>
  );
}
