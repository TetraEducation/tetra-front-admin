import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/members/data-table')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/members/data-table"!</div>
}
