import { beforeEach, describe, expect, it, vi } from "vitest"
import { TransactionType } from "../../models/transaction.model.js"

const prismaMock = vi.hoisted(() => ({
  transaction: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  category: {
    findFirst: vi.fn(),
  },
}))

vi.mock("../../prisma.js", () => ({ default: prismaMock }))

const { transactionService, toTransactionType } = await import("../transaction.service.js")

const baseRow = {
  id: "t1",
  title: "Salary",
  amount: 100000,
  type: "INCOME",
  date: new Date("2025-05-01T00:00:00.000Z"),
  categoryId: "c1",
  userId: "u1",
  category: { id: "c1", name: "Income", color: "#000000", icon: "money" },
}

const VALID_CREATE = {
  title: "Salary",
  amount: 100000,
  type: TransactionType.INCOME,
  date: "2025-05-01T00:00:00.000Z",
  categoryId: "c1",
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("toTransactionType", () => {
  it("accepts INCOME and EXPENSE", () => {
    expect(toTransactionType("INCOME")).toBe(TransactionType.INCOME)
    expect(toTransactionType("EXPENSE")).toBe(TransactionType.EXPENSE)
  })

  it("throws GraphQLError INTERNAL_SERVER_ERROR on unknown values", () => {
    expect(() => toTransactionType("FOO")).toThrowError(
      expect.objectContaining({ extensions: { code: "INTERNAL_SERVER_ERROR" } }),
    )
  })
})

describe("TransactionService.findAll", () => {
  it("returns rows mapped with the typed enum", async () => {
    prismaMock.transaction.findMany.mockResolvedValue([baseRow])
    const result = await transactionService.findAll("u1")
    expect(result[0]?.type).toBe(TransactionType.INCOME)
    expect(prismaMock.transaction.findMany).toHaveBeenCalledWith({
      where: { userId: "u1" },
      include: { category: true },
      orderBy: { date: "desc" },
    })
  })
})

describe("TransactionService.findOne", () => {
  it("throws NOT_FOUND when ownership fails", async () => {
    prismaMock.transaction.findFirst.mockResolvedValue(null)
    await expect(transactionService.findOne("t1", "u-other")).rejects.toMatchObject({
      extensions: { code: "NOT_FOUND" },
    })
  })
})

describe("TransactionService.create", () => {
  it("rejects negative amount with BAD_USER_INPUT", async () => {
    await expect(
      transactionService.create({ ...VALID_CREATE, amount: -1 } as never, "u1"),
    ).rejects.toMatchObject({ extensions: { code: "BAD_USER_INPUT" } })
  })

  it("rejects unparseable date with BAD_USER_INPUT", async () => {
    await expect(
      transactionService.create({ ...VALID_CREATE, date: "abacaxi" }, "u1"),
    ).rejects.toMatchObject({ extensions: { code: "BAD_USER_INPUT" } })
  })

  it("rejects category owned by another user with NOT_FOUND", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null)
    await expect(transactionService.create(VALID_CREATE, "u1")).rejects.toMatchObject({
      extensions: { code: "NOT_FOUND" },
    })
    expect(prismaMock.transaction.create).not.toHaveBeenCalled()
  })

  it("creates the transaction when category is owned", async () => {
    prismaMock.category.findFirst.mockResolvedValue({ id: "c1", userId: "u1" })
    prismaMock.transaction.create.mockResolvedValue(baseRow)

    const result = await transactionService.create(VALID_CREATE, "u1")

    expect(result.id).toBe("t1")
    expect(result.type).toBe(TransactionType.INCOME)
    const callArg = prismaMock.transaction.create.mock.calls[0]?.[0]
    expect(callArg.data.userId).toBe("u1")
    expect(callArg.data.date).toBeInstanceOf(Date)
  })
})

describe("TransactionService.update", () => {
  it("rejects empty title (regression: && spread bug)", async () => {
    prismaMock.transaction.findFirst.mockResolvedValue(baseRow)
    await expect(
      transactionService.update("t1", { title: "" }, "u1"),
    ).rejects.toMatchObject({ extensions: { code: "BAD_USER_INPUT" } })
  })

  it("checks ownership of the new categoryId on update", async () => {
    prismaMock.transaction.findFirst.mockResolvedValue(baseRow)
    prismaMock.category.findFirst.mockResolvedValue(null)

    await expect(
      transactionService.update("t1", { categoryId: "c-other" }, "u1"),
    ).rejects.toMatchObject({ extensions: { code: "NOT_FOUND" } })
    expect(prismaMock.transaction.update).not.toHaveBeenCalled()
  })

  it("patches only fields explicitly provided", async () => {
    prismaMock.transaction.findFirst.mockResolvedValue(baseRow)
    prismaMock.transaction.update.mockResolvedValue({ ...baseRow, title: "New" })

    await transactionService.update("t1", { title: "New" }, "u1")

    const callArg = prismaMock.transaction.update.mock.calls[0]?.[0]
    expect(callArg.data).toEqual({ title: "New" })
  })
})

describe("TransactionService.delete", () => {
  it("returns true on owned record", async () => {
    prismaMock.transaction.findFirst.mockResolvedValue(baseRow)
    prismaMock.transaction.delete.mockResolvedValue(baseRow)
    await expect(transactionService.delete("t1", "u1")).resolves.toBe(true)
  })

  it("rejects on non-owned record", async () => {
    prismaMock.transaction.findFirst.mockResolvedValue(null)
    await expect(transactionService.delete("t1", "u-other")).rejects.toMatchObject({
      extensions: { code: "NOT_FOUND" },
    })
  })
})
