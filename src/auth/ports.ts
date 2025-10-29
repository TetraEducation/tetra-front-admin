// src/auth/ports.ts
// Hexagonal Architecture: Auth Port (interface)

import type { Me } from './authStore';

export interface LoginCredentials {
  email: string;
  password: string;
  tenantId?: string; // Opcional para login de tenant
}

export interface LoginResponse {
  access_token: string;
  user?: Me;
}

export interface AuthPort {
  login(credentials: LoginCredentials): Promise<LoginResponse>;
  fetchMe(): Promise<Me>;
  refresh(): Promise<string>; // retorna novo access token
  logout(): Promise<void>;
  impersonate(tenantId: string, reason: string): Promise<{ access_token: string; impersonation_id: string; expires_in: number }>;
}

