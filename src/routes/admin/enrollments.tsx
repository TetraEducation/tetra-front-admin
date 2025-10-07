import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/enrollments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/enrollments"!</div>
}
