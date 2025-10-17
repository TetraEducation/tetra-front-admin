import TenantLoginForm from './TenantLoginForm';
import type { Branding } from '@/lib/apiTenants.mock';

interface TenantLoginLeftLayoutProps {
  branding?: Branding | null;
  tenantId: string;
  host: string;
}

export default function TenantLoginLeftLayout({ branding }: TenantLoginLeftLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <TenantLoginForm branding={branding} />
        </div>
      </div>
      
      {/* Right Side - Branding */}
      <div className="flex-1 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            {branding?.title || 'Bem-vindo'}
          </h1>
          <p className="text-xl opacity-90">
            {branding?.subtitle || 'Sua plataforma de educação digital'}
          </p>
        </div>
      </div>
    </div>
  );
}
