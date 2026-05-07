import { useMemo, useState } from "react"
import { Plus, Trash, SquarePen, Tag, ArrowUpDown, Utensils } from "lucide-react"
import { useCategories, useDeleteCategory } from "../hooks/useCategories"
import CategoryIcon from "@/core/components/CategoryIcon"
import CategoryModal from "../components/CategoryModal"
import CategoryBadge from "../components/CategoryBadge"
import type { Category } from "../types/category.types"
import { useTransactions } from "@/features/transactions/hooks/useTransactions"
import { useTransactionCountByCategory } from "@/features/dashboard/hooks/useDashboardStats"
import { getItemLabel } from "@utils/text"

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | undefined>()

  const { data: categories = [], isLoading } = useCategories()
  const { data: transactions = [] } = useTransactions()
  const deleteMutation = useDeleteCategory()

  const transactionCountByCategory = useTransactionCountByCategory(transactions)

  const totalTransactions = transactions.length
  const mostUsed = useMemo(() => {
    return categories
      .map((category) => ({
        ...category,
        count: transactionCountByCategory.get(category.id) ?? 0,
      }))
      .sort((a, b) => b.count - a.count)[0]
  }, [categories, transactionCountByCategory])

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta categoria?")) return
    deleteMutation.mutate(id)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditing(undefined)
  }

  return (
    <>
      <CategoryModal open={modalOpen} onClose={handleClose} editing={editing} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize suas transações por categorias
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="cursor-pointer flex items-center justify-center gap-2 bg-brand-base hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nova categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-gray-500" />
            <p className="text-3xl font-bold text-gray-800">{categories.length}</p>
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">
            Total de Categorias
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <ArrowUpDown className="h-5 w-5 text-purple-base" />
            <p className="text-3xl font-bold text-gray-800">{totalTransactions}</p>
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">
            Total de Transações
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Utensils className="h-5 w-5 text-blue-500" />
            <p className="text-3xl font-bold text-gray-800">
              {mostUsed?.name ?? "—"}
            </p>
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">
            Categoria Mais Utilizada
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400 text-center py-16">Carregando...</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-16">
          Nenhuma categoria criada. Crie a primeira!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const txCount = transactionCountByCategory.get(cat.id) ?? 0
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 min-h-[220px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-red-base hover:bg-red-light transition-colors"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleEdit(cat)}
                      className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:text-brand-base hover:bg-green-light transition-colors"
                    >
                      <SquarePen className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-gray-800 mb-1">{cat.name}</h3>
                {cat.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">{cat.description}</p>
                )}

                <div className="mt-auto pt-5 flex items-center justify-between">
                  <CategoryBadge name={cat.name} color={cat.color} />
                  <span className="text-xs text-gray-400">
                    {txCount} {getItemLabel(txCount)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
