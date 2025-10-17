// src/mocks/users.ts
// Cada usuário tem: id, email, password, role ('tenant_admin' | 'member' | 'platform_admin'), tenantKey (se aplicável)
export const MOCK_USERS = [
    // usuários da plataforma (super-admin)
    { id: "u0", email: "admin@tetra.com", password: "admin123", role: "platform_admin", tenantKey: null },
  
    // Tenant Alpha
    { id: "u1", email: "admin-alpha@cliente.com", password: "alpha123", role: "tenant_admin", tenantKey: "tenant-alpha" },
    { id: "u2", email: "user-alpha@cliente.com", password: "user123", role: "member", tenantKey: "tenant-alpha" },
  
    // Tenant Beta
    { id: "u3", email: "admin-beta@cliente.com", password: "beta123", role: "tenant_admin", tenantKey: "tenant-beta" },
    { id: "u4", email: "user-beta@cliente.com", password: "user123", role: "member", tenantKey: "tenant-beta" },
  ];
  