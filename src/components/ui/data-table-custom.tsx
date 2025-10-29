// src/components/ui/data-table-custom.tsx
import { ReactNode } from 'react'

export type ColumnDef<T> = {
  header: string
  accessorKey?: keyof T
  cell?: (row: T) => ReactNode
  headerClassName?: string
  cellClassName?: string
}

type DataTableProps<T> = {
  data: T[]
  columns: ColumnDef<T>[]
  emptyState?: ReactNode
  onRowClick?: (row: T) => void
  className?: string
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  emptyState,
  onRowClick,
  className = ''
}: DataTableProps<T>) {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={
                    column.headerClassName ||
                    'px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'
                  }
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, idx) => (
                    <td
                      key={idx}
                      className={column.cellClassName || 'px-6 py-4'}
                    >
                      {column.cell
                        ? column.cell(row)
                        : column.accessorKey
                        ? String(row[column.accessorKey])
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12">
                  {emptyState || (
                    <div className="text-center text-gray-500">
                      Nenhum dado encontrado
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


