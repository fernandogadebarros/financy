import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import {
  useDashboardStats,
  useTransactionCountByCategory,
  useTotalByCategory,
} from "../useDashboardStats"
import type { Transaction } from "@/features/transactions/types/transaction.types"

const cat = (id: string) => ({ id, name: id, color: "#000", icon: "tag" })

const tx = (overrides: Partial<Transaction>): Transaction => ({
  id: Math.random().toString(),
  title: "x",
  amount: 0,
  type: "EXPENSE",
  date: "2026-03-10",
  category: cat("cat-1"),
  ...overrides,
})

describe("useDashboardStats", () => {
  it("returns zeros for empty list", () => {
    const { result } = renderHook(() => useDashboardStats([]))
    expect(result.current).toEqual({ income: 0, expense: 0, balance: 0 })
  })

  it("sums INCOME and EXPENSE separately and computes balance", () => {
    const list = [
      tx({ type: "INCOME", amount: 5000 }),
      tx({ type: "INCOME", amount: 3000 }),
      tx({ type: "EXPENSE", amount: 2000 }),
    ]
    const { result } = renderHook(() => useDashboardStats(list))
    expect(result.current).toEqual({ income: 8000, expense: 2000, balance: 6000 })
  })
})

describe("useTransactionCountByCategory", () => {
  it("counts transactions per category and ignores items without category", () => {
    const list = [
      tx({ category: cat("a") }),
      tx({ category: cat("a") }),
      tx({ category: cat("b") }),
      tx({ category: undefined }),
    ]
    const { result } = renderHook(() => useTransactionCountByCategory(list))
    expect(result.current.get("a")).toBe(2)
    expect(result.current.get("b")).toBe(1)
    expect(result.current.size).toBe(2)
  })
})

describe("useTotalByCategory", () => {
  it("sums amounts per category", () => {
    const list = [
      tx({ category: cat("a"), amount: 100 }),
      tx({ category: cat("a"), amount: 50 }),
      tx({ category: cat("b"), amount: 25 }),
    ]
    const { result } = renderHook(() => useTotalByCategory(list))
    expect(result.current.get("a")).toBe(150)
    expect(result.current.get("b")).toBe(25)
  })
})
