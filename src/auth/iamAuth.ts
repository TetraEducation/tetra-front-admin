// src/auth/iamAuth.ts
// Adaptador de autenticação para tetra-iam (Login direto com email/senha)

import { AUTH } from '../config/auth';
import { useAuth } from './authStore';
import type { AuthPort, LoginCredentials, LoginResponse } from './ports';
import type { Me } from './authStore';

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
    
    const resp = await fetch(`${AUTH.iamBaseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': 'admin-spa-client', // Identifica o client
        ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
      },
      credentials: 'include', // Importante para enviar/receber cookies
      body: JSON.stringify(credentials),
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
    const csrf = readCsrf();
    
    // POST /auth/refresh usando o cookie HttpOnly (refresh token)
    const resp = await fetch(`${AUTH.iamBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
      },
      credentials: 'include', // Envia cookie refresh automaticamente
    });

    if (!resp.ok) {
      throw new Error('refresh_failed');
    }

    const data = await resp.json();
    // IAM retorna: { access_token }
    useAuth.getState().setAuth(data.access_token, useAuth.getState().me);
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

    useAuth.getState().clear();
  },
};

