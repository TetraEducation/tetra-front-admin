import TenantLoginForm from './TenantLoginForm';
import type { Branding } from '@/lib/apiTenants';

interface TenantLoginLeftLayoutProps {
  branding?: Branding | null;
  tenantId: string;
  host: string;
}

export default function TenantLoginLeftLayout({ branding }: TenantLoginLeftLayoutProps) {

    console.log('TenantLoginLeftLayout branding', branding);
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <TenantLoginForm branding={branding} />
        </div>
      </div>
      
      {/* Right Side - Branding */}
      <div 
        className="flex-1 flex items-center justify-center p-8"
        style={{
          backgroundColor: branding?.primaryColor || '#4F46E5',
          backgroundImage: branding?.bgImageUrl ? `url(${branding.bgImageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center text-white">
          {branding?.logoUrl && (
            <img 
              src={branding.logoUrl} 
              alt="Logo" 
              className="h-20 mx-auto mb-8 object-contain"
            />
          )}
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
