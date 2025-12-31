import { useMemo, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef } from "@/components/ui/data-table-custom";
import { DataTable } from "@/components/ui/data-table-custom";
import {
  Filter,
  MoreVertical,
  Plus,
  Search,
  SquareStack,
  Target,
  Users2,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

type GroupStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";
type GroupPeriodicity = "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUAL";

type Group = {
  id: string;
  name: string;
  description: string;
  members: number;
  status: GroupStatus;
  periodicity: GroupPeriodicity;
  owner: string;
  createdAt: string;
  updatedAt: string;
};

const mockGroups: Group[] = [
  {
    id: "g-001",
    name: "Onboarding Devs",
    description: "Trilha de integração para novos desenvolvedores",
    members: 42,
    status: "ACTIVE",
    periodicity: "WEEKLY",
    owner: "Ana Martins",
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-12-21T12:45:00Z",
  },
  {
    id: "g-002",
    name: "Trilha Front-end Avançado",
    description: "Grupo focado em React, TanStack e boas práticas",
    members: 128,
    status: "ACTIVE",
    periodicity: "MONTHLY",
    owner: "Eduardo Lima",
    createdAt: "2024-03-08T13:30:00Z",
    updatedAt: "2024-12-18T17:20:00Z",
  },
  {
    id: "g-003",
    name: "Mentoria UX Research",
    description: "Sessões guiadas sobre discovery e entrevistas",
    members: 34,
    status: "INACTIVE",
    periodicity: "DAILY",
    owner: "Clara Mendes",
    createdAt: "2023-11-02T09:15:00Z",
    updatedAt: "2024-10-10T08:10:00Z",
  },
  {
    id: "g-004",
    name: "Comunidade DevOps",
    description: "Discussões sobre CI/CD, observabilidade e cloud",
    members: 86,
    status: "ACTIVE",
    periodicity: "MONTHLY",
    owner: "João Pedro",
    createdAt: "2024-04-22T11:05:00Z",
    updatedAt: "2024-12-09T15:50:00Z",
  },
  {
    id: "g-005",
    name: "Gestão Educacional",
    description: "Grupo de líderes de escolas parceiras",
    members: 18,
    status: "ARCHIVED",
    periodicity: "ANNUAL",
    owner: "Mariana Rios",
    createdAt: "2022-09-18T07:40:00Z",
    updatedAt: "2024-05-01T18:00:00Z",
  },
];

const statusBadge = {
  ACTIVE: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Ativo",
  },
  INACTIVE: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    dot: "bg-gray-400",
    label: "Inativo",
  },
  ARCHIVED: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
    label: "Arquivado",
  },
} satisfies Record<
  GroupStatus,
  { bg: string; text: string; dot: string; label: string }
>;

const periodicityLabel: Record<GroupPeriodicity, string> = {
  DAILY: "Diário",
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
  ANNUAL: "Anual",
};

