// src/auth/ports.ts
// Hexagonal Architecture: Auth Port (interface)

import type { Me } from './authStore';

export interface LoginCredentials {
  email: string;
  password: string;
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
}

