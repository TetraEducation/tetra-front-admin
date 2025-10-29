// src/components/ui/impersonation-modal.tsx
import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

type ImpersonationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  tenantName: string
  isLoading?: boolean
}

export function ImpersonationModal({
  isOpen,
  onClose,
  onConfirm,
  tenantName,
  isLoading = false
}: ImpersonationModalProps) {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim())
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setReason('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Fazer Login na Plataforma</h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-600 leading-relaxed mb-4">
            Tem certeza que deseja fazer login na plataforma <strong>"{tenantName}"</strong>?
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Isso irá redirecioná-lo para a área administrativa da plataforma como administrador.
          </p>
          
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Motivo da Impersonação *
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Suporte técnico, investigação de problema, treinamento..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Este motivo será registrado para auditoria.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {isLoading ? "Fazendo Login..." : "Sim, Fazer Login"}
          </button>
        </div>
      </div>
    </div>
  )
}
