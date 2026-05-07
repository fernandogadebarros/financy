import { z } from "zod"
import { TransactionType } from "../models/transaction.model.js"

const isoDate = z
  .string()
  .min(1, "Date is required")
  .refine(value => !Number.isNaN(new Date(value).getTime()), "Invalid date")

export const createTransactionSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  amount: z.number().int().positive("Amount must be positive"),
  type: z.nativeEnum(TransactionType),
  date: isoDate,
  categoryId: z.string().min(1, "categoryId is required"),
})

export const updateTransactionSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  amount: z.number().int().positive().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  date: isoDate.optional(),
  categoryId: z.string().min(1).optional(),
})

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>
