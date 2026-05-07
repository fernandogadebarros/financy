import { CircleArrowDown, CircleArrowUp, SquarePen, Trash } from "lucide-react"
import CategoryIcon from "@/core/components/CategoryIcon"
import CategoryBadge from "@/features/categories/components/CategoryBadge"
import { formatCurrency, formatDate } from "@utils/formatters"
import type { Transaction } from "../types/transaction.types"

interface TransactionRowProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export default function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const { id, title, amount, type, date, category } = transaction
  const isIncome = type === "INCOME"
  const TypeIcon = isIncome ? CircleArrowUp : CircleArrowDown
  const typeColor = isIncome ? "text-success" : "text-danger"
  const typeLabel = isIncome ? "Entrada" : "Saída"
  const sign = isIncome ? "+" : "-"

  return (
    <div className="px-4 py-4 hover:bg-gray-50 transition-colors lg:px-0 lg:py-0">
      <div className="lg:hidden space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {category ? (
              <CategoryIcon icon={category.icon} color={category.color} size="xs" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gray-100" />
            )}
            <div className="min-w-0">
              <span className="block text-sm font-medium text-gray-800 truncate">{title}</span>
              <span className="text-xs text-gray-400">{formatDate(date)}</span>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
            {sign} {formatCurrency(amount)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <TypeIcon className={`h-3 w-3 ${typeColor}`} />
              <span className={`text-xs font-medium ${typeColor}`}>{typeLabel}</span>
            </div>
            {category ? (
              <CategoryBadge name={category.name} color={category.color} />
            ) : (
              <span className="text-xs text-gray-400">Sem categoria</span>
            )}
          </div>

          <RowActions onEdit={() => onEdit(transaction)} onDelete={() => onDelete(id)} />
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-[1fr_124px_172px_124px_136px_80px] items-center px-6 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          {category ? (
            <CategoryIcon icon={category.icon} color={category.color} size="xs" />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gray-100" />
          )}
          <span className="text-sm font-medium text-gray-800 truncate">{title}</span>
        </div>

        <span className="text-sm text-gray-500 text-center">{formatDate(date)}</span>

        <div className="flex justify-center">
          {category ? (
            <CategoryBadge name={category.name} color={category.color} />
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>

        <div className="flex items-center justify-center gap-1">
          <TypeIcon className={`h-3 w-3 ${typeColor}`} />
          <span className={`text-sm font-medium ${typeColor}`}>{typeLabel}</span>
        </div>

        <span className="text-sm font-semibold text-right text-gray-800">
          {sign} {formatCurrency(amount)}
        </span>

        <RowActions onEdit={() => onEdit(transaction)} onDelete={() => onDelete(id)} />
      </div>
    </div>
  )
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        aria-label="Excluir transação"
        onClick={onDelete}
        className="cursor-pointer inline-flex h-7 w-7 items-center justify-center text-danger border border-gray-300 rounded-md hover:bg-red-light transition-colors"
      >
        <Trash className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Editar transação"
        onClick={onEdit}
        className="cursor-pointer inline-flex h-7 w-7 items-center justify-center text-gray-500 border border-gray-300 rounded-md hover:text-brand-base hover:bg-green-light transition-colors"
      >
        <SquarePen className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
