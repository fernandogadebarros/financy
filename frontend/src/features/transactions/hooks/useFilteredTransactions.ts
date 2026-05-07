import { useMemo } from "react"
import type { Transaction } from "../types/transaction.types"
import type { TransactionFilters } from "./useTransactionFilters"

export function useFilteredTransactions(
  transactions: Transaction[],
  filters: TransactionFilters
) {
  return useMemo(() => {
    const term = filters.search.trim().toLowerCase()

    return transactions.filter((t) => {
      if (term && !t.title.toLowerCase().includes(term)) return false
      if (filters.type === "income" && t.type !== "INCOME") return false
      if (filters.type === "expense" && t.type !== "EXPENSE") return false
      if (filters.categoryId !== "todas" && t.category?.id !== filters.categoryId) return false
      if (filters.month !== "todos" && !t.date.startsWith(filters.month)) return false
      return true
    })
  }, [transactions, filters])
}

export function useMonthOptions(transactions: Transaction[]): string[] {
  return useMemo(() => {
    const set = new Set<string>()
    transactions.forEach((t) => set.add(t.date.slice(0, 7)))
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [transactions])
}
