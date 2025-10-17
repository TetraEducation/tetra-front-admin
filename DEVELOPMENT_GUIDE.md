# 📋 Guia de Desenvolvimento - Tetra Front Admin

## 🏗️ Estrutura de Pastas

```
src/
├── app/                      # Lógica de negócio e páginas
│   ├── platform/            # Módulo Platform
│   │   ├── pages/          # Páginas do módulo
│   │   ├── components/     # Componentes específicos do módulo
│   │   └── hooks/          # Hooks customizados do módulo
│   └── tenant/             # Módulo Tenant
│       ├── pages/
│       ├── components/
│       └── hooks/
├── components/              # Componentes compartilhados globais
│   ├── ui/                 # Componentes de UI (shadcn/ui)
│   └── [ComponentName].tsx # Componentes de layout/features
├── routes/                  # Definições de rotas (TanStack Router)
│   ├── __root.tsx          # Layout raiz
│   ├── index.tsx           # Rota /
│   ├── platform.tsx        # Layout /platform
│   ├── platform.index.tsx  # Rota /platform/
│   └── platform.*.tsx      # Outras rotas do platform
├── lib/                     # Utilitários e configurações
└── styles.css              # Estilos globais
```

---

## 🎯 Quando Usar Cada Pasta

### **`src/app/[módulo]/pages/`** ✅

**Use para:** Componentes de **página completa** que serão renderizados por rotas.

**Exemplos:**

- `TenantsList.tsx` - Lista de tenants
- `TenantsCreate.tsx` - Formulário de criação
- `Dashboard.tsx` - Dashboard principal
- `MembersReport.tsx` - Relatório de membros

**Características:**

- Fazem fetch de dados
- Compõem vários componentes menores
- Têm lógica de negócio específica

```tsx
// ✅ Bom: src/app/platform/pages/TenantsList.tsx
export function TenantsList() {
  const tenants = useFetchTenants(); // Hook de dados

  return (
    <div>
      <PageHeader title="Tenants" />
      <TenantsTable data={tenants} />
      <CreateButton to="/platform/tenants/create" />
    </div>
  );
}
```

---

### **`src/app/[módulo]/components/`** ✅

**Use para:** Componentes **específicos do módulo**, não reutilizáveis em outros contextos.

**Exemplos:**

- `TenantsTable.tsx` - Tabela específica de tenants
- `TenantCard.tsx` - Card de exibição de tenant
- `TenantFilters.tsx` - Filtros específicos
- `MemberStatusBadge.tsx` - Badge de status de membro

**Características:**

- Usam tipos/interfaces específicos do módulo
- Contêm lógica de negócio do domínio
- NÃO são reutilizados em outros módulos

```tsx
// ✅ Bom: src/app/platform/components/TenantsTable.tsx
interface TenantsTableProps {
  tenants: Tenant[]; // Tipo específico do domínio
}

export function TenantsTable({ tenants }: TenantsTableProps) {
  return (
    <DataTable
      columns={tenantColumns}
      data={tenants}
      onRowClick={handleTenantClick}
    />
  );
}
```

---

### **`src/components/`** ✅

**Use para:** Componentes **compartilhados globalmente** entre módulos.

**Exemplos:**

- `Header.tsx` - Header da aplicação
- `Sidebar.tsx` - Sidebar global
- `PageHeader.tsx` - Header de página genérico
- `ErrorBoundary.tsx` - Boundary de erro
- `LoadingSpinner.tsx` - Spinner de carregamento

**Características:**

- Agnósticos de domínio/módulo
- Reutilizáveis em qualquer lugar
- Geralmente parametrizáveis via props

```tsx
// ✅ Bom: src/components/PageHeader.tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
```

---

### **`src/components/ui/`** ✅

**Use para:** Componentes de **UI primitivos** (geralmente do shadcn/ui).

**O que vai aqui:**

- `button.tsx`, `input.tsx`, `select.tsx`
- `dialog.tsx`, `popover.tsx`, `tooltip.tsx`
- `card.tsx`, `table.tsx`, `data-table.tsx`

**Regra:** ⚠️ **NÃO modifique esses componentes diretamente!** Eles são gerados pelo shadcn/ui.

Se precisar customizar:

```tsx
// ❌ Não faça: Modificar src/components/ui/button.tsx

// ✅ Faça: Criar um wrapper
// src/components/PrimaryButton.tsx
import { Button } from "@/components/ui/button";

export function PrimaryButton(props: ButtonProps) {
  return <Button variant="default" size="lg" {...props} />;
}
```

---

### **`src/routes/`** ✅

**Use para:** **Definições de rotas** do TanStack Router.

**Padrões de nomenclatura:**

| Arquivo                         | Rota Gerada                  | Descrição              |
| ------------------------------- | ---------------------------- | ---------------------- |
| `__root.tsx`                    | `/`                          | Layout raiz            |
| `index.tsx`                     | `/`                          | Homepage               |
| `platform.tsx`                  | `/platform`                  | Layout do platform     |
| `platform.index.tsx`            | `/platform/`                 | Index do platform      |
| `platform.tenants.tsx`          | `/platform/tenants`          | Layout de tenants      |
| `platform.tenants.create.tsx`   | `/platform/tenants/create`   | Página de criar        |
| `platform.tenants.$id.tsx`      | `/platform/tenants/:id`      | Rota dinâmica          |
| `platform.tenants.$id.edit.tsx` | `/platform/tenants/:id/edit` | Rota dinâmica aninhada |

