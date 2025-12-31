// src/app/platform/hooks/usePlatformAuth.ts
import { useEffect, useState } from "react";
import { getCookie, setCookie, deleteCookie } from "@/utils/cookies";
import { MOCK_USERS } from "@/mocks/users";
import { TENANTS } from "@/mocks/tenants";

type User = { id: string; email: string; role: string; tenantKey?: string | null } | null;

const PLATFORM_ADMIN_KEY = "platform-admin"; // opcional, podemos usar apenas credenciais do admin@tetra.com

export function usePlatformAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);

  // ao montar, checa cookie platform-key e tenta reconstruir user básico (mock)
  useEffect(() => {
    const key = getCookie("platform-key");
    if (key) {
      // se key === platform-admin, assumimos super-admin (ou checar credenciais no backend em prod)
      if (key === PLATFORM_ADMIN_KEY) {
        setUser({ id: "u0", email: "admin@tetra.com", role: "platform_admin", tenantKey: null });
        return;
      }

      // se a key casar com tenant, setamos um user "anon" desse tenant (não logado especificamente)
      const tenant = TENANTS.find((t) => t.key === key);
      if (tenant) {
        // marca user como não autenticado (até inserir credencial), mas com tenantKey presente
        setUser({ id: `session_${tenant.id}`, email: `${tenant.slug}@session.local`, role: "session", tenantKey: tenant.key });
        return;
      }
    }
    setUser(null);
  }, []);

  async function login({ email, password, platformKey }: { email: string; password: string; platformKey?: string }) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350)); // mock delay

    // primeiro tenta encontrar usuário no MOCK_USERS
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) {
      setLoading(false);
      return false;
    }

    // se usuário encontrado:
    // - se for platform_admin: gravar cookie platform-key = platform-admin (mock)
    // - se for tenant_admin ou member: gravar cookie platform-key = usuário.tenantKey
    if (found.role === "platform_admin") {
      setCookie("platform-key", PLATFORM_ADMIN_KEY, 7);
      setUser({ id: found.id, email: found.email, role: found.role, tenantKey: null });
      setLoading(false);
      return true;
    }

    if (found.tenantKey) {
      setCookie("platform-key", found.tenantKey, 7);
      setUser({ id: found.id, email: found.email, role: found.role, tenantKey: found.tenantKey });
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  }

  function logout() {
    deleteCookie("platform-key");
    setUser(null);
  }

  function isPlatformAdminFromCookie() {
    const key = getCookie("platform-key");
    return key === PLATFORM_ADMIN_KEY;
  }

  function resolveRedirect() {
    // decide destino após login com base no user (ou cookie)
    const currentKey = getCookie("platform-key");
    if (!currentKey) return { type: "internal", url: "/login" }; // sem cookie: volta pro login

    // super-admin => /administrative (área da nossa plataforma)
    if (currentKey === PLATFORM_ADMIN_KEY) {
      return { type: "internal", url: "/administrative/home" };
    }

    // se key for um tenant, checar role atual:
    const currentUserRole = user?.role ?? "unknown";
    if (currentUserRole === "tenant_admin") {
      // tenant admin => permanecer no app e ir para /admin (tenant area)
      return { type: "internal", url: "/admin" };
    }

    // se member ou sessão anônima => redirecionar para member app (externo)
    const memberUrl = import.meta.env.VITE_MEMBER_APP_URL || "/member";
    return { type: "external", url: memberUrl };
  }

  return { user, loading, login, logout, resolveRedirect, isPlatformAdminFromCookie };
}
