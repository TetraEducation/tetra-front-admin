import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { startLogin } from '@/app/platform/hooks/usePlatformAuth'; // ou seu auth helper

// Função temporária até implementar startLogin
const startLogin = () => {
  console.log('Iniciando login PKCE...');
  // TODO: Implementar PKCE
};

export default function TenantLoginForm({ branding }: { branding?: any }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); startLogin(); }} className="space-y-4">
      {branding?.logoUrl && <img src={branding.logoUrl} alt="logo" className="h-10 mb-4" />}
      <div>
        <label className="block text-sm">E-mail</label>
        <Input type="email" placeholder="seu-email@empresa.com.br" required />
      </div>
      <div>
        <label className="block text-sm">Senha</label>
        <Input type="password" placeholder="••••••" required />
      </div>
      <Button type="submit" className="w-full" style={{ backgroundColor: 'var(--brand-primary)' }}>
        Entrar
      </Button>
    </form>
  );
}