**Exemplo de rota simples:**

```tsx
// src/routes/platform.tenants.create.tsx
import { createFileRoute } from "@tanstack/react-router";
import { TenantsCreate } from "@/app/platform/pages/TenantsCreate";

export const Route = createFileRoute("/platform/tenants/create")({
  component: TenantsCreate,
});
```

**Exemplo de rota com layout:**

```tsx
// src/routes/platform.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PlatformLayout } from "@/app/platform/PlatformLayout";

export const Route = createFileRoute("/platform")({
  component: () => (
    <PlatformLayout>
      <Outlet />
    </PlatformLayout>
  ),
});
```

**Exemplo de rota dinâmica:**

```tsx
// src/routes/platform.tenants.$id.tsx
import { createFileRoute } from "@tanstack/react-router";
import { TenantDetails } from "@/app/platform/pages/TenantDetails";

export const Route = createFileRoute("/platform/tenants/$id")({
  component: TenantDetails,
});
```

---

## 📐 Fluxo de Desenvolvimento

### **1️⃣ Criar uma Nova Página**

```bash
# Passo 1: Criar o componente da página
src/app/platform/pages/TenantsEdit.tsx

# Passo 2: Criar a rota
src/routes/platform.tenants.$id.edit.tsx

# Passo 3: Rodar o dev server (regenera routeTree.gen.ts automaticamente)
pnpm dev
```

**Exemplo completo:**

```tsx
// src/app/platform/pages/TenantsEdit.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "@tanstack/react-router";

export function TenantsEdit() {
  const { id } = useParams({ from: "/platform/tenants/$id/edit" });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Editar Tenant {id}</h2>
      <form className="space-y-4">
        <Input placeholder="Nome" />
        <Button>Salvar</Button>
      </form>
    </div>
  );
}
```

```tsx
// src/routes/platform.tenants.$id.edit.tsx
import { createFileRoute } from "@tanstack/react-router";
import { TenantsEdit } from "@/app/platform/pages/TenantsEdit";

export const Route = createFileRoute("/platform/tenants/$id/edit")({
  component: TenantsEdit,
});
```

---

### **2️⃣ Criar um Componente Reutilizável**

```bash
# Se for específico do módulo:
src/app/platform/components/TenantCard.tsx

# Se for compartilhado:
src/components/StatusBadge.tsx
```

**Exemplo de componente específico:**

```tsx
// src/app/platform/components/TenantCard.tsx
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({ tenant }: TenantCardProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold">{tenant.name}</h3>
      <p className="text-sm text-gray-500">{tenant.slug}</p>
      <Link to="/platform/tenants/$id" params={{ id: tenant.id }}>
        Ver detalhes
      </Link>
    </Card>
  );
}
```

**Exemplo de componente compartilhado:**

```tsx
// src/components/StatusBadge.tsx
interface StatusBadgeProps {
  status: "active" | "inactive" | "pending";
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status]}`}>
      {label}
    </span>
  );
}
```

---

### **3️⃣ Usar Data Table**

```tsx
// src/app/platform/pages/MembersList.tsx
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/platform/components/members-columns";

export function MembersList() {
  const members = useFetchMembers();

  return (
    <div>
      <h2>Membros</h2>
      <DataTable columns={columns} data={members} />
    </div>
  );
}
```

```tsx
// src/app/platform/components/members-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        Editar
      </Button>
    ),
  },
];
```

---

### **4️⃣ Adicionar um Novo Componente do shadcn/ui**

```bash
# Listar componentes disponíveis
npx shadcn@latest add

# Adicionar um componente específico
npx shadcn@latest add badge

# O componente será adicionado em src/components/ui/badge.tsx
```

```tsx
// Usar o componente
import { Badge } from "@/components/ui/badge";

<Badge>Novo</Badge>;
```

---

### **5️⃣ Criar um Custom Hook**

```tsx
// src/app/platform/hooks/useTenants.ts
import { useState, useEffect } from "react";

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tenants")
      .then((res) => res.json())
      .then((data) => {
        setTenants(data);
        setLoading(false);
      });
  }, []);

  return { tenants, loading };
}
```

```tsx
// Usar o hook
import { useTenants } from "@/app/platform/hooks/useTenants";

