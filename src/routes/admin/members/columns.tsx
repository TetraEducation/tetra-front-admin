import { type ColumnDef } from "@tanstack/react-table"
import { CheckCircle, XCircle, Clock, User, Mail, Shield, Calendar, Eye, Copy, MoreHorizontal, Edit, Trash2, ChevronDown } from "lucide-react"
import { useState } from "react"

// Hook para gerenciar seleção
export const useMemberSelection = () => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  
  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }
  
  const selectAll = (memberIds: string[]) => {
    setSelectedMembers(memberIds)
  }
  
  const clearSelection = () => {
    setSelectedMembers([])
  }
  
  return {
    selectedMembers,
    toggleMember,
    selectAll,
    clearSelection
  }
}

// Componente de dropdown de ações
const ActionsDropdown = ({ member }: { member: Member }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Função para lidar com teclas de atalho
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'c' || e.key === 'C') {
      setIsOpen(!isOpen)
    } else if (e.key === 'a' || e.key === 'A') {
      console.log('Acesso rápido ao membro:', member.id)
      setIsOpen(false)
    } else if (e.key === 'e' || e.key === 'E') {
      console.log('Editar membro:', member.id)
      setIsOpen(false)
    } else if (e.key === 'x' || e.key === 'X') {
      console.log('Excluir membro:', member.id)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" onKeyDown={handleKeyDown} tabIndex={0}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
        title="Ações (C)"
      >
        <MoreHorizontal size={16} />
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar o dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            <div className="py-1">
              <button
                onClick={() => {
                  console.log('Acesso rápido ao membro:', member.id)
                  setIsOpen(false)
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <User size={14} />
                  <span>Acesso Rápido</span>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">A</span>
              </button>
              
              <hr className="my-1 border-gray-100" />
              
              <button
                onClick={() => {
                  console.log('Editar membro:', member.id)
                  setIsOpen(false)
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Edit size={14} />
                  <span>Editar</span>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">E</span>
              </button>
              
              <hr className="my-1 border-gray-100" />
              
              <button
                onClick={() => {
                  console.log('Excluir membro:', member.id)
                  setIsOpen(false)
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Trash2 size={14} />
                  <span>Excluir</span>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">X</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Função para copiar email
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    
    // Criar notificação temporária
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300'
    notification.textContent = `Email copiado: ${text}`
    document.body.appendChild(notification)
    
    // Remover após 3 segundos
    setTimeout(() => {
      notification.style.opacity = '0'
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
    
  } catch (err) {
    console.error('Erro ao copiar:', err)
    
    // Notificação de erro
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    notification.textContent = 'Erro ao copiar email'
    document.body.appendChild(notification)
    
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }
}

// This type is used to define the shape of our data.
export type Member = {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "pending"
  role: "admin" | "member" | "moderator"
  createdAt: string
  lastAccess?: string
  hasAccess: boolean
}

export const createColumns = (selectedMembers: string[], toggleMember: (id: string) => void, selectAll: (ids: string[]) => void): ColumnDef<Member>[] => [
  // Coluna de seleção
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => {
            if (e.target.checked) {
              selectAll(table.getRowModel().rows.map(row => row.original.id))
            } else {
              selectAll([])
            }
          }}
          className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={selectedMembers.includes(row.original.id)}
          onChange={() => toggleMember(row.original.id)}
          className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
    minSize: 50,
    maxSize: 50,
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="flex items-center gap-2">
        <User size={16} className="text-emerald-600" />
        <span className="font-semibold">Nome</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
          <User size={14} className="text-emerald-600" />
        </div>
        <span className="font-medium text-gray-900">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="flex items-center gap-2">
        <Mail size={16} className="text-emerald-600" />
        <span className="font-semibold">Email</span>
      </div>
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return (
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-gray-400" />
          <span className="text-gray-600">{email}</span>
          <button
            onClick={() => copyToClipboard(email)}
            className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
            title="Copiar email"
          >
            <Copy size={12} />
          </button>
        </div>
      )
    },
  },
  {
    accessorKey: "hasAccess",
    header: () => (
      <div className="flex items-center gap-2">
        <Eye size={16} className="text-emerald-600" />
        <span className="font-semibold">Acesso</span>
      </div>
    ),
    cell: ({ row }) => {
      const hasAccess = row.getValue("hasAccess") as boolean
      const lastAccess = row.original.lastAccess
      
      return (
        <div className="flex items-center gap-2">
          {hasAccess ? (
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <div>
                <span className="text-green-700 font-medium text-sm">Acessou</span>
                {lastAccess && (
                  <p className="text-xs text-gray-500">
                    {new Date(lastAccess).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-red-500" />
              <span className="text-red-700 font-medium text-sm">Nunca acessou</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center gap-2">
        <Shield size={16} className="text-emerald-600" />
        <span className="font-semibold">Status</span>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusConfig = {
        active: { 
          color: "bg-green-100 text-green-800 border-green-200", 
          icon: CheckCircle,
          label: "Ativo"
        },
        inactive: { 
          color: "bg-red-100 text-red-800 border-red-200", 
          icon: XCircle,
          label: "Inativo"
        },
        pending: { 
          color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
          icon: Clock,
          label: "Pendente"
        }
      }
      
      const config = statusConfig[status as keyof typeof statusConfig]
      const IconComponent = config.icon
      
      return (
        <div className="flex items-center gap-2">
          <IconComponent size={14} className={config.color.split(' ')[1]} />
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            {config.label}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: () => (
      <div className="flex items-center gap-2">
        <Shield size={16} className="text-emerald-600" />
        <span className="font-semibold">Função</span>
      </div>
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      const roleConfig = {
        admin: { label: "Administrador", color: "bg-purple-100 text-purple-800" },
        member: { label: "Membro", color: "bg-blue-100 text-blue-800" },
        moderator: { label: "Moderador", color: "bg-orange-100 text-orange-800" }
      }
      
      const config = roleConfig[role as keyof typeof roleConfig]
      
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-emerald-600" />
        <span className="font-semibold">Cadastro</span>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-gray-600">{date.toLocaleDateString("pt-BR")}</span>
        </div>
      )
    },
  },
  // Coluna de ações
  {
    id: "actions",
    header: () => (
      <span className="font-semibold">Ações</span>
    ),
    cell: ({ row }) => {
      const member = row.original
      return <ActionsDropdown member={member} />
    },
    enableSorting: false,
    enableHiding: false,
  },
]