import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  category: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock("../../prisma.js", () => ({ default: prismaMock }))

const { categoryService } = await import("../category.service.js")

const VALID_CREATE = {
  name: "Food",
  color: "#FF8800",
  icon: "burger",
  description: "meals",
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("CategoryService.findAll", () => {
  it("scopes the query by userId", async () => {
    prismaMock.category.findMany.mockResolvedValue([])
    await categoryService.findAll("user-1")
    expect(prismaMock.category.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { transactions: true } } },
    })
  })
})

describe("CategoryService.findOne", () => {
  it("returns the category when ownership matches", async () => {
    prismaMock.category.findFirst.mockResolvedValue({ id: "c1", userId: "u1" })
    const result = await categoryService.findOne("c1", "u1")
    expect(result).toEqual({ id: "c1", userId: "u1" })
    expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
      where: { id: "c1", userId: "u1" },
      include: { _count: { select: { transactions: true } } },
    })
  })

  it("throws NOT_FOUND when ownership fails (does not leak existence)", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null)
    await expect(categoryService.findOne("c1", "u-other")).rejects.toMatchObject({
      extensions: { code: "NOT_FOUND" },
    })
  })
})

describe("CategoryService.create", () => {
  it("rejects invalid color with BAD_USER_INPUT", async () => {
    await expect(
      categoryService.create({ ...VALID_CREATE, color: "red" } as never, "u1"),
    ).rejects.toMatchObject({ extensions: { code: "BAD_USER_INPUT" } })
    expect(prismaMock.category.create).not.toHaveBeenCalled()
  })

  it("rejects empty name", async () => {
    await expect(
      categoryService.create({ ...VALID_CREATE, name: "" } as never, "u1"),
    ).rejects.toMatchObject({ extensions: { code: "BAD_USER_INPUT" } })
  })

  it("creates the category with userId injected", async () => {
    prismaMock.category.create.mockResolvedValue({ id: "c1", ...VALID_CREATE, userId: "u1" })
    await categoryService.create(VALID_CREATE, "u1")
    const callArg = prismaMock.category.create.mock.calls[0]?.[0]
    expect(callArg.data.userId).toBe("u1")
    expect(callArg.data.name).toBe("Food")
  })
})

describe("CategoryService.update", () => {
  it("checks ownership before applying patch", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null)
    await expect(
      categoryService.update("c1", { name: "X" }, "u-other"),
    ).rejects.toMatchObject({ extensions: { code: "NOT_FOUND" } })
    expect(prismaMock.category.update).not.toHaveBeenCalled()
  })

  it("only patches fields explicitly defined", async () => {
    prismaMock.category.findFirst.mockResolvedValue({ id: "c1", userId: "u1" })
    prismaMock.category.update.mockResolvedValue({ id: "c1" })

    await categoryService.update("c1", { name: "New", color: "#000000" }, "u1")

    const callArg = prismaMock.category.update.mock.calls[0]?.[0]
    expect(callArg.data).toEqual({ name: "New", color: "#000000" })
    expect(callArg.data).not.toHaveProperty("icon")
    expect(callArg.data).not.toHaveProperty("description")
  })

  it("supports setting description to null explicitly", async () => {
    prismaMock.category.findFirst.mockResolvedValue({ id: "c1", userId: "u1" })
    prismaMock.category.update.mockResolvedValue({ id: "c1" })

    await categoryService.update("c1", { description: null }, "u1")

    const callArg = prismaMock.category.update.mock.calls[0]?.[0]
    expect(callArg.data).toEqual({ description: null })
  })

  it("rejects empty string for name (regression: && spread bug)", async () => {
    prismaMock.category.findFirst.mockResolvedValue({ id: "c1", userId: "u1" })
    await expect(categoryService.update("c1", { name: "" }, "u1")).rejects.toMatchObject({
      extensions: { code: "BAD_USER_INPUT" },
    })
  })
})

describe("CategoryService.delete", () => {
  it("checks ownership before deleting", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null)
    await expect(categoryService.delete("c1", "u-other")).rejects.toMatchObject({
      extensions: { code: "NOT_FOUND" },
    })
    expect(prismaMock.category.delete).not.toHaveBeenCalled()
  })

  it("returns true on success", async () => {
    prismaMock.category.findFirst.mockResolvedValue({ id: "c1", userId: "u1" })
    prismaMock.category.delete.mockResolvedValue({ id: "c1" })
    await expect(categoryService.delete("c1", "u1")).resolves.toBe(true)
  })
})
