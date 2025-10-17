# 🛠️ Stack Tecnológica - Tetra Front Admin

Este documento descreve todas as tecnologias, ferramentas, bibliotecas e configurações utilizadas no projeto.

---

## 📦 Visão Geral

```
Framework de Build: Vite 7.1.7
Linguagem: TypeScript 5.7.2
UI Framework: React 19.0.0
Roteamento: TanStack Router 1.132.0
Estilização: Tailwind CSS 4.0.6
UI Components: shadcn/ui (Radix UI)
Linter/Formatter: Biome 2.2.4
Gerenciador de Pacotes: pnpm
```

---

## 🏗️ Core Technologies

### **React 19.0.0**

- Framework JavaScript para construção de interfaces
- Usa React Server Components Ready
- JSX com TypeScript

### **TypeScript 5.7.2**

- Superset tipado de JavaScript
- Configuração strict mode habilitada
- Type safety em todo o projeto

### **Vite 7.1.7**

- Build tool moderna e rápida
- Hot Module Replacement (HMR)
- Build otimizado para produção
- Dev server na porta 3000

---

## 🎨 UI & Styling

### **Tailwind CSS 4.0.6**

- Framework CSS utility-first
- Configuração via plugin Vite (`@tailwindcss/vite`)
- CSS Variables habilitadas
- Arquivo de estilos: `src/styles.css`

**Configuração:**

```javascript
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";

plugins: [tailwindcss()];
```

### **shadcn/ui**

- Biblioteca de componentes React
- Baseada em Radix UI
- Estilo: `new-york`
- Ícones: Lucide React

**Componentes Radix UI incluídos:**

- `@radix-ui/react-checkbox` - Checkboxes acessíveis
- `@radix-ui/react-dialog` - Modais e diálogos
- `@radix-ui/react-label` - Labels de formulário
- `@radix-ui/react-popover` - Popovers
- `@radix-ui/react-select` - Selects customizados
- `@radix-ui/react-slot` - Composition de componentes
- `@radix-ui/react-tooltip` - Tooltips

**Utilitários de Estilo:**

- `class-variance-authority` (CVA) - Variantes de componentes
- `clsx` - Conditional classes
- `tailwind-merge` - Merge de classes Tailwind

### **Lucide React 0.545.0**

- Biblioteca de ícones
- Mais de 1000+ ícones SVG
- Tree-shakeable

---

## 🧭 Roteamento

### **TanStack Router 1.132.0**

- Type-safe routing
- File-based routing
- Code splitting automático
- Devtools incluído

**Plugins:**

- `@tanstack/router-plugin` - Plugin Vite para geração automática de rotas
- `@tanstack/react-router-devtools` - Devtools para debug

**Configuração:**

```typescript
// vite.config.ts
import { tanstackRouter } from "@tanstack/router-plugin/vite";

plugins: [tanstackRouter({ autoCodeSplitting: true })];
```

**Arquivo gerado automaticamente:**

- `src/routeTree.gen.ts` - Árvore de rotas (não editar manualmente)

---

## 📊 Data Management

### **TanStack Table 8.21.3**

- Tabelas headless e flexíveis
- Sorting, filtering, pagination
- Totalmente tipado

### **Zod 4.1.12**

- Schema validation
- Type inference
- Runtime type checking

---

## 🎭 Outras Bibliotecas

### **Sonner 2.0.7**

- Sistema de notificações toast
- API simples e elegante
- Suporta promise-based toasts

### **next-themes 0.4.6**

- Sistema de temas (dark/light mode)
- Persist tema via localStorage
- SSR-safe

### **html2canvas 1.4.1**

- Captura de screenshots de elementos DOM
- Export de relatórios como imagem

### **web-vitals 5.1.0**

- Métricas de performance
- Core Web Vitals do Google

---

## 🔧 Ferramentas de Desenvolvimento

### **Biome 2.2.4**

- Linter e formatter unificado
- Substituto moderno do ESLint + Prettier
- Extremamente rápido (escrito em Rust)

**Configuração (`biome.json`):**

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  }
}
```

**Arquivos ignorados:**

- `src/routeTree.gen.ts` - Arquivo auto-gerado

### **Vitest 3.0.5**

- Framework de testes
- API compatível com Jest
- Integrado com Vite

**Testing Libraries:**

- `@testing-library/react` 16.2.0
- `@testing-library/dom` 10.4.0
- `jsdom` 27.0.0 - Ambiente DOM para testes

### **TanStack Devtools**

- `@tanstack/react-devtools` 0.7.0
- Ferramentas de debug para TanStack Router

---

## ⚙️ Arquivos de Configuração

### **`vite.config.ts`**

Configuração do Vite com plugins e aliases.

```typescript
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

**Plugins configurados:**

1. `tanstackRouter` - Gera rotas automaticamente
2. `viteReact` - Suporte a React com Fast Refresh
3. `tailwindcss` - Processa Tailwind CSS

**Aliases:**

- `@/` → `./src/`

---

