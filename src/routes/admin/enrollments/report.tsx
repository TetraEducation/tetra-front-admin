import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/enrollments/report')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/enrollments/report"!</div>
}
