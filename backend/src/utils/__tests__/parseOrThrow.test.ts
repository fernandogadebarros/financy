import { describe, expect, it } from "vitest"
import { z } from "zod"
import { GraphQLError } from "graphql"
import { parseOrThrow } from "../parseOrThrow.js"

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().positive(),
})

describe("parseOrThrow", () => {
  it("returns the parsed data on success", () => {
    const result = parseOrThrow(schema, { email: "x@y.com", age: 30 })
    expect(result).toEqual({ email: "x@y.com", age: 30 })
  })

  it("throws a GraphQLError with BAD_USER_INPUT and lists all issues", () => {
    try {
      parseOrThrow(schema, { email: "no-at-sign", age: -1 })
      throw new Error("should have thrown")
    } catch (err) {
      expect(err).toBeInstanceOf(GraphQLError)
      const gqlError = err as GraphQLError
      expect(gqlError.extensions?.code).toBe("BAD_USER_INPUT")
      const issues = gqlError.extensions?.issues as Array<{ path: string; message: string }>
      expect(issues).toHaveLength(2)
      expect(issues.map(i => i.path).sort()).toEqual(["age", "email"])
    }
  })
})
