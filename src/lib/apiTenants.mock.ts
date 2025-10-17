// src/lib/apiTenants.mock.ts - Mock para desenvolvimento
export type Branding = {
  title?: string;
  subtitle?: string;
  logoUrl?: string;
  faviconUrl?: string;
  layout?: 'left' | 'right' | 'center';
  primaryColor?: string;
  accentColor?: string;
  bgImageUrl?: string;
};

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Resolve tenantId pelo host (mock)
export async function resolveTenantByHost(host: string) {
  await delay(1000); // Simula delay de rede
  
  // Para desenvolvimento local, permite simular diferentes tenants
  const urlParams = new URLSearchParams(window.location.search);
  const mockTenant = urlParams.get('mock_tenant');
  
  if (mockTenant) {
    return { tenantId: mockTenant };
  }
  
  // Mock: mapeia hostnames para tenant IDs
  const hostToTenantMap: Record<string, string> = {
    'localhost:3001': 'tenant-alpha',
    'localhost:3000': 'tenant-alpha',
    'localhost': 'tenant-alpha',
    'cliente-alpha.localhost': 'tenant-alpha',
    'cliente-beta.localhost': 'tenant-beta',
  };

  const tenantId = hostToTenantMap[host];
  
  if (!tenantId) {
    throw new Error(`Tenant não encontrado para o host: ${host}`);
  }

  return { tenantId };
}

// Busca branding público do tenant (mock)
export async function fetchBranding(tenantId: string) {
  await delay(800); // Simula delay de rede
  
  // Mock: branding por tenant
  const brandingMap: Record<string, Branding> = {
    'tenant-alpha': {
      title: 'Cliente Alpha',
      subtitle: 'Sua plataforma de educação digital',
      logoUrl: 'https://via.placeholder.com/200x80/4F46E5/FFFFFF?text=Alpha',
      faviconUrl: 'https://via.placeholder.com/32x32/4F46E5/FFFFFF?text=A',
      primaryColor: '#4F46E5',
      layout: 'center',
    },
    'tenant-beta': {
      title: 'Cliente Beta',
      subtitle: 'Educação que transforma',
      logoUrl: 'https://via.placeholder.com/200x80/059669/FFFFFF?text=Beta',
      faviconUrl: 'https://via.placeholder.com/32x32/059669/FFFFFF?text=B',
      primaryColor: '#059669',
      layout: 'left',
    },
    'tenant-gamma': {
      title: 'Cliente Gamma',
      subtitle: 'Inovação em educação',
      logoUrl: 'https://via.placeholder.com/200x80/DC2626/FFFFFF?text=Gamma',
      faviconUrl: 'https://via.placeholder.com/32x32/DC2626/FFFFFF?text=G',
      primaryColor: '#DC2626',
      layout: 'right',
    },
    'tenant-delta': {
      title: 'Cliente Delta',
      subtitle: 'Transformando vidas através da educação',
      logoUrl: 'https://via.placeholder.com/200x80/7C3AED/FFFFFF?text=Delta',
      faviconUrl: 'https://via.placeholder.com/32x32/7C3AED/FFFFFF?text=D',
      primaryColor: '#7C3AED',
      layout: 'center',
    },
  };

  const branding = brandingMap[tenantId];
  
  if (!branding) {
    throw new Error(`Branding não encontrado para o tenant: ${tenantId}`);
  }

  return { 
    tenantId, 
    name: branding.title || 'Tenant', 
    slug: tenantId,
    branding 
  };
}
