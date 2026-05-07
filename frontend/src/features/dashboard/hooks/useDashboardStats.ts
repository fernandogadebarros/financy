import { useMemo } from "react"
import type { Transaction } from "@/features/transactions/types/transaction.types"

export interface DashboardTotals {
  income: number
  expense: number
  balance: number
}

export function useDashboardStats(transactions: Transaction[]): DashboardTotals {
  return useMemo(() => {
    const totals = transactions.reduce(
      (acc, t) => {
        if (t.type === "INCOME") acc.income += t.amount
        else acc.expense += t.amount
        return acc
      },
      { income: 0, expense: 0 }
    )
    return { ...totals, balance: totals.income - totals.expense }
  }, [transactions])
}

export function useTransactionCountByCategory(
  transactions: Transaction[]
): Map<string, number> {
  return useMemo(() => {
    const map = new Map<string, number>()
    for (const t of transactions) {
      const id = t.category?.id
      if (!id) continue
      map.set(id, (map.get(id) ?? 0) + 1)
    }
    return map
  }, [transactions])
}

export function useTotalByCategory(
  transactions: Transaction[]
): Map<string, number> {
  return useMemo(() => {
    const map = new Map<string, number>()
    for (const t of transactions) {
      const id = t.category?.id
      if (!id) continue
      map.set(id, (map.get(id) ?? 0) + t.amount)
    }
    return map
  }, [transactions])
}
