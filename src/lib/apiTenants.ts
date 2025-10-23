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

// Busca lista de tenants (para o painel administrativo)
export async function fetchTenants() {
  try {
    const response = await apiClient.get('/tenants');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar lista de tenants:', error);
    throw new Error('Erro ao carregar lista de tenants');
  }
}