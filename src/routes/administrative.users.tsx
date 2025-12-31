// src/routes/administrative.users.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { DataTable, type ColumnDef } from '@/components/ui/data-table-custom'
import { User, Calendar, /* Shield, */ Search, Filter, X } from 'lucide-react'
import { useUsersSearch } from '@/app/platform/hooks/useUsers'
import type { User as ApiUser, UserStatus } from '@/lib/apiUsers'
import { UserStatusEnum, requestPasswordReset } from '@/lib/apiUsers'
import { toast } from 'sonner'

// Helper para obter estilo e label do status
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
        label: status
      };
  }
};

// Helper para converter roles da API para labels em PT-BR - COMENTADO TEMPORARIAMENTE
// const getRoleLabel = (role: string) => {
//   switch (role) {
//     case 'TENANT_OWNER':
//       return 'Proprietário';
//     case 'TENANT_ADMIN':
//       return 'Administrador';
//     case 'TENANT_MEMBER':
//       return 'Usuário';
//     default:
//       return role;
//   }
// };

function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [resettingPasswordFor, setResettingPasswordFor] = useState<string | null>(null)

  // Usa busca real da API
  const { data: usersResponse, isLoading, error } = useUsersSearch(appliedSearch, statusFilter)
  
  const users = usersResponse?.items || []
  const totalCount = usersResponse?.meta.total || 0

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

  // Filtra os dados localmente por role (API não suporta filtro de role ainda)
  const filteredUsers = users.filter(user => {
    if (roleFilter === 'all') return true
    return user.tenant_role === roleFilter
  })

  // Função para resetar senha de um usuário
  const handleResetPassword = async (user: ApiUser) => {
    if (resettingPasswordFor === user.id) return // Evita cliques duplos

    setResettingPasswordFor(user.id)
    
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

  // Calcula estatísticas
  const activeUsers = users.filter(u => u.status === UserStatusEnum.ACTIVE).length
  const inactiveUsers = users.filter(u => u.status === UserStatusEnum.INACTIVE).length
  const pendingUsers = users.filter(u => u.status === UserStatusEnum.PENDING).length
  const blockedUsers = users.filter(u => u.status === UserStatusEnum.BLOCKED).length
  // const adminUsers = users.filter(u => u.tenant_role === 'TENANT_ADMIN').length
  // const ownerUsers = users.filter(u => u.tenant_role === 'TENANT_OWNER').length
  // const memberUsers = users.filter(u => u.tenant_role === 'TENANT_MEMBER').length

  const columns: ColumnDef<ApiUser>[] = useMemo(() => [
    {
      header: 'Usuário',
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    // {
    //   header: 'Função',
    //   cell: (user) => (
    //     <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
    //       <Shield size={12} />
    //       {getRoleLabel(user.tenant_role)}
    //     </span>
    //   ),
    // },
    {
      header: 'Data de Cadastro',
      cell: (user) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} />
          <span className="font-medium">
            {new Date(user.created_at).toLocaleDateString('pt-BR')}
          </span>
        </div>
      ),
    },
    {
      header: 'Último Login',
      cell: (user) => {
        const lastLogin = (user as any).last_login_at;
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span className="font-medium">
              {lastLogin 
                ? new Date(lastLogin).toLocaleDateString('pt-BR')
                : '—'
              }
            </span>
          </div>
        );
      },
    },
    {
      header: 'Status',
      cell: (user) => {
        const statusStyle = getStatusStyle(user.status);
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
            <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></div>
            {statusStyle.label}
          </span>
        );
      },
    },
    {
      header: 'Ações',
      cell: (user) => {
        const isResetting = resettingPasswordFor === user.id
        
        return (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => toast.info('Editar usuário', { description: `Editando ${user.name}` })}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Editar
            </button>
            <button 
              onClick={() => handleResetPassword(user)}
              disabled={isResetting}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResetting ? 'Enviando...' : 'Resetar Senha'}
            </button>
          </div>
        );
      },
    },
  ], [resettingPasswordFor])

  const emptyState = (
    <div className="text-center">
      <User className="mx-auto text-gray-400 mb-4" size={64} />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Nenhum usuário encontrado
      </h3>
      <p className="text-gray-600 mb-6">
        Comece adicionando usuários ao sistema
      </p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
        <User size={20} />
        Adicionar Usuário
      </button>
    </div>
  )

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    )
  }

  // Error state
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <User className="text-blue-600" size={40} />
          Usuários
        </h1>
        
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
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
          <div className="space-y-3">
            {/* Filtros por Status */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
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
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
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
            </div>

            {/* Filtros por Função - COMENTADO TEMPORARIAMENTE */}
            {/* <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Função:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRoleFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === 'all'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todas ({totalCount})
                </button>
                <button
                  onClick={() => setRoleFilter('TENANT_OWNER')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === 'TENANT_OWNER'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Shield size={12} />
                    Proprietários ({ownerUsers})
                  </div>
                </button>
                <button
                  onClick={() => setRoleFilter('TENANT_ADMIN')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === 'TENANT_ADMIN'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Administradores ({adminUsers})
                </button>
                <button
                  onClick={() => setRoleFilter('TENANT_MEMBER')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === 'TENANT_MEMBER'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Usuários ({memberUsers})
                </button>
              </div>
            </div> */}
            
            {/* Mostrar filtros ativos */}
            {(appliedSearch || statusFilter !== 'all') && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {filteredUsers.length} de {totalCount} usuários
                  {appliedSearch && ` para "${appliedSearch}"`}
                </span>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setAppliedSearch('')
                    setStatusFilter('all')
                    setRoleFilter('all')
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
        
        <DataTable
          data={filteredUsers}
          columns={columns}
          emptyState={emptyState}
          onRowClick={(user) => console.log('Clicou no usuário:', user.name)}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/administrative/users')({
  component: UsersPage,
})
