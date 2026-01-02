// src/auth/iamAuth.ts
// Adaptador de autenticação para tetra-iam (Login direto com email/senha)

import { AUTH } from '../config/auth';
import { useAuth } from './authStore';
import type { AuthPort, LoginCredentials, LoginResponse } from './ports';
import type { Me } from './authStore';
import { deleteCookie, setCookie } from '@/utils/cookies';

function readCsrf(): string | undefined {
  // Se o IAM emitir cookie csrf=X, leia aqui p/ enviar em X-CSRF-Token
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith('csrf='))
    ?.split('=')[1];
}

export const iamAuth: AuthPort = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const csrf = readCsrf();
    
    // Constrói URL com tenantId como query parameter se fornecido
    // Usa path relativo para proxy funcionar (same-origin)
    let url = `${AUTH.iamBaseUrl}/auth/login`;
    if (credentials.tenantId) {
      url += `?tenantId=${credentials.tenantId}`;
    }
    
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': 'admin-spa-client', // Identifica o client
        ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
      },
      credentials: 'include', // Importante para enviar/receber cookies
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!resp.ok) {
      const error = await resp.json().catch(() => ({ message: 'Credenciais inválidas' }));
      throw new Error(error.message || 'Erro ao fazer login');
    }

    const data = await resp.json();
    
    // IAM retorna: { access_token, user?: { id, email, name, platform_access } }
    // O refresh token vem no cookie HttpOnly automaticamente
    
    // Normaliza platform_access para platformAccess (camelCase)
    const user = data.user ? {
      ...data.user,
      platformAccess: data.user.platform_access || data.user.platformAccess,
    } : undefined;
    
    return {
      access_token: data.access_token,
      user,
    };
  },

  async fetchMe(): Promise<Me> {
    const token = useAuth.getState().accessToken;
    if (!token) {
      throw new Error('No access token');
    }

    const resp = await fetch(`${AUTH.iamBaseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });

    if (!resp.ok) {
      throw new Error('401: Unauthorized');
    }

    return await resp.json();
  },

  async refresh(): Promise<string> {
    console.log('🔄 iamAuth.refresh() - Iniciando refresh...');
    console.log('🌐 URL:', `${AUTH.iamBaseUrl}/oauth2-secure/token`);
    console.log('🔑 Credentials: include (cookies serão enviados automaticamente)');
    
    // POST /oauth2-secure/token usando o cookie HttpOnly (refresh token opaco)
    const resp = await fetch(`${AUTH.iamBaseUrl}/oauth2-secure/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include', // Envia cookie refresh automaticamente
      body: 'grant_type=refresh_token', // Form data conforme OAuth2
    });

    console.log('📡 Response status:', resp.status, resp.statusText);

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => 'Sem detalhes do erro');
      console.error('❌ Refresh falhou:', errorText);
      throw new Error(`refresh_failed: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    console.log('✅ Refresh bem-sucedido, access_token recebido');
    
    // IAM retorna: { access_token, csrf_token, expires_in }
    // O csrf_token já vem no cookie, mas também no response
    useAuth.getState().setAuth(data.access_token, useAuth.getState().me);
    
    // Atualiza cookie com o novo token
    setCookie('access_token', data.access_token, 7);
    
    return data.access_token as string;
  },

  async logout(): Promise<void> {
    const token = useAuth.getState().accessToken;
    const csrf = readCsrf();

    await fetch(`${AUTH.iamBaseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
      },
      credentials: 'include',
    }).catch(() => {
      // Ignora erros de logout
    });

    // Limpa cookies após logout
    deleteCookie('access_token');
    deleteCookie('tenant_id');
    
    useAuth.getState().clear();
  },

  async impersonate(tenantId: string, reason: string): Promise<{ access_token: string; impersonation_id: string; expires_in: number }> {
    const token = useAuth.getState().accessToken;
    if (!token) {
      throw new Error('No access token');
    }

    // Usa /api/admin para evitar conflito com rotas do frontend /admin
    const resp = await fetch('/api/admin/impersonations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        tenantId,
        reason,
      }),
    });

    if (!resp.ok) {
      const error = await resp.json().catch(() => ({ message: 'Erro ao fazer impersonação' }));
      throw new Error(error.message || 'Erro ao fazer impersonação');
    }

    return await resp.json();
  },
};