export function TenantsList() {
  const { tenants, loading } = useTenants();

  if (loading) return <LoadingSpinner />;

  return <DataTable data={tenants} />;
}
```

---

## ✅ Checklist de Boas Práticas

### **Componentes**

- ✅ Componentes de UI primitivos em `components/ui/`
- ✅ Componentes compartilhados em `components/`
- ✅ Componentes específicos em `app/[módulo]/components/`
- ✅ Páginas em `app/[módulo]/pages/`
- ✅ Use TypeScript interfaces para props
- ✅ Exporte componentes como named exports
- ✅ Use PascalCase para nomes de componentes
- ✅ Um componente por arquivo

### **Rotas**

- ✅ Sempre use o caminho completo no `createFileRoute()`
- ✅ Layouts devem renderizar `<Outlet />`
- ✅ Páginas são importadas e referenciadas, não definidas inline
- ✅ Use `.` para separar segmentos: `platform.tenants.create.tsx`
- ✅ Use `$` para rotas dinâmicas: `platform.tenants.$id.tsx`
- ✅ Não edite `routeTree.gen.ts` manualmente
- ✅ Reinicie o dev server se as rotas não atualizarem

### **Importações**

- ✅ Use alias `@/` para imports: `@/components/ui/button`
- ✅ Imports relativos apenas dentro do mesmo módulo
- ✅ Componentes de UI sempre de `@/components/ui/`
- ✅ Organize imports: external → internal → relative

### **TypeScript**

- ✅ Sempre defina tipos para props
- ✅ Evite `any`, use tipos específicos
- ✅ Use interfaces para objetos complexos
- ✅ Exporte tipos que serão reutilizados

### **Styling**

- ✅ Use Tailwind CSS classes
- ✅ Componentes responsivos por padrão
- ✅ Use `cn()` de `@/lib/utils` para classes condicionais

---

## 🚫 Anti-Padrões (O Que NÃO Fazer)

### ❌ Não misture lógica de negócio em rotas

```tsx
// ❌ Ruim
export const Route = createFileRoute("/platform/tenants")({
  component: () => {
    const [tenants, setTenants] = useState([]);
    // ... muita lógica aqui
    return <div>...</div>;
  },
});

// ✅ Bom
export const Route = createFileRoute("/platform/tenants")({
  component: TenantsList, // Componente separado em pages/
});
```

### ❌ Não crie componentes genéricos dentro de módulos

```tsx
// ❌ Ruim: src/app/platform/components/Button.tsx
// Isso deveria estar em src/components/ ou usar o do shadcn/ui

// ✅ Bom: Use o Button do shadcn ou crie em src/components/
```

### ❌ Não use IDs de rota incorretos

```tsx
// ❌ Ruim
createFileRoute("create"); // Incompleto
createFileRoute(""); // Vazio
createFileRoute("/platform/__root"); // Não use __root em IDs

// ✅ Bom
createFileRoute("/platform/tenants/create");
createFileRoute("/platform/");
createFileRoute("/platform");
```

### ❌ Não modifique componentes do shadcn/ui diretamente

```tsx
// ❌ Ruim: Editar src/components/ui/button.tsx

// ✅ Bom: Criar um wrapper ou usar variants
import { Button } from "@/components/ui/button";
<Button variant="default" size="lg">
  Click
</Button>;
```

### ❌ Não use `children` em layouts do TanStack Router

```tsx
// ❌ Ruim
export const PlatformLayout = ({ children }) => {
  return <div>{children}</div>;
};

// ✅ Bom
import { Outlet } from "@tanstack/react-router";

export const PlatformLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
```

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                    # Inicia dev server na porta 3000

# Build
pnpm build                  # Build de produção

# Linting e Formatação
pnpm lint                   # Verifica erros com Biome
pnpm format                 # Formata código com Biome
pnpm check                  # Lint + format

# Adicionar componentes UI
npx shadcn@latest add [component]

# TypeScript
pnpm exec tsc --noEmit      # Verificar erros de tipo

# Regenerar rotas (se necessário)
npx @tanstack/router-cli generate
```

---

## 📚 Referências

- [TanStack Router Docs](https://tanstack.com/router/latest)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## 📝 Template para Context/Instruções (GPT/IA)

Ao trabalhar com assistentes de IA, forneça este contexto:

> Este projeto usa **TanStack Router** com roteamento baseado em arquivos e **shadcn/ui** para componentes. A estrutura é:
>
> - `src/routes/` → Definições de rotas (IDs devem ser caminhos completos)
> - `src/app/[módulo]/pages/` → Componentes de página
> - `src/app/[módulo]/components/` → Componentes específicos do módulo
> - `src/components/` → Componentes compartilhados globais
> - `src/components/ui/` → Componentes primitivos do shadcn/ui (não modificar)
>
> **Regras essenciais:**
>
> 1. Rotas usam nomenclatura com pontos: `platform.tenants.create.tsx` → `/platform/tenants/create`
> 2. Layouts renderizam `<Outlet />`, não `{children}`
> 3. IDs de rota em `createFileRoute()` devem ser o caminho completo
> 4. Componentes de UI vêm de `@/components/ui/`, nunca modifique-os
> 5. Lógica de negócio fica em `pages/`, não em `routes/`
> 6. O arquivo `routeTree.gen.ts` é auto-gerado pelo plugin, nunca edite manualmente
> 7. Use TypeScript para tudo, sempre defina tipos para props
> 8. Imports usam alias `@/` configurado no tsconfig.json

---

**Última atualização:** Outubro 2025
