import { describe, expect, it } from "vitest"
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../transaction.validator.js"
import { TransactionType } from "../../models/transaction.model.js"

describe("createTransactionSchema", () => {
  const valid = {
    title: "Salary",
    amount: 100000,
    type: TransactionType.INCOME,
    date: "2025-05-01T00:00:00.000Z",
    categoryId: "cat_1",
  }

  it("accepts valid input", () => {
    expect(createTransactionSchema.parse(valid)).toMatchObject({
      title: "Salary",
      amount: 100000,
      type: TransactionType.INCOME,
      categoryId: "cat_1",
    })
  })

  it("rejects negative amount", () => {
    expect(() => createTransactionSchema.parse({ ...valid, amount: -1 })).toThrow()
  })

  it("rejects zero amount", () => {
    expect(() => createTransactionSchema.parse({ ...valid, amount: 0 })).toThrow()
  })

  it("rejects unparseable date", () => {
    expect(() => createTransactionSchema.parse({ ...valid, date: "abacaxi" })).toThrow()
  })

  it("rejects empty title", () => {
    expect(() => createTransactionSchema.parse({ ...valid, title: "" })).toThrow()
  })

  it("rejects unknown type", () => {
    expect(() =>
      createTransactionSchema.parse({ ...valid, type: "FOO" as never }),
    ).toThrow()
  })
})

describe("updateTransactionSchema", () => {
  it("accepts an empty patch", () => {
    expect(updateTransactionSchema.parse({})).toEqual({})
  })

  it("rejects empty title in a partial update", () => {
    expect(() => updateTransactionSchema.parse({ title: "" })).toThrow()
  })

  it("rejects negative amount in a partial update", () => {
    expect(() => updateTransactionSchema.parse({ amount: -1 })).toThrow()
  })
})
