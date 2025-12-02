// src/app/platform/pages/MembersPage.tsx
import { useState, useMemo, useCallback } from 'react'
import { Users, UserPlus, Search, Filter, X, Mail, Shield, MoreVertical, Edit, Trash2, UserX, UserCheck } from 'lucide-react'
import { useUsersSearch } from '../hooks/useUsers'
import { DataTable, type ColumnDef } from '@/components/ui/data-table-custom'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import type { User, UserStatus, TenantRole } from '@/lib/apiUsers'
import { UserStatusEnum, requestPasswordReset } from '@/lib/apiUsers'

const getStatusStyle = (status: UserStatus) => {
  switch (status) {
    case UserStatusEnum.ACTIVE:
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        dot: 'bg-green-500',
        label: 'Ativo'
      };
    case UserStatusEnum.INACTIVE:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        dot: 'bg-gray-500',
        label: 'Inativo'
      };
    case UserStatusEnum.PENDING:
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        dot: 'bg-yellow-500',
        label: 'Pendente'
      };
    case UserStatusEnum.BLOCKED:
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-500',
        label: 'Bloqueado'
      };
    case UserStatusEnum.DELETED:
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-500',
        label: 'Excluído'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        dot: 'bg-gray-500',
        label: 'Desconhecido'
      };
  }
};

const getRoleLabel = (role: TenantRole) => {
  switch (role) {
    case 'TENANT_OWNER':
      return 'Proprietário';
    case 'TENANT_ADMIN':
      return 'Administrador';
    case 'TENANT_MEMBER':
      return 'Membro';
    default:
      return role;
  }
};

