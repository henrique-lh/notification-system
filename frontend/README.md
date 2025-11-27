# Notification Frontend

Documentação do frontend em React + Vite + Tailwind para listar notificações de um endpoint por userId.

## Como usar

1. Entre na pasta `frontend`:

```bash
cd frontend
```

2. Instale dependências:

```bash
npm install
```

3. Rode em modo desenvolvimento:

```bash
npm run dev
```

4. Abra http://localhost:5173

### Observações
- A aplicação consulta: `http://localhost:8888/api/notifications/user/{userId}`

## Decisões arquiteturais relevantes

- Stack e tooling
	- Vite + React para um dev server rápido e build otimizado.
	- Tailwind CSS para utilitários de estilo, com PostCSS para processamento.
	- Projeto pequeno e focado: evitei adicionar state managers pesados (Redux, Zustand) para manter a curva de manutenção baixa.

- Organização do código
	- `src/` contém a aplicação React:
		- `App.jsx` — orquestra seleção de usuário, modal global de criação e passa `userId` para a lista.
		- `components/UserSelector.jsx` — gerenciamento de usuários (persistidos em localStorage) e seleção.
		- `components/NotificationList.jsx` — lista, fetch das notificações e ações (marcar lida, deletar).
		- `components/CreateNotificationModal.jsx` — modal global para criação de notificações.

- Estado e persistência
	- Estado local React (useState/useEffect) para simplicidade e performance local.
	- Lista de usuários e usuário selecionado persistidos em `localStorage` para sessão de dev/usabilidade.
	- Comunicação com a API feita diretamente via fetch; `NotificationList` aceita um `refreshKey` para forçar refetch quando necessário.

- Contrato de API
	- O frontend consome endpoints REST simples:
		- GET /api/notifications/user/{userId}
		- POST /api/notifications
		- PATCH /api/notifications/{id}/read
		- DELETE /api/notifications/{id}
	- O código assume respostas JSON no formato `{ data: [...], total, page, pageSize }` para listagem.

- Estilo e acessibilidade
	- Usamos Tailwind + fontes (Inter/Poppins) para um visual moderno e consistente.
	- Botões e inputs possuem foco visível e estados desabilitados claros. Ainda há espaço para melhorar a acessibilidade (aria-labels, testes com leitores de tela).

- Trade-offs e limitações
	- Não foi introduzido um cache sofisticado (ex.: React Query) nem WebSockets; o app faz fetchs diretos e refetchs simples. Bom para MVP, mas para escala considere React Query + cache e revalidação incremental.
	- O app não implementa autenticação — a API é chamada diretamente. Em produção, a camada de autenticação/autorização deve ser adicionada.

- Possíveis próximos passos
	- Adicionar toasts (react-hot-toast) para feedback não intrusivo em operações (criar, erro, deletar).
	- Substituir fetchs manuais por React Query para cache, retries e refetch automático.
	- Adicionar testes de integração para os componentes que fazem chamadas à API (mocks de fetch).
	- Melhorar acessibilidade com roles ARIA e testes automatizados.

