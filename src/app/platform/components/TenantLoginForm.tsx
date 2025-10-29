import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { iamAuth } from '@/auth/iamAuth';
import { useAuth } from '@/auth/authStore';

export default function TenantLoginForm({ branding, tenantId }: { branding?: any; tenantId?: string }) {
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
      // Login direto com email/senha + tenantId (diferente do administrative-panel)
      const response = await iamAuth.login({ email, password, tenantId });
      
      // Armazena token em memória
      const user = response.user || (await iamAuth.fetchMe());
      useAuth.getState().setAuth(response.access_token, user);

      // Valida platformAccess (mesmo que o administrative-panel)
      if (user.platformAccess !== 'ADMIN') {
        throw new Error('Acesso negado: você não tem permissão de administrador');
      }

      // Redireciona para /admin (diferente do administrative-panel que vai para /administrative-panel/home)
      navigate({ to: '/admin' });
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err instanceof Error ? err.message : 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {branding?.logoUrl && <img src={branding.logoUrl} alt="logo" className="h-10 mb-4" />}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
        <Input 
          type="email" 
          placeholder="seu-email@empresa.com.br" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
          disabled={loading}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
        <Input 
          type="password" 
          placeholder="••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
          disabled={loading}
          className="w-full"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        style={{ backgroundColor: 'var(--brand-primary)' }}
        disabled={loading}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}
