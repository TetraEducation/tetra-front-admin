// Utilitários para manipulação de cookies
// NOTA: Por enquanto usando cookies client-side. Em produção, considerar HttpOnly cookies do backend

export function setCookie(name: string, value: string, days = 7, path = "/") {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  // Adiciona SameSite=Lax para melhor segurança (permite cookies em navegação same-site)
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const c of cookies) {
    const [k, ...v] = c.split("=");
    if (decodeURIComponent(k) === name) {
      return decodeURIComponent(v.join("="));
    }
  }
  return null;
}

export function deleteCookie(name: string, path = "/") {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}