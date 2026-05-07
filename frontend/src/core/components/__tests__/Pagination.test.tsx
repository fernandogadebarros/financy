import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Pagination from "../Pagination"

describe("Pagination", () => {
  it("renders all pages when totalPages <= windowSize", () => {
    render(<Pagination page={1} totalPages={3} onChange={() => {}} />)
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "4" })).not.toBeInTheDocument()
  })

  it("renders a sliding window when totalPages > windowSize", () => {
    render(<Pagination page={10} totalPages={20} onChange={() => {}} windowSize={5} />)
    expect(screen.getByRole("button", { name: "8" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "12" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument()
  })

  it("disables prev on first page and next on last page", () => {
    const { rerender } = render(<Pagination page={1} totalPages={3} onChange={() => {}} />)
    expect(screen.getByRole("button", { name: /página anterior/i })).toBeDisabled()

    rerender(<Pagination page={3} totalPages={3} onChange={() => {}} />)
    expect(screen.getByRole("button", { name: /próxima página/i })).toBeDisabled()
  })

  it("calls onChange when clicking a page button", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={2} totalPages={5} onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: "4" }))

    expect(onChange).toHaveBeenCalledWith(4)
  })

  it("marks current page with aria-current", () => {
    render(<Pagination page={2} totalPages={5} onChange={() => {}} />)
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("button", { name: "3" })).not.toHaveAttribute("aria-current", "page")
  })
})
