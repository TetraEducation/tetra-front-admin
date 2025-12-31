// src/config/auth.ts
// Configuração de autenticação com tetra-iam

// Em desenvolvimento, o Vite proxy intercepta as rotas /auth/*, /users/*, /oauth2-secure/*
// e redireciona para localhost:3335, tornando as chamadas same-origin
// Isso permite que cookies SameSite=Lax funcionem corretamente

export const AUTH = {
  // Em dev: '' (vazio) usa o mesmo origin + proxy do Vite
  // Em prod: https://iam.tetraeducacao.com.br
  iamBaseUrl: import.meta.env.VITE_IAM_BASE_URL || '',
  clientId: import.meta.env.VITE_IAM_ADMIN_CLIENT_ID || 'admin-spa-client',
  redirectUri: `${window.location.origin}/oauth/callback`,
  scope: 'openid profile email',
};

