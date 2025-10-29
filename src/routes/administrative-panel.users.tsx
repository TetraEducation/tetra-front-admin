// src/routes/administrative-panel.users.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DataTable, type ColumnDef } from '@/components/ui/data-table-custom'
import { User, Calendar, Shield, Search, Filter, X } from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  role: string
  lastLogin: string
  status: 'ACTIVE' | 'INACTIVE'
}

// Mock data para demonstração
const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@tetraeducacao.com',
    role: 'Administrador',
    lastLogin: '2024-01-15',
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@tetraeducacao.com',
    role: 'Gerente',
    lastLogin: '2024-01-14',
    status: 'ACTIVE'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@tetraeducacao.com',
    role: 'Usuário',
    lastLogin: '2024-01-10',
    status: 'INACTIVE'
  }
]

function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [appliedSearch, setAppliedSearch] = useState('') // Termo de busca aplicado

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

  // Filtra os dados baseado na busca aplicada e filtros
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = appliedSearch ? 
      (user.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
       user.email.toLowerCase().includes(appliedSearch.toLowerCase())) : true
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const activeUsers = mockUsers.filter(u => u.status === 'ACTIVE').length
  const inactiveUsers = mockUsers.filter(u => u.status === 'INACTIVE').length
  const adminUsers = mockUsers.filter(u => u.role === 'Administrador').length
  const managerUsers = mockUsers.filter(u => u.role === 'Gerente').length
  const regularUsers = mockUsers.filter(u => u.role === 'Usuário').length
  const columns: ColumnDef<User>[] = [
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
    {
      header: 'Função',
      accessorKey: 'role',
      cell: (user) => (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Shield size={12} />
          {user.role}
        </span>
      ),
    },
    {
      header: 'Último Acesso',
      accessorKey: 'lastLogin',
      cell: (user) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} />
          <span className="font-medium">{user.lastLogin}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (user) => (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
          user.status === 'ACTIVE' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'
          }`}></div>
          {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      header: 'Ações',
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Editar
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Resetar Senha
          </button>
        </div>
      ),
    },
  ]

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
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
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
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todos ({mockUsers.length})
                </button>
                <button
                  onClick={() => setStatusFilter('ACTIVE')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'ACTIVE'
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
                  onClick={() => setStatusFilter('INACTIVE')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'INACTIVE'
                      ? 'bg-gray-100 text-gray-800 border border-gray-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    Inativos ({inactiveUsers})
                  </div>
                </button>
              </div>
            </div>

            {/* Filtros por Função */}
            <div className="flex items-center gap-3">
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
                  Todas ({mockUsers.length})
                </button>
                <button
                  onClick={() => setRoleFilter('Administrador')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === 'Administrador'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Shield size={12} />
                    Administradores ({adminUsers})
                  </div>
                </button>
                <button
                  onClick={() => setRoleFilter('Gerente')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === 'Gerente'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Gerentes ({managerUsers})
                </button>
                <button
                  onClick={() => setRoleFilter('Usuário')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === 'Usuário'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Usuários ({regularUsers})
                </button>
              </div>
            </div>
            
            {/* Mostrar filtros ativos */}
            {(appliedSearch || statusFilter !== 'all' || roleFilter !== 'all') && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {filteredUsers.length} de {mockUsers.length} usuários
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

export const Route = createFileRoute('/administrative-panel/users')({
  component: UsersPage,
})
