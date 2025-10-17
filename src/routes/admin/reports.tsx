import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Relatórios</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatório de Membros</h3>
          <p className="text-gray-600 text-sm mb-4">Análise detalhada dos membros cadastrados</p>
          <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
            Gerar Relatório
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatório de Grupos</h3>
          <p className="text-gray-600 text-sm mb-4">Estatísticas dos grupos e participação</p>
          <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
            Gerar Relatório
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatório de Matrículas</h3>
          <p className="text-gray-600 text-sm mb-4">Progresso e conclusões das matrículas</p>
          <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
            Gerar Relatório
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatório Financeiro</h3>
          <p className="text-gray-600 text-sm mb-4">Receitas e análises financeiras</p>
          <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
            Gerar Relatório
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatório de Produtos</h3>
          <p className="text-gray-600 text-sm mb-4">Performance dos produtos e cursos</p>
          <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
            Gerar Relatório
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatório Customizado</h3>
          <p className="text-gray-600 text-sm mb-4">Crie relatórios personalizados</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Criar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}