import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { iamAuth } from '@/auth/iamAuth';
import { useAuth } from '@/auth/authStore';
import { setCookie } from '@/utils/cookies';

export default function AdministrativeLoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Login direto com email/senha
      const response = await iamAuth.login({ email, password });
      
      // Armazena token em memória
      const user = response.user || (await iamAuth.fetchMe());
      useAuth.getState().setAuth(response.access_token, user);

      // Armazena accessToken em cookies para reutilização
      // NOTA: Por enquanto usando cookies client-side. Em produção, considerar HttpOnly cookies do backend
      if (response.access_token) {
        setCookie('access_token', response.access_token, 7); // 7 dias
      }

      // Valida platformAccess
      if (user.platformAccess !== 'ADMIN') {
        throw new Error('Acesso negado: você não tem permissão de administrador');
      }

      // Redireciona para home
      navigate({ to: '/administrative/home' });
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err instanceof Error ? err.message : 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Painel Administrativo
        </h1>
        <p className="text-gray-600">
          Acesse a área de gestão da plataforma
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@tetraeducacao.com"
            required
            disabled={loading}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            className="w-full"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Apenas para administradores da plataforma</p>
      </div>
    </form>
  );
}



