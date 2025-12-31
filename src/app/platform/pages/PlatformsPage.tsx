// src/app/platform/pages/PlatformsPage.tsx
import { useState, useMemo, useCallback } from 'react'
import { Building2, Globe, Users, TrendingUp, Plus, Search, Filter, X, UserCheck, Eye, MoreVertical, Settings, Edit, Pause, Play, Trash2 } from 'lucide-react'
import { useTenantsSearch } from '../hooks/useTenants'
import { DataTable, type ColumnDef } from '@/components/ui/data-table-custom'
import { ImpersonationModal } from '@/components/ui/impersonation-modal'
import { CreatePlatformModal, type CreatePlatformData } from '@/components/ui/create-platform-modal'
import { ViewPlatformModal, type TenantDetailsData, type TenantUpdateData } from '@/components/ui/view-platform-modal'
import { iamAuth } from '@/auth/iamAuth'
import { useAuth } from '@/auth/authStore'
import { createTenant, getTenantDetails, updateTenant } from '@/lib/apiTenants'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

type Tenant = {
  id: string
  name: string
  slug: string
  status: string
  taxId?: string
}

const getStatusStyle = (status: TenantStatus) => {
  switch (status) {
    case 'ACTIVE':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        dot: 'bg-green-500',
        label: 'Ativo'
      };
    case 'INACTIVE':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        dot: 'bg-gray-500',
        label: 'Inativo'
      };
    case 'SUSPENDED':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-500',
        label: 'Suspenso'
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

