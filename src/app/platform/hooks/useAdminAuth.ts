import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { authStore } from '@/lib/authStore';

// Hook para usar autenticação administrativa
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(authStore.isAuthenticated());
  const [user, setUser] = useState(authStore.getUser());

  useEffect(() => {
    // Atualiza estado quando authStore mudar
    const unsubscribe = authStore.subscribe((state) => {
      setIsAuthenticated(!!state.accessToken);
      setUser(state.user);
    });

    return unsubscribe;
  }, []);

  return {
    isAuthenticated,
    user,
    token: authStore.getToken(),
    logout: () => authStore.clear(),
  };
}

// Hook para proteger rotas administrativas
export function useRequireAdminAuth() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/administrative-panel' });
    }
  }, [isAuthenticated, navigate]);

  return { isAuthenticated };
}



