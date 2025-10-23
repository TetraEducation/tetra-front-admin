// src/http/withAuth.ts
// Wrapper HTTP com auto-refresh de token
// Intercepta 401 e tenta renovar o token automaticamente

import { useAuth } from '../auth/authStore';
import { iamAuth } from '../auth/iamAuth';

export async function http(url: string, init: RequestInit = {}): Promise<Response> {
  const auth = useAuth.getState();

  const makeRequest = (token?: string) =>
    fetch(url, {
      ...init,
      headers: {
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });

  // Primeira tentativa com o token atual
  let response = await makeRequest(auth.accessToken);

  // Se receber 401, tenta refresh
  if (response.status === 401) {
    try {
      const newToken = await iamAuth.refresh();
      response = await makeRequest(newToken);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      // Último recurso: voltar pro login
      await iamAuth.logout();
      await iamAuth.startLogin({ next: window.location.pathname });
      return Promise.reject(new Error('unauthorized'));
    }
  }

  return response;
}

// Helper para facilitar uso com JSON
export async function httpJson<T = unknown>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await http(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