const periodicityBadge: Record<GroupPeriodicity, string> = {
  DAILY: "bg-amber-50 text-amber-700 border border-amber-200",
  WEEKLY: "bg-blue-50 text-blue-700 border border-blue-200",
  MONTHLY: "bg-purple-50 text-purple-700 border border-purple-200",
  ANNUAL: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export const Route = createFileRoute("/admin/groups")({
  component: GroupsPage,
});

function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<GroupStatus | "all">("all");
  const [periodicityFilter, setPeriodicityFilter] = useState<
    GroupPeriodicity | "all"
  >("all");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSearch = () => setAppliedSearch(searchTerm);

  const handleClearSearch = () => {
    setSearchTerm("");
    setAppliedSearch("");
  };

  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch = appliedSearch
      ? group.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        group.description.toLowerCase().includes(appliedSearch.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter === "all" || group.status === statusFilter;
    const matchesPeriodicity =
      periodicityFilter === "all" || group.periodicity === periodicityFilter;

    return matchesSearch && matchesStatus && matchesPeriodicity;
  });

  const activeGroups = mockGroups.filter((group) => group.status === "ACTIVE");
  const archivedGroups = mockGroups.filter(
    (group) => group.status === "ARCHIVED"
  );
  const totalMembers = mockGroups.reduce(
    (total, group) => total + group.members,
    0
  );

  const columns: ColumnDef<Group>[] = useMemo(
    () => [
      {
        header: "Grupo",
        cell: (group) => (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 grid place-content-center">
              <Users2 size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{group.name}</p>
              <p className="text-sm text-gray-500 line-clamp-1">
                {group.description}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "Membros",
        cell: (group) => (
          <div className="flex items-center gap-2 text-gray-800">
            <UsersRound size={16} className="text-emerald-600" />
            <span className="font-medium">{group.members}</span>
          </div>
        ),
      },
      {
        header: "Periodicidade",
        cell: (group) => (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${periodicityBadge[group.periodicity]}`}
          >
            {periodicityLabel[group.periodicity]}
          </span>
        ),
      },
      {
        header: "Status",
        cell: (group) => {
          const badge = statusBadge[group.status];
          return (
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${badge.bg} ${badge.text}`}
            >
              <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
              {badge.label}
            </span>
          );
        },
      },
      {
        header: "Responsável",
        cell: (group) => (
          <span className="text-sm text-gray-700 font-medium">
            {group.owner}
          </span>
        ),
      },
      {
        header: "Ações",
        cell: (group) => {
          const isOpen = openMenuId === group.id;
          return (
            <div className="relative">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenMenuId((prev) =>
                    prev === group.id ? null : group.id
                  );
                }}
                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                aria-label={`Opções do grupo ${group.name}`}
              >
                <MoreVertical size={18} />
              </button>
              {isOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-[101]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    onClick={() => {
                      setOpenMenuId(null);
                      toast.info("Visualizar grupo", {
                        description: `Abrindo detalhes de ${group.name}`,
                      });
                    }}
                  >
                    <Target size={16} />
                    Visualizar
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    onClick={() => {
                      setOpenMenuId(null);
                      toast.info("Editar grupo", {
                        description: `Editando ${group.name}`,
                      });
                    }}
                  >
                    <SquareStack size={16} />
                    Editar permissões
                  </button>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [openMenuId]
  );

  const emptyState = (
    <div className="text-center">
      <Users2 className="mx-auto mb-4 text-gray-400" size={64} />
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        Nenhum grupo encontrado
      </h3>
      <p className="mb-6 text-gray-600">
        Organize permissões criando o primeiro grupo de acesso.
      </p>
      <button
        type="button"
        onClick={() => setIsCreateModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-emerald-700"
      >
        <Plus size={18} />
        Criar primeiro grupo
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 flex items-center gap-3 text-4xl font-bold text-gray-900">
              <Users2 className="text-emerald-600" size={40} />
              Grupos de Acesso
            </h1>
            <p className="text-lg text-gray-600">
              Centralize permissões e gerencie as equipes com segurança.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            <Plus size={20} />
            Novo Grupo
          </button>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border-l-4 border-emerald-500 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Total de grupos
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {mockGroups.length}
                </p>
              </div>
              <div className="rounded-full bg-emerald-100 p-4">
                <Users2 className="text-emerald-600" size={28} />
              </div>
            </div>
          </div>
          <div className="rounded-xl border-l-4 border-blue-500 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Grupos ativos
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {activeGroups.length}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {archivedGroups.length} arquivados
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-4">
                <Target className="text-blue-600" size={28} />
              </div>
            </div>
          </div>
          <div className="rounded-xl border-l-4 border-purple-500 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Membros em grupos
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalMembers}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-4">
                <UsersRound className="text-purple-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Pesquisar por nome ou descrição..."
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/30"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700"
            >
              <Search size={18} />
              Buscar
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Filter size={18} />
              Filtros Avançados
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-600">Status:</span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: `Todos (${mockGroups.length})`, value: "all" },
                  { label: `Ativos (${activeGroups.length})`, value: "ACTIVE" },
                  {
                    label: `Inativos (${mockGroups.filter((g) => g.status === "INACTIVE").length})`,
                    value: "INACTIVE",
                  },
                  {
                    label: `Arquivados (${archivedGroups.length})`,
                    value: "ARCHIVED",
                  },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setStatusFilter(item.value as typeof statusFilter)
                    }
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      statusFilter === item.value
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-600">Periodicidade:</span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: "Todas", value: "all" },
                  { label: "Diário", value: "DAILY" },
                  { label: "Semanal", value: "WEEKLY" },
                  { label: "Mensal", value: "MONTHLY" },
                  { label: "Anual", value: "ANNUAL" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setPeriodicityFilter(
                        item.value as typeof periodicityFilter
                      )
                    }
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      periodicityFilter === item.value
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {openMenuId && (
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setOpenMenuId(null)}
          />
        )}

        <DataTable
          data={filteredGroups}
          columns={columns}
          emptyState={emptyState}
          onRowClick={(group) =>
            toast.info("Grupo selecionado", {
              description: `Você abriu ${group.name}`,
            })
          }
        />

        <div className="mt-8 rounded-lg border-l-4 border-emerald-500 bg-emerald-50/80 p-6 text-sm text-emerald-900">
          <h3 className="mb-2 font-semibold">
            💡 Dica: grupos bem estruturados aceleram liberações
          </h3>
          <p>
            Utilize padrões consistentes (por exemplo, “Equipe · Objetivo”) para
            nomear os grupos e manter permissões alinhadas entre times de
            suporte, conteúdo e comercial.
          </p>
        </div>

        {/* Modal placeholder */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-gray-900">
                Criar novo grupo
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Esta é apenas uma prévia. Integre com seu fluxo de criação
                quando estiver pronto.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    toast.success("Grupo criado", {
                      description:
                        "Fluxo de criação será implementado em breve.",
                    });
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
