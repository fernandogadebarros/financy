import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { graphqlClient } from "@/core/api/graphqlClient"
import { toast } from "@/core/components/toastStore"
import { getErrorMessage } from "@utils/errors"
import {
  GET_TRANSACTIONS,
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
} from "../graphql/transactions.queries"
import type {
  TransactionsResponse,
  CreateTransactionInput,
  UpdateTransactionInput,
  CreateTransactionResponse,
  UpdateTransactionResponse,
} from "../types/transaction.types"

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const data = await graphqlClient.request<TransactionsResponse>(GET_TRANSACTIONS)
      return data.transactions
    },
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateTransactionInput) => {
      const data = await graphqlClient.request<CreateTransactionResponse>(
        CREATE_TRANSACTION,
        { input }
      )
      return data.createTransaction
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] })
      toast.success("Transação criada")
    },
    onError: (error) => toast.error(getErrorMessage(error, "Erro ao criar transação")),
  })
}

export function useUpdateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateTransactionInput) => {
      const data = await graphqlClient.request<UpdateTransactionResponse>(
        UPDATE_TRANSACTION,
        { id, input }
      )
      return data.updateTransaction
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] })
      toast.success("Transação atualizada")
    },
    onError: (error) => toast.error(getErrorMessage(error, "Erro ao atualizar transação")),
  })
}

export function useDeleteTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await graphqlClient.request(DELETE_TRANSACTION, { id })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] })
      toast.success("Transação removida")
    },
    onError: (error) => toast.error(getErrorMessage(error, "Erro ao remover transação")),
  })
}
