// src/lib/apiIam.ts - Implementação real da API IAM
import axios from 'axios';
import { urls } from './urls';
import { useAuth } from '@/auth/authStore';

// Helper para normalizar hostname nos logs (mostra localhost:porta em ambiente local)
const getLogHostname = () => {
  const isLocal = import.meta.env.VITE_ENV === 'local';
  if (isLocal) {
    return 'localhost:3335'; // IAM API
  }
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
  // Em produção, mostra o hostname + porta se disponível
  const port = typeof window !== 'undefined' && window.location.port ? `:${window.location.port}` : '';
  return `${hostname}${port}`;
};

// Cliente HTTP configurado para IAM
const apiClient = axios.create({
  baseURL: urls.iam,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    const authState = useAuth.getState();
    const token = authState.accessToken;
    const logHostname = getLogHostname();
    
    // Log sempre para debug
    console.log(`[${logHostname}] 🔍 Interceptor executado para:`, config.method?.toUpperCase(), config.url);
    console.log(`[${logHostname}] 🔑 Token disponível:`, token ? '✅ SIM' : '❌ NÃO');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[${logHostname}] ✅ Token adicionado ao header Authorization`);
    } else {
      console.warn(`[${logHostname}] ⚠️ Token não encontrado! Requisição será feita sem autenticação.`);
      console.warn(`[${logHostname}] Estado completo do auth:`, {
        hasToken: !!authState.accessToken,
        hasMe: !!authState.me,
        me: authState.me,
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  tenantId?: string; // Se fornecido, usa GET /users?tenantId=xxx (usuários do tenant)
  search?: string;
  page?: number;
  limit?: number;
  status?: UserStatus;
  isAdministrative?: boolean; // Se true, usa GET /administrative/users (admins do sistema)
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

// Busca lista de usuários
// Se isAdministrative for true → GET /administrative/users (admins do sistema)
// Se tenantId for fornecido → GET /users?tenantId=xxx (usuários do tenant)
// Caso contrário → GET /users (usuários gerais)
export async function fetchUsers(params: FetchUsersParams = {}): Promise<FetchUsersResponse> {
  try {
    const { tenantId, search, page = 1, limit = 10, status, isAdministrative } = params;
    
    const queryParams: Record<string, any> = {
      page,
      limit,
    };
    
    if (tenantId) {
      queryParams.tenantId = tenantId;
    }
    
    if (search) {
      queryParams.search = search;
    }
    
    if (status) {
      queryParams.status = status;
    }
    
    // Define o endpoint baseado nos parâmetros
    // Se for administrative → /administrative/users
    // Se tiver tenantId → /users?tenantId=xxx
    // Caso contrário → /users
    const endpoint = isAdministrative 
      ? '/administrative/users'
      : '/users';
    
    const logHostname = getLogHostname();
    console.log(`[${logHostname}] fetchUsers params:`, { tenantId, isAdministrative, ...queryParams });
    const response = await apiClient.get(endpoint, { params: queryParams });
    console.log(`[${logHostname}] fetchUsers response`, response.data);
    
    // A API retorna { success: true, data: { items: [...], meta: {...} } }
    // ou { data: [...], meta: {...} } (formato alternativo)
    // Cada item tem { id, name, email, status, tenant_role, created_at, last_login_at, updated_at }
    const responseData = response.data.data || response.data;
    const items = responseData.items || responseData.data || [];
    const meta = responseData.meta || response.data.meta || {
      total: response.data.total || items.length,
      page: response.data.page || page,
      limit: response.data.limit || limit,
      totalPages: response.data.totalPages || Math.ceil((response.data.total || items.length) / limit),
    };
    
    console.log(`[${logHostname}] fetchUsers processado:`, { itemsCount: items.length, meta });
    
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
      meta,
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
    const logHostname = getLogHostname();
    console.log(`[${logHostname}] requestPasswordReset email:`, email);
    const response = await apiClient.post('/users/password-reset', { email });
    console.log(`[${logHostname}] requestPasswordReset response`, response.data);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao solicitar reset de senha:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erro ao solicitar reset de senha');
    }
    throw new Error('Erro ao solicitar reset de senha');
  }
}

// Tipo para criação de usuário
export type RegisterUserParams = {
  name: string;
  email: string;
  password: string;
  tenant_role: 'TENANT_ADMIN' | 'TENANT_MEMBER' | 'TENANT_INSTRUCTOR' | 'TENANT_SUPPORT';
};

// Tipo para resposta de criação de usuário
export type RegisterUserResponse = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  tenant_role: TenantRole;
  created_at: string;
};

// Registra um novo usuário no tenant
export async function registerUser(params: RegisterUserParams): Promise<RegisterUserResponse> {
  try {
    const logHostname = getLogHostname();
    console.log(`[${logHostname}] registerUser params:`, { ...params, password: '***' });
    const response = await apiClient.post('/auth/register', params);
    console.log(`[${logHostname}] registerUser response`, response.data);

    const data = response.data.data || response.data;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      status: data.status,
      tenant_role: data.tenant_role,
      created_at: data.created_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error(`[${getLogHostname()}] Erro ao registrar usuário:`, error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erro ao registrar usuário');
    }
    throw new Error('Erro ao registrar usuário');
  }
}

