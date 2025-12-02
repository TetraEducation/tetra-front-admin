// src/routes/admin/products.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table-custom";
import {
  Box,
  Plus,
  Search,
  Filter,
  X,
  DollarSign,
  TrendingUp,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import {
  CreateProductModal,
  type CreateProductPayload,
} from "@/components/ui/create-product-modal";

type ProductStatus = "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED";
type ProductType = "COURSE" | "EBOOK" | "MENTORSHIP" | "SUBSCRIPTION";

type Product = {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  type: ProductType;
  price: number;
  status: ProductStatus;
  enrollments: number;
  createdAt: string;
  updatedAt: string;
  instructor?: string;
  releaseDate?: string;
  certificateEnabled?: boolean;
  certificateProgress?: number;
  watermarkEnabled?: boolean;
};

// Dados mockados
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Curso Completo de JavaScript",
    description:
      "Aprenda JavaScript do básico ao avançado com projetos práticos",
    type: "COURSE",
    price: 199.9,
    status: "ACTIVE",
    enrollments: 342,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-20T15:30:00Z",
  },
  {
    id: "2",
    name: "Curso de React e Next.js",
    description: "Desenvolvimento moderno com React, Next.js e TypeScript",
    type: "COURSE",
    price: 299.9,
    status: "ACTIVE",
    enrollments: 278,
    createdAt: "2024-02-10T09:00:00Z",
    updatedAt: "2024-12-18T14:20:00Z",
  },
  {
    id: "3",
    name: "Python para Análise de Dados",
    description: "Python, Pandas, NumPy e visualização de dados",
    type: "COURSE",
    price: 249.9,
    status: "DRAFT",
    enrollments: 0,
    createdAt: "2024-03-05T11:00:00Z",
    updatedAt: "2024-12-15T10:00:00Z",
  },
  {
    id: "4",
    name: "E-book: Git e GitHub",
    description: "Guia completo de versionamento de código",
    type: "EBOOK",
    price: 49.9,
    status: "ACTIVE",
    enrollments: 521,
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-12-10T16:45:00Z",
  },
  {
    id: "5",
    name: "Mentoria em DevOps",
    description: "Sessões individuais de mentoria em DevOps e Cloud",
    type: "MENTORSHIP",
    price: 499.9,
    status: "ACTIVE",
    enrollments: 45,
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2024-12-19T09:15:00Z",
  },
  {
    id: "6",
    name: "Assinatura Premium",
    description: "Acesso ilimitado a todos os cursos da plataforma",
    type: "SUBSCRIPTION",
    price: 99.9,
    status: "ACTIVE",
    enrollments: 156,
    createdAt: "2024-05-15T12:00:00Z",
    updatedAt: "2024-12-21T11:30:00Z",
  },
  {
    id: "7",
    name: "Curso de Node.js",
    description: "Backend com Node.js, Express e banco de dados",
    type: "COURSE",
    price: 279.9,
    status: "INACTIVE",
    enrollments: 189,
    createdAt: "2023-11-10T09:00:00Z",
    updatedAt: "2024-11-01T10:00:00Z",
  },
  {
    id: "8",
    name: "E-book: Docker na Prática",
    description: "Aprenda containerização com Docker",
    type: "EBOOK",
    price: 39.9,
    status: "DRAFT",
    enrollments: 0,
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-22T08:00:00Z",
  },
];

// Helpers
const getStatusStyle = (status: ProductStatus) => {
  switch (status) {
    case "ACTIVE":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        dot: "bg-green-500",
        label: "Ativo",
      };
    case "INACTIVE":
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        dot: "bg-gray-500",
        label: "Inativo",
      };
    case "DRAFT":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        dot: "bg-yellow-500",
        label: "Rascunho",
      };
    case "ARCHIVED":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        dot: "bg-red-500",
        label: "Arquivado",
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

const getTypeLabel = (type: ProductType) => {
  switch (type) {
    case "COURSE":
      return "Curso";
    case "EBOOK":
      return "E-book";
    case "MENTORSHIP":
      return "Mentoria";
    case "SUBSCRIPTION":
      return "Assinatura";
    default:
      return type;
  }
};

