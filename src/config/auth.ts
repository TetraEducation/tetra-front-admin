// src/config/auth.ts
// Configuração de autenticação com tetra-iam

import { urls } from "../lib/urls";

// Em desenvolvimento, o Vite proxy intercepta as rotas /auth/*, /users/*, /oauth2-secure/*
// e redireciona para localhost:3335, tornando as chamadas same-origin
// Isso permite que cookies SameSite=Lax funcionem corretamente

// Remove barra final se existir para evitar dupla barra na construção da URL
const normalizeUrl = (url: string) => url.replace(/\/$/, "");

const isLocal = import.meta.env.VITE_ENV === "local";

export const AUTH = {
  // Se for local, usa string vazia (proxy)
  // Senão, sempre usa urls.iam (que já está configurado corretamente)
  iamBaseUrl: isLocal ? "" : normalizeUrl(urls.iam),
  clientId: import.meta.env.VITE_IAM_ADMIN_CLIENT_ID || "admin-spa-client",
  redirectUri: `${window.location.origin}/oauth/callback`,
  scope: "openid profile email",
};
