// Mock de autenticação administrativa
// Este arquivo simula o endpoint /api/admin-login

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'superadmin';
  };
}

// Usuários administrativos mock
const adminUsers = [
  {
    id: 'admin-1',
    email: 'admin@tetraeducacao.com',
    password: 'admin123',
    name: 'Administrador Tetra',
    role: 'superadmin' as const,
  },
  {
    id: 'admin-2',
    email: 'gestor@tetraeducacao.com',
    password: 'gestor123',
    name: 'Gestor da Plataforma',
    role: 'admin' as const,
  },
];

// Simula login administrativo
export async function mockAdminLogin(
  request: AdminLoginRequest
): Promise<AdminLoginResponse> {
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = adminUsers.find(
    (u) => u.email === request.email && u.password === request.password
  );

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  // Gera um token mock (JWT-like)
  const token = `mock_admin_token_${user.id}_${Date.now()}`;

  return {
    access_token: token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}