### **`tsconfig.json`**

Configuração do TypeScript para o projeto.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "jsx": "react-jsx",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "verbatimModuleSyntax": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["src/components/*"],
      "@lib/*": ["src/lib/*"],
      "@hooks/*": ["src/hooks/*"]
    }
  }
}
```

**Recursos habilitados:**

- **Strict Mode** - Type checking rigoroso
- **No Unused Locals/Parameters** - Detecta variáveis não usadas
- **Verbatim Module Syntax** - Import/export type explícito
- **Path Mapping** - Aliases para imports

**Aliases TypeScript:**

- `@/*` → `./src/*`
- `@components/*` → `src/components/*`
- `@lib/*` → `src/lib/*`
- `@hooks/*` → `src/hooks/*`

---

### **`biome.json`**

Configuração do Biome para linting e formatação.

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  },
  "files": {
    "includes": [
      "**/src/**/*",
      "**/.vscode/**/*",
      "**/index.html",
      "**/vite.config.js",
      "!**/src/routeTree.gen.ts"
    ]
  }
}
```

**Regras aplicadas:**

- Indentação com **tabs**
- Aspas **duplas** para strings
- Organize imports automático
- Ignora `routeTree.gen.ts`

---

### **`components.json`**

Configuração do shadcn/ui CLI.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles.css",
    "baseColor": "gray",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Configuração:**

- **Estilo:** `new-york` (design system)
- **RSC:** Desabilitado (não usa React Server Components)
- **TSX:** Habilitado
- **Base Color:** Gray
- **CSS Variables:** Habilitadas
- **Icon Library:** Lucide

**Aliases shadcn:**

- `@/components` - Componentes
- `@/lib/utils` - Utilitários
- `@/components/ui` - Componentes UI
- `@/hooks` - Custom hooks

---

### **`package.json`**

Gerenciamento de dependências e scripts.

```json
{
  "name": "tanstack-router-demo",
  "type": "module",
  "scripts": {
    "dev": "vite --port 3000",
    "build": "vite build && tsc",
    "serve": "vite preview",
    "test": "vitest run",
    "format": "biome format",
    "lint": "biome lint",
    "check": "biome check"
  }
}
```

---

## 📜 Scripts Disponíveis

### **Desenvolvimento**

```bash
pnpm dev
```

- Inicia servidor de desenvolvimento
- Porta: 3000
- Hot Module Replacement habilitado
- Regenera rotas automaticamente

### **Build**

```bash
pnpm build
```

- Executa `vite build` - Build otimizado de produção
- Executa `tsc` - Verificação de tipos TypeScript
- Gera assets minificados

### **Preview**

```bash
pnpm serve
```

- Prévia local do build de produção
- Útil para testar antes do deploy

### **Testes**

```bash
pnpm test
```

- Executa testes com Vitest
- Modo run (não watch)

### **Linting e Formatação**

```bash
pnpm lint       # Verifica problemas de código
pnpm format     # Formata código
pnpm check      # Lint + format
```

---

## 🗂️ Estrutura de Arquivos de Configuração

```
/
├── vite.config.ts          # Configuração do Vite
├── tsconfig.json           # Configuração do TypeScript
├── biome.json              # Configuração do Biome
├── components.json         # Configuração do shadcn/ui
├── package.json            # Dependências e scripts
├── pnpm-lock.yaml          # Lock file do pnpm
├── index.html              # HTML de entrada
├── public/                 # Assets estáticos
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
└── src/
    ├── main.tsx            # Entry point da aplicação
    ├── styles.css          # Estilos globais + Tailwind
    └── lib/
        └── utils.ts        # Utilitário cn() para classes
