import { z } from "zod"
import { TRANSACTION_TYPES } from "../types/transaction.types"

export const transactionSchema = z.object({
  title: z.string().min(1, "Descrição é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine(
      (v) => !isNaN(parseFloat(v.replace(",", "."))) && parseFloat(v.replace(",", ".")) > 0,
      { message: "Valor deve ser maior que 0" }
    ),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  type: z.enum(TRANSACTION_TYPES),
})

export type TransactionFormData = z.infer<typeof transactionSchema>
