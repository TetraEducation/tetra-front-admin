# 🏗️ Guia de Criação de Plataforma

## ✅ Funcionalidades Implementadas

### 1. **Modal de Criação de Plataforma**

- ✅ Design moderno e responsivo com gradiente Tetra (verde)
- ✅ Validação em tempo real dos campos
- ✅ Geração automática de slug a partir do nome
- ✅ Máscara automática para CNPJ
- ✅ Validação de URL do logo com preview
- ✅ Feedback visual de loading durante a criação
- ✅ Tratamento de erros com mensagens claras

### 2. **Validações Implementadas**

- **Nome da Plataforma:**
  - Obrigatório
  - Mínimo de 3 caracteres
- **Slug:**
  - Obrigatório
  - Apenas letras minúsculas, números e hífens
  - Mínimo de 3 caracteres
  - Gerado automaticamente a partir do nome (remove acentos e caracteres especiais)
- **CNPJ:**
  - Obrigatório
  - Formato: `00.000.000/0000-00`
  - Máscara aplicada automaticamente
- **URL do Logo:**
  - Opcional
  - Validação de URL válida
  - Preview da imagem no modal

### 3. **Toasts/Notificações (Sonner)**

- ✅ **Sucesso:** Notificação verde com mensagem de sucesso e domínio gerado
- ✅ **Erro:** Notificação vermelha com mensagem de erro detalhada
- ✅ Posicionamento: Top-right
- ✅ Duração: 5 segundos
- ✅ Botão de fechar
- ✅ Cores ricas (richColors)

### 4. **Integração com API**

- ✅ Endpoint: `POST http://localhost:3334/tenants`
- ✅ Payload:
  ```json
  {
    "name": "Nome da Plataforma",
    "slug": "slug-da-plataforma",
    "taxId": "00.000.000/0000-00",
    "logoUrl": "https://exemplo.com/logo.png" // opcional
  }
  ```
- ✅ Resposta esperada:
  ```json
  {
    "message": "Tenant created successfully"
  }
  ```

### 5. **Atualização da Lista**

- ✅ Após criar, a lista de plataformas é automaticamente recarregada
- ✅ Usa `react-query` para invalidar e refazer a query
- ✅ Modal fecha automaticamente após sucesso

## 🚀 Como Testar

### 1. **Certifique-se de que os backends estão rodando:**

```bash
# Terminal 1: Backend do IAM
cd tetra-iam
pnpm dev

# Terminal 2: Backend do Tenants
cd tetra-tenants
pnpm dev

# Terminal 3: Frontend
cd tetra-front-admin
pnpm dev
```

### 2. **Acesse o painel administrativo:**

```
http://localhost:3000/administrative-panel
```

### 3. **Faça login com suas credenciais:**

- Email: `lucas@tetraeducacao.com.br`
- Senha: sua senha

### 4. **Navegue para "Plataformas":**

- Clique em "Plataformas" na sidebar esquerda

### 5. **Clique em "Nova Plataforma":**

- No canto superior direito, clique no botão verde "Nova Plataforma"

### 6. **Preencha o formulário:**

- **Nome:** `Banco do Brasil`
- **Slug:** `bancodobrasil` (gerado automaticamente, mas você pode editar)
- **CNPJ:** `00.000.000/0001-91` (digite sem pontos, o sistema formata)
- **URL do Logo:** `https://logodownload.org/wp-content/uploads/2016/04/banco-do-brasil-logo-1.png` (opcional)

### 7. **Clique em "Criar Plataforma":**

- Observe o loading no botão ("Criando...")
- Aguarde a notificação de sucesso no canto superior direito
- Veja a nova plataforma aparecer na lista automaticamente

### 8. **Teste de erro:**

- Tente criar uma plataforma com um slug duplicado
- Ou deixe campos obrigatórios vazios
- Observe as mensagens de erro

## 🎨 Características Visuais

### Modal:

- Background com blur
- Animação de entrada (fade-in + zoom)
- Header com gradiente verde Tetra
- Ícone de prédio (Building2) no header
- Preview do logo em tempo real
- Botões com estados de loading

### Toasts:

- Posição: Top-right
- Cores ricas para sucesso/erro
- Expansível ao hover
- Botão de fechar
- Duração de 5 segundos

### Validações:

- Bordas vermelhas nos campos com erro
- Mensagens de erro em vermelho abaixo dos campos
- Preview do slug com domínio completo
- Máscara automática para CNPJ

## 🧪 Casos de Teste

### ✅ Casos de Sucesso:

1. Criar plataforma com todos os campos preenchidos
2. Criar plataforma sem logo (campo opcional)
3. Editar o slug gerado automaticamente
4. Criar múltiplas plataformas em sequência

### ❌ Casos de Erro:

1. Nome vazio ou com menos de 3 caracteres
2. Slug vazio ou com caracteres especiais
3. CNPJ inválido (formato errado)
4. URL do logo inválida
5. Slug duplicado (erro do backend)
6. Backend offline (erro de rede)

## 📝 Observações

- O slug é gerado automaticamente a partir do nome, mas pode ser editado manualmente
- A máscara do CNPJ é aplicada automaticamente conforme você digita
- O preview do logo só aparece se a URL for válida e a imagem carregar
- A lista de plataformas é recarregada automaticamente após criar uma nova
- Os toasts desaparecem automaticamente após 5 segundos, mas podem ser fechados manualmente

## 🔧 Troubleshooting

### Modal não abre:

- Verifique o console do navegador para erros
- Certifique-se de que o botão "Nova Plataforma" está clicável

### Toast não aparece:

- Verifique se o `<Toaster />` está no `__root.tsx`
- Verifique a posição do toast (pode estar fora da tela)

### Lista não atualiza:

- Verifique se o `queryClient.invalidateQueries` está sendo chamado
- Verifique se a query key está correta (`['tenants']`)

### Erro ao criar:

- Verifique se o backend do tetra-tenants está rodando na porta 3334
- Verifique o console do backend para mensagens de erro
- Verifique se os dados do formulário estão corretos

## 🎉 Conclusão

A funcionalidade de criação de plataforma está completa e totalmente integrada com:

- ✅ UI/UX moderna e responsiva
- ✅ Validações robustas
- ✅ Feedback visual com toasts
- ✅ Integração com API
- ✅ Atualização automática da lista
- ✅ Tratamento de erros

Aproveite! 🚀
