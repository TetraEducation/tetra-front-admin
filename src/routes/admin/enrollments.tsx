// src/routes/admin/enrollments.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table-custom";
import {
  GraduationCap,
  UserPlus,
  Search,
  Filter,
  X,
  Users,
  Calendar,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  XCircle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

type EnrollmentStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "PENDING";
type EnrollmentProgress = number; // 0-100

type Enrollment = {
  id: string;
  memberName: string;
  memberEmail: string;
  productName: string;
  productType: string;
  startDate: string;
  progress: EnrollmentProgress;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
};

// Dados mockados
const mockEnrollments: Enrollment[] = [
  {
    id: "1",
    memberName: "Maria Santos",
    memberEmail: "maria@example.com",
    productName: "Curso Completo de JavaScript",
    productType: "Curso",
    startDate: "2024-01-10T00:00:00Z",
    progress: 75,
    status: "IN_PROGRESS",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-12-20T15:30:00Z",
  },
  {
    id: "2",
    memberName: "João Silva",
    memberEmail: "joao@example.com",
    productName: "Curso de React e Next.js",
    productType: "Curso",
    startDate: "2024-02-15T00:00:00Z",
    progress: 100,
    status: "COMPLETED",
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-11-30T10:00:00Z",
  },
  {
    id: "3",
    memberName: "Ana Costa",
    memberEmail: "ana@example.com",
    productName: "E-book: Git e GitHub",
    productType: "E-book",
    startDate: "2024-03-01T00:00:00Z",
    progress: 45,
    status: "IN_PROGRESS",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-12-18T14:20:00Z",
  },
  {
    id: "4",
    memberName: "Pedro Oliveira",
    memberEmail: "pedro@example.com",
    productName: "Mentoria em DevOps",
    productType: "Mentoria",
    startDate: "2024-04-05T00:00:00Z",
    progress: 0,
    status: "PENDING",
    createdAt: "2024-04-05T00:00:00Z",
    updatedAt: "2024-04-05T00:00:00Z",
  },
  {
    id: "5",
    memberName: "Carla Mendes",
    memberEmail: "carla@example.com",
    productName: "Python para Análise de Dados",
    productType: "Curso",
    startDate: "2024-01-20T00:00:00Z",
    progress: 30,
    status: "CANCELLED",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-06-15T09:00:00Z",
  },
  {
    id: "6",
    memberName: "Roberto Alves",
    memberEmail: "roberto@example.com",
    productName: "Assinatura Premium",
    productType: "Assinatura",
    startDate: "2024-05-01T00:00:00Z",
    progress: 60,
    status: "IN_PROGRESS",
    createdAt: "2024-05-01T00:00:00Z",
    updatedAt: "2024-12-19T11:30:00Z",
  },
  {
    id: "7",
    memberName: "Fernanda Lima",
    memberEmail: "fernanda@example.com",
    productName: "Curso de React e Next.js",
    productType: "Curso",
    startDate: "2024-06-10T00:00:00Z",
    progress: 90,
    status: "IN_PROGRESS",
    createdAt: "2024-06-10T00:00:00Z",
    updatedAt: "2024-12-21T08:15:00Z",
  },
  {
    id: "8",
    memberName: "Lucas Pereira",
    memberEmail: "lucas@example.com",
    productName: "E-book: Docker na Prática",
    productType: "E-book",
    startDate: "2024-07-15T00:00:00Z",
    progress: 100,
    status: "COMPLETED",
    createdAt: "2024-07-15T00:00:00Z",
    updatedAt: "2024-09-20T16:45:00Z",
  },
];

// Helpers
const getStatusStyle = (status: EnrollmentStatus) => {
  switch (status) {
    case "IN_PROGRESS":
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",
        dot: "bg-blue-500",
        label: "Em Andamento",
      };
    case "COMPLETED":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        dot: "bg-green-500",
        label: "Concluída",
      };
    case "CANCELLED":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        dot: "bg-red-500",
        label: "Cancelada",
      };
    case "PENDING":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        dot: "bg-yellow-500",
        label: "Pendente",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        dot: "bg-gray-500",
        label: status,
      };
  }
};

function EnrollmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Função para aplicar busca
  const handleSearch = () => {
    setAppliedSearch(searchTerm);
  };

  // Função para limpar busca
  const handleClearSearch = () => {
    setSearchTerm("");
    setAppliedSearch("");
  };

  // Função para buscar com Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filtra os dados baseado na busca aplicada e filtros
  const filteredEnrollments = mockEnrollments.filter((enrollment) => {
    const matchesSearch = appliedSearch
      ? enrollment.memberName
          .toLowerCase()
          .includes(appliedSearch.toLowerCase()) ||
        enrollment.productName
          .toLowerCase()
          .includes(appliedSearch.toLowerCase()) ||
        enrollment.memberEmail
          .toLowerCase()
          .includes(appliedSearch.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter === "all" || enrollment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calcula estatísticas
  const totalEnrollments = mockEnrollments.length;
  const inProgressEnrollments = mockEnrollments.filter(
    (e) => e.status === "IN_PROGRESS"
  ).length;
  const completedEnrollments = mockEnrollments.filter(
    (e) => e.status === "COMPLETED"
  ).length;
  const cancelledEnrollments = mockEnrollments.filter(
    (e) => e.status === "CANCELLED"
  ).length;
  const pendingEnrollments = mockEnrollments.filter(
    (e) => e.status === "PENDING"
  ).length;

  // Definição das colunas da tabela
  const columns: ColumnDef<Enrollment>[] = useMemo(
    () => [
      {
        header: "Membro",
        cell: (enrollment) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {enrollment.memberName}
              </p>
              <p className="text-sm text-gray-500">{enrollment.memberEmail}</p>
            </div>
          </div>
        ),
      },
      {
        header: "Curso/Produto",
        cell: (enrollment) => (
          <div>
            <p className="font-medium text-gray-900">
              {enrollment.productName}
            </p>
            <p className="text-sm text-gray-500">{enrollment.productType}</p>
          </div>
        ),
      },
      {
        header: "Data de Início",
        cell: (enrollment) => (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span className="font-medium">
              {new Date(enrollment.startDate).toLocaleDateString("pt-BR")}
            </span>
          </div>
        ),
      },
      {
        header: "Progresso",
        cell: (enrollment) => (
          <div className="min-w-[120px]">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  enrollment.progress === 100
                    ? "bg-green-500"
                    : enrollment.progress >= 50
                      ? "bg-emerald-600"
                      : "bg-blue-500"
                }`}
                style={{ width: `${enrollment.progress}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-gray-600">
              {enrollment.progress}%
            </span>
          </div>
        ),
      },
      {
        header: "Status",
        cell: (enrollment) => {
          const statusStyle = getStatusStyle(enrollment.status);
          return (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
            >
              <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></div>
              {statusStyle.label}
            </span>
          );
        },
      },
      {
        header: "Ações",
        cell: (enrollment) => {
          const isMenuOpen = openMenuId === enrollment.id;

          return (
            <div className="flex items-center gap-2">
              {/* Menu de 3 pontos */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMenuId((prev) =>
                      prev === enrollment.id ? null : enrollment.id
                    );
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Mais opções"
                >
                  <MoreVertical size={18} />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[101]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        toast.info("Visualizar Matrícula", {
                          description: `Visualizando matrícula de ${enrollment.memberName}`,
                        });
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Eye size={16} />
                      Visualizar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        toast.info("Editar Matrícula", {
                          description: `Editando matrícula de ${enrollment.memberName}`,
                        });
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Editar
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>

                    {enrollment.status !== "CANCELLED" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          toast.error("Cancelar Matrícula", {
                            description: `Tem certeza que deseja cancelar a matrícula de ${enrollment.memberName}?`,
                          });
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <XCircle size={16} />
                        Cancelar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
    ],
    [openMenuId]
  );

  const emptyState = (
    <div className="text-center">
      <GraduationCap className="mx-auto text-gray-400 mb-4" size={64} />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Nenhuma matrícula encontrada
      </h3>
      <p className="text-gray-600 mb-6">Comece criando uma nova matrícula</p>
      <button
        onClick={() =>
          toast.info("Nova Matrícula", {
            description: "Modal de criação será implementado",
          })
        }
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
      >
        <UserPlus size={20} />
        Criar Primeira Matrícula
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <GraduationCap className="text-emerald-600" size={40} />
                Matrículas
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie todas as matrículas de cursos e produtos
              </p>
            </div>
            <button
              onClick={() =>
                toast.info("Nova Matrícula", {
                  description: "Modal de criação será implementado",
                })
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <UserPlus size={20} />
          Nova Matrícula
        </button>
      </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Total de Matrículas
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalEnrollments}
                </p>
              </div>
              <div className="bg-emerald-100 p-4 rounded-full">
                <GraduationCap className="text-emerald-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Em Andamento
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {inProgressEnrollments}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <Clock className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Concluídas
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {completedEnrollments}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Canceladas
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {cancelledEnrollments}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {pendingEnrollments} pendentes
                </p>
              </div>
              <div className="bg-red-100 p-4 rounded-full">
                <XCircle className="text-red-600" size={28} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por membro, produto ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Search size={18} />
              Buscar
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
              <Filter size={18} />
              Filtros Avançados
            </button>
          </div>

          {/* Filtros Rápidos */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              Filtros rápidos:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Todas ({totalEnrollments})
              </button>
              <button
                onClick={() => setStatusFilter("IN_PROGRESS")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Em Andamento ({inProgressEnrollments})
                </div>
              </button>
              <button
                onClick={() => setStatusFilter("COMPLETED")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === "COMPLETED"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Concluídas ({completedEnrollments})
                </div>
              </button>
              <button
                onClick={() => setStatusFilter("CANCELLED")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === "CANCELLED"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Canceladas ({cancelledEnrollments})
                </div>
              </button>
              <button
                onClick={() => setStatusFilter("PENDING")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === "PENDING"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Pendentes ({pendingEnrollments})
                </div>
              </button>
                  </div>

            {/* Mostrar filtros ativos */}
            {(appliedSearch || statusFilter !== "all") && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-500">
                  {filteredEnrollments.length} de {totalEnrollments}{" "}
                  matrícula(s) encontrada(s)
                  {appliedSearch && ` para "${appliedSearch}"`}
                  </span>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setAppliedSearch("");
                    setStatusFilter("all");
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Overlay global para fechar menu ao clicar fora */}
        {openMenuId && (
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setOpenMenuId(null)}
          />
        )}

        {/* Enrollments Table */}
        <DataTable
          data={filteredEnrollments}
          columns={columns}
          emptyState={emptyState}
          onRowClick={(enrollment) =>
            console.log("Clicou na matrícula:", enrollment.memberName)
          }
        />

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <TrendingUp
              className="text-blue-600 flex-shrink-0 mt-1"
              size={24}
            />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                💡 Sobre Matrículas
              </h3>
              <p className="text-blue-800 text-sm">
                Gerencie todas as matrículas de membros em cursos, e-books,
                mentorias e assinaturas. Acompanhe o progresso, status e
                histórico de cada matrícula.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/admin/enrollments")({
  component: EnrollmentsPage,
});
