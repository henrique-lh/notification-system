# Notifications API

Este repositório contém a API de notificações (Meteor) usada pelo frontend do projeto.

## Visão geral

A API expõe endpoints REST para criar, listar, marcar como lida e deletar notificações.
Principais responsabilidades:

- `imports/api/notifications/*` — código da API (rotas, controller, service, repositório, coleções, métodos e publicações).
- `server/main.js` — bootstrap do servidor Meteor.

Base tecnológica: Meteor (Node.js), usando rotas e um pequeno serviço que isola a lógica de negócio.

## Requisitos

- Node.js (compatível com a versão usada pelo Meteor local)
- Meteor (instalar via https://www.meteor.com/install)

Recomendo instalar o Meteor globalmente antes de rodar a aplicação.

## Rodando localmente

1. Instale o Meteor (se ainda não tiver):

```bash
# Linux / macOS (exemplo):
curl https://install.meteor.com/ | sh
```

2. Na pasta do backend (`notifications-api`), rode o servidor com as configurações:

```bash
cd /home/henrique/projects/notification-system/notifications-api
meteor npm install
meteor run --settings settings.json --port 8888
```

O comando acima inicia a API em http://localhost:8888 . Ajuste `--port` se precisar usar outra porta, no entanto, lembre-se de alterar as requisções cURL nos exemplos abaixo.

> Observação: o `settings.json` é carregado pelo Meteor como settings públicos e privados. Verifique o arquivo `settings.json` na raiz do projeto para chaves/variáveis necessárias.

## Endpoints (exemplos)

Criação de notificação (POST)

```bash
curl --request POST \
	--url http://localhost:8888/api/notifications \
	--header 'content-type: application/json' \
	--data '{
	"userId": "user123",
	"title": "another!",
	"message": "Sua conta foi criada com sucesso"
}'
```

Listar notificações por usuário (GET)

```bash
curl --request GET \
	--url http://localhost:8888/api/notifications/user/user123
```

Marcar notificação como lida (PATCH)

```bash
curl --request PATCH \
	--url http://localhost:8888/api/notifications/{notificationId}/read
```

Deletar notificação (DELETE)

```bash
curl --request DELETE \
	--url http://localhost:8888/api/notifications/{notificationId}
```

### Exemplo de resposta (GET /api/notifications/user/user456)

```json
{
	"data": [
		{
			"_id": "DJ7iqTpzEoiQppCnu",
			"userId": "user456",
			"title": "oi",
			"message": "oi",
			"read": false,
			"deleted": false,
			"createdAt": "2025-11-26T22:13:02.099Z"
		},
		{
			"_id": "vMtYBK9GxqwEifjNH",
			"userId": "user456",
			"title": "teste",
			"message": "teste",
			"read": false,
			"deleted": false,
			"createdAt": "2025-11-26T22:09:34.594Z"
		}
	],
	"total": 2,
	"page": 1,
	"pageSize": 20
}
```

## Testes

Existem testes automatizados sob a pasta `tests/`.

- Rodar testes unitários/integração uma vez:

```bash
cd /home/henrique/projects/notification-system/notifications-api
meteor test --once --driver-package=meteortesting:mocha --port 8888
```

Os testes de exemplo existentes são:

- `tests/server/notifications.create.test.js`
- `tests/server/notifications.markAsRead.test.js`
- `tests/server/notifications.paginated.test.js`

## Decisões arquiteturais e organização do código

O diretório relevante é `imports/api/notifications` e contém a separação de responsabilidades adotada:

- `collection.js` — definição da coleção (Mongo) e índices.
- `repository.js` — camada de acesso a dados (CRUD direto com a coleção). Mantém a lógica de armazenamento isolada.
- `service.js` — regras de negócio, composição de chamadas ao repositório e validações de alto nível.
- `controller.js` — orquestra requisições/response, validações de entrada e mapping entre HTTP e serviço.
- `routes.js` — expõe rotas REST (POST, GET, PATCH, DELETE) usando o middleware `utils/jsonMiddleware.js`.
- `methods.js` — métodos Meteor (caso usados para RPC/internal) — mantidos para compatibilidade com features Meteor.
- `publications.js` — publicações Meteor (se houver uso via DDP).
- `errors.js` — tipos de erro customizados e helpers para responses padronizados.

Essa separação facilita testes unitários (mock do repositório x service) e permite trocar a forma de persistência sem alterar o controller/rotas.

### Middleware

- `imports/api/notifications/utils/jsonMiddleware.js` — middleware simples para garantir que o body seja JSON e padronizar o parse/response.

### Banco de dados

Esta API utiliza MongoDB através do pacote integrado do Meteor (`Mongo`). Em desenvolvimento o Meteor inicia uma instância local do MongoDB automaticamente e os dados ficam alojados na pasta interna do projeto (ex.: `.meteor/local/db`).

Para produção, você deve apontar para um servidor MongoDB externo definindo a variável de ambiente `MONGO_URL` antes de iniciar a aplicação. Além disso, os índices principais das coleções são definidos em `imports/api/notifications/collection.js` para garantir consultas rápidas (especialmente nas rotas de listagem paginada).

Exemplo — rodando em produção com um Mongo externo:

```bash
export MONGO_URL="mongodb://username:password@mongo.example.com:27017/notifications-db"
meteor run --production --port 8888
```

> Observação: usar o banco local do Meteor é conveniente para desenvolvimento, mas não é recomendado para ambientes de produção pela falta de redundância/replicação.

## Observações operacionais

- CORS: se for acessar essa API a partir de um frontend hospedado em outro domínio/porta, habilite CORS no servidor (ou use um proxy no desenvolvimento). O código atual já utiliza um middleware JSON — ver `routes.js` para comportamentos específicos.
- Logs/monitoramento: para produção, ajuste variáveis de ambiente e considere rotinas de monitoração (Prometheus/Log aggregation).