const getTypeStyle = (type: ProductType) => {
  switch (type) {
    case "COURSE":
      return "bg-blue-100 text-blue-800";
    case "EBOOK":
      return "bg-purple-100 text-purple-800";
    case "MENTORSHIP":
      return "bg-orange-100 text-orange-800";
    case "SUBSCRIPTION":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
  const filteredProducts = products.filter((product) => {
    const matchesSearch = appliedSearch
      ? product.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(appliedSearch.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesType = typeFilter === "all" || product.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calcula estatísticas
  const activeProducts = products.filter((p) => p.status === "ACTIVE").length;
  const draftProducts = products.filter((p) => p.status === "DRAFT").length;
  const totalEnrollments = products.reduce((sum, p) => sum + p.enrollments, 0);

  // Definição das colunas da tabela
  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        header: "Produto",
        cell: (product) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Box className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-500 line-clamp-1">
                {product.description}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "Tipo",
        cell: (product) => (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeStyle(product.type)}`}
          >
            {getTypeLabel(product.type)}
          </span>
        ),
      },
      {
        header: "Preço",
        cell: (product) => (
          <div className="flex items-center gap-2 text-gray-900">
            <DollarSign size={16} className="text-emerald-600" />
            <span className="font-semibold">
              {product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        ),
      },
      {
        header: "Matrículas",
        cell: (product) => (
          <div className="text-center">
            <span className="font-medium text-gray-900">
              {product.enrollments}
            </span>
          </div>
        ),
      },
      {
        header: "Status",
        cell: (product) => {
          const statusStyle = getStatusStyle(product.status);
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
        cell: (product) => {
          const isMenuOpen = openMenuId === product.id;

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
                      prev === product.id ? null : product.id
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
                        toast.info("Visualizar Produto", {
                          description: `Visualizando ${product.name}`,
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
                        toast.info("Editar Produto", {
                          description: `Editando ${product.name}`,
                        });
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        toast.success("Produto duplicado", {
                          description: `${product.name} foi duplicado`,
                        });
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Copy size={16} />
                      Duplicar
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        toast.error("Excluir Produto", {
                          description: `Tem certeza que deseja excluir ${product.name}?`,
                        });
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
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
      <Box className="mx-auto text-gray-400 mb-4" size={64} />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Nenhum produto encontrado
      </h3>
      <p className="text-gray-600 mb-6">Comece criando seu primeiro produto</p>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
      >
        <Plus size={20} />
        Criar Primeiro Produto
      </button>
    </div>
  );

  const handleCreateProduct = (data: CreateProductPayload) => {
    const generateProductId = () => {
      if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
      }
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const now = new Date();
    const releaseDateIso = data.releaseDate
      ? new Date(data.releaseDate).toISOString()
      : now.toISOString();

    const newProduct: Product = {
      id: generateProductId(),
      name: data.name.trim(),
      subtitle: data.subtitle.trim(),
      description: data.description.trim(),
      instructor: data.instructor.trim(),
      releaseDate: releaseDateIso,
      type: "COURSE",
      price: 0,
      status: "DRAFT",
      enrollments: 0,
      createdAt: releaseDateIso,
      updatedAt: now.toISOString(),
      certificateEnabled: data.settings.certificateEnabled,
      certificateProgress:
        data.settings.certificateEnabled && data.settings.releaseByProgress
          ? data.settings.progressThreshold
          : undefined,
      watermarkEnabled: data.settings.watermarkEnabled,
    };

    setProducts((previous) => [newProduct, ...previous]);
    toast.success("Produto criado", {
      description: `${data.name} foi adicionado ao catálogo como rascunho.`,
    });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Box className="text-emerald-600" size={40} />
                Produtos
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie cursos, e-books, mentorias e assinaturas
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Novo Produto
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Total de Produtos
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {products.length}
                </p>
              </div>
              <div className="bg-emerald-100 p-4 rounded-full">
                <Box className="text-emerald-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Produtos Ativos
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {activeProducts}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {draftProducts} rascunhos
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <TrendingUp className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Total de Matrículas
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalEnrollments}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <Calendar className="text-blue-600" size={28} />
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
                placeholder="Buscar por nome ou descrição..."
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
          <div className="space-y-3">
            {/* Filtros por Status */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === "all"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Todos ({products.length})
                </button>
                <button
                  onClick={() => setStatusFilter("ACTIVE")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === "ACTIVE"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Ativos ({activeProducts})
                  </div>
                </button>
                <button
                  onClick={() => setStatusFilter("DRAFT")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === "DRAFT"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Rascunhos ({draftProducts})
                  </div>
                </button>
              </div>
            </div>

            {/* Filtros por Tipo */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Tipo:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    typeFilter === "all"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setTypeFilter("COURSE")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    typeFilter === "COURSE"
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Cursos
                </button>
                <button
                  onClick={() => setTypeFilter("EBOOK")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    typeFilter === "EBOOK"
                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  E-books
                </button>
                <button
                  onClick={() => setTypeFilter("MENTORSHIP")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    typeFilter === "MENTORSHIP"
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Mentorias
                </button>
                <button
                  onClick={() => setTypeFilter("SUBSCRIPTION")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    typeFilter === "SUBSCRIPTION"
                      ? "bg-pink-100 text-pink-800 border border-pink-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Assinaturas
                </button>
              </div>
            </div>

            {/* Mostrar filtros ativos */}
            {(appliedSearch ||
              statusFilter !== "all" ||
              typeFilter !== "all") && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {filteredProducts.length} de {products.length} produtos
                  {appliedSearch && ` para "${appliedSearch}"`}
                </span>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setAppliedSearch("");
                    setStatusFilter("all");
                    setTypeFilter("all");
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

        {/* Products Table */}
        <DataTable
          data={filteredProducts}
          columns={columns}
          emptyState={emptyState}
          onRowClick={(product) =>
            console.log("Clicou no produto:", product.name)
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
                💡 Sobre Produtos
              </h3>
              <p className="text-blue-800 text-sm">
                Gerencie todos os seus produtos educacionais: cursos online,
                e-books, mentorias e assinaturas. Configure preços, acompanhe
                matrículas e organize seu catálogo de forma eficiente.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CreateProductModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateProduct}
      />
    </div>
  );
}

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});
