import { describe, expect, it } from "vitest"
import jwt from "jsonwebtoken"
import { signToken, verifyToken } from "../jwt.js"

describe("jwt utils", () => {
  it("signs a token and verifies it back to the same payload", () => {
    const token = signToken({ userId: "user-1", email: "alice@example.com" })
    const payload = verifyToken(token)
    expect(payload.userId).toBe("user-1")
    expect(payload.email).toBe("alice@example.com")
  })

  it("throws when the token is signed with a different secret", () => {
    const token = jwt.sign({ userId: "u", email: "a@b.com" }, "another-secret-32-chars-xxxxxxxxxx", {
      expiresIn: "1h",
    })
    expect(() => verifyToken(token)).toThrow()
  })

  it("throws when the payload shape is invalid", () => {
    const token = jwt.sign({ foo: "bar" }, process.env.JWT_SECRET!, { expiresIn: "1h" })
    expect(() => verifyToken(token)).toThrow()
  })

  it("throws when the email is malformed", () => {
    const token = jwt.sign({ userId: "u", email: "not-an-email" }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    })
    expect(() => verifyToken(token)).toThrow()
  })

  it("throws when the token is expired", () => {
    const token = jwt.sign({ userId: "u", email: "a@b.com" }, process.env.JWT_SECRET!, {
      expiresIn: -10,
    })
    expect(() => verifyToken(token)).toThrow()
  })
})
