import { GraphQLError } from "graphql"
import type { ZodSchema } from "zod"
import { ZodError } from "zod"

export function parseOrThrow<T>(schema: ZodSchema<T>, value: unknown): T {
  const result = schema.safeParse(value)
  if (result.success) return result.data

  throw new GraphQLError("Invalid input", {
    extensions: {
      code: "BAD_USER_INPUT",
      issues: result.error.issues.map(i => ({ path: i.path.join("."), message: i.message })),
    },
  })
}

export function isZodError(err: unknown): err is ZodError {
  return err instanceof ZodError
}