const getRoleStyle = (role: TenantRole) => {
  switch (role) {
    case 'TENANT_OWNER':
      return 'bg-purple-100 text-purple-800';
    case 'TENANT_ADMIN':
      return 'bg-blue-100 text-blue-800';
    case 'TENANT_MEMBER':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [resettingPasswordFor, setResettingPasswordFor] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Usa busca real da API
  const { data: usersResponse, isLoading, error } = useUsersSearch(appliedSearch, statusFilter)
  
  const users = usersResponse?.items || []
  const totalCount = usersResponse?.meta.total || 0

  // Toggle menu
  const toggleMenu = useCallback((userId: string) => {
    setOpenMenuId(prev => prev === userId ? null : userId)
  }, [])

  // Função para aplicar busca
  const handleSearch = () => {
    setAppliedSearch(searchTerm)
  }

  // Função para limpar busca
  const handleClearSearch = () => {
    setSearchTerm('')
    setAppliedSearch('')
  }

  // Função para buscar com Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Função para resetar senha de um usuário
  const handleResetPassword = async (user: User) => {
    if (resettingPasswordFor === user.id) return // Evita cliques duplos

    setResettingPasswordFor(user.id)
    setOpenMenuId(null) // Fecha o menu
    
    try {
      const response = await requestPasswordReset(user.email)
      
      toast.success('Email enviado!', {
        description: `Um link de redefinição de senha foi enviado para ${user.email}`,
        duration: 5000,
      })

      // Em desenvolvimento, mostra o token
      if (response.token) {
        console.log('🔑 Token de redefinição (DEV):', response.token)
        toast.info('Token gerado (DEV)', {
          description: `Token: ${response.token}`,
          duration: 10000,
        })
      }
    } catch (error) {
      console.error('Erro ao resetar senha:', error)
      toast.error('Erro ao enviar email', {
        description: error instanceof Error ? error.message : 'Não foi possível enviar o email de redefinição',
        duration: 5000,
      })
    } finally {
      setResettingPasswordFor(null)
    }
  }

  // Calcula estatísticas dos dados filtrados
  const activeUsers = users.filter(u => u.status === UserStatusEnum.ACTIVE).length;
  const inactiveUsers = users.filter(u => u.status === UserStatusEnum.INACTIVE).length;
  const pendingUsers = users.filter(u => u.status === UserStatusEnum.PENDING).length;
  const blockedUsers = users.filter(u => u.status === UserStatusEnum.BLOCKED).length;

  // Definição das colunas da tabela
  const columns: ColumnDef<User>[] = useMemo(() => [
    {
      header: 'Membro',
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Mail size={12} />
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Função',
      cell: (user) => (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleStyle(user.tenant_role)}`}>
          <Shield size={12} />
          {getRoleLabel(user.tenant_role)}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (user) => {
        const statusStyle = getStatusStyle(user.status)
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
            <div className={`w-2 h-2 ${statusStyle.dot} rounded-full`}></div>
            {statusStyle.label}
          </span>
        )
      },
    },
    {
      header: 'Data de Cadastro',
      cell: (user) => (
        <span className="text-sm text-gray-600">
          {new Date(user.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </span>
      ),
    },
    {
      header: 'Ações',
      cell: (user) => {
        const isActive = user.status === UserStatusEnum.ACTIVE
        const isMenuOpen = openMenuId === user.id
        
        return (
          <div className="flex items-center gap-2">
            {/* Menu de 3 pontos */}
            <div className="relative">
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleMenu(user.id)
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
                      e.stopPropagation()
                      setOpenMenuId(null)
                      toast.info('Editar Membro', {
                        description: `Editando ${user.name}`,
                      })
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleResetPassword(user)
                    }}
                    disabled={resettingPasswordFor === user.id}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mail size={16} />
                    {resettingPasswordFor === user.id ? 'Enviando...' : 'Resetar Senha'}
                  </button>
                  
                  <div className="border-t border-gray-200 my-1"></div>
                  
                  {isActive ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(null)
                        toast.warning('Suspender Membro', {
                          description: `${user.name} será suspenso`,
                        })
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                    >
                      <UserX size={16} />
                      Suspender
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(null)
                        toast.success('Ativar Membro', {
                          description: `${user.name} será ativado`,
                        })
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                    >
                      <UserCheck size={16} />
                      Ativar
                    </button>
                  )}
                  
                  <div className="border-t border-gray-200 my-1"></div>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuId(null)
                      toast.error('Excluir Membro', {
                        description: `Tem certeza que deseja excluir ${user.name}?`,
                      })
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
        )
      },
    },
  ], [openMenuId, toggleMenu])

  // Empty state customizado
  const emptyState = (
    <div className="text-center">
      <Users className="mx-auto text-gray-400 mb-4" size={64} />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Nenhum membro encontrado
      </h3>
      <p className="text-gray-600 mb-6">
        Comece adicionando membros à sua plataforma
      </p>
      <button 
        onClick={() => toast.info('Adicionar Membro', { description: 'Modal de criação será implementado' })}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
      >
        <UserPlus size={20} />
        Adicionar Primeiro Membro
      </button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando membros...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro ao carregar</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Users className="text-emerald-600" size={40} />
                Membros
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie os membros e suas permissões na plataforma
              </p>
            </div>
            <button 
              onClick={() => toast.info('Adicionar Membro', { description: 'Modal de criação será implementado' })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <UserPlus size={20} />
              Adicionar Membro
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total de Membros</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
              </div>
              <div className="bg-emerald-100 p-4 rounded-full">
                <Users className="text-emerald-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Ativos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{activeUsers}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <UserCheck className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Inativos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{inactiveUsers}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-full">
                <UserX className="text-gray-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Bloqueados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{blockedUsers}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-full">
                <UserX className="text-red-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
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
              disabled={isLoading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Buscar
                </>
              )}
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
              <Filter size={18} />
              Filtros Avançados
            </button>
          </div>

          {/* Filtros Rápidos */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Filtros rápidos:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos ({totalCount})
              </button>
              <button
                onClick={() => setStatusFilter(UserStatusEnum.ACTIVE)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === UserStatusEnum.ACTIVE
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Ativos ({activeUsers})
                </div>
              </button>
              <button
                onClick={() => setStatusFilter(UserStatusEnum.INACTIVE)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === UserStatusEnum.INACTIVE
                    ? 'bg-gray-100 text-gray-800 border border-gray-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Inativos ({inactiveUsers})
                </div>
              </button>
              <button
                onClick={() => setStatusFilter(UserStatusEnum.PENDING)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === UserStatusEnum.PENDING
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Pendentes ({pendingUsers})
                </div>
              </button>
              <button
                onClick={() => setStatusFilter(UserStatusEnum.BLOCKED)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === UserStatusEnum.BLOCKED
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Bloqueados ({blockedUsers})
                </div>
              </button>
            </div>
            
            {/* Mostrar filtros ativos */}
            {(appliedSearch || statusFilter !== 'all') && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-500">
                  {users.length} resultado(s) encontrado(s)
                  {appliedSearch && ` para "${appliedSearch}"`}
                </span>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setAppliedSearch('')
                    setStatusFilter('all')
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

        {/* Members Table - Componentizada */}
        <DataTable
          data={users}
          columns={columns}
          emptyState={emptyState}
          onRowClick={(user) => console.log('Clicou no membro:', user.name)}
        />

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">💡 Sobre Membros</h3>
              <p className="text-blue-800 text-sm">
                Gerencie os membros da sua plataforma, defina suas funções e permissões. 
                Os membros podem ter diferentes níveis de acesso: Proprietário, Administrador ou Membro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

