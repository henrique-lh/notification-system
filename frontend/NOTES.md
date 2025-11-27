# NOTES — Notification Frontend

## Resumo rápido

Este arquivo lista decisões, trade-offs, pontos não implementados por falta de tempo e próximos passos sugeridos para o frontend (Vite + React + Tailwind).

## Trade-offs e decisões importantes

- Estado local vs gerenciadores globais
  - Escolha: useState/useEffect e localStorage para persistência básica.
  - Justificativa: aplicação pequena, sem necessidade de múltiplos consumidores do mesmo estado.
  - Trade-off: sem React Query / Zustand / Redux a app é simples, mas perde recursos de cache/normalização/otimização para escala.

- API contract simples (fetch direto)
  - Escolha: fetch direto nos componentes (NotificationList) com um `refreshKey` para forçar refetch.
  - Justificativa: simples e transparente para o MVP.
  - Trade-off: falta de tratamento avançado de cache, retries e deduplicação de requests que bibliotecas como React Query trazem.

- Estilização e dependências
  - Tailwind + Google Fonts (Inter/Poppins) para aparência moderna e consistência.
  - Trade-off: dependência de build-step e configurações de PostCSS; preferi evitar bibliotecas de UI pesadas (ex: MUI) para manter bundle pequeno.

## Pontos não implementados / limitações por falta de tempo

- Autenticação/Autorização
  - Atualmente a UI chama a API sem autenticação. Em produção é necessário adicionar um fluxo de auth (JWT/OAuth/Meteor Accounts) e enviar tokens nas requisições.

- Cache e sincronização
  - Não há cache centralizado; quando a app cria uma notificação o `refreshKey` força refetch. Para melhor UX/escala, usar React Query para cache, revalidação, optimistic updates e retries.

- Feedback do usuário (toasts)
  - Falta feedback não intrusivo (toasts) para operações (criado, erro, deletado). Atualmente usamos alert/confirm para erros e confirmação.

- Testes (UI / integração)
  - Não há testes de componentes nem testes end-to-end. Ideal: adicionar testes com React Testing Library (componentes) e Cypress/Playwright (E2E).

- Acessibilidade
  - Melhorias pendentes: roles/aria-labels, keyboard navigation refinada, contraste auditado com ferramentas e testes com leitores de tela.

- Internacionalização (i18n)
  - Strings estão hard-coded em português; para multi-idioma, adicionar i18n (react-intl / i18next).

- Mobile / responsive refinements
  - Layout funciona em desktop; testes e ajustes mobile podem melhorar a experiência em telas pequenas.

- Build/CI/CD e deploy
  - Não há Dockerfile / pipeline CI neste repositório. Ideal adicionar Docker/CI para builds e deploy automáticos.

## Possíveis próximos passos

1. Toques de UX: toasts e confirmações não-blocking
   - Instalar `react-hot-toast` e usar para sucesso/erro nas operações (criar, deletar, marcar lida).

2. Melhorar fetch/cache: React Query
   - Substituir fetchs manuais por React Query: traz cache, retries e mecanismos de revalidação.

3. Autenticação básica
   - Adicionar mecanismo de envio de token (ex.: JWT) e proteção de rotas no backend/front (header Authorization).

4. Testes
   - Adicionar testes de unidade e integração para os componentes que fazem chamadas à API. Usar mocks de fetch e testes E2E com Cypress.

5. Acessibilidade e i18n
   - Adicionar roles, aria-labels e testes automatizados de acessibilidade.
   - Internacionalizar strings com `react-intl` ou `i18next`.

6. Docker + CI
   - Criar `Dockerfile` e `docker-compose.yml` simples para rodar frontend e backend localmente; adicionar pipeline que rode `npm run build` e testes.
