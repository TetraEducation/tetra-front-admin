// src/auth/useSessionRestore.ts
// Hook para restaurar sessão do backend na inicialização
// Tenta restaurar de cookies primeiro, depois usa refresh token (HttpOnly cookie)

import { useEffect, useState } from 'react';
import { useAuth } from './authStore';
import { iamAuth } from './iamAuth';
import { getCookie, setCookie } from '@/utils/cookies';

export function useSessionRestore() {
  const { accessToken, setAuth } = useAuth();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    (async () => {
      // Se já tem token em memória, não precisa restaurar
      if (accessToken) {
        setIsRestoring(false);
        return;
      }

      try {
        // Primeiro, tenta restaurar do cookie (se existir)
        const cookieToken = getCookie('access_token');
        if (cookieToken) {
          console.log('🍪 Token encontrado em cookie, validando...');
          try {
            // Define o token temporariamente para validar
            useAuth.getState().setAuth(cookieToken, undefined);
            // Valida o token tentando buscar dados do usuário
            const user = await iamAuth.fetchMe();
            setAuth(cookieToken, user);
            console.log('✅ Sessão restaurada do cookie com sucesso');
            setIsRestoring(false);
            return;
          } catch (error) {
            console.warn('⚠️ Token do cookie inválido ou expirado, tentando refresh...');
            // Limpa o token inválido
            useAuth.getState().clear();
            // Se o token do cookie estiver inválido, continua para tentar refresh
          }
        }

        console.log('🔄 Tentando restaurar sessão do backend...');
        console.log('📍 Domínio atual:', window.location.hostname);
        console.log('📍 Origin completo:', window.location.origin);
        console.log('🍪 Cookies disponíveis:', document.cookie);
        console.log('🍪 Tem cookie refresh?', document.cookie.includes('refresh=') ? '✅ SIM' : '❌ NÃO');
        
        // Usa refresh token (HttpOnly cookie) para restaurar sessão
        // Backend valida o refresh token opaco e retorna novo access token
        const newToken = await iamAuth.refresh();
        console.log('✅ Novo access token recebido');
        
        const user = await iamAuth.fetchMe();
        console.log('✅ Dados do usuário recebidos:', user.email);
        
        setAuth(newToken, user);
        
        // Atualiza o cookie com o novo token
        setCookie('access_token', newToken, 7);
        
        console.log('✅ Sessão restaurada com sucesso');
      } catch (error) {
        console.error('❌ Erro ao restaurar sessão:', error);
        console.log('📋 Detalhes do erro:', error instanceof Error ? error.message : error);
        // Não é um erro - usuário simplesmente não está logado
      } finally {
        setIsRestoring(false);
      }
    })();
  }, []); // Executa apenas uma vez na inicialização

  return { isRestoring };
}

