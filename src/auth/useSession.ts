// src/auth/useSession.ts
// Hook principal de gerenciamento de sessão
// Combina restauração de sessão e auto-refresh

import { useSessionRestore } from './useSessionRestore';
import { useTokenRefresh } from './useTokenRefresh';

export function useSession() {
  // Restaura sessão do backend na inicialização (se houver refresh token válido)
  const { isRestoring } = useSessionRestore();
  
  // Auto-refresh do token antes de expirar
  useTokenRefresh();
  
  return { isRestoring };
}