export default function PlatformsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [appliedSearch, setAppliedSearch] = useState('') // Termo de busca aplicado
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingTenant, setViewingTenant] = useState<TenantDetailsData | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [viewModalMode, setViewModalMode] = useState<'view' | 'edit'>('view')
  const [isSaving, setIsSaving] = useState(false)
  const queryClient = useQueryClient()

  // Usa busca real da API apenas com o termo aplicado
  const { data: tenantsResponse, isLoading, error } = useTenantsSearch(appliedSearch, statusFilter)
  
  const tenants = tenantsResponse?.data || []
  const totalCount = tenantsResponse?.total || 0

  // Toggle menu
  const toggleMenu = useCallback((tenantId: string) => {
    setOpenMenuId(prev => prev === tenantId ? null : tenantId)
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

  // Função para abrir modal de login
  const handleLogin = (tenant: Tenant) => {
    // Verifica se a plataforma está ativa
    if (tenant.status !== 'ACTIVE') {
      alert(`Não é possível fazer login na plataforma "${tenant.name}" pois ela está ${tenant.status.toLowerCase()}.`)
      return
    }

    setSelectedTenant(tenant)
    setIsModalOpen(true)
  }

  // Função para confirmar login com impersonação real
  const handleConfirmLogin = async (reason: string) => {
    if (!selectedTenant) return

    setIsLoggingIn(true)

    try {
      // Chama API de impersonação real
      const impersonationResponse = await iamAuth.impersonate(selectedTenant.id, reason)
      
      console.log('✅ Impersonação realizada:', {
        tenant: selectedTenant.name,
        impersonationId: impersonationResponse.impersonation_id,
        expiresIn: impersonationResponse.expires_in
      })

      // Armazena o token de impersonação
      useAuth.getState().setAuth(impersonationResponse.access_token, useAuth.getState().me)

      // Abre a URL do tenant em nova aba usando o token de impersonação
      const tenantUrl = `http://${selectedTenant.slug}.tetraeducacao.com.br/admin`
      window.open(tenantUrl, '_blank')
      
      // Fecha o modal após sucesso
      setIsModalOpen(false)
      setSelectedTenant(null)
      
    } catch (error) {
      console.error('❌ Erro ao fazer impersonação:', error)
      alert(`Erro ao fazer login na plataforma: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Função para fechar modal
  const handleCloseModal = () => {
    if (!isLoggingIn) {
      setIsModalOpen(false)
      setSelectedTenant(null)
    }
  }

  // Função para visualizar detalhes da plataforma
  const handleViewDetails = async (tenantId: string, mode: 'view' | 'edit' = 'view') => {
    setIsLoadingDetails(true)
    setIsViewModalOpen(true)
    setViewModalMode(mode)
    
    try {
      const details = await getTenantDetails(tenantId)
      setViewingTenant({
        ...details,
        createdAt: new Date(details.createdAt),
        updatedAt: new Date(details.updatedAt),
      })
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error)
      toast.error('Erro ao carregar detalhes', {
        description: error instanceof Error ? error.message : 'Não foi possível carregar os detalhes da plataforma',
      })
      setIsViewModalOpen(false)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  // Função para salvar alterações da plataforma
  const handleSaveChanges = async (data: TenantUpdateData) => {
    if (!viewingTenant) return

    setIsSaving(true)
    
    try {
      await updateTenant(viewingTenant.tenantId, data)
      
      toast.success('Plataforma atualizada!', {
        description: 'As alterações foram salvas com sucesso.',
      })

      // Recarrega os dados
      await queryClient.invalidateQueries({ queryKey: ['tenants'] })
      
      // Fecha o modal
      handleCloseViewModal()
    } catch (error) {
      console.error('Erro ao atualizar plataforma:', error)
      toast.error('Erro ao atualizar', {
        description: error instanceof Error ? error.message : 'Não foi possível salvar as alterações',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Função para fechar o modal de visualização
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewingTenant(null)
    setViewModalMode('view')
  }

  // Função para criar nova plataforma
  const handleCreatePlatform = async (data: CreatePlatformData) => {
    setIsCreating(true)
    
    try {
      // Limpa os campos vazios de details antes de enviar
      const cleanDetails = data.details ? Object.fromEntries(
        Object.entries(data.details).filter(([_, value]) => value && value.trim() !== '')
      ) : undefined

      await createTenant({
        name: data.name,
        slug: data.slug,
        taxId: data.taxId,
        details: Object.keys(cleanDetails || {}).length > 0 ? cleanDetails : undefined,
      })
      
      toast.success('Plataforma criada com sucesso!', {
        description: `A plataforma "${data.name}" foi criada e está disponível em ${data.slug}.tetraeducacao.com.br`,
        duration: 5000,
      })
      
      // Recarrega a lista de plataformas
      await queryClient.invalidateQueries({ queryKey: ['tenants'] })
      
      // Fecha o modal
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('❌ Erro ao criar plataforma:', error)
      toast.error('Erro ao criar plataforma', {
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao criar a plataforma. Tente novamente.',
        duration: 5000,
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Calcula estatísticas dos dados filtrados
  const activeTenants = tenants.filter(t => t.status === 'ACTIVE').length;
  const inactiveTenants = tenants.filter(t => t.status === 'INACTIVE').length;
  const suspendedTenants = tenants.filter(t => t.status === 'SUSPENDED').length;

  // Definição das colunas da tabela - memoizada para evitar re-renders
  const columns: ColumnDef<Tenant>[] = useMemo(() => [
    {
      header: 'Plataformas',
      cell: (tenant) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Building2 className="text-emerald-600" size={20} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{tenant.name}</p>
            <p className="text-sm text-gray-500">{tenant.taxId || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Slug',
      cell: (tenant) => (
        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-700">
          {tenant.slug}
        </code>
      ),
    },
    {
      header: 'Status',
      cell: (tenant) => {
        const statusStyle = getStatusStyle(tenant.status as TenantStatus)
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
            <div className={`w-2 h-2 ${statusStyle.dot} rounded-full`}></div>
            {statusStyle.label}
          </span>
        )
      },
    },
    {
      header: 'Usuários',
      cell: () => (
        <div className="flex items-center gap-2 text-gray-600">
          <Users size={16} />
          <span className="font-medium">-</span>
        </div>
      ),
    },
    {
      header: 'Ações',
      cell: (tenant) => {
        const isActive = tenant.status === 'ACTIVE'
        const isMenuOpen = openMenuId === tenant.id
        
        return (
          <div className="flex items-center gap-2">
            {/* Botão Logar */}
            <button 
              onClick={() => handleLogin(tenant)}
              disabled={!isActive}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
                isActive 
                  ? 'text-blue-600 hover:bg-blue-50' 
                  : 'text-gray-400 cursor-not-allowed bg-gray-50'
              }`}
              title={
                isActive 
                  ? `Fazer login em ${tenant.name}` 
                  : `Não é possível fazer login em ${tenant.name} (${tenant.status.toLowerCase()})`
              }
            >
              <UserCheck size={16} />
              Logar
            </button>

            {/* Botão Ver Detalhes */}
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleViewDetails(tenant.id)
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={`Ver detalhes de ${tenant.name}`}
            >
              <Eye size={18} />
            </button>

            {/* Menu de 3 pontos */}
            <div className="relative">
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleMenu(tenant.id)
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Mais opções"
              >
                <MoreVertical size={18} />
              </button>

              {/* Dropdown Menu - só renderiza se for ESTE tenant específico */}
              {isMenuOpen && (
                <>
                  {/* Menu */}
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[101]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(null)
                        toast.info('Configurar', {
                          description: `Configurando ${tenant.name}`,
                        })
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Configurar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(null)
                        handleViewDetails(tenant.id, 'edit')
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    {isActive ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(null)
                          toast.warning('Suspender Plataforma', {
                            description: `${tenant.name} será suspensa`,
                          })
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                      >
                        <Pause size={16} />
                        Suspender
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(null)
                          toast.success('Ativar Plataforma', {
                            description: `${tenant.name} será ativada`,
                          })
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                      >
                        <Play size={16} />
                        Ativar
                      </button>
                    )}
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(null)
                        toast.error('Excluir Plataforma', {
                          description: `Tem certeza que deseja excluir ${tenant.name}?`,
                        })
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )
      },
    },
  ], [openMenuId, toggleMenu, handleLogin])

  // Empty state customizado
  const emptyState = (
    <div className="text-center">
      <Building2 className="mx-auto text-gray-400 mb-4" size={64} />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Nenhuma plataforma encontrada
      </h3>
      <p className="text-gray-600 mb-6">
        Comece criando uma nova plataforma para seus clientes
      </p>
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
      >
        <Plus size={20} />
        Criar Primeira Plataforma
      </button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando plataformas...</p>
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
                <Building2 className="text-emerald-600" size={40} />
                Plataformas
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie todas as plataformas e clientes do sistema Tetra Educação
              </p>
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Nova Plataforma
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total de Plataformas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{tenants.length}</p>
              </div>
              <div className="bg-emerald-100 p-4 rounded-full">
                <Building2 className="text-emerald-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Plataformas Ativas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{activeTenants}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {inactiveTenants > 0 && `${inactiveTenants} inativas`}
                  {suspendedTenants > 0 && ` • ${suspendedTenants} suspensas`}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <Globe className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total de Usuários</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <Users className="text-purple-600" size={28} />
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
                placeholder="Buscar por nome ou slug da plataforma..."
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
                Todas ({totalCount})
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
                  Ativas ({activeTenants})
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
                  Inativas ({inactiveTenants})
                </div>
              </button>
              <button
                onClick={() => setStatusFilter('SUSPENDED')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === 'SUSPENDED'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Suspensas ({suspendedTenants})
                </div>
              </button>
            </div>
            
            {/* Mostrar filtros ativos */}
            {(appliedSearch || statusFilter !== 'all') && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-500">
                  {tenants.length} resultado(s) encontrado(s)
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

        {/* Platforms Table - Componentizada */}
        <DataTable
          data={tenants}
          columns={columns}
          emptyState={emptyState}
          onRowClick={(tenant) => console.log('Clicou na plataforma:', tenant.name)}
        />

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">💡 Sobre Plataformas</h3>
              <p className="text-blue-800 text-sm">
                Cada plataforma representa um cliente ou tenant no sistema. Aqui você pode visualizar e gerenciar 
                todas as instâncias, configurar branding, domínios personalizados, e monitorar o uso de recursos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Impersonação */}
      <ImpersonationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogin}
        tenantName={selectedTenant?.name || ''}
        isLoading={isLoggingIn}
      />

      {/* Modal de Criação de Plataforma */}
      <CreatePlatformModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleCreatePlatform}
        isLoading={isCreating}
      />

      {/* Modal de Visualização/Edição de Plataforma */}
      <ViewPlatformModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        data={viewingTenant}
        isLoading={isLoadingDetails}
        mode={viewModalMode}
        onSave={handleSaveChanges}
        isSaving={isSaving}
      />
    </div>
  )
}

