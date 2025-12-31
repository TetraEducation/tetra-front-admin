# Tetra Front Admin – Roadmap

Este documento acompanha a evolução do painel administrativo da Tetra Educação. Use a checklist abaixo para entender rapidamente o que já foi entregue e o que ainda está em andamento.

## ✅ Entregues
- [x] Autenticação via IAM com controle de `platformAccess` para o `/administrative-panel`
- [x] Login do tenant (`/admin`) sem exigência de `platformAccess` e guard dedicado (`TenantGuard`)
- [x] Login area administrativa (`/administrative-panel`
- [x] Sidebar do tenant com colapso persistente e layout centralizado=
- [x] Padrão de telas unificado (produtos, matrículas, membros) com DataTable, buscas e filtros
- [x] Implementação das telas mockadas:
  - [x] Produtos (`/admin/products`) com cards, filtros e menu de ações
  - [x] Matrículas (`/admin/enrollments`) com progressos e status
  - [x] Membros (`/admin/members`) seguindo o mesmo visual do painel
- [x] Integração com API IAM para usuários (listagem, status e reset de senha)

## 🚧 Em andamento
- [ ] Conectar tela de produtos à API real (listar, criar, editar, excluir)
- [ ] Conectar tela de matrículas à API real (listagem e ações)
- [ ] Implementar modais reais de criação/edição (produtos, matrículas, membros)
- [ ] Persistir estado de colapso da sidebar no storage para manter preferências do usuário
- [ ] Criar testes automatizados para garantias de autenticação e guards

## 📅 Próximos passos sugeridos
1. Definir contratos das APIs de produtos e matrículas e iniciar integrações
2. Implementar toasts de sucesso/erro conectados às respostas reais
3. Adicionar paginação real compartilhada entre DataTable e backend
4. Criar documentação de deploy e configuração de variáveis de ambiente

---

Última atualização: 2025/11/12
