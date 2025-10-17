import { AlertCircle } from 'lucide-react';

interface TenantLoginErrorProps {
  message: string;
}

export default function TenantLoginError({ message }: TenantLoginErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Erro de Acesso
        </h2>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}
