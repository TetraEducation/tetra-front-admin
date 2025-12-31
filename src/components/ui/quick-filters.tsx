// src/components/ui/quick-filters.tsx
import { ReactNode } from 'react'

export type FilterOption = {
  key: string
  label: string
  count: number
  icon?: ReactNode
  color?: 'green' | 'red' | 'gray' | 'blue' | 'purple' | 'emerald'
}

type QuickFiltersProps = {
  title: string
  options: FilterOption[]
  activeFilter: string
  onFilterChange: (filter: string) => void
  className?: string
}

const getColorClasses = (color: FilterOption['color'], isActive: boolean) => {
  const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium transition-colors'
  
  if (isActive) {
    switch (color) {
      case 'green':
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
      case 'red':
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`
      case 'blue':
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`
      case 'purple':
        return `${baseClasses} bg-purple-100 text-purple-800 border border-purple-200`
      case 'emerald':
        return `${baseClasses} bg-emerald-100 text-emerald-800 border border-emerald-200`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`
    }
  }
  
  return `${baseClasses} bg-gray-100 text-gray-600 hover:bg-gray-200`
}

const getDotColor = (color: FilterOption['color']) => {
  switch (color) {
    case 'green':
      return 'bg-green-500'
    case 'red':
      return 'bg-red-500'
    case 'blue':
      return 'bg-blue-500'
    case 'purple':
      return 'bg-purple-500'
    case 'emerald':
      return 'bg-emerald-500'
    default:
      return 'bg-gray-500'
  }
}

export function QuickFilters({ 
  title, 
  options, 
  activeFilter, 
  onFilterChange, 
  className = '' 
}: QuickFiltersProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-gray-600">{title}:</span>
      <div className="flex items-center gap-2">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => onFilterChange(option.key)}
            className={getColorClasses(option.color, activeFilter === option.key)}
          >
            <div className="flex items-center gap-1">
              {option.icon && <span>{option.icon}</span>}
              {option.color && !option.icon && (
                <div className={`w-2 h-2 ${getDotColor(option.color)} rounded-full`}></div>
              )}
              {option.label} ({option.count})
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}


