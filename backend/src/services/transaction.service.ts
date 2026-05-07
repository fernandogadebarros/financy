import { GraphQLError } from "graphql"
import type { Prisma } from "@prisma/client"
import prisma from "../prisma.js"
import { parseOrThrow } from "../utils/parseOrThrow.js"
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../validators/transaction.validator.js"
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../dtos/input/transaction.input.js"
import { TransactionType, type TransactionModel } from "../models/transaction.model.js"

const INCLUDE_CATEGORY = { category: true } as const

export function toTransactionType(value: string): TransactionType {
  if (value === TransactionType.INCOME || value === TransactionType.EXPENSE) {
    return value
  }
  throw new GraphQLError("Invalid transaction state", {
    extensions: { code: "INTERNAL_SERVER_ERROR" },
  })
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
    const data = parseOrThrow(createTransactionSchema, input)
    await this.assertCategoryOwned(data.categoryId, userId)

    const row = await prisma.transaction.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        date: new Date(data.date),
        categoryId: data.categoryId,
        userId,
      },
      include: INCLUDE_CATEGORY,
    })
    return { ...row, type: toTransactionType(row.type) }
  }

  async update(
    id: string,
    input: UpdateTransactionInput,
    userId: string,
  ): Promise<TransactionModel> {
    const data = parseOrThrow(updateTransactionSchema, input)
    await this.findOne(id, userId)

    if (data.categoryId !== undefined) {
      await this.assertCategoryOwned(data.categoryId, userId)
    }

    const patch: Prisma.TransactionUpdateInput = {}
    if (data.title !== undefined) patch.title = data.title
    if (data.amount !== undefined) patch.amount = data.amount
    if (data.type !== undefined) patch.type = data.type
    if (data.date !== undefined) patch.date = new Date(data.date)
    if (data.categoryId !== undefined) patch.category = { connect: { id: data.categoryId } }

    const row = await prisma.transaction.update({
      where: { id },
      data: patch,
      include: INCLUDE_CATEGORY,
    })
    return { ...row, type: toTransactionType(row.type) }
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId)
    await prisma.transaction.delete({ where: { id } })
    return true
  }

  private async assertCategoryOwned(categoryId: string, userId: string): Promise<void> {
    const category = await prisma.category.findFirst({ where: { id: categoryId, userId } })
    if (!category) {
      throw new GraphQLError("Category not found", { extensions: { code: "NOT_FOUND" } })
    }
  }
}

export const transactionService = new TransactionService()
