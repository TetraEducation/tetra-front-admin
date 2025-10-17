import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { usePlatformAuth } from "@/app/platform/hooks/usePlatformAuth";

export function AdministrativeLogin() {
  const { login, loading } = usePlatformAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login({ email, password });
    if (ok) {
      navigate({ to: "/administrative-panel/home" });
    } else {
      // usar sonner ou setState de erro
      alert("Credenciais inválidas (mock) — tente: admin@tetra.com / senha: admin123");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login — Administrative Panel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Email</span>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm">Senha</span>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <Button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
      </form>
    </div>
  );
}
