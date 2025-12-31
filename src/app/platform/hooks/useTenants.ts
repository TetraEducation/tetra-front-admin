// src/app/platform/hooks/useTenants.ts
import { useQuery } from '@tanstack/react-query';
import { resolveTenantByHost, fetchBranding, fetchTenants, type Branding, type FetchTenantsParams } from '@/lib/apiTenants';

const TENANT_HOST_KEY = (host: string) => ['tenant', 'resolve', host];
const BRANDING_KEY = (tenantId?: string) => ['tenant', 'branding', tenantId];
const TENANTS_KEY = (params: FetchTenantsParams) => ['tenants', 'list', params];

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

// Hook para listar tenants com busca e filtros (usado no AdministrativeHome)
export function useTenants(params: FetchTenantsParams = {}) {
  return useQuery({
    queryKey: TENANTS_KEY(params),
    queryFn: () => fetchTenants(params),
    staleTime: 30_000, // 30 segundos
    gcTime: 5 * 60_000, // 5 minutos
    retry: 2,
  });
}

// Hook para busca manual (sem debounce)
export function useTenantsSearch(searchTerm: string, statusFilter: string = 'all') {
  const params: FetchTenantsParams = {
    search: searchTerm || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter as any,
    page: 1,
    limit: 50, // Limite maior para busca
  };
  
  return useTenants(params);
}
