import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import {
  Wallet, CircleArrowUp, CircleArrowDown, Plus, ChevronRight,
} from "lucide-react"
import { useTransactions } from "@/features/transactions/hooks/useTransactions"
import { useCategories } from "@/features/categories/hooks/useCategories"
import { formatCurrency, formatDate } from "@utils/formatters"
import { getItemLabel } from "@utils/text"
import CategoryIcon from "@/core/components/CategoryIcon"
import CategoryBadge from "@/features/categories/components/CategoryBadge"
import TransactionModal from "@/features/transactions/components/TransactionModal"

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: transactions = [], isLoading: txLoading } = useTransactions()
  const { data: categories = [] } = useCategories()
  const navigate = useNavigate()

  const totalBalance = transactions.reduce((acc, t) => {
    return t.type === "INCOME" ? acc + t.amount : acc - t.amount
  }, 0)
  
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + t.amount, 0)

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const categoryTotals = categories
    .map((cat) => {
      const total = transactions
        .filter((t) => t.category?.id === cat.id)
        .reduce((s, t) => s + t.amount, 0)
      const count = transactions.filter((t) => t.category?.id === cat.id).length
      return { ...cat, total, count }
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return (
    <>
      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            <Wallet className="h-4 w-4 text-purple-base" />
            Saldo Total
          </div>
          <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalBalance)}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            <CircleArrowUp className="h-4 w-4 text-success" />
            Receitas do Mês
          </div>
          <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            <CircleArrowDown className="h-4 w-4 text-danger" />
            Despesas do Mês
          </div>
          <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-4 sm:px-7 py-5 border-b border-gray-200">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Transações Recentes
            </h2>
            <Link
              to="/transacoes"
              className="flex items-center gap-1 text-sm text-brand-base hover:text-brand-dark font-medium transition-colors"
            >
              Ver todas <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {txLoading ? (
            <p className="text-sm text-gray-400 text-center px-6 py-8">Carregando...</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-gray-400 text-center px-6 py-8">
              Nenhuma transação ainda. Crie a primeira!
            </p>
          ) : (
            <div className="divide-y divide-gray-200">
              {recent.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 sm:px-7 py-3.5">
                  {t.category ? (
                    <CategoryIcon icon={t.category.icon} color={t.category.color} />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Wallet className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{t.title}</p>
                    <p className="text-[11px] text-gray-400">{formatDate(t.date)}</p>
                  </div>
                  {t.category && (
                    <div className="hidden sm:flex w-28 justify-center shrink-0">
                      <CategoryBadge name={t.category.name} color={t.category.color} />
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-1.5 min-w-[104px] sm:min-w-[130px] shrink-0">
                    <span className="text-sm font-semibold text-gray-700">
                      {t.type === "INCOME" ? "+" : "-"}{formatCurrency(t.amount)}
                    </span>
                    {t.type === "EXPENSE" ? (
                      <CircleArrowDown className="h-3.5 w-3.5 text-danger" />
                    ) : (
                      <CircleArrowUp className="h-3.5 w-3.5 text-success" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 px-4 sm:px-7 py-4">
            <button
              onClick={() => setModalOpen(true)}
              className="cursor-pointer flex items-center justify-center gap-2 w-full text-sm text-brand-base hover:text-brand-dark transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              Nova transação
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Categorias
            </h2>
            <button
              onClick={() => navigate("/categorias")}
              className="cursor-pointer flex items-center gap-1 text-sm text-brand-base hover:text-brand-dark font-medium transition-colors"
            >
              Gerenciar <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {categoryTotals.length === 0 ? (
            <p className="text-sm text-gray-400 text-center px-6 py-8">
              Nenhuma categoria com transações
            </p>
          ) : (
            <div>
              {categoryTotals.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-6 py-2">
                  <CategoryBadge name={cat.name} color={cat.color} />
                  <div className="grid grid-cols-[56px_80px] items-center justify-items-end">
                    <div className="text-right mr-8">
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {cat.count} {getItemLabel(cat.count)}
                      </span>
                    </div>
                    <p className="w-32 text-right text-sm font-semibold text-gray-800">
                      {formatCurrency(cat.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
