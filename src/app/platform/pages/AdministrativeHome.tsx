import { usePlatformAuth } from "@/app/platform/hooks/usePlatformAuth";
import { useTenants } from "@/app/platform/hooks/useTenants";

export function AdministrativeHome() {
  const { user } = usePlatformAuth();
  const { tenants, loading } = useTenants();

  return (
    <div>
      <h2 className="text-2xl font-semibold">Bem-vindo, {user?.email}</h2>
      <section className="mt-6">
        <h3 className="font-medium mb-2">Tenants</h3>
        {loading ? <p>Carregando...</p> : (
          <ul className="space-y-2">
            {tenants.map(t => (
              <li key={t.id} className="p-3 bg-white rounded shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.slug}</div>
                  </div>
                  <div>
                    <button className="text-sm underline">Entrar no tenant</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
