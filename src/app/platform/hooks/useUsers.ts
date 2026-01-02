// src/app/platform/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { fetchUsers, type FetchUsersParams } from '@/lib/apiIam';

const USERS_KEY = (params: FetchUsersParams) => ['users', 'list', params];

// Hook para listar usuários com busca e filtros
export function useUsers(params: FetchUsersParams = {}) {
  return useQuery({
    queryKey: USERS_KEY(params),
    queryFn: () => fetchUsers(params),
    staleTime: 30_000, // 30 segundos
    gcTime: 5 * 60_000, // 5 minutos
    retry: 2,
  });
}

// Hook para busca manual (sem debounce)
// Se tenantId for fornecido, busca usuários do tenant específico (GET /users?tenantId=xxx)
// Se isAdministrative for true, busca admins do sistema (GET /administrative/users)
export function useUsersSearch(searchTerm: string, statusFilter: string = 'all', tenantId?: string, isAdministrative: boolean = false) {
  const params: FetchUsersParams = {
    tenantId, // Se fornecido, usa GET /users?tenantId=xxx
    isAdministrative, // Se true, usa GET /administrative/users
    search: searchTerm || undefined,
    status: statusFilter === 'all' ? undefined : (statusFilter as any),
    page: 1,
    limit: 50, // Limite maior para busca
  };
  
  return useUsers(params);
}




