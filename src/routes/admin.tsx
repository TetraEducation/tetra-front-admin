import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-72"> {/* Espaço para a sidebar */}
        <Outlet />
      </div>
    </div>
  )
}