// src/config/auth.ts
// Configuração de autenticação OAuth2 + PKCE com tetra-iam

export const AUTH = {
  iamBaseUrl: import.meta.env.VITE_IAM_BASE_URL || 'http://localhost:3335',
  clientId: import.meta.env.VITE_IAM_ADMIN_CLIENT_ID || 'admin-spa-client',
  redirectUri: `${window.location.origin}/oauth/callback`,
  scope: 'openid profile email',
};

