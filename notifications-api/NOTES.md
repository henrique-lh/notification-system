# NOTES — Notifications API

## Resumo rápido

Este arquivo documenta decisões, trade-offs, pendências (por falta de tempo) e próximos passos sugeridos para o serviço `notifications-api`.

## Trade-offs e decisões arquiteturais

- Meteor + Mongo embutido
  - Vantagem: configuração mínima para desenvolvimento, integração simples com `Mongo` e APIs Meteor (methods/publications).
  - Trade-off: o uso do Mongo local do Meteor é ótimo para produtividade, mas menos adequado para produção (replicação/backup/observability exigem configuração extra).

- REST simples sobre rotas customizadas
  - Vantagem: endpoints fáceis de chamar via curl/HTTP e integração direta com frontends não-Meteor.
  - Trade-off: não exploramos DDP/real-time (publications) para push de notificações ao cliente. Se o caso de uso exigir updates em tempo real, considerar habilitar uma camada DDP/WebSocket.

- Separação service/repository/controller
  - Vantagem: facilita testes unitários, isola regras de negócio e acesso a dados.
  - Trade-off: adiciona alguma complexidade inicial, mas compensa a médio prazo para manutenção e cobertura de testes.

- Simplicidade do schema
  - Decisão: os documentos de notificação têm campos leves (title, message, userId, read, deleted, createdAt).
  - Trade-off: não há um esquema fortemente tipado (ex.: migrations, validações com JSON Schema/TypeBox) no core — isso acelera o desenvolvimento, mas exige validação cuidadosa nas bordas (controllers).

## Pontos não implementados / limitações conhecidas

- Autenticação e autorização: não existe controle de acesso. Qualquer cliente que conhecer os endpoints pode criar/ler/deletar notificações. (Priorizar: alta)
- Validação robusta de payloads: existem validações básicas, mas não há uso de bibliotecas como AJV/JOI/Zod para validação declarativa e mensagens de erro estruturadas.
- Rate limiting / proteção contra abuso: não há limite por IP/usuario; endpoints públicos podem ser alvos de abuso.
- Observability/telemetria: falta integração com metrics (Prometheus), tracing e logs estruturados.
- Backups e estratégia de produção para Mongo: o README indica uso de `MONGO_URL`, mas não há scripts para dump/restore, nem instruções de migração/versão do schema.
- Testes: existem testes básicos (create, markAsRead, pagination) mas cobertura e mocks poderiam ser ampliados (ex.: testes de falhas, testes de integração contra um Mongo real em CI).
- Deploy/infra: falta Dockerfile / docker-compose / templates para deploy (k8s/Heroku). O projeto depende do runtime Meteor local na máquina do desenvolvedor.
- Segurança: falta CORS fino, proteção CSRF, validação de input anti-injection e headers de segurança.
- Operações em lote e webhooks: não há suporte para criação em lote nem envio de webhooks/integração com filas (ex.: RabbitMQ, Redis queues) para processamento assíncrono.

### Contagem de notificações não lidas (Redis)

Uma melhoria que não foi implementada por falta de tempo, mas que seria um diferencial operacional, é o uso de Redis como contador rápido das notificações não lidas por usuário.

- Por que usar Redis?
   - Performance: contar documentos no Mongo com filtros (ex.: { userId, read: false, deleted: false }) em alto tráfego pode ser custoso. Redis permite manter um contador por usuário (ex.: key `unread:user:{userId}`) com operações atômicas INCR/DECR muito rápidas.
   - Latência baixa: respostas que exibem apenas o número de não lidas (badge) ficam instantâneas, sem precisar de agregações no banco primário.
   - Escalabilidade: reduz carga de leitura no Mongo quando muitos clientes ou dashboards pedem apenas o total de não lidas.

- Como funcionaria (resumo de implementação)
1. No fluxo de criação de notificação (POST), além de persistir no Mongo, executar INCR na chave Redis do usuário.

2. Ao marcar como lida (PATCH) ou deletar (DELETE), executar DECR (ou set explicitamente após recalcular) garantindo que o contador não fique negativo.

3. Periodicamente (ou sob demanda) reconciliar contadores com agregações Mongo (cron job) para corrigir eventuais divergências (eventual consistency).

4. Opcional: usar Pub/Sub do Redis para emitir eventos que o frontend possa assinar (via um gateway WebSocket) para updates em tempo real do badge.

#### Decisão tomada

Por limitação de tempo e escopo do MVP, decidi não adicionar Redis neste momento — priorizei um caminho simples e confiável usando apenas Mongo. Ainda assim, recomendo o Redis como próximo passo de performance quando o serviço estiver com carga maior ou quando badges de não lidas tiverem alto tráfego.

## Próximos passos sugeridos

1. Autenticação & autorização (prioridade alta)
   - Adicionar JWT/OAuth para proteger endpoints (ou usar accounts do Meteor com token-based auth).
   - Autorizar apenas usuários/serviços permitidos para criar/deletar/consultar notificações.

2. Validação de entrada declarativa
   - Introduzir Zod/JOI/AJV para validar payloads nas rotas e retornar erros consistentes.

3. Hardening e rate limiting
   - Adicionar middleware de rate limiting (ex.: express-rate-limit ou similar para o stack usado).
   - Bloqueio por IP/usuário e alertas para padrões suspeitos.

4. Observability e métricas
   - Integrar logs estruturados (p.ex. pino/winston), métricas básicas (Prometheus) e tracing (OpenTelemetry).

5. Dockerização e CI
   - Adicionar `Dockerfile` e `docker-compose.yml` para facilitar desenvolvimento e CI.
   - Criar pipeline CI que execute `meteor npm test` e, se possível, rode testes de integração contra uma instância Mongo ephemeral.

6. Backups e produção do Mongo
   - Documentar e/ou automatizar dump/restore (`mongodump`/`mongorestore`) e recomendar uso de replica set / MongoDB Atlas.

7. Melhorar testes
   - Cobertura maior: falhas, edge-cases, mocks do repositório e testes end-to-end.

8. Real-time (opcional)
   - Se necessário, adicionar publicação DDP/WebSocket para notificar clientes em tempo real quando novas notificações chegarem.

9. API Catalog / contract testing
   - Gerar collection para Postman/Insomnia e adicionar testes de contrato (ex.: Pact) para evitar regressões entre frontend e backend.
