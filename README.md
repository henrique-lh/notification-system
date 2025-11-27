# Sistema de Notificações

Este repositório contém uma aplicação de demonstração para gerenciamento de notificações composta por um backend (API construída com Meteor) e um frontend (React + Vite + Tailwind).

## Visão geral e objetivo

O objetivo deste projeto é fornecer uma API simples para criação, listagem, marcação como lida e exclusão de notificações, além de um frontend leve que permite visualizar e gerenciar essas notificações por usuário.

Casos de uso cobertos
- Criar uma notificação para um usuário (POST /api/notifications)
- Listar notificações por usuário (GET /api/notifications/user/{userId})
- Marcar notificação como lida (PATCH /api/notifications/{id}/read)
- Deletar notificação (DELETE /api/notifications/{id})

## O que foi feito

- Backend (`notifications-api`)
	- Endpoints REST para criar, listar, marcar como lida e deletar notificações.
	- Organização em camadas: `controller`, `service`, `repository`, `collection` e `routes` para separar responsabilidades e facilitar testes.
	- Testes automatizados básicos localizados em `notifications-api/tests/` (create, markAsRead, pagination).
	- `NOTES.md` e `README.md` com instruções, trade-offs e próximos passos (ex.: uso de Redis sugerido para contagem de não lidas).

- Frontend (`frontend`)
	- App React (Vite) com Tailwind CSS que permite: criar notificações, listar por usuário, marcar como lida e deletar.
	- Persistência simples de usuários e usuário selecionado em `localStorage`.
	- Componentes principais: `App.jsx`, `UserSelector.jsx`, `NotificationList.jsx`, `CreateNotificationModal.jsx`.
	- Estilização moderna (fonte Inter/Poppins, gradientes, cartões) e um favicon.
	- `NOTES.md` e `README.md` documentando decisões arquiteturais e próximos passos.

## Como rodar localmente

Veja `notifications-api/README.md` e `frontend/README.md` para rodar a aplicação localmente e exemplos de requisição ao backend
