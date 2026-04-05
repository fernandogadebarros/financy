# Financy

Aplicação de gestão de finanças pessoais com backend GraphQL e frontend React.

## Stack

- **Backend:** Node.js, Express, Apollo Server, TypeGraphQL, Prisma (SQLite)
- **Frontend:** React 19, Vite, TailwindCSS, GraphQL Request, Zustand, React Query

---

## Rodando localmente

### Pré-requisitos

- Node.js 20+
- npm

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
JWT_SECRET=sua_chave_secreta_aqui
DATABASE_URL="file:./dev.db"
PORT=4000
CORS_ORIGIN="http://localhost:5173"
```

Instale as dependências, rode as migrations e inicie o servidor:

```bash
npm install
npm run prisma:migrate
npm run dev
```

O backend estará disponível em: `http://localhost:4000/graphql`

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

O frontend estará disponível em: `http://localhost:5173`

---

## Rodando com Docker

### Pré-requisitos

- Docker
- Docker Compose

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
JWT_SECRET=sua_chave_secreta_aqui
DATABASE_URL="file:./dev.db"
CORS_ORIGIN="http://localhost:5174"
VITE_BACKEND_URL="http://localhost:4001/graphql"
```

### 3. Suba os containers

```bash
docker compose up --build
```

| Serviço  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost:5174            |
| Backend  | http://localhost:4001/graphql    |

### Parar os containers

```bash
docker compose down
```

Para remover também o volume do banco de dados:

```bash
docker compose down -v
```
