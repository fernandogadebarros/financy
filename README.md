# Financy

> Desafio prático da Fase 3 — Pós-graduação em Engenharia de Software pela **[Rocketseat](https://rocketseat.com.br)**

Financy é uma aplicação web de **gestão de finanças pessoais** que permite ao usuário registrar receitas e despesas, organizá-las por categorias customizadas e acompanhar sua saúde financeira através de um dashboard com resumos visuais.

---

## Propósito

O projeto foi desenvolvido como desafio prático avaliativo da pós-graduação, com o objetivo de demonstrar domínio de uma stack fullstack moderna: API GraphQL com autenticação JWT no backend e interface React com gerenciamento de estado e queries reativas no frontend.

---

## Stack

### Backend

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express 5 |
| API | GraphQL · Apollo Server 5 · TypeGraphQL 2 |
| ORM | Prisma 6 |
| Banco de dados | SQLite (dev) |
| Autenticação | JWT (`jsonwebtoken`) · bcrypt |
| Validação | Zod 3 |
| Observabilidade | Pino |
| Linguagem | TypeScript 5 (strict) |
| Testes | Vitest 2 |

### Frontend

| Camada | Tecnologia |
|---|---|
| Framework | React 19 · Vite |
| Linguagem | TypeScript 5 (strict) |
| Estilização | Tailwind CSS |
| GraphQL Client | GraphQL Request |
| Estado global | Zustand |
| Queries / Cache | TanStack Query (React Query) |
| Formulários | React Hook Form · Zod |
| Componentes UI | Radix UI · Lucide Icons |
| Testes | Vitest · Testing Library |

---

## Telas e fluxos

### Autenticação

O acesso à aplicação é protegido por autenticação JWT. O usuário não autenticado é redirecionado para o fluxo de entrada.

- **Registro** — criação de conta com nome, e-mail e senha; retorna token e redireciona para o dashboard.
- **Login** — autenticação com e-mail e senha; token armazenado no estado global (Zustand).

### Dashboard

Visão geral da saúde financeira do usuário:

- Cards de **saldo total**, **receitas do mês** e **despesas do mês**.
- Gráfico de distribuição de gastos por categoria (total e contagem de transações).
- Lista das **transações mais recentes**.

### Transações

Gerenciamento completo das movimentações financeiras:

- Listagem paginada com **filtros** por tipo (receita / despesa), categoria e período.
- Criação, edição e exclusão de transações via modal.
- Cada transação tem título, valor, tipo (INCOME / EXPENSE), data e categoria vinculada.

### Categorias

Organização personalizada das transações:

- Listagem de categorias do usuário com contador de transações associadas.
- Criação e edição via modal com nome, ícone e cor customizável (hex).
- Exclusão de categorias (com cascade nas transações).

### Perfil

Gerenciamento da conta:

- Exibição dos dados do usuário (nome, e-mail e avatar com iniciais).
- Edição do nome via formulário validado.
- Botão de logout com limpeza do estado global e redirecionamento.

---

## Rodando localmente

### Pré-requisitos

- Node.js 20+
- npm ou pnpm

### 1. Clone o repositório

```bash
git clone https://github.com/fernandogadebarros/financy.git
cd financy
```

### 2. Configure o Backend

```bash
cd backend
cp .env.example .env
```

Edite o `.env` com seus valores:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=sua_chave_secreta_com_pelo_menos_32_caracteres
PORT=4000
CORS_ORIGIN="http://localhost:5173"
```

Instale as dependências, rode as migrations e inicie:

```bash
npm install
npm run prisma:migrate
npm run dev
```

Backend disponível em `http://localhost:4000/graphql`

### 3. Configure o Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env
```

Edite o `.env`:

```env
VITE_BACKEND_URL="http://localhost:4000/graphql"
```

Instale as dependências e inicie:

```bash
npm install
npm run dev
```

Frontend disponível em `http://localhost:5173`

---

## Rodando com Docker

### Pré-requisitos

- Docker e Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/fernandogadebarros/financy.git
cd financy
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` na raiz:

```env
JWT_SECRET=sua_chave_secreta_com_pelo_menos_32_caracteres
DATABASE_URL="file:./dev.db"
CORS_ORIGIN="http://localhost:5174"
VITE_BACKEND_URL="http://localhost:4001/graphql"
```

### 3. Suba os containers

```bash
docker compose up --build
```

| Serviço  | URL                           |
|----------|-------------------------------|
| Frontend | http://localhost:5174         |
| Backend  | http://localhost:4001/graphql |

### Parar os containers

```bash
docker compose down
```

Para remover também o volume do banco de dados:

```bash
docker compose down -v
```

---

## Testes

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```s