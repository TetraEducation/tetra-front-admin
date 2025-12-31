// src/auth/useTokenRefresh.ts
// Hook para renovar token automaticamente antes de expirar
// Backend usa TTL de 15 minutos para access tokens

import { useEffect } from 'react';
import { useAuth } from './authStore';
import { iamAuth } from './iamAuth';

export function useTokenRefresh() {
  const { accessToken, setAuth, clear } = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    try {
      // Decodifica JWT para pegar tempo de expiração
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresAt = payload.exp * 1000; // Converte para ms
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      // Se já expirou, não agenda refresh
      if (timeUntilExpiry <= 0) {
        console.warn('⚠️ Token já expirado');
        return;
      }

      // Renova 2 minutos antes de expirar (backend usa 15min TTL)
      // Ou 80% do tempo de vida, o que for menor
      const refreshTime = Math.max(
        Math.min(timeUntilExpiry * 0.8, timeUntilExpiry - 2 * 60 * 1000),
        0
      );

      console.log(
        `🔄 Token expira em ${Math.round(timeUntilExpiry / 1000)}s, renovando em ${Math.round(refreshTime / 1000)}s`
      );

      const timer = setTimeout(async () => {
        try {
          console.log('🔄 Renovando token automaticamente...');
          const newToken = await iamAuth.refresh();
          const user = await iamAuth.fetchMe();
          setAuth(newToken, user);
          console.log('✅ Token renovado com sucesso');
        } catch (error) {
          console.error('❌ Erro ao renovar token:', error);
          // Se refresh falhar, limpa sessão
          clear();
        }
      }, refreshTime);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
    }
  }, [accessToken, setAuth, clear]);
}



