// Configuração de URLs da API
const hostname = window?.location.hostname ?? "";

const isLocal = import.meta.env.VITE_ENV === "local";
const isStaging = hostname.includes("staging");

export const urls = {
  // URL da API de Tenants
  tenants: isLocal
    ? "http://localhost:3334"
    : isStaging
      ? "https://staging-api.tetraeducacao.com/tenants"
      : "https://tenants.tetraeducacao.com.br",

  // URL da API de IAM
  iam: isLocal
    ? "http://localhost:3335"
    : isStaging
      ? "https://staging-api.tetraeducacao.com/iam"
      : "https://iam.tetraeducacao.com.br/",
};
