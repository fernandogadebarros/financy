import { describe, it, expect } from "vitest"
import { ClientError } from "graphql-request"
import type { GraphQLError } from "graphql"
import { getErrorMessage } from "../errors"

describe("getErrorMessage", () => {
  it("maps known GraphQL message via dictionary", () => {
    const error = buildClientError("Invalid credentials")
    expect(getErrorMessage(error, "fallback")).toBe("E-mail ou senha inválidos")
  })

  it("returns raw GraphQL message when not in dictionary", () => {
    const error = buildClientError("Email already taken")
    expect(getErrorMessage(error, "fallback")).toBe("Email already taken")
  })

  it("returns Error.message when given a regular Error", () => {
    expect(getErrorMessage(new Error("boom"), "fallback")).toBe("boom")
  })

  it("returns the string when given a string", () => {
    expect(getErrorMessage("oops", "fallback")).toBe("oops")
  })

  it("returns fallback when error type is unknown", () => {
    expect(getErrorMessage(undefined, "fallback")).toBe("fallback")
    expect(getErrorMessage(123, "fallback")).toBe("fallback")
  })
})

function buildClientError(message: string): ClientError {
  return new ClientError(
    {
      data: null,
      errors: [{ message } as GraphQLError],
      status: 400,
      headers: new Headers(),
      body: JSON.stringify({ errors: [{ message }] }),
    },
    { query: "" }
  )
}
