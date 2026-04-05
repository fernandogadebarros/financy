import "reflect-metadata"
import "dotenv/config"
import express from "express"
import cors from "cors"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@as-integrations/express5"
import { buildSchema } from "type-graphql"
import { AuthResolver } from "./resolvers/auth.resolver.js"
import { CategoryResolver } from "./resolvers/category.resolver.js"
import { TransactionResolver } from "./resolvers/transaction.resolver.js"
import { buildContext } from "./graphql/context.js"

async function bootstrap() {
  const app = express()

  app.use(cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }))

  const schema = await buildSchema({
    resolvers: [AuthResolver, CategoryResolver, TransactionResolver],
    validate: false,
    emitSchemaFile: "./schema.graphql",
  })

  const server = new ApolloServer({ schema })

  await server.start()

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, { context: buildContext })
  )

  const PORT = Number(process.env.PORT) ?? 4000

  app.listen({ port: PORT }, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`)
  })
}

bootstrap()
