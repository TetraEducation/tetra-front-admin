import { createFileRoute } from '@tanstack/react-router'
import { createColumns, useMemberSelection, type Member } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { Plus, Search, Filter, X, Camera } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/admin/members/report')({
  component: RouteComponent,
})

// Mock data - replace with actual API call
const mockMembers: Member[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    status: "active",
    role: "admin",
    createdAt: "2024-01-15T10:30:00Z",
    lastAccess: "2024-01-20T14:30:00Z",
    hasAccess: true
  },
  {
    id: "2", 
    name: "Maria Santos",
    email: "maria@example.com",
    status: "active",
    role: "member",
    createdAt: "2024-01-20T14:15:00Z",
    lastAccess: "2024-01-22T09:15:00Z",
    hasAccess: true
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@example.com", 
    status: "pending",
    role: "member",
    createdAt: "2024-01-25T09:45:00Z",
    hasAccess: false
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@example.com",
    status: "inactive", 
    role: "moderator",
    createdAt: "2024-01-10T16:20:00Z",
    lastAccess: "2024-01-18T11:45:00Z",
    hasAccess: true
  },
  {
    id: "5",
    name: "Carlos Mendes",
    email: "carlos@example.com",
    status: "active",
    role: "member",
    createdAt: "2024-01-28T08:30:00Z",
    hasAccess: false
  }
]

function RouteComponent() {
  const { selectedMembers, toggleMember, selectAll, clearSelection } = useMemberSelection()
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [accessFilter, setAccessFilter] = useState('all')
  
  // Filtrar membros baseado nos filtros
  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    const matchesAccess = accessFilter === 'all' || 
                         (accessFilter === 'accessed' && member.hasAccess) ||
                         (accessFilter === 'never_accessed' && !member.hasAccess)
    
    return matchesSearch && matchesStatus && matchesRole && matchesAccess
  })
  
  const columns = createColumns(selectedMembers, toggleMember, selectAll)

  // Função para capturar a tela
  const captureScreen = async () => {
    try {
      // Usar html2canvas para capturar a tela
      const html2canvas = (await import('html2canvas')).default
      
      // Capturar apenas o conteúdo principal (não a página inteira)
      const element = document.querySelector('.min-h-screen') as HTMLElement || document.body
      
      const canvas = await html2canvas(element, {
        scale: 0.8, // Reduzir escala para melhor performance
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f9fafb',
        logging: false, // Desabilitar logs
        width: element.scrollWidth,
        height: element.scrollHeight
      })
      
      // Converter para blob e fazer download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `relatorio-membros-${new Date().toISOString().split('T')[0]}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      }, 'image/png', 0.9) // Qualidade 90%
      
    } catch (error) {
      console.error('Erro ao capturar tela:', error)
      
      // Fallback mais simples
      try {
        // Tentar capturar apenas a tabela
        const html2canvas = (await import('html2canvas')).default
        const tableElement = document.querySelector('.bg-white.rounded-xl') as HTMLElement
        
        if (tableElement) {
          const canvas = await html2canvas(tableElement, {
            scale: 0.8,
            backgroundColor: '#ffffff'
          })
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = `relatorio-membros-${new Date().toISOString().split('T')[0]}.png`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }
          }, 'image/png', 0.9)
        } else {
          throw new Error('Elemento não encontrado')
        }
        
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError)
        
        // Instruções para o usuário
        const userAgent = navigator.userAgent.toLowerCase()
        let instructions = ''
        
        if (userAgent.includes('windows')) {
          instructions = 'Use Windows + Shift + S para capturar a tela'
        } else if (userAgent.includes('mac')) {
          instructions = 'Use Cmd + Shift + 4 para capturar a tela'
        } else if (userAgent.includes('linux')) {
          instructions = 'Use Shift + Print Screen para capturar a tela'
        } else {
          instructions = 'Use a ferramenta de captura do seu sistema operacional'
        }
        
        alert(`Não foi possível capturar automaticamente. ${instructions}`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatório de Membros</h1>
              <p className="text-gray-600">Visualize e gerencie todos os membros do sistema</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Contador de selecionados */}
              {selectedMembers.length > 0 && (
                <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg border border-emerald-200">
                  <span className="text-sm font-medium">
                    {selectedMembers.length} selecionado{selectedMembers.length > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={clearSelection}
                    className="ml-2 text-emerald-600 hover:text-emerald-800 text-sm"
                  >
                    Limpar
                  </button>
                </div>
              )}
              
              {/* Botão de cadastrar novo membro */}
              <button
                onClick={() => console.log('Cadastrar novo membro')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus size={16} />
                <span className="font-medium">Novo Membro</span>
              </button>
              
              {/* Botão de capturar tela */}
              <button
                onClick={captureScreen}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors shadow-sm"
                title="Capturar tela e salvar como imagem"
              >
                <Camera size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Table and Dashboard Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          {/* Filtros Section */}
          <div className="mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Filter size={14} className="text-emerald-500" />
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Filtros</span>
              </div>
              
              {/* Botão Limpar Filtros */}
              {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all' || accessFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setRoleFilter('all')
                    setAccessFilter('all')
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-sm transition-colors"
                >
                  <X size={10} />
                  <span>Limpar</span>
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Busca por nome/email */}
              <div className="relative flex-1 min-w-[200px]">
                <Search size={12} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-xs border-0 bg-gray-50 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-all"
                />
              </div>
              
              {/* Filtro por Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border-0 bg-gray-50 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-all"
              >
                <option value="all">Status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="pending">Pendente</option>
              </select>
              
              {/* Filtro por Função */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border-0 bg-gray-50 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-all"
              >
                <option value="all">Função</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderador</option>
                <option value="member">Membro</option>
              </select>
              
              {/* Filtro por Acesso */}
              <select
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border-0 bg-gray-50 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-all"
              >
                <option value="all">Acesso</option>
                <option value="accessed">Com Acesso</option>
                <option value="never_accessed">Sem Acesso</option>
              </select>
            </div>
          </div>
          
          {/* Table */}
          <DataTable columns={columns} data={filteredMembers} />
          
          {/* Dashboard Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo dos Dados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total de Membros */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Membros</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredMembers.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Membros Ativos */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Membros Ativos</p>
                    <p className="text-2xl font-bold text-green-600">{filteredMembers.filter(m => m.status === 'active').length}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {filteredMembers.length > 0 ? Math.round((filteredMembers.filter(m => m.status === 'active').length / filteredMembers.length) * 100) : 0}% do total
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Membros com Acesso */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Com Acesso</p>
                    <p className="text-2xl font-bold text-emerald-600">{filteredMembers.filter(m => m.hasAccess).length}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {filteredMembers.length > 0 ? Math.round((filteredMembers.filter(m => m.hasAccess).length / filteredMembers.length) * 100) : 0}% do total
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Membros Pendentes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">{filteredMembers.filter(m => m.status === 'pending').length}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {filteredMembers.length > 0 ? Math.round((filteredMembers.filter(m => m.status === 'pending').length / filteredMembers.length) * 100) : 0}% do total
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

