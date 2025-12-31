// src/components/ui/confirmation-modal.tsx
import { ReactNode } from 'react'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'

type ModalType = 'warning' | 'success' | 'info' | 'danger'

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: ModalType
  isLoading?: boolean
}

const getModalConfig = (type: ModalType) => {
  switch (type) {
    case 'warning':
      return {
        icon: AlertTriangle,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-100',
        confirmColor: 'bg-amber-600 hover:bg-amber-700',
        borderColor: 'border-amber-200'
      }
    case 'success':
      return {
        icon: CheckCircle,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-100',
        confirmColor: 'bg-green-600 hover:bg-green-700',
        borderColor: 'border-green-200'
      }
    case 'danger':
      return {
        icon: AlertCircle,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-100',
        confirmColor: 'bg-red-600 hover:bg-red-700',
        borderColor: 'border-red-200'
      }
    case 'info':
    default:
      return {
        icon: Info,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100',
        confirmColor: 'bg-blue-600 hover:bg-blue-700',
        borderColor: 'border-blue-200'
      }
  }
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const config = getModalConfig(type)
  const IconComponent = config.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${config.borderColor}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${config.iconBg}`}>
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${config.confirmColor}`}
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}


