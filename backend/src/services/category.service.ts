import { GraphQLError } from "graphql"
import prisma from "../prisma.js"
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
    return prisma.category.create({
      data: { ...input, userId },
      include: INCLUDE_COUNT,
    })
  }

  async update(id: string, input: UpdateCategoryInput, userId: string) {
    await this.findOne(id, userId)
    return prisma.category.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.color && { color: input.color }),
        ...(input.icon && { icon: input.icon }),
        ...(input.description !== undefined && { description: input.description }),
      },
      include: INCLUDE_COUNT,
    })
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId)
    await prisma.category.delete({ where: { id } })
    return true
  }
}