```

---

## 🔌 Plugins e Integrações

### **Vite Plugins**

1. **TanStack Router Plugin**

   - Auto-gera `routeTree.gen.ts`
   - Code splitting automático
   - Type-safe routing

2. **Vite React Plugin**

   - Fast Refresh
   - JSX/TSX support
   - React DevTools

3. **Tailwind Vite Plugin**
   - Processa Tailwind CSS
   - JIT compilation
   - Purge de CSS não usado

### **TypeScript Integration**

- Tipos automáticos do Vite (`vite/client`)
- Path mapping para imports limpos
- Strict type checking

---

## 📦 Gerenciamento de Dependências

### **pnpm**

- Gerenciador de pacotes usado no projeto
- Mais rápido e eficiente que npm/yarn
- Usa hard links para economizar espaço

**Comandos úteis:**

```bash
pnpm install                # Instalar dependências
pnpm add [pacote]          # Adicionar dependência
pnpm add -D [pacote]       # Adicionar dev dependency
pnpm remove [pacote]       # Remover dependência
pnpm update                # Atualizar dependências
```

---

## 🎨 Sistema de Design

### **Tailwind CSS Configuration**

- Base color: Gray
- CSS Variables habilitadas
- Responsive breakpoints padrão
- Customização via `src/styles.css`

### **shadcn/ui Components**

Componentes instalados:

- ✅ `button` - Botões com variantes
- ✅ `card` - Cards de conteúdo
- ✅ `checkbox` - Checkboxes
- ✅ `data-table` - Tabelas de dados
- ✅ `dialog` - Modais e diálogos
- ✅ `input` - Campos de texto
- ✅ `label` - Labels de formulário
- ✅ `popover` - Popovers
- ✅ `select` - Selects customizados
- ✅ `sonner` - Toast notifications
- ✅ `table` - Tabelas básicas
- ✅ `tooltip` - Tooltips

**Adicionar novos componentes:**

```bash
npx shadcn@latest add [component-name]
```

---

## 🔍 Type Safety

### **TanStack Router Types**

- Rotas totalmente tipadas
- Autocomplete de paths
- Type-safe params e search params
- Inferência automática de tipos

### **shadcn/ui Types**

- Props totalmente tipadas
- Variants com type safety
- Autocomplete de variantes

### **Zod Validation**

- Schema validation runtime
- Type inference automática
- Validação de formulários

---

## 🚀 Performance

### **Otimizações do Vite**

- Code splitting automático por rota
- Tree shaking
- Minificação
- Lazy loading de componentes

### **React 19 Features**

- Server Components ready
- Automatic batching
- Concurrent features

### **Tailwind CSS**

- JIT compilation
- Purge de CSS não usado
- Classes otimizadas

---

## 🧪 Testing

### **Vitest Setup**

```typescript
// vitest.config.ts (se existir)
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
});
```

### **Testing Utilities**

- `@testing-library/react` - Testes de componentes React
- `@testing-library/dom` - Queries e utilitários
- `jsdom` - Ambiente DOM simulado

---

## 📊 Dependências Principais

### **Production Dependencies**

| Pacote                   | Versão  | Descrição            |
| ------------------------ | ------- | -------------------- |
| `react`                  | 19.0.0  | UI Framework         |
| `react-dom`              | 19.0.0  | React DOM renderer   |
| `@tanstack/react-router` | 1.132.0 | Roteamento type-safe |
| `@tanstack/react-table`  | 8.21.3  | Tabelas headless     |
| `tailwindcss`            | 4.0.6   | Framework CSS        |
| `lucide-react`           | 0.545.0 | Biblioteca de ícones |
| `zod`                    | 4.1.12  | Validação de schemas |
| `sonner`                 | 2.0.7   | Toast notifications  |
| `clsx`                   | 2.1.1   | Classes condicionais |
| `tailwind-merge`         | 3.3.1   | Merge de classes     |

### **Development Dependencies**

| Pacote                   | Versão | Descrição           |
| ------------------------ | ------ | ------------------- |
| `vite`                   | 7.1.7  | Build tool          |
| `typescript`             | 5.7.2  | TypeScript          |
| `@biomejs/biome`         | 2.2.4  | Linter + Formatter  |
| `vitest`                 | 3.0.5  | Framework de testes |
| `@vitejs/plugin-react`   | 5.0.4  | Plugin React        |
| `@testing-library/react` | 16.2.0 | Testing utilities   |

---

## 🔐 Boas Práticas de Configuração

### ✅ Do's

- ✅ Use os aliases configurados (`@/`, `@components`)
- ✅ Mantenha as configurações sincronizadas (tsconfig + vite)
- ✅ Não edite `routeTree.gen.ts` manualmente
- ✅ Use Biome para linting e formatação
- ✅ Adicione componentes shadcn via CLI
- ✅ Mantenha dependências atualizadas

### ❌ Don'ts

- ❌ Não altere `biome.json` sem consultar a equipe
- ❌ Não desabilite strict mode do TypeScript
- ❌ Não ignore warnings do linter
- ❌ Não commite arquivos gerados (`routeTree.gen.ts`)
- ❌ Não modifique componentes em `src/components/ui/` diretamente

---

## 📱 Suporte e Compatibilidade

### **Browsers Suportados**

- Chrome/Edge (últimas 2 versões)
- Firefox (últimas 2 versões)
- Safari (últimas 2 versões)

### **Node.js**

- Versão recomendada: 18.x ou superior
- Compatível com Node 20.x

---

## 🔄 Atualizações

### **Verificar atualizações:**

```bash
pnpm outdated
```

### **Atualizar dependências:**

```bash
pnpm update              # Atualizar dentro dos ranges do package.json
pnpm update --latest     # Atualizar para as versões mais recentes
```

### **Atualizar shadcn/ui components:**

```bash
npx shadcn@latest add [component] --overwrite
```

---

## 📚 Recursos e Documentação

### **Documentação Oficial**

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Table](https://tanstack.com/table/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Biome](https://biomejs.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Zod](https://zod.dev/)

### **Comunidades**

- [React Discord](https://discord.gg/react)
- [TanStack Discord](https://discord.gg/tanstack)
- [Tailwind Discord](https://discord.gg/tailwindcss)

---

**Última atualização:** Outubro 2025  
**Versão do Projeto:** 1.0.0

