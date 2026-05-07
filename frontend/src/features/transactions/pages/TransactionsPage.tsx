import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useTransactions, useDeleteTransaction } from "../hooks/useTransactions"
import { useTransactionFilters } from "../hooks/useTransactionFilters"
import { useFilteredTransactions, useMonthOptions } from "../hooks/useFilteredTransactions"
import { useCategories } from "@/features/categories/hooks/useCategories"
import { formatMonthLabel } from "@utils/formatters"
import TransactionModal from "../components/TransactionModal"
import TransactionRow from "../components/TransactionRow"
import Pagination from "@/core/components/Pagination"
import type { Transaction } from "../types/transaction.types"
import type { TransactionFilterType } from "../hooks/useTransactionFilters"
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

  const { filters, page, setPage, update } = useTransactionFilters()

  const { data: transactions = [], isLoading } = useTransactions()
  const { data: categories = [] } = useCategories()
  const deleteMutation = useDeleteTransaction()

  const monthOptions = useMonthOptions(transactions)
  const filtered = useFilteredTransactions(transactions, filters)

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
          type="button"
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
                value={filters.search}
                onChange={(e) => update("search", e.target.value)}
                placeholder="Buscar por descrição"
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Tipo</label>
            <Select
              value={filters.type}
              onValueChange={(v) => update("type", v as TransactionFilterType)}
            >
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
            <Select value={filters.categoryId} onValueChange={(v) => update("categoryId", v)}>
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
            <Select value={filters.month} onValueChange={(v) => update("month", v)}>
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
              <TransactionRow
                key={t.id}
                transaction={t}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </>
  )
}
