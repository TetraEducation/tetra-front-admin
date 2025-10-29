import TenantLoginForm from './TenantLoginForm';
import type { Branding } from '@/lib/apiTenants';

interface TenantLoginCenterLayoutProps {
  branding?: Branding | null;
  tenantId: string;
  host: string;
}

export default function TenantLoginCenterLayout({ branding, tenantId }: TenantLoginCenterLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            {branding?.logoUrl && (
              <img src={branding.logoUrl} alt="logo" className="h-16 mx-auto mb-4" />
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {branding?.title || 'Bem-vindo'}
            </h1>
            <p className="text-gray-600 mt-2">
              {branding?.subtitle || 'Faça login para continuar'}
            </p>
          </div>
          
          <TenantLoginForm branding={branding} tenantId={tenantId} />
        </div>
      </div>
    </div>
  );
}
