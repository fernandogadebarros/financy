import { describe, it, expect } from "vitest"
import {
  formatCurrency,
  formatDate,
  formatMonthLabel,
  amountToCentsString,
  parseCentsFromString,
  getInitials,
} from "../formatters"

describe("formatCurrency", () => {
  it("formats cents into BRL currency", () => {
    expect(formatCurrency(12345)).toMatch(/123,45/)
    expect(formatCurrency(0)).toMatch(/0,00/)
  })
})

describe("formatDate", () => {
  it("preserves the date for ISO yyyy-mm-dd strings (no timezone shift)", () => {
    expect(formatDate("2026-01-31")).toBe("31/01/26")
    expect(formatDate("2026-01-31T03:00:00.000Z")).toBe("31/01/26")
  })

  it("formats Date objects in local time", () => {
    const d = new Date(2026, 0, 31)
    expect(formatDate(d)).toBe("31/01/26")
  })
})

describe("formatMonthLabel", () => {
  it("converts yyyy-mm key to localized label", () => {
    expect(formatMonthLabel("2026-03")).toBe("Março / 2026")
    expect(formatMonthLabel("2026-12")).toBe("Dezembro / 2026")
  })
})

describe("cents helpers", () => {
  it("amountToCentsString and parseCentsFromString roundtrip", () => {
    expect(amountToCentsString(12345)).toBe("123,45")
    expect(parseCentsFromString("123,45")).toBe(12345)
    expect(parseCentsFromString("0,99")).toBe(99)
  })
})

describe("getInitials", () => {
  it("returns up to two uppercase initials", () => {
    expect(getInitials("Fernando Gabarros")).toBe("FG")
    expect(getInitials("João da Silva Santos")).toBe("JD")
    expect(getInitials("Ana")).toBe("A")
  })
})
