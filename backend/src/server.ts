import "reflect-metadata"
import express, { type ErrorRequestHandler } from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { pinoHttp } from "pino-http"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@as-integrations/express5"
import { buildSchema } from "type-graphql"
import { env, corsOrigins } from "./config.js"
import { logger } from "./logger.js"
import prisma from "./prisma.js"
import { AuthResolver } from "./resolvers/auth.resolver.js"
import { CategoryResolver } from "./resolvers/category.resolver.js"
import { TransactionResolver } from "./resolvers/transaction.resolver.js"
import { buildContext } from "./graphql/context.js"

const SAFE_GRAPHQL_ERROR_CODES = new Set([
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "BAD_USER_INPUT",
  "CONFLICT",
  "GRAPHQL_VALIDATION_FAILED",
  "GRAPHQL_PARSE_FAILED",
])

async function bootstrap() {
  const app = express()
  const isProduction = env.NODE_ENV === "production"

  app.use(helmet())
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || corsOrigins.includes(origin)) return cb(null, true)
        cb(new Error("CORS blocked"))
      },
      credentials: true,
    }),
  )
  app.use(pinoHttp({ logger }))

  app.get("/healthz", (_req, res) => {
    res.json({ ok: true })
  })

  const schema = await buildSchema({
    resolvers: [AuthResolver, CategoryResolver, TransactionResolver],
    validate: false,
    emitSchemaFile: "./schema.graphql",
  })

  const apollo = new ApolloServer({
    schema,
    includeStacktraceInErrorResponses: !isProduction,
    formatError: (formatted, _error) => {
      const code = formatted.extensions?.code
      if (isProduction && (typeof code !== "string" || !SAFE_GRAPHQL_ERROR_CODES.has(code))) {
        return {
          message: "Internal server error",
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        }
      }
      return formatted
    },
  })

  await apollo.start()

  const graphqlLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  })

  app.use(
    "/graphql",
    graphqlLimiter,
    express.json({ limit: env.BODY_LIMIT }),
    expressMiddleware(apollo, { context: buildContext }),
  )

  const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    req.log?.error({ err }, "express.error")
    if (isProduction) {
      res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR" } })
      return
    }
    res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", message: err instanceof Error ? err.message : "Unknown error" },
    })
  }
  app.use(errorHandler)

  const httpServer = app.listen({ port: env.PORT }, () => {
    logger.info({ port: env.PORT }, "server.ready")
  })

  let shuttingDown = false
  async function shutdown(signal: string) {
    if (shuttingDown) return
    shuttingDown = true
    logger.info({ signal }, "server.shutdown.start")
    httpServer.close()
    try {
      await apollo.stop()
      await prisma.$disconnect()
    } catch (err) {
      logger.error({ err }, "server.shutdown.error")
    }
    logger.info("server.shutdown.done")
    process.exit(0)
  }

  process.on("SIGTERM", () => void shutdown("SIGTERM"))
  process.on("SIGINT", () => void shutdown("SIGINT"))
}

bootstrap().catch(err => {
  logger.fatal({ err }, "server.bootstrap.failed")
  process.exit(1)
})
