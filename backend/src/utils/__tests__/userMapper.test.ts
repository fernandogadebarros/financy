import { describe, expect, it } from "vitest"
import { toUserModel, USER_PUBLIC_SELECT } from "../userMapper.js"

describe("toUserModel", () => {
  it("returns only public fields", () => {
    const result = toUserModel({
      id: "u1",
      name: "Alice",
      email: "alice@example.com",
      createdAt: new Date("2025-01-01"),
    })
    expect(result).toEqual({
      id: "u1",
      name: "Alice",
      email: "alice@example.com",
      createdAt: new Date("2025-01-01"),
    })
  })

  it("never leaks a password field even if upstream caller passes one", () => {
    const result = toUserModel({
      id: "u1",
      name: "Alice",
      email: "alice@example.com",
      createdAt: new Date("2025-01-01"),
      ...({ password: "leaked-hash" } as Record<string, string>),
    } as never)
    expect(result).not.toHaveProperty("password")
  })
})

describe("USER_PUBLIC_SELECT", () => {
  it("does not include password", () => {
    expect(USER_PUBLIC_SELECT).not.toHaveProperty("password")
  })

  it("includes the public fields", () => {
    expect(USER_PUBLIC_SELECT).toMatchObject({
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    })
  })
})
