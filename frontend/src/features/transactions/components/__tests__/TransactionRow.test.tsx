import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TransactionRow from "../TransactionRow"
import type { Transaction } from "../../types/transaction.types"

const baseTransaction: Transaction = {
  id: "tx-1",
  title: "Almoço",
  amount: 4500,
  type: "EXPENSE",
  date: "2026-03-10",
  category: { id: "cat-1", name: "Alimentação", color: "#16A34A", icon: "utensils" },
}

describe("TransactionRow", () => {
  it("renders title, formatted date and signed amount", () => {
    render(<TransactionRow transaction={baseTransaction} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.getAllByText("Almoço").length).toBeGreaterThan(0)
    expect(screen.getAllByText(/10\/03\/26/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/45,00/).length).toBeGreaterThan(0)
  })

  it("calls onEdit with the transaction when edit is clicked", async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(<TransactionRow transaction={baseTransaction} onEdit={onEdit} onDelete={() => {}} />)

    const editButtons = screen.getAllByRole("button", { name: /editar transação/i })
    await user.click(editButtons[0])

    expect(onEdit).toHaveBeenCalledWith(baseTransaction)
  })

  it("calls onDelete with the id when delete is clicked", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<TransactionRow transaction={baseTransaction} onEdit={() => {}} onDelete={onDelete} />)

    const deleteButtons = screen.getAllByRole("button", { name: /excluir transação/i })
    await user.click(deleteButtons[0])

    expect(onDelete).toHaveBeenCalledWith("tx-1")
  })

  it("shows fallback label when category is missing", () => {
    render(
      <TransactionRow
        transaction={{ ...baseTransaction, category: undefined }}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    )
    expect(screen.getByText(/sem categoria/i)).toBeInTheDocument()
  })
})
