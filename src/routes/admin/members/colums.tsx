import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/members/colums')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/members/colums"!</div>
}
