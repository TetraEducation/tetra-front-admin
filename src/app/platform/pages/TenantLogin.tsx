// src/app/platform/pages/TenantLogin.tsx
import { useEffect } from 'react';
import { useTenantContext } from '../hooks/useTenants';
import type { Branding } from '@/lib/apiTenants';
import TenantLoginLeftLayout from '../components/TenantLoginLeftLayout';
import TenantLoginRightLayout from '../components/TenantLoginRightLayout';
import TenantLoginCenterLayout from '../components/TenantLoginCenterLayout';
import TenantLoginError from '../components/TenantLoginError';

export function TenantLogin() {
  const { host, tenantId, branding, isResolving, isLoadingBranding, error } = useTenantContext();
  const brandingData = branding as Branding | null;

  useEffect(() => {
    if (brandingData?.faviconUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (link) link.href = brandingData.faviconUrl;
      else {
        const el = document.createElement('link');
        el.rel = 'icon';
        el.href = brandingData.faviconUrl;
        document.head.appendChild(el);
      }
    }
    // aplica cor primária como CSS var
    if (brandingData?.primaryColor) {
      document.documentElement.style.setProperty('--brand-primary', brandingData.primaryColor);
    }
    // limpa on unmount? opcional
    return () => {
      // document.documentElement.style.removeProperty('--brand-primary');
    };
  }, [brandingData]);

  if (isResolving || isLoadingBranding) return <div className="p-8">Carregando...</div>;
  if (error) return <TenantLoginError message="Domínio não encontrado ou indisponível." />;
  if (!tenantId) return <TenantLoginError message="Domínio não configurado." />;

  const layout = brandingData?.layout ?? 'right';

  if (layout === 'left') return <TenantLoginLeftLayout branding={brandingData} tenantId={tenantId!} host={host || 'localhost'} />;
  if (layout === 'center') return <TenantLoginCenterLayout branding={brandingData} tenantId={tenantId!} host={host || 'localhost'} />;
  return <TenantLoginRightLayout branding={brandingData} tenantId={tenantId!} host={host || 'localhost'} />;
}

export default TenantLogin;
