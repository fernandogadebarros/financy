# Financy — Frontend

Interface web do Financy, aplicação de controle financeiro pessoal. Permite gerenciar receitas, despesas e categorias através de uma SPA React conectada à API GraphQL.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + Vite |
| Linguagem | TypeScript 5 (strict) |
| Estilo | Tailwind CSS v4 + Radix UI |
| Formulários | React Hook Form + Zod |
| Server state | TanStack Query v5 |
| Client state | Zustand (auth) |
| API | GraphQL via `graphql-request` |
| Roteamento | React Router v7 |

## Estrutura

```
src/
├── core/
│   ├── api/            # graphqlClient configurado com Authorization header
│   ├── components/ui/  # Componentes base (Dialog, Select, Input, DatePicker...)
│   └── utils/          # Formatadores de valor e data
└── features/
    ├── auth/           # Login, registro, store Zustand, hooks de mutation
    ├── categories/     # CRUD de categorias com ícone e cor
    ├── transactions/   # CRUD de transações com tipo, valor e categoria
    ├── dashboard/      # Visão geral com resumo financeiro
    └── profile/        # Edição de nome do usuário
```

Cada feature segue a estrutura:

```
feature/
├── components/   # Componentes específicos da feature
├── graphql/      # Queries e mutations GQL
├── hooks/        # Hooks TanStack Query (useQuery / useMutation)
├── pages/        # Páginas roteadas
├── schemas/      # Schemas Zod para validação de formulários
└── types/        # Tipos TypeScript da feature
```

## Como rodar

### Pré-requisitos

- Node.js 20+
- Backend rodando em `http://localhost:4000/graphql` (ver `../backend`)

### Instalação

```bash
npm install
```

### Configuração

Copie o arquivo de exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

Variáveis disponíveis:

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Desenvolvimento

```bash
npm run dev
```

Acesse em `http://localhost:5173`.

### Build de produção

```bash
npm run build
npm run preview
```

## Autenticação

O token JWT é armazenado no `localStorage` pela store Zustand (`authStore`). O `graphqlClient` injeta o header `Authorization: Bearer <token>` automaticamente em todas as requisições via `requestMiddleware`.

Rotas protegidas redirecionam para `/login` se não houver token válido.

## Formulários e validação

Todos os formulários usam React Hook Form com resolver Zod. Os schemas Zod são a **fonte única de verdade** para tipos de formulário — os tipos TypeScript são derivados via `z.infer<typeof schema>`.

Exemplo:
```ts
// schema define validação + tipo
export const categorySchema = z.object({ ... })
export type CategoryFormData = z.infer<typeof categorySchema>

// componente usa o tipo inferido
useForm<CategoryFormData>({ resolver: zodResolver(categorySchema) })
```

## GraphQL Codegen

O projeto está configurado com `@graphql-codegen` para gerar tipos a partir do schema do backend:

```bash
npm run codegen        # gera uma vez
npm run codegen:watch  # observa mudanças
```

Os arquivos gerados ficam em `src/gql/` (não editar manualmente).
