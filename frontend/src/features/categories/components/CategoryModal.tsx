import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/core/components/ui/dialog"
import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories"
import type { CategoryModalProps } from "../types/category.types"
import { categorySchema, type CategoryFormData } from "../schemas/category.schemas"
import {
  BriefcaseBusiness, CarFront, HeartPulse, PiggyBank,
  ShoppingCart, Ticket, ReceiptText, Utensils,
  PawPrint, House, Gift, Tag,
  BookOpen, Wallet, Dumbbell, BaggageClaim,
} from "lucide-react"
import { getCategoryColorClasses, normalizeHexColor } from "@utils/categoryColors"

const ICONS = [
  { key: "briefcase", Icon: BriefcaseBusiness },
  { key: "car", Icon: CarFront },
  { key: "heart", Icon: HeartPulse },
  { key: "piggy-bank", Icon: PiggyBank },
  { key: "shopping-cart", Icon: ShoppingCart },
  { key: "ticket", Icon: Ticket },
  { key: "receipt-text", Icon: ReceiptText },
  { key: "utensils", Icon: Utensils },
  { key: "footprints", Icon: PawPrint },
  { key: "house", Icon: House },
  { key: "gift", Icon: Gift },
  { key: "tag", Icon: Tag },
  { key: "book-open", Icon: BookOpen },
  { key: "wallet", Icon: Wallet },
  { key: "dumbbell", Icon: Dumbbell },
  { key: "bus", Icon: BaggageClaim },
]

const COLORS = [
  "#16A34A",
  "#2563EB",
  "#9333EA",
  "#DB2777",
  "#DC2626",
  "#EA580C",
  "#CA8A04",
]

export default function CategoryModal({ open, onClose, editing }: CategoryModalProps) {
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const isPending = createMutation.isPending || updateMutation.isPending
  const isEditing = !!editing

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { color: COLORS[0], icon: ICONS[0].key },
  })

  const selectedColor = watch("color")
  const selectedColorNormalized = normalizeHexColor(selectedColor)
  const selectedIcon = watch("icon")

  useEffect(() => {
    if (!editing) {
      reset({ color: COLORS[0], icon: ICONS[0].key, name: "", description: "" })
      return
    }

    reset({
      name: editing.name,
      description: editing.description ?? "",
      color: normalizeHexColor(editing.color),
      icon: editing.icon,
    })
  }, [editing, open, reset])

  const onSubmit = (data: CategoryFormData) => {
    if (!editing) {
      createMutation.mutate(data, {
        onSuccess: () => { reset(); onClose() },
      })
      return
    }

    updateMutation.mutate(
      { id: editing.id, ...data },
      { onSuccess: () => { reset(); onClose() } }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader className="border-b-0 pb-2">
          <DialogTitle>{isEditing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados da categoria" : "Organize suas transações com categorias"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Título</label>
            <input
              placeholder="Ex. Alimentação"
              className={clsx(
                "w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors",
                errors.name ? "border-red-base" : "border-gray-300 focus:border-brand-base"
              )}
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-red-base">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              rows={2}
              placeholder="Descrição da categoria"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-brand-base resize-none transition-colors"
              {...register("description")}
            />
            <p className="text-xs text-gray-400">Opcional</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Ícone</label>
            <div className="grid grid-cols-8 gap-1.5">
              {ICONS.map(({ key, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue("icon", key)}
                  className={clsx(
                    "cursor-pointer flex items-center justify-center w-9 h-9 rounded-lg border transition-colors",
                    selectedIcon === key
                      ? "border-brand-base bg-green-light"
                      : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4 text-gray-600" />
                </button>
              ))}
            </div>
            {errors.icon && <p className="text-xs text-red-base">{errors.icon.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Cor</label>
            <div className="grid grid-cols-7 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  className={clsx(
                    "cursor-pointer h-8 rounded-md border bg-white p-1 transition-all",
                    selectedColorNormalized === color
                      ? "border-brand-base ring-1 ring-brand-base/40"
                      : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <span
                    className={clsx("block h-full w-full rounded-sm", getCategoryColorClasses(color).swatchBg)}
                  />
                </button>
              ))}
            </div>
            {errors.color && <p className="text-xs text-red-base">{errors.color.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer w-full bg-brand-base hover:bg-brand-dark disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-3 transition-colors mt-2"
          >
            {isPending ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
