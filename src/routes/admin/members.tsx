import { createFileRoute } from "@tanstack/react-router";
import MembersPage from "@/app/platform/pages/MembersPage";

export const Route = createFileRoute("/admin/members")({
  component: MembersPage,
});