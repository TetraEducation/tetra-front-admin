// src/lib/apiTenants.ts - Implementação real da API tetra-tenants
import axios from 'axios';
import { urls } from './urls';

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

// Cliente HTTP configurado
const apiClient = axios.create({
  baseURL: urls.tenants,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Resolve tenantId pelo host via API tetra-tenants
export async function resolveTenantByHost(host: string) {
  try {
    console.log('urls.tenants', urls.tenants);
    console.log('resolveTenantByHost', host);
const response = await apiClient.get('/tenants/public/domains/resolve', {
      params: { host }
    });

    console.log('response', response.data);
    
    return {
      tenantId: response.data.tenantId,
      name: response.data.name,
      slug: response.data.slug,
    };
  } catch (error) {
    console.error('Erro ao resolver tenant por host:', error);
    throw new Error(`Tenant não encontrado para o host: ${host}`);
  }
}

// Busca branding público do tenant via API tetra-tenants
export async function fetchBranding(tenantId: string) {
  try {
    const response = await apiClient.get(`/tenants/public/${tenantId}/branding`);
    console.log('fetchBranding response', response.data);
    return {
      tenantId: response.data.tenantId,
      name: response.data.name,
      slug: response.data.slug,
      branding: response.data.branding as Branding,
    };
  } catch (error) {
    console.error('Erro ao buscar branding do tenant:', error);
    throw new Error(`Branding não encontrado para o tenant: ${tenantId}`);
  }
}

// Tipos para parâmetros de busca
export type FetchTenantsParams = {
  search?: string
  page?: number
  limit?: number
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

export type FetchTenantsResponse = {
  data: Array<{
    id: string
    name: string
    slug: string
    status: string
  }>
  total: number
  page: number
  limit: number
  totalPages: number
}

// Busca lista de tenants (para o painel administrativo)
export async function fetchTenants(params: FetchTenantsParams = {}): Promise<FetchTenantsResponse> {
  try {
    const { search, page = 1, limit = 10, status } = params
    
    const queryParams: Record<string, any> = {
      page,
      limit,
    }
    
    if (search) {
      queryParams.search = search
    }
    
    if (status) {
      queryParams.status = status
    }
    
    console.log('fetchTenants params:', queryParams)
    const response = await apiClient.get('/tenants', { params: queryParams })
    console.log('fetchTenants response', response.data)
    
    // A API retorna { data: [...], total, page, limit, totalPages }
    // Cada item tem { tenantId, name, slug, taxId, logoUrl, status, createdAt, updatedAt }
    const tenants = response.data.data.map((item: any) => ({
      id: item.tenantId, // ✅ Usando tenantId da API
      name: item.name,
      slug: item.slug,
      status: item.status,
      taxId: item.taxId,
    }));
    
    return {
      data: tenants,
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages,
    }
  } catch (error) {
    console.error('Erro ao buscar lista de tenants:', error)
    throw new Error('Erro ao carregar lista de tenants')
  }
}

// Tipos para criação de tenant
export type CreateTenantParams = {
  name: string
  slug: string
  taxId?: string
  details?: {
    primaryEmail?: string
    salesContactName?: string
    salesContactEmail?: string
    salesContactPhone?: string
    supportContactName?: string
    supportContactEmail?: string
    supportContactPhone?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    notes?: string
  }
}

export type CreateTenantResponse = {
  message: string
}

// Cria um novo tenant
export async function createTenant(data: CreateTenantParams): Promise<CreateTenantResponse> {
  try {
    console.log('createTenant params:', data)
    const response = await apiClient.post('/tenants', data)
    console.log('createTenant response', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao criar tenant:', error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erro ao criar plataforma')
    }
    throw new Error('Erro ao criar plataforma')
  }
}

// Tipo para os detalhes do tenant
export type TenantDetailsResponse = {
  tenantId: string
  name: string
  slug: string
  taxId?: string | null
  status: string
  createdAt: string
  updatedAt: string
  details?: {
    primaryEmail?: string
    salesContactName?: string
    salesContactEmail?: string
    salesContactPhone?: string
    supportContactName?: string
    supportContactEmail?: string
    supportContactPhone?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    notes?: string
  } | null
}

// Busca os detalhes de um tenant específico
export async function getTenantDetails(tenantId: string): Promise<TenantDetailsResponse> {
  try {
    console.log('getTenantDetails tenantId:', tenantId)
    const response = await apiClient.get(`/tenants/${tenantId}`)
    console.log('getTenantDetails response', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar detalhes do tenant:', error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erro ao buscar detalhes da plataforma')
    }
    throw new Error('Erro ao buscar detalhes da plataforma')
  }
}

// Tipo para atualização de tenant
export type UpdateTenantParams = {
  slug?: string
  details?: {
    primaryEmail?: string
    salesContactName?: string
    salesContactEmail?: string
    salesContactPhone?: string
    supportContactName?: string
    supportContactEmail?: string
    supportContactPhone?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    notes?: string
  }
}

export type UpdateTenantResponse = {
  message: string
}

// Atualiza um tenant existente
export async function updateTenant(tenantId: string, data: UpdateTenantParams): Promise<UpdateTenantResponse> {
  try {
    console.log('updateTenant params:', { tenantId, data })
    const response = await apiClient.patch(`/tenants/${tenantId}`, data)
    console.log('updateTenant response', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar tenant:', error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Erro ao atualizar plataforma')
    }
    throw new Error('Erro ao atualizar plataforma')
  }
}