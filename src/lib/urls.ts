// Configuração de URLs da API
const hostname = window?.location.hostname ?? "";

const isLocal = import.meta.env.VITE_ENV === "local";
const isStaging = hostname.includes("staging");

export const urls = {
  // URL da API de Tenants
  // Em local: /api/tenants (proxy do Vite intercepta e redireciona para localhost:3334)
  // Em staging/prod: URL completa da API
  tenants: isLocal
    ? "/api/tenants" // Proxy do Vite intercepta /api/tenants/* → localhost:3334
    : isStaging
      ? "https://staging-api.tetraeducacao.com/tenants"
      : "https://tenants.tetraeducacao.com.br",

  // URL da API de IAM
  // Em local: /api/iam (proxy do Vite intercepta e redireciona para localhost:3335)
  // Em staging/prod: URL completa da API
  iam: isLocal
    ? "/api/iam" // Proxy do Vite intercepta /api/iam/* → localhost:3335
    : isStaging
      ? "https://staging-api.tetraeducacao.com/iam"
      : "https://iam.tetraeducacao.com.br",
};
