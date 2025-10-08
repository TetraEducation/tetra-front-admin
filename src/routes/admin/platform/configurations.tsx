import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/platform/configurations')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/configurations"!</div>
}
