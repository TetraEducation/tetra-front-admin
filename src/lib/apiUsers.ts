// src/lib/apiUsers.ts - Implementação real da API IAM para usuários
import axios from 'axios';
import { urls } from './urls';

// Cliente HTTP configurado para IAM
const apiClient = axios.create({
  baseURL: urls.iam,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enum de status de usuário
export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

// Tipo para status de usuário
export type UserStatus = UserStatusEnum | string;

// Tipo para role do tenant
export type TenantRole = 'TENANT_OWNER' | 'TENANT_ADMIN' | 'TENANT_MEMBER' | string;

// Tipo para usuário
export type User = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  tenant_role?: TenantRole | null;
  created_at: string;
  last_login_at?: string | null;
  updated_at?: string;
};

// Tipo para parâmetros de busca
export type FetchUsersParams = {
  search?: string;
  page?: number;
  limit?: number;
  status?: UserStatus;
};

// Tipo para resposta da busca de usuários
export type FetchUsersResponse = {
  items: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// Busca lista de usuários (para o painel administrativo)
export async function fetchUsers(params: FetchUsersParams = {}): Promise<FetchUsersResponse> {
  try {
    const { search, page = 1, limit = 10, status } = params;
    
    const queryParams: Record<string, any> = {
      page,
      limit,
    };
    
    if (search) {
      queryParams.search = search;
    }
    
    if (status) {
      queryParams.status = status;
    }
    
    console.log('fetchUsers params:', queryParams);
    const response = await apiClient.get('/users', { params: queryParams });
    console.log('fetchUsers response', response.data);
    
    // A API retorna { data: [...], meta: { total, page, limit, totalPages } }
    // Cada item tem { id, name, email, status, tenant_role, created_at, last_login_at, updated_at }
    const items = response.data.data || response.data.items || [];
    
    return {
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        status: item.status,
        tenant_role: item.tenant_role || null,
        created_at: item.created_at || item.createdAt,
        last_login_at: item.last_login_at || item.lastLoginAt || null,
        updated_at: item.updated_at || item.updatedAt,
      })),
      meta: response.data.meta || {
        total: response.data.total || items.length,
        page: response.data.page || page,
        limit: response.data.limit || limit,
        totalPages: response.data.totalPages || Math.ceil((response.data.total || items.length) / limit),
      },
    };
  } catch (error) {
    console.error('Erro ao buscar lista de usuários:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erro ao carregar lista de usuários');
    }
    throw new Error('Erro ao carregar lista de usuários');
  }
}

// Tipo para resposta de reset de senha
export type RequestPasswordResetResponse = {
  message: string;
};

// Solicita reset de senha para um usuário
export async function requestPasswordReset(email: string): Promise<RequestPasswordResetResponse> {
  try {
    console.log('requestPasswordReset email:', email);
    const response = await apiClient.post('/users/password-reset', { email });
    console.log('requestPasswordReset response', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao solicitar reset de senha:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erro ao solicitar reset de senha');
    }
    throw new Error('Erro ao solicitar reset de senha');
  }
}
