import { GraphQLError } from "graphql"
import prisma from "../prisma.js"
import { parseOrThrow } from "../utils/parseOrThrow.js"
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator.js"
import type { CreateCategoryInput, UpdateCategoryInput } from "../dtos/input/category.input.js"

const INCLUDE_COUNT = { _count: { select: { transactions: true } } } as const

export class CategoryService {
  async findAll(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: INCLUDE_COUNT,
    })
  }

  async findOne(id: string, userId: string) {
    const category = await prisma.category.findFirst({
      where: { id, userId },
      include: INCLUDE_COUNT,
    })
    if (!category) {
      throw new GraphQLError("Category not found", { extensions: { code: "NOT_FOUND" } })
    }
    return category
  }

  async create(input: CreateCategoryInput, userId: string) {
    const data = parseOrThrow(createCategorySchema, input)
    return prisma.category.create({
      data: { ...data, userId },
      include: INCLUDE_COUNT,
    })
  }

  async update(id: string, input: UpdateCategoryInput, userId: string) {
    const data = parseOrThrow(updateCategorySchema, input)
    await this.findOne(id, userId)

    const patch: Record<string, unknown> = {}
    if (data.name !== undefined) patch.name = data.name
    if (data.color !== undefined) patch.color = data.color
    if (data.icon !== undefined) patch.icon = data.icon
    if (data.description !== undefined) patch.description = data.description

    return prisma.category.update({
      where: { id },
      data: patch,
      include: INCLUDE_COUNT,
    })
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId)
    await prisma.category.delete({ where: { id } })
    return true
  }
}

export const categoryService = new CategoryService()
