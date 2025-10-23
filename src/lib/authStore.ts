// Store em memória para gerenciar autenticação administrativa
// Não persiste em localStorage para maior segurança

type AuthState = {
  accessToken: string | null;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'superadmin';
  } | null;
};

class AuthStore {
  private state: AuthState = {
    accessToken: null,
    user: null,
  };

  // Listeners para mudanças de estado
  private listeners: Set<(state: AuthState) => void> = new Set();

  // Define o token e opcionalmente os dados do usuário
  setToken(token: string, user?: AuthState['user']) {
    this.state = {
      accessToken: token,
      user: user || this.state.user,
    };
    this.notifyListeners();
  }

  // Define os dados do usuário
  setUser(user: AuthState['user']) {
    this.state = {
      ...this.state,
      user,
    };
    this.notifyListeners();
  }

  // Retorna o token atual
  getToken(): string | null {
    return this.state.accessToken;
  }

  // Retorna o usuário atual
  getUser(): AuthState['user'] {
    return this.state.user;
  }

  // Verifica se está autenticado
  isAuthenticated(): boolean {
    return !!this.state.accessToken;
  }

  // Limpa a autenticação (logout)
  clear() {
    this.state = {
      accessToken: null,
      user: null,
    };
    this.notifyListeners();
  }

  // Subscreve para mudanças de estado
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notifica todos os listeners
  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Retorna o estado completo
  getState(): AuthState {
    return { ...this.state };
  }
}

// Exporta instância singleton
export const authStore = new AuthStore();

// Helper para usar em fetch/axios
export function getAuthHeaders() {
  const token = authStore.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}



