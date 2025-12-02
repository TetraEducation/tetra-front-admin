import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* O ml-72 já é aplicado no __root.tsx, então não precisa aqui */}
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
