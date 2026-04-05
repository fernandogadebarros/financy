import { GraphQLError } from "graphql"
import type { MiddlewareFn } from "type-graphql"
import type { GraphqlContext } from "../graphql/context.js"

export const IsAuth: MiddlewareFn<GraphqlContext> = async ({ context }, next) => {
  if (!context.userId) {
    throw new GraphQLError("Not authenticated", { extensions: { code: "UNAUTHENTICATED" } })
  }
  return next()
}
