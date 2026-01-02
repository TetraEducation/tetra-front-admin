// src/config/auth.ts
// Configuração de autenticação com tetra-iam

import { urls } from "../lib/urls";

// Em desenvolvimento, o Vite proxy intercepta as rotas /api/iam/*
// e redireciona para localhost:3335, tornando as chamadas same-origin
// Isso permite que cookies SameSite=Lax funcionem corretamente

// Remove barra final se existir para evitar dupla barra na construção da URL
const normalizeUrl = (url: string) => url.replace(/\/$/, "");

export const AUTH = {
  // Sempre usa urls.iam (que já está configurado corretamente para local/prod)
  // Em local: /api/iam (proxy intercepta)
  // Em prod: https://iam.tetraeducacao.com.br
  iamBaseUrl: normalizeUrl(urls.iam),
  clientId: import.meta.env.VITE_IAM_ADMIN_CLIENT_ID || "admin-spa-client",
  redirectUri: `${window.location.origin}/oauth/callback`,
  scope: "openid profile email",
};
