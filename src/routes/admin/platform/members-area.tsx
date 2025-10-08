import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/platform/members-area')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/platform/members-area"!</div>
}
