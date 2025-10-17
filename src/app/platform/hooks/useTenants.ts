// src/app/platform/hooks/useTenants.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resolveTenantByHost, fetchBranding, type Branding } from '@/lib/apiTenants';

const TENANT_HOST_KEY = (host: string) => ['tenant', 'resolve', host];
const BRANDING_KEY = (tenantId?: string) => ['tenant', 'branding', tenantId];

export function useTenantContext() {
  const host = typeof window !== 'undefined' ? window.location.host : '';

  // 1 - resolve tenantId por host via API real
  const resolveQuery = useQuery({
    queryKey: TENANT_HOST_KEY(host),
    queryFn: async () => {
      if (!host) throw new Error('host is empty');
      const data = await resolveTenantByHost(host);
      return data.tenantId;
    },
    staleTime: 60_000, // 1 minuto
    gcTime: 5 * 60_000, // gcTime substitui cacheTime no v5
    retry: false,
    enabled: !!host,
  });

  const tenantId = resolveQuery.data as string | undefined;

  // 2 - busca branding do tenant via API real
  const brandingQuery = useQuery({
    queryKey: BRANDING_KEY(tenantId),
    queryFn: async () => {
      if (!tenantId) throw new Error('tenantId missing');
      const res = await fetchBranding(tenantId);
      return res.branding as Branding;
    },
    enabled: !!tenantId,
    staleTime: 60_000,
    gcTime: 10 * 60_000, // gcTime substitui cacheTime no v5
  });

  return {
    host,
    tenantId,
    branding: brandingQuery.data,
    isResolving: resolveQuery.isLoading,
    isLoadingBranding: brandingQuery.isLoading,
    error: resolveQuery.error || brandingQuery.error,
    refetch: async () => {
      await resolveQuery.refetch();
      await brandingQuery.refetch();
    },
  };
}

// Hook antigo para compatibilidade (usado no AdministrativeHome)
export function useTenants() {
  const [tenants, setTenants] = useState<Array<{id: string; name: string; slug: string}>>([]);
  const [loading, setLoading] = useState(false);

  // Mock simples para não quebrar
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTenants([
        { id: '1', name: 'Cliente Alpha', slug: 'tenant-alpha' },
        { id: '2', name: 'Cliente Beta', slug: 'tenant-beta' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return { tenants, loading };
}
