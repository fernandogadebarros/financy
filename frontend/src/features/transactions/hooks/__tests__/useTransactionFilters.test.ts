import { describe, it, expect } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { useTransactionFilters } from "../useTransactionFilters"

describe("useTransactionFilters", () => {
  it("starts with default filters and page 1", () => {
    const { result } = renderHook(() => useTransactionFilters())

    expect(result.current.filters).toEqual({
      search: "",
      type: "todos",
      categoryId: "todas",
      month: "todos",
    })
    expect(result.current.page).toBe(1)
  })

  it("update sets filter and resets page to 1", () => {
    const { result } = renderHook(() => useTransactionFilters())

    act(() => result.current.setPage(5))
    expect(result.current.page).toBe(5)

    act(() => result.current.update("search", "lunch"))

    expect(result.current.filters.search).toBe("lunch")
    expect(result.current.page).toBe(1)
  })

  it("reset returns to initial state", () => {
    const { result } = renderHook(() => useTransactionFilters())

    act(() => {
      result.current.update("type", "income")
      result.current.update("categoryId", "abc-123")
      result.current.setPage(3)
    })

    act(() => result.current.reset())

    expect(result.current.filters).toEqual({
      search: "",
      type: "todos",
      categoryId: "todas",
      month: "todos",
    })
    expect(result.current.page).toBe(1)
  })
})
