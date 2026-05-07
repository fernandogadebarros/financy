import { describe, expect, it } from "vitest"
import { loginSchema, registerSchema, updateMeSchema } from "../auth.validator.js"

describe("registerSchema", () => {
  it("accepts a valid payload", () => {
    const result = registerSchema.parse({
      name: "  Alice  ",
      email: "  Alice@Example.com ",
      password: "longenough",
    })
    expect(result.name).toBe("Alice")
    expect(result.email).toBe("alice@example.com")
  })

  it("rejects empty name", () => {
    expect(() => registerSchema.parse({ name: "  ", email: "a@b.com", password: "longenough" })).toThrow()
  })

  it("rejects invalid email", () => {
    expect(() => registerSchema.parse({ name: "A", email: "no-at", password: "longenough" })).toThrow()
  })

  it("rejects short password", () => {
    expect(() => registerSchema.parse({ name: "A", email: "a@b.com", password: "short" })).toThrow()
  })

  it("rejects password longer than 72 chars (bcrypt limit)", () => {
    expect(() => registerSchema.parse({ name: "A", email: "a@b.com", password: "x".repeat(73) })).toThrow()
  })
})

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.parse({ email: "a@b.com", password: "anything" })
    expect(result.email).toBe("a@b.com")
  })

  it("rejects empty password", () => {
    expect(() => loginSchema.parse({ email: "a@b.com", password: "" })).toThrow()
  })
})

describe("updateMeSchema", () => {
  it("rejects empty name", () => {
    expect(() => updateMeSchema.parse({ name: "" })).toThrow()
    expect(() => updateMeSchema.parse({ name: "   " })).toThrow()
  })

  it("trims and accepts valid name", () => {
    const result = updateMeSchema.parse({ name: "  Bob  " })
    expect(result.name).toBe("Bob")
  })
})
