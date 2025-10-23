// src/auth/AdminGuard.tsx
// Guard para proteger rotas do painel administrativo
// Verifica se o usuário está autenticado e tem platformAccess === 'ADMIN'

import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from './authStore';
import { iamAuth } from './iamAuth';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { accessToken, me } = useAuth();
  const [ok, setOk] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setChecking(true);

        // Se não tem token, tenta refresh primeiro (caso tenha refresh cookie)
        if (!accessToken) {
          try {
            await iamAuth.refresh();
            const user = await iamAuth.fetchMe();
            if (user.platformAccess !== 'ADMIN') {
              throw new Error('forbidden');
            }
            setOk(true);
            return;
          } catch {
            // Se refresh falhar, redireciona para login
            navigate({ to: '/administrative-panel' });
            return;
          }
        }

        // Se tem token, valida o usuário
        const user = me ?? (await iamAuth.fetchMe());
        if (user.platformAccess !== 'ADMIN') {
          throw new Error('forbidden: platformAccess is not ADMIN');
        }

        setOk(true);
      } catch (err) {
        console.error('AdminGuard error:', err);
        setOk(false);
        // Redireciona para login em caso de erro
        navigate({ to: '/administrative-panel' });
      } finally {
        setChecking(false);
      }
    })();
  }, [accessToken, me, navigate]);

  if (checking || !ok) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Verificando acesso...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

