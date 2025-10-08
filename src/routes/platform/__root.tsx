import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/platform')({
  component: PlatformLayout,
})

function PlatformLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <Outlet />
      </div>
    </div>
  )
}
