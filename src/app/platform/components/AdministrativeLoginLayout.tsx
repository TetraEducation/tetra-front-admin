import AdministrativeLoginForm from './AdministrativeLoginForm';

export default function AdministrativeLoginLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div 
        className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-8"
      >
        <div className="text-center text-white max-w-lg">
          <div className="mb-8">
            <svg 
              className="w-24 h-24 mx-auto mb-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold mb-6">
            Tetra Educação
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Plataforma de Gestão Multi-Tenant
          </p>
          
          <div className="space-y-4 text-left bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold">Gestão de Tenants</h3>
                <p className="text-sm opacity-80">Crie e gerencie múltiplos clientes</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold">Controle Total</h3>
                <p className="text-sm opacity-80">Configure domínios e branding</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold">Analytics em Tempo Real</h3>
                <p className="text-sm opacity-80">Monitore o desempenho da plataforma</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <AdministrativeLoginForm />
        </div>
      </div>
    </div>
  );
}



