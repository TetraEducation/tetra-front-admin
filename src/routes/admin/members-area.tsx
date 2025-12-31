import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Layers3,
  ListChecks,
  Palette,
  Settings2,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sections = [
  {
    id: "overview",
    icon: LayoutDashboard,
    label: "Visão Geral",
    description:
      "Veja como os membros enxergam a página inicial e os principais blocos ativos.",
  },
  {
    id: "modules",
    icon: Layers3,
    label: "Módulos",
    description:
      "Gerencie cards, galerias e coleções de cursos que aparecerão na área do membro.",
  },
  {
    id: "checklists",
    icon: ListChecks,
    label: "Checklists",
    description:
      "Crie listas de atividades para orientar o progresso dos membros.",
  },
  {
    id: "branding",
    icon: Palette,
    label: "Branding",
    description:
      "Personalize cores, banners e mensagens para reforçar a identidade do tenant.",
  },
  {
    id: "automation",
    icon: Settings2,
    label: "Automação",
    description:
      "Defina regras de acesso, notificações e integrações com outras soluções.",
  },
] as const;

export const Route = createFileRoute("/admin/members-area")({
  component: MembersAreaPage,
});

function MembersAreaPage() {
  const [activeSection, setActiveSection] =
    useState<(typeof sections)[number]["id"]>("overview");

  const selected = sections.find((section) => section.id === activeSection)!;
  const SelectedIcon = selected.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="mx-auto w-full max-w-[1680px] space-y-6">
        <header className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Área do Membro</h1>
          <p className="mt-2 text-gray-600">
            Configure conteúdos, aparência e experiências exclusivas que os
            membros enxergam ao acessar a plataforma.
          </p>
        </header>

        <div className="grid gap-6 2xl:grid-cols-[minmax(0,8.5fr)_minmax(380px,3.5fr)] xl:grid-cols-[minmax(0,7fr)_minmax(320px,3.5fr)] lg:grid-cols-[minmax(0,3.5fr)_minmax(260px,2.2fr)]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg lg:p-10">
            <h2 className="text-xl font-semibold text-gray-900">
              Visualização
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Pré-visualização do item selecionado:{" "}
              <span className="font-medium text-gray-800">
                {selected.label}
              </span>
            </p>

            <div className="mt-6 min-h-[320px] rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-12 text-center text-sm text-emerald-800 shadow-inner lg:p-18">
              <p className="font-medium">
                A pré-visualização dinâmica desta seção será exibida aqui.
              </p>
              <p className="mt-2 text-emerald-700">
                Utilize o menu lateral para configurar módulos, aparências e
                automações da área do membro.
              </p>
            </div>
          </section>

          <aside className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Configurações
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Selecione o item para configurar os blocos que aparecem para os
                membros.
              </p>
            </div>

            <Select
              value={activeSection}
              onValueChange={(value) =>
                setActiveSection(value as (typeof sections)[number]["id"])
              }
            >
              <SelectTrigger className="w-full justify-between">
                <SelectValue placeholder="Selecione a configuração" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-content-center rounded-lg bg-emerald-500 text-white">
                  <SelectedIcon size={20} />
                </span>
                <div>
                  <p className="text-base font-semibold text-emerald-900">
                    {selected.label}
                  </p>
                  <p className="text-xs text-emerald-700">
                    {selected.description}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
