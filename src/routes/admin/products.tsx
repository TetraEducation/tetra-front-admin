import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
          Adicionar Produto
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Curso de JavaScript</h3>
            <p className="text-gray-600 text-sm mb-4">Aprenda JavaScript do básico ao avançado</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-emerald-600">R$ 199</span>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Ativo
              </span>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t">
            <div className="flex justify-between">
              <button className="text-emerald-600 hover:text-emerald-900 text-sm font-medium">Editar</button>
              <button className="text-red-600 hover:text-red-900 text-sm font-medium">Excluir</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Curso de React</h3>
            <p className="text-gray-600 text-sm mb-4">Desenvolvimento com React e Next.js</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-emerald-600">R$ 299</span>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Ativo
              </span>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t">
            <div className="flex justify-between">
              <button className="text-emerald-600 hover:text-emerald-900 text-sm font-medium">Editar</button>
              <button className="text-red-600 hover:text-red-900 text-sm font-medium">Excluir</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Curso de Python</h3>
            <p className="text-gray-600 text-sm mb-4">Python para análise de dados</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-emerald-600">R$ 249</span>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Rascunho
              </span>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t">
            <div className="flex justify-between">
              <button className="text-emerald-600 hover:text-emerald-900 text-sm font-medium">Editar</button>
              <button className="text-red-600 hover:text-red-900 text-sm font-medium">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}