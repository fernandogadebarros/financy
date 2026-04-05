import { GraphQLError } from "graphql"
import prisma from "../prisma.js"
import type { CreateTransactionInput, UpdateTransactionInput } from "../dtos/input/transaction.input.js"
import { TransactionType, type TransactionModel } from "../models/transaction.model.js"

const INCLUDE_CATEGORY = { category: true } as const

function toTransactionType(value: string): TransactionType {
  if (value === TransactionType.INCOME || value === TransactionType.EXPENSE) {
    return value
  }
  throw new Error(`Unknown transaction type: ${value}`)
}

export class TransactionService {
  async findAll(userId: string): Promise<TransactionModel[]> {
    const rows = await prisma.transaction.findMany({
      where: { userId },
      include: INCLUDE_CATEGORY,
      orderBy: { date: "desc" },
    })
    return rows.map(r => ({ ...r, type: toTransactionType(r.type) }))
  }

  async findOne(id: string, userId: string): Promise<TransactionModel> {
    const tx = await prisma.transaction.findFirst({
      where: { id, userId },
      include: INCLUDE_CATEGORY,
    })
    if (!tx) {
      throw new GraphQLError("Transaction not found", { extensions: { code: "NOT_FOUND" } })
    }
    return { ...tx, type: toTransactionType(tx.type) }
  }

  async create(input: CreateTransactionInput, userId: string): Promise<TransactionModel> {
    const category = await prisma.category.findFirst({ where: { id: input.categoryId, userId } })
    if (!category) {
      throw new GraphQLError("Category not found", { extensions: { code: "NOT_FOUND" } })
    }

    const row = await prisma.transaction.create({
      data: {
        title: input.title,
        amount: input.amount,
        type: input.type,
        date: new Date(input.date),
        categoryId: input.categoryId,
        userId,
      },
      include: INCLUDE_CATEGORY,
    })
    return { ...row, type: toTransactionType(row.type) }
  }

  async update(id: string, input: UpdateTransactionInput, userId: string): Promise<TransactionModel> {
    await this.findOne(id, userId)

    if (input.categoryId) {
      const category = await prisma.category.findFirst({ where: { id: input.categoryId, userId } })
      if (!category) {
        throw new GraphQLError("Category not found", { extensions: { code: "NOT_FOUND" } })
      }
    }

    const row = await prisma.transaction.update({
      where: { id },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.amount !== undefined && { amount: input.amount }),
        ...(input.type && { type: input.type }),
        ...(input.date && { date: new Date(input.date) }),
        ...(input.categoryId && { categoryId: input.categoryId }),
      },
      include: INCLUDE_CATEGORY,
    })
    return { ...row, type: toTransactionType(row.type) }
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId)
    await prisma.transaction.delete({ where: { id } })
    return true
  }
}
