import { useCallback, useState } from "react"

export type TransactionFilterType = "todos" | "income" | "expense"

export interface TransactionFilters {
  search: string
  type: TransactionFilterType
  categoryId: string
  month: string
}

const INITIAL_FILTERS: TransactionFilters = {
  search: "",
  type: "todos",
  categoryId: "todas",
  month: "todos",
}

export function useTransactionFilters() {
  const [filters, setFilters] = useState<TransactionFilters>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)

  const update = useCallback(
    <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
      setPage(1)
    },
    []
  )

  const reset = useCallback(() => {
    setFilters(INITIAL_FILTERS)
    setPage(1)
  }, [])

  return { filters, page, setPage, update, reset }
}
