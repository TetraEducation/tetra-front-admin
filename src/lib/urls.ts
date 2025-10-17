// Configuração de URLs da API
const hostname = window?.location.hostname ?? '';

const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
const isStaging = hostname.includes('staging');

export const urls = {
  // URL da API de Tenants
  tenants: import.meta.env.VITE_TETRA_TENANTS_URL || 
    (isLocal 
      ? 'http://localhost:3004' 
      : isStaging
        ? 'https://staging-api.tetraeducacao.com/tenants'
        : 'https://api.tetraeducacao.com/tenants'),

  // URL da API de IAM
  iam: import.meta.env.VITE_TETRA_IAM_URL || 
    (isLocal 
      ? 'http://localhost:3005'
      : isStaging
        ? 'https://staging-api.tetraeducacao.com/iam'
        : 'https://api.tetraeducacao.com/iam'),
};
