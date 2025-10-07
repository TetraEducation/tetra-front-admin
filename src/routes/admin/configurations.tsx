import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/configurations')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/configurations"!</div>
}
