import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { GraphQLError } from "graphql"

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock("../../prisma.js", () => ({ default: prismaMock }))

vi.mock("../../utils/jwt.js", () => ({
  signToken: vi.fn(() => "signed-token"),
  verifyToken: vi.fn(),
}))

const { authService } = await import("../auth.service.js")

const VALID_REGISTER = {
  name: "Alice",
  email: "alice@example.com",
  password: "longenough",
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("AuthService.register", () => {
  it("creates the user and returns AuthPayload without password", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    prismaMock.user.create.mockResolvedValue({
      id: "u1",
      name: "Alice",
      email: "alice@example.com",
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    })

    const result = await authService.register(VALID_REGISTER)

    expect(result.token).toBe("signed-token")
    expect(result.user).toEqual({
      id: "u1",
      name: "Alice",
      email: "alice@example.com",
      createdAt: new Date("2025-01-01"),
    })
    expect(result.user).not.toHaveProperty("password")

    const createCall = prismaMock.user.create.mock.calls[0]?.[0]
    expect(createCall.select).not.toHaveProperty("password")
    expect(createCall.data.password).not.toBe("longenough")
  })

  it("rejects duplicate email with CONFLICT", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "u1", email: "alice@example.com" })

    await expect(authService.register(VALID_REGISTER)).rejects.toMatchObject({
      extensions: { code: "CONFLICT" },
    })
    expect(prismaMock.user.create).not.toHaveBeenCalled()
  })

  it("rejects invalid email with BAD_USER_INPUT", async () => {
    await expect(
      authService.register({ ...VALID_REGISTER, email: "not-an-email" }),
    ).rejects.toMatchObject({ extensions: { code: "BAD_USER_INPUT" } })
  })

  it("rejects short password with BAD_USER_INPUT", async () => {
    await expect(
      authService.register({ ...VALID_REGISTER, password: "short" }),
    ).rejects.toMatchObject({ extensions: { code: "BAD_USER_INPUT" } })
  })
})

describe("AuthService.login", () => {
  it("returns AuthPayload on valid credentials", async () => {
    const bcrypt = (await import("bcryptjs")).default
    const hashed = await bcrypt.hash("longenough", 4)
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      name: "Alice",
      email: "alice@example.com",
      password: hashed,
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    })

    const result = await authService.login({
      email: "alice@example.com",
      password: "longenough",
    })

    expect(result.token).toBe("signed-token")
    expect(result.user.id).toBe("u1")
    expect(result.user).not.toHaveProperty("password")
  })

  it("rejects unknown email with UNAUTHENTICATED (does not leak existence)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    await expect(
      authService.login({ email: "nobody@example.com", password: "whatever" }),
    ).rejects.toMatchObject({ extensions: { code: "UNAUTHENTICATED" } })
  })

  it("rejects wrong password with UNAUTHENTICATED", async () => {
    const bcrypt = (await import("bcryptjs")).default
    const hashed = await bcrypt.hash("real-password", 4)
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      name: "Alice",
      email: "alice@example.com",
      password: hashed,
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    })

    await expect(
      authService.login({ email: "alice@example.com", password: "wrong" }),
    ).rejects.toMatchObject({ extensions: { code: "UNAUTHENTICATED" } })
  })

  it("returns the same UNAUTHENTICATED message for unknown email and wrong password", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null)
    const unknownErr = await authService
      .login({ email: "nobody@example.com", password: "x" })
      .catch(e => e as GraphQLError)

    const bcrypt = (await import("bcryptjs")).default
    const hashed = await bcrypt.hash("real-password", 4)
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: "u1",
      name: "Alice",
      email: "alice@example.com",
      password: hashed,
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    })
    const wrongPwErr = await authService
      .login({ email: "alice@example.com", password: "bad" })
      .catch(e => e as GraphQLError)

    expect(unknownErr.message).toBe(wrongPwErr.message)
    expect(unknownErr.extensions?.code).toBe(wrongPwErr.extensions?.code)
  })
})

describe("AuthService.updateMe", () => {
  it("rejects empty name with BAD_USER_INPUT", async () => {
    await expect(authService.updateMe("u1", "  ")).rejects.toMatchObject({
      extensions: { code: "BAD_USER_INPUT" },
    })
    expect(prismaMock.user.update).not.toHaveBeenCalled()
  })

  it("updates and returns the public user", async () => {
    prismaMock.user.update.mockResolvedValue({
      id: "u1",
      name: "Alice 2",
      email: "alice@example.com",
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-02-01"),
    })

    const result = await authService.updateMe("u1", "Alice 2")

    expect(result).toEqual({
      id: "u1",
      name: "Alice 2",
      email: "alice@example.com",
      createdAt: new Date("2025-01-01"),
    })
    expect(result).not.toHaveProperty("password")
  })
})
