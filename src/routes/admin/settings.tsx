import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTenantContext } from "@/app/platform/hooks/useTenants";
import { useTenantDetails } from "@/app/platform/hooks/useTenants";
import { FileText, Users, Bell, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type TabType = "basic" | "contacts" | "notifications" | "danger";

function SettingsPage() {
  const { tenantId } = useTenantContext();
  const { data: tenantDetails, isLoading, error } = useTenantDetails(tenantId);
  const [activeTab, setActiveTab] = useState<TabType>("basic");

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Configurações</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Configurações</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Erro ao carregar dados:{" "}
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Configurações</h1>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex px-6" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "basic"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FileText size={18} />
              Informações Básicas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("contacts")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "contacts"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users size={18} />
              Contatos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "notifications"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Bell size={18} />
              Notificações
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("danger")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "danger"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <AlertTriangle size={18} />
              Zona de Perigo
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Tab: Informações Básicas */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              {/* Seção: Identificação */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Identificação
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da plataforma
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={tenantDetails?.name || ""}
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                        defaultValue={tenantDetails?.slug || ""}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CNPJ/CPF
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        defaultValue={tenantDetails?.taxId || ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: Contato */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Contato
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Principal
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={tenantDetails?.details?.primaryEmail || ""}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={tenantDetails?.details?.phone || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Seção: Endereço */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Endereço
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço Completo
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={tenantDetails?.details?.address || ""}
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        defaultValue={tenantDetails?.details?.city || ""}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        defaultValue={tenantDetails?.details?.state || ""}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CEP
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        defaultValue={tenantDetails?.details?.zipCode || ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: Observações */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Observações
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas e Observações
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={4}
                    defaultValue={tenantDetails?.details?.notes || ""}
                    readOnly
                  />
                </div>
              </div>

              {/* Botão de Salvar */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed opacity-60"
                  disabled
                  title="Precisa implementar"
                >
                  Salvar Alterações (precisa implementar)
                </button>
              </div>
            </div>
          )}

          {/* Tab: Contatos */}
          {activeTab === "contacts" && (
            <div className="space-y-6">
              {/* Contato de Vendas */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">
                  Contato de Vendas
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        defaultValue={
                          tenantDetails?.details?.salesContactName || ""
                        }
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        defaultValue={
                          tenantDetails?.details?.salesContactEmail || ""
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={
                        tenantDetails?.details?.salesContactPhone || ""
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Contato de Suporte */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 mb-4">
                  Contato de Suporte
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        defaultValue={
                          tenantDetails?.details?.supportContactName || ""
                        }
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        defaultValue={
                          tenantDetails?.details?.supportContactEmail || ""
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      defaultValue={
                        tenantDetails?.details?.supportContactPhone || ""
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed opacity-60"
                disabled
                title="Precisa implementar"
              >
                Salvar Alterações (precisa implementar)
              </button>
            </div>
          )}

          {/* Tab: Notificações */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Notificações por Email
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receber notificações importantes por email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Notificações Push
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receber notificações no navegador
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Tab: Zona de Perigo */}
          {activeTab === "danger" && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Ações irreversíveis que afetam permanentemente sua conta e
                dados.
              </p>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Excluir Tenant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
