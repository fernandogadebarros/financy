import { describe, expect, it } from "vitest"
import { env, corsOrigins } from "../config.js"

describe("config", () => {
  it("loads env in test mode with sane defaults", () => {
    expect(env.NODE_ENV).toBe("test")
    expect(env.JWT_SECRET.length).toBeGreaterThanOrEqual(32)
    expect(env.PORT).toBeTypeOf("number")
    expect(env.BCRYPT_COST).toBeGreaterThanOrEqual(4)
  })

  it("derives corsOrigins from CORS_ORIGIN", () => {
    expect(Array.isArray(corsOrigins)).toBe(true)
    expect(corsOrigins.length).toBeGreaterThan(0)
  })
})
