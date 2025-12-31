// src/components/ui/create-platform-modal.tsx
import { useState } from 'react'
import { Building2, X, Loader2, FileText, Users, MapPin } from 'lucide-react'

type CreatePlatformModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: CreatePlatformData) => void
  isLoading?: boolean
}

export type CreatePlatformData = {
  name: string
  slug: string
  taxId: string
  details?: {
    primaryEmail?: string
    salesContactName?: string
    salesContactEmail?: string
    salesContactPhone?: string
    supportContactName?: string
    supportContactEmail?: string
    supportContactPhone?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    notes?: string
  }
}

type TabType = 'basic' | 'contacts' | 'address'

export function CreatePlatformModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CreatePlatformModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic')
  const [formData, setFormData] = useState<CreatePlatformData>({
    name: '',
    slug: '',
    taxId: '',
    details: {
      primaryEmail: '',
      salesContactName: '',
      salesContactEmail: '',
      salesContactPhone: '',
      supportContactName: '',
      supportContactEmail: '',
      supportContactPhone: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'BR',
      notes: '',
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('details.')) {
      const detailField = field.replace('details.', '')
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          [detailField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
      
      // Auto-gera slug quando o nome é digitado
      if (field === 'name' && !formData.slug) {
        const generatedSlug = value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
          .replace(/\s+/g, '-') // Substitui espaços por hífens
          .replace(/-+/g, '-') // Remove hífens duplicados
          .replace(/^-|-$/g, '') // Remove hífens no início e fim
        setFormData(prev => ({ ...prev, slug: generatedSlug }))
      }
    }
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validações obrigatórias
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    } else if (formData.name.length > 120) {
      newErrors.name = 'Nome deve ter no máximo 120 caracteres'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug é obrigatório'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug deve conter apenas letras minúsculas, números e hífens'
    } else if (formData.slug.length < 3) {
      newErrors.slug = 'Slug deve ter pelo menos 3 caracteres'
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = 'CNPJ é obrigatório'
    } else {
      // Validação básica de CNPJ (formato XX.XXX.XXX/XXXX-XX)
      const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
      if (!cnpjPattern.test(formData.taxId)) {
        newErrors.taxId = 'CNPJ inválido (formato: 00.000.000/0000-00)'
      }
    }

    // Validações opcionais (formato de email)
    const emailFields = [
      'details.primaryEmail',
      'details.salesContactEmail',
      'details.supportContactEmail'
    ]
    
    emailFields.forEach(field => {
      const value = field === 'details.primaryEmail' ? formData.details?.primaryEmail :
                    field === 'details.salesContactEmail' ? formData.details?.salesContactEmail :
                    formData.details?.supportContactEmail
      
      if (value && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field] = 'Email inválido'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onConfirm(formData)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setActiveTab('basic')
      setFormData({
        name: '',
        slug: '',
        taxId: '',
        details: {
          primaryEmail: '',
          salesContactName: '',
          salesContactEmail: '',
          salesContactPhone: '',
          supportContactName: '',
          supportContactEmail: '',
          supportContactPhone: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'BR',
          notes: '',
        }
      })
      setErrors({})
      onClose()
    }
  }

  const formatCNPJ = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
  }

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value)
    handleChange('taxId', formatted)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-600">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Criar Nova Plataforma</h3>
                <p className="text-sm text-gray-600">Preencha os dados da nova plataforma</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-emerald-200 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex px-6" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'basic'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={18} />
              Informações Básicas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contacts')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'contacts'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users size={18} />
              Contatos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('address')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'address'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MapPin size={18} />
              Endereço
            </button>
          </nav>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {/* Tab: Informações Básicas */}
          {activeTab === 'basic' && (
            <div className="space-y-5">
          {/* Nome da Plataforma */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Plataforma <span className="text-red-500 text-xs">obrigatório</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={isLoading}
              placeholder="Ex: Banco Bradesco S.A."
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug (Identificador Único) <span className="text-red-500 text-xs">obrigatório</span>
            </label>
            <div className="relative">
              <input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value.toLowerCase())}
                disabled={isLoading}
                placeholder="Ex: bradesco"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formData.slug && !errors.slug && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {formData.slug}.tetraeducacao.com.br
                  </span>
                </div>
              )}
            </div>
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
            <p className="text-xs text-gray-500 mt-1">
              O slug será usado no domínio: <code className="bg-gray-100 px-1 rounded">{formData.slug || 'slug'}.tetraeducacao.com.br</code>
            </p>
          </div>

          {/* CNPJ */}
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ <span className="text-red-500 text-xs">obrigatório</span>
            </label>
            <input
              id="taxId"
              type="text"
              value={formData.taxId}
              onChange={(e) => handleCNPJChange(e.target.value)}
              disabled={isLoading}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.taxId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
          </div>

          {/* Email Principal */}
          <div>
            <label htmlFor="primaryEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email Principal <span className="text-gray-400 text-xs">opcional</span>
            </label>
            <input
              id="primaryEmail"
              type="email"
              value={formData.details?.primaryEmail || ''}
              onChange={(e) => handleChange('details.primaryEmail', e.target.value)}
              disabled={isLoading}
              placeholder="contato@empresa.com.br"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors['details.primaryEmail'] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors['details.primaryEmail'] && <p className="text-red-500 text-xs mt-1">{errors['details.primaryEmail']}</p>}
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone <span className="text-gray-400 text-xs">opcional</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.details?.phone || ''}
              onChange={(e) => handleChange('details.phone', e.target.value)}
              disabled={isLoading}
              placeholder="(11) 1234-5678"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
            </div>
          )}

          {/* Tab: Contatos */}
          {activeTab === 'contacts' && (
            <div className="space-y-5">
              {/* Contato Comercial */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-3">Contato Comercial</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="salesContactName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome <span className="text-gray-400 text-xs">opcional</span>
                    </label>
                    <input
                      id="salesContactName"
                      type="text"
                      value={formData.details?.salesContactName || ''}
                      onChange={(e) => handleChange('details.salesContactName', e.target.value)}
                      disabled={isLoading}
                      placeholder="Nome do responsável comercial"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="salesContactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-gray-400 text-xs">opcional</span>
                    </label>
                    <input
                      id="salesContactEmail"
                      type="email"
                      value={formData.details?.salesContactEmail || ''}
                      onChange={(e) => handleChange('details.salesContactEmail', e.target.value)}
                      disabled={isLoading}
                      placeholder="comercial@empresa.com.br"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors['details.salesContactEmail'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['details.salesContactEmail'] && <p className="text-red-500 text-xs mt-1">{errors['details.salesContactEmail']}</p>}
                  </div>
                  <div>
                    <label htmlFor="salesContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone <span className="text-gray-400 text-xs">opcional</span>
                    </label>
                    <input
                      id="salesContactPhone"
                      type="tel"
                      value={formData.details?.salesContactPhone || ''}
                      onChange={(e) => handleChange('details.salesContactPhone', e.target.value)}
                      disabled={isLoading}
                      placeholder="(11) 1234-5678"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Contato Suporte */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-sm font-semibold text-purple-900 mb-3">Contato de Suporte</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="supportContactName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome <span className="text-gray-400 text-xs">opcional</span>
                    </label>
                    <input
                      id="supportContactName"
                      type="text"
                      value={formData.details?.supportContactName || ''}
                      onChange={(e) => handleChange('details.supportContactName', e.target.value)}
                      disabled={isLoading}
                      placeholder="Nome do responsável pelo suporte"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="supportContactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-gray-400 text-xs">opcional</span>
                    </label>
                    <input
                      id="supportContactEmail"
                      type="email"
                      value={formData.details?.supportContactEmail || ''}
                      onChange={(e) => handleChange('details.supportContactEmail', e.target.value)}
                      disabled={isLoading}
                      placeholder="suporte@empresa.com.br"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors['details.supportContactEmail'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['details.supportContactEmail'] && <p className="text-red-500 text-xs mt-1">{errors['details.supportContactEmail']}</p>}
                  </div>
                  <div>
                    <label htmlFor="supportContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone <span className="text-gray-400 text-xs">opcional</span>
                    </label>
                    <input
                      id="supportContactPhone"
                      type="tel"
                      value={formData.details?.supportContactPhone || ''}
                      onChange={(e) => handleChange('details.supportContactPhone', e.target.value)}
                      disabled={isLoading}
                      placeholder="(11) 1234-5678"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Endereço */}
          {activeTab === 'address' && (
            <div className="space-y-5">
              {/* Endereço */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço <span className="text-gray-400 text-xs">opcional</span>
                </label>
                <input
                  id="address"
                  type="text"
                  value={formData.details?.address || ''}
                  onChange={(e) => handleChange('details.address', e.target.value)}
                  disabled={isLoading}
                  placeholder="Rua, número, complemento"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Cidade e Estado */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade <span className="text-gray-400 text-xs">opcional</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.details?.city || ''}
                    onChange={(e) => handleChange('details.city', e.target.value)}
                    disabled={isLoading}
                    placeholder="São Paulo"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado (UF) <span className="text-gray-400 text-xs">opcional</span>
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={formData.details?.state || ''}
                    onChange={(e) => handleChange('details.state', e.target.value.toUpperCase())}
                    disabled={isLoading}
                    placeholder="SP"
                    maxLength={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* CEP e País */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    CEP <span className="text-gray-400 text-xs">opcional</span>
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    value={formData.details?.zipCode || ''}
                    onChange={(e) => handleChange('details.zipCode', e.target.value)}
                    disabled={isLoading}
                    placeholder="00000-000"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    País <span className="text-gray-400 text-xs">opcional</span>
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={formData.details?.country || 'BR'}
                    onChange={(e) => handleChange('details.country', e.target.value.toUpperCase())}
                    disabled={isLoading}
                    placeholder="BR"
                    maxLength={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Observações */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Observações <span className="text-gray-400 text-xs">opcional</span>
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={formData.details?.notes || ''}
                  onChange={(e) => handleChange('details.notes', e.target.value)}
                  disabled={isLoading}
                  placeholder="Observações adicionais sobre a plataforma..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4" />
                Criar Plataforma
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

