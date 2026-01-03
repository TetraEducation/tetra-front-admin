// src/auth/authStore.ts
// Store de autenticação em memória (Zustand)
// Não persiste em localStorage - se recarregar, renova com refresh token

import { create } from 'zustand';

export type Me = {
  id: string;
  email: string;
  name?: string;
  platformAccess: 'ADMIN' | 'NONE';
  picture_url?: string | null;
  status?: string;
  email_verified_at?: string | null;
  last_login_at?: string | null;
  tenant_role?: string | null;
};

type AuthState = {
  accessToken?: string;
  me?: Me;
  setAuth: (token?: string, me?: Me) => void;
  clear: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  accessToken: undefined,
  me: undefined,
  setAuth: (token, me) => set({ accessToken: token, me }),
  clear: () => set({ accessToken: undefined, me: undefined }),
}));

