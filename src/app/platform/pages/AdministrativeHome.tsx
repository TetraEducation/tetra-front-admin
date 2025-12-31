import { useAuth } from "@/auth/authStore";
import { Link } from "@tanstack/react-router";

export function AdministrativeHome() {
  const { me } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-600 rounded-full mb-4">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Bem-vindo ao Painel Administrativo
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Olá, <span className="font-semibold text-blue-600">{me?.name || me?.email}</span>! 👋
          </p>
          
          <p className="text-gray-500">
            Gerencie sua plataforma multi-tenant com facilidade
          </p>
        </div>

        {/* Cards de Ações */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/administrative/tenants"
            className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Gerenciar Tenants
                </h3>
                <p className="text-sm text-gray-600">
                  Visualize, crie e configure seus clientes
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 opacity-50 cursor-not-allowed">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Usuários
                  <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Em breve</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Gerenciar usuários da plataforma
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-semibold text-gray-900">Online</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Função</p>
                <p className="font-semibold text-gray-900">Admin</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Plataforma</p>
                <p className="font-semibold text-gray-900">Tetra</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
