import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import {
  useFilteredTransactions,
  useMonthOptions,
} from "../useFilteredTransactions"
import type { Transaction } from "../../types/transaction.types"
import type { TransactionFilters } from "../useTransactionFilters"

const ALL: TransactionFilters = {
  search: "",
  type: "todos",
  categoryId: "todas",
  month: "todos",
}

const tx = (overrides: Partial<Transaction>): Transaction => ({
  id: "1",
  title: "Lunch",
  amount: 1000,
  type: "EXPENSE",
  date: "2026-03-10",
  category: { id: "cat-1", name: "Food", color: "#000", icon: "utensils" },
  ...overrides,
})

describe("useFilteredTransactions", () => {
  it("returns all transactions with default filters", () => {
    const list = [tx({ id: "a" }), tx({ id: "b" })]
    const { result } = renderHook(() => useFilteredTransactions(list, ALL))
    expect(result.current).toHaveLength(2)
  })

  it("filters by search (case insensitive, in title)", () => {
    const list = [tx({ id: "a", title: "Lunch" }), tx({ id: "b", title: "Coffee" })]
    const { result } = renderHook(() =>
      useFilteredTransactions(list, { ...ALL, search: "luN" })
    )
    expect(result.current.map((t) => t.id)).toEqual(["a"])
  })

  it("filters by type", () => {
    const list = [
      tx({ id: "a", type: "INCOME" }),
      tx({ id: "b", type: "EXPENSE" }),
    ]
    const { result } = renderHook(() =>
      useFilteredTransactions(list, { ...ALL, type: "income" })
    )
    expect(result.current.map((t) => t.id)).toEqual(["a"])
  })

  it("filters by categoryId", () => {
    const list = [
      tx({ id: "a", category: { id: "cat-1", name: "x", color: "#000", icon: "i" } }),
      tx({ id: "b", category: { id: "cat-2", name: "y", color: "#000", icon: "i" } }),
    ]
    const { result } = renderHook(() =>
      useFilteredTransactions(list, { ...ALL, categoryId: "cat-2" })
    )
    expect(result.current.map((t) => t.id)).toEqual(["b"])
  })

  it("filters by month prefix", () => {
    const list = [
      tx({ id: "a", date: "2026-03-10" }),
      tx({ id: "b", date: "2026-04-01" }),
    ]
    const { result } = renderHook(() =>
      useFilteredTransactions(list, { ...ALL, month: "2026-03" })
    )
    expect(result.current.map((t) => t.id)).toEqual(["a"])
  })
})

describe("useMonthOptions", () => {
  it("returns unique months sorted desc", () => {
    const list = [
      tx({ id: "a", date: "2026-03-10" }),
      tx({ id: "b", date: "2026-04-01" }),
      tx({ id: "c", date: "2026-03-25" }),
    ]
    const { result } = renderHook(() => useMonthOptions(list))
    expect(result.current).toEqual(["2026-04", "2026-03"])
  })
})
