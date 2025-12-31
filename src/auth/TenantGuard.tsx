// src/auth/TenantGuard.tsx
// Guard para proteger rotas do tenant (/admin)
// Só verifica se está autenticado, NÃO verifica platformAccess
// platformAccess === 'ADMIN' só é necessário para /administrative

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "./authStore";
import { iamAuth } from "./iamAuth";

export function TenantGuard({ children }: { children: React.ReactNode }) {
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
            if (!user) {
              throw new Error("User not authenticated");
            }
            setOk(true);
            return;
          } catch {
            // Se refresh falhar, redireciona para login
            navigate({ to: "/login" });
            return;
          }
        }

        // Se tem token, valida se está autenticado (sem verificar platformAccess)
        const user = me ?? (await iamAuth.fetchMe());
        if (!user) {
          throw new Error("User not authenticated");
        }

        setOk(true);
      } catch (err) {
        console.error("TenantGuard error:", err);
        setOk(false);
        // Redireciona para login em caso de erro
        navigate({ to: "/login" });
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


