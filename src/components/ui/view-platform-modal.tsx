// src/components/ui/view-platform-modal.tsx
import { useState, useEffect } from 'react'
import { X, Building2, FileText, Users, MapPin, Calendar, Activity, Edit, Save } from 'lucide-react'

type ViewPlatformModalProps = {
  isOpen: boolean
  onClose: () => void
  data: TenantDetailsData | null
  isLoading?: boolean
  mode?: 'view' | 'edit'
  onSave?: (data: TenantUpdateData) => Promise<void>
  isSaving?: boolean
}

export type TenantUpdateData = {
  slug?: string
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

export type TenantDetailsData = {
  tenantId: string
  name: string
  slug: string
  taxId?: string | null
  status: string
  createdAt: Date
  updatedAt: Date
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
  } | null
}

export function ViewPlatformModal({
  isOpen,
  onClose,
  data,
  isLoading = false,
  mode = 'view',
  onSave,
  isSaving = false,
}: ViewPlatformModalProps) {
  const [isEditing, setIsEditing] = useState(mode === 'edit')
  const [formData, setFormData] = useState<TenantUpdateData>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setIsEditing(mode === 'edit')
  }, [mode])

  useEffect(() => {
    if (data) {
      setFormData({
        slug: data.slug,
        details: data.details ? { ...data.details } : {}
      })
    }
  }, [data])

  if (!isOpen) return null

  const handleChange = (field: string, value: string) => {
    if (field === 'slug') {
      setFormData(prev => ({ ...prev, slug: value }))
    } else if (field.startsWith('details.')) {
      const detailField = field.replace('details.', '')
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          [detailField]: value
        }
      }))
    }
    
    // Limpa erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validação do slug
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug deve conter apenas letras minúsculas, números e hífens'
    }

    // Validação de emails
    const emailFields = [
      { key: 'details.primaryEmail', value: formData.details?.primaryEmail },
      { key: 'details.salesContactEmail', value: formData.details?.salesContactEmail },
      { key: 'details.supportContactEmail', value: formData.details?.supportContactEmail }
    ]

    emailFields.forEach(({ key, value }) => {
      if (value && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[key] = 'Email inválido'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm() || !onSave) return

    // Limpa campos vazios antes de enviar
    const cleanDetails = formData.details ? Object.fromEntries(
      Object.entries(formData.details).filter(([_, value]) => value && value.trim() !== '')
    ) : undefined

    await onSave({
      slug: formData.slug !== data?.slug ? formData.slug : undefined,
      details: Object.keys(cleanDetails || {}).length > 0 ? cleanDetails : undefined
    })
  }

  const handleCancel = () => {
    if (mode === 'edit') {
      onClose()
    } else {
      setIsEditing(false)
      // Reseta o formulário com os dados originais
      if (data) {
        setFormData({
          slug: data.slug,
          details: data.details ? { ...data.details } : {}
        })
      }
      setErrors({})
    }
  }

  const hasContactDetails = data?.details && (
    data.details.salesContactName ||
    data.details.salesContactEmail ||
    data.details.salesContactPhone ||
    data.details.supportContactName ||
    data.details.supportContactEmail ||
    data.details.supportContactPhone
  )

  const hasAddressDetails = data?.details && (
    data.details.address ||
    data.details.city ||
    data.details.state ||
    data.details.zipCode ||
    data.details.country
  )

  // Helper para renderizar campo (view ou edit)
  const renderField = (
    label: string,
    field: string,
    value: string | undefined,
    placeholder?: string,
    type: 'text' | 'email' | 'tel' = 'text'
  ) => {
    if (isEditing) {
      return (
        <div>
          <label htmlFor={field} className="block text-xs font-medium text-gray-500 mb-1">
            {label}
          </label>
          <input
            id={field}
            type={type}
            value={field === 'slug' ? formData.slug || '' : formData.details?.[field.replace('details.', '') as keyof typeof formData.details] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            disabled={isSaving}
            placeholder={placeholder}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors[field] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
        </div>
      )
    }

    return value ? (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    ) : null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isEditing ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              {isEditing ? <Edit className="w-6 h-6 text-white" /> : <Building2 className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar Plataforma' : 'Detalhes da Plataforma'}
              </h2>
              <p className="text-sm text-gray-600">
                {isEditing ? 'Atualize as informações da plataforma' : 'Visualização completa dos dados'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mode === 'view' && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
                title="Editar"
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <button
              onClick={onClose}
              disabled={isLoading || isSaving}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Informações Básicas</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Nome - Somente leitura */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Nome</label>
                      <p className="text-sm text-gray-900 font-medium">{data.name}</p>
                    </div>

                    {/* Slug - Editável */}
                    {renderField('Slug', 'slug', data.slug, 'bradesco', 'text')}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* CNPJ - Somente leitura */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">CNPJ</label>
                      <p className="text-sm text-gray-900">{data.taxId || '—'}</p>
                    </div>

                    {/* Status - Somente leitura */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        data.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <Activity className="w-3 h-3" />
                        {data.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>

                  {(isEditing || data.details?.primaryEmail || data.details?.phone) && (
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      {/* Email Principal - Editável */}
                      {renderField('Email Principal', 'details.primaryEmail', data.details?.primaryEmail, 'contato@empresa.com.br', 'email')}
                      
                      {/* Telefone - Editável */}
                      {renderField('Telefone', 'details.phone', data.details?.phone, '(11) 1234-5678', 'tel')}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Criado em
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(data.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Atualizado em
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(data.updatedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contatos */}
              {(isEditing || hasContactDetails) && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Contatos</h3>
                  </div>
                  <div className="space-y-4">
                    {/* Contato Comercial */}
                    {(isEditing || data.details?.salesContactName || data.details?.salesContactEmail || data.details?.salesContactPhone) && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-900 mb-3">Contato Comercial</h4>
                        <div className="space-y-3">
                          {renderField('Nome', 'details.salesContactName', data.details?.salesContactName, 'Nome do responsável comercial')}
                          {renderField('Email', 'details.salesContactEmail', data.details?.salesContactEmail, 'comercial@empresa.com.br', 'email')}
                          {renderField('Telefone', 'details.salesContactPhone', data.details?.salesContactPhone, '(11) 1234-5678', 'tel')}
                        </div>
                      </div>
                    )}

                    {/* Contato Suporte */}
                    {(isEditing || data.details?.supportContactName || data.details?.supportContactEmail || data.details?.supportContactPhone) && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <h4 className="text-sm font-semibold text-purple-900 mb-3">Contato de Suporte</h4>
                        <div className="space-y-3">
                          {renderField('Nome', 'details.supportContactName', data.details?.supportContactName, 'Nome do responsável pelo suporte')}
                          {renderField('Email', 'details.supportContactEmail', data.details?.supportContactEmail, 'suporte@empresa.com.br', 'email')}
                          {renderField('Telefone', 'details.supportContactPhone', data.details?.supportContactPhone, '(11) 1234-5678', 'tel')}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Endereço */}
              {(isEditing || hasAddressDetails) && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Endereço</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {renderField('Endereço', 'details.address', data.details?.address, 'Rua, número, complemento')}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {renderField('Cidade', 'details.city', data.details?.city, 'São Paulo')}
                      {renderField('Estado', 'details.state', data.details?.state, 'SP')}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {renderField('CEP', 'details.zipCode', data.details?.zipCode, '00000-000')}
                      {renderField('País', 'details.country', data.details?.country, 'BR')}
                    </div>
                  </div>
                </section>
              )}

              {/* Observações */}
              {(isEditing || data.details?.notes) && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Observações</h3>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    {isEditing ? (
                      <textarea
                        id="details.notes"
                        rows={4}
                        value={formData.details?.notes || ''}
                        onChange={(e) => handleChange('details.notes', e.target.value)}
                        disabled={isSaving}
                        placeholder="Observações adicionais sobre a plataforma..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{data.details?.notes}</p>
                    )}
                  </div>
                </section>
              )}

              {/* Caso não tenha detalhes extras */}
              {!hasContactDetails && !hasAddressDetails && !data.details?.notes && (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Nenhum detalhe adicional cadastrado</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !onSave}
                className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar Alterações
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

