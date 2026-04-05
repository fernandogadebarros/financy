import { createParameterDecorator, type ResolverData } from "type-graphql"
import type { GraphqlContext } from "../context.js"
import prisma from "../../prisma.js"

export function GqlUser() {
  return createParameterDecorator(
    async ({ context }: ResolverData<GraphqlContext>) => {
      if (!context.userId) return null
      return prisma.user.findUnique({ where: { id: context.userId } })
    }
  )
}
