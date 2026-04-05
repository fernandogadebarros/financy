import { useState, useMemo } from "react"
import clsx from "clsx"
import { Plus, Search, Trash, SquarePen, CircleArrowDown, CircleArrowUp } from "lucide-react"
import { useTransactions, useDeleteTransaction } from "../hooks/useTransactions"
import { useCategories } from "@/features/categories/hooks/useCategories"
import { formatCurrency, formatDate, formatMonthLabel } from "@utils/formatters"
import CategoryIcon from "@/core/components/CategoryIcon"
import CategoryBadge from "@/features/categories/components/CategoryBadge"
import TransactionModal from "../components/TransactionModal"
import type { Transaction } from "../types/transaction.types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select"

const PAGE_SIZE = 8

export default function TransactionsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | undefined>()
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("todos")
  const [filterCategory, setFilterCategory] = useState("todas")
  const [filterMonth, setFilterMonth] = useState<string>("todos")
  const [page, setPage] = useState(1)

  const { data: transactions = [], isLoading } = useTransactions()
  const { data: categories = [] } = useCategories()
  const deleteMutation = useDeleteTransaction()

  const monthOptions = useMemo(() => {
    const set = new Set<string>()
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7)
      set.add(key)
    })
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      if (filterType === "income" && t.type !== "INCOME") return false
      if (filterType === "expense" && t.type !== "EXPENSE") return false
      if (filterCategory !== "todas" && t.category?.id !== filterCategory) return false
      if (filterMonth !== "todos" && !t.date.startsWith(filterMonth)) return false
      return true
    })
  }, [transactions, search, filterType, filterCategory, filterMonth])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta transação?")) return
    deleteMutation.mutate(id)
  }

  const handleEdit = (t: Transaction) => {
    setEditing(t)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditing(undefined)
  }

  return (
    <>
      <TransactionModal open={modalOpen} onClose={handleClose} editingTransaction={editing} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="cursor-pointer flex items-center justify-center gap-2 bg-brand-base hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nova transação
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Buscar</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-brand-base transition-colors">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Buscar por descrição"
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Tipo</label>
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1) }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="income">Entrada</SelectItem>
                  <SelectItem value="expense">Saída</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Categoria</label>
            <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setPage(1) }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="todas">Todas</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Período</label>
            <Select value={filterMonth} onValueChange={(v) => { setFilterMonth(v); setPage(1) }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="todos">Todos</SelectItem>
                  {monthOptions.map((m) => (
                    <SelectItem key={m} value={m}>{formatMonthLabel(m)}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1fr_124px_172px_124px_136px_80px] px-6 py-4 bg-white border-b border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Data</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Categoria</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Tipo</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Valor</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</span>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-400 text-center py-16">Carregando...</p>
        ) : paginated.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">
            Nenhuma transação encontrada
          </p>
        ) : (
          <div className="divide-y divide-gray-200">
            {paginated.map((t) => (
              <div key={t.id} className="px-4 py-4 hover:bg-gray-50 transition-colors lg:px-0 lg:py-0">
                <div className="lg:hidden space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {t.category ? (
                        <CategoryIcon icon={t.category.icon} color={t.category.color} size="xs" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-gray-100" />
                      )}
                      <div className="min-w-0">
                        <span className="block text-sm font-medium text-gray-800 truncate">{t.title}</span>
                        <span className="text-xs text-gray-400">{formatDate(t.date)}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {t.type === "INCOME" ? "+" : "-"} {formatCurrency(t.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {t.type === "EXPENSE" ? (
                          <>
                            <CircleArrowDown className="h-3 w-3 text-danger" />
                            <span className="text-xs text-danger font-medium">Saída</span>
                          </>
                        ) : (
                          <>
                            <CircleArrowUp className="h-3 w-3 text-success" />
                            <span className="text-xs text-success font-medium">Entrada</span>
                          </>
                        )}
                      </div>
                      {t.category ? (
                        <CategoryBadge name={t.category.name} color={t.category.color} />
                      ) : (
                        <span className="text-xs text-gray-400">Sem categoria</span>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="cursor-pointer inline-flex h-7 w-7 items-center justify-center text-danger border border-gray-300 rounded-md hover:bg-red-light transition-colors"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleEdit(t)}
                        className="cursor-pointer inline-flex h-7 w-7 items-center justify-center text-gray-500 border border-gray-300 rounded-md hover:text-brand-base hover:bg-green-light transition-colors"
                      >
                        <SquarePen className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:grid grid-cols-[1fr_124px_172px_124px_136px_80px] items-center px-6 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    {t.category ? (
                      <CategoryIcon icon={t.category.icon} color={t.category.color} size="xs" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gray-100" />
                    )}
                    <span className="text-sm font-medium text-gray-800 truncate">{t.title}</span>
                  </div>

                  <span className="text-sm text-gray-500 text-center">{formatDate(t.date)}</span>

                  <div className="flex justify-center">
                    {t.category ? (
                      <CategoryBadge name={t.category.name} color={t.category.color} />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1">
                    {t.type === "EXPENSE" ? (
                      <>
                        <CircleArrowDown className="h-3 w-3 text-danger" />
                        <span className="text-sm text-danger font-medium">Saída</span>
                      </>
                    ) : (
                      <>
                        <CircleArrowUp className="h-3 w-3 text-success" />
                        <span className="text-sm text-success font-medium">Entrada</span>
                      </>
                    )}
                  </div>

                  <span className="text-sm font-semibold text-right text-gray-800">
                    {t.type === "INCOME" ? "+" : "-"} {formatCurrency(t.amount)}
                  </span>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="cursor-pointer inline-flex h-7 w-7 items-center justify-center text-danger border border-gray-300 rounded-md hover:bg-red-light transition-colors"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleEdit(t)}
                      className="cursor-pointer inline-flex h-7 w-7 items-center justify-center text-gray-500 border border-gray-300 rounded-md hover:text-brand-base hover:bg-green-light transition-colors"
                    >
                      <SquarePen className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              {(page - 1) * PAGE_SIZE + 1} a{" "}
              {Math.min(page * PAGE_SIZE, filtered.length)} |{" "}
              {filtered.length} resultados
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md text-sm text-gray-500 border border-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={clsx(
                    "cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-medium transition-colors",
                    p === page
                      ? "bg-brand-base text-white border border-brand-base"
                      : "text-gray-600 border border-gray-400 hover:bg-gray-100"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md text-sm text-gray-500 border border-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
