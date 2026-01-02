// Configuração de URLs da API
const hostname = window?.location.hostname ?? "";

const isLocal = import.meta.env.VITE_ENV === "local";
const isStaging = hostname.includes("staging");

export const urls = {
  // URL da API de Tenants
  // Em local: string vazia para usar proxy do Vite (/tenants → localhost:3334)
  // Em staging/prod: URL completa da API
  tenants: isLocal
    ? "" // Proxy do Vite intercepta /tenants/* → localhost:3334
    : isStaging
      ? "https://staging-api.tetraeducacao.com/tenants"
      : "https://tenants.tetraeducacao.com.br",

  // URL da API de IAM
  // Em local: string vazia para usar proxy do Vite (/auth, /users, /oauth2-secure → localhost:3335)
  // Em staging/prod: URL completa da API
  iam: isLocal
    ? "" // Proxy do Vite intercepta /auth/*, /users/*, /oauth2-secure/* → localhost:3335
    : isStaging
      ? "https://staging-api.tetraeducacao.com/iam"
      : "https://iam.tetraeducacao.com.br/",
};
