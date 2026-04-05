# Financy — Backend

API GraphQL do Financy, aplicação de controle financeiro pessoal. Fornece autenticação JWT e operações CRUD para categorias e transações.

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 24 |
| Framework | Express 5 |
| GraphQL | Apollo Server 5 + TypeGraphQL 2 |
| ORM | Prisma 6 |
| Banco de dados | SQLite |
| Autenticação | JWT (`jsonwebtoken`) |
| Linguagem | TypeScript 5 (strict) |

## Estrutura

```
src/
├── server.ts              # Ponto de entrada — Express + Apollo Server
├── prisma.ts              # Instância singleton do PrismaClient
├── models/                # Classes @ObjectType do TypeGraphQL (schema GraphQL)
│   ├── user.model.ts
│   ├── category.model.ts
│   └── transaction.model.ts
├── resolvers/             # Classes @Resolver com queries e mutations
│   ├── auth.resolver.ts
│   ├── category.resolver.ts
│   └── transaction.resolver.ts
├── services/              # Lógica de negócio e acesso ao Prisma
│   ├── auth.service.ts
│   ├── category.service.ts
│   └── transaction.service.ts
├── dtos/
│   ├── input/             # Classes @InputType para argumentos das mutations
│   └── output/            # Classes @ObjectType para respostas compostas
├── graphql/
│   ├── context.ts         # Extrai userId do JWT e injeta no contexto GraphQL
│   └── decorators/        # @GqlUser() — extrai o usuário autenticado no resolver
├── middlewares/
│   └── auth.middleware.ts # IsAuth — verifica userId no contexto antes de executar
├── utils/
│   └── jwt.ts             # signToken / verifyToken com validação de env
└── prisma/
    └── schema.prisma      # Modelos User, Category, Transaction
```

## Como rodar

### Pré-requisitos

- Node.js 20+

### Instalação

```bash
npm install
```

### Configuração

```bash
cp .env.example .env
```

Variáveis necessárias:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta"
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

### Banco de dados

```bash
npm run prisma:migrate   # aplica migrações
npm run prisma:generate  # gera o Prisma Client
npm run prisma:studio    # abre o Prisma Studio (opcional)
```

### Desenvolvimento

```bash
npm run dev
```

API disponível em `http://localhost:4000/graphql`.

### Build de produção

```bash
npm run build
npm start
```

## Autenticação

O fluxo de autenticação usa JWT:

1. `register` / `login` retornam um `AuthPayload` com `token` e `user`
2. O cliente envia `Authorization: Bearer <token>` em todas as requisições
3. `buildContext` (`graphql/context.ts`) extrai e verifica o token, adicionando `userId` ao contexto
4. O middleware `IsAuth` bloqueia resolvers protegidos se `userId` estiver ausente
5. O decorator `@GqlUser()` resolve o usuário completo a partir do `userId` no contexto

## TypeGraphQL + tsx

O projeto usa `tsx` para desenvolvimento, que transpila via esbuild. Como o esbuild **não emite `emitDecoratorMetadata`**, todos os decorators `@Field()`, `@Arg()` e `@Query()`/`@Mutation()` precisam de tipos explícitos:

```ts
// correto — tipo explícito necessário com tsx
@Field(() => String)
name!: string

// incorreto — falha em runtime com tsx
@Field()
name!: string
```

## Schema GraphQL

O schema é gerado automaticamente pelo TypeGraphQL ao iniciar o servidor e emitido em `schema.graphql` na raiz do projeto. Os nomes dos tipos GraphQL são configurados explicitamente nos models onde necessário:

```ts
@ObjectType("Category")   // GraphQL type: Category (não CategoryModel)
export class CategoryModel { ... }
```

## Notas sobre o banco

O Prisma schema usa `type String` para o campo `Transaction.type` (não um enum Prisma). A conversão para o enum TypeScript `TransactionType` é feita na camada de serviço via `toTransactionType()`, que valida o valor em runtime e lança erro se inválido.
