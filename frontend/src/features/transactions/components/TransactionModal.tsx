import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { CircleArrowDown, CircleArrowUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"
import { DatePicker } from "@/core/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select"
import { useCreateTransaction, useUpdateTransaction } from "../hooks/useTransactions"
import { useCategories } from "@/features/categories/hooks/useCategories"
import type { TransactionModalProps } from "../types/transaction.types"
import { transactionSchema, type TransactionFormData } from "../schemas/transaction.schemas"
import { amountToCentsString, parseCentsFromString } from "@utils/formatters"

export default function TransactionModal({ open, onClose, editingTransaction }: TransactionModalProps) {
  const { data: categories = [] } = useCategories()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const isPending = createMutation.isPending || updateMutation.isPending
  const isEditing = !!editingTransaction

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: "EXPENSE" },
  })

  const type = watch("type")
  const dateValue = watch("date")

  useEffect(() => {
    if (!editingTransaction) {
      reset({ type: "EXPENSE", title: "", date: "", amount: "", categoryId: "" })
      return
    }

    reset({
      title: editingTransaction.title,
      date: editingTransaction.date?.slice(0, 10) ?? "",
      amount: amountToCentsString(editingTransaction.amount),
      categoryId: editingTransaction.category?.id ?? "",
      type: editingTransaction.type,
    })
  }, [editingTransaction, open, reset])

  const onSubmit = (data: TransactionFormData) => {
    const payload = {
      title: data.title,
      amount: parseCentsFromString(data.amount),
      type: data.type,
      date: data.date,
      categoryId: data.categoryId,
    }

    if (!editingTransaction) {
      createMutation.mutate(payload, {
        onSuccess: () => { reset(); onClose() },
      })
      return
    }

    updateMutation.mutate(
      { id: editingTransaction.id, ...payload },
      { onSuccess: () => { reset(); onClose() } }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader className="border-b-0 pb-2">
          <DialogTitle>{isEditing ? "Editar transação" : "Nova transação"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados da transação" : "Registre sua despesa ou receita"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1 border border-gray-300 rounded-lg p-2 bg-white">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setValue("type", "EXPENSE")}
              className={clsx(
                "cursor-pointer flex items-center justify-center gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                type === "EXPENSE"
                  ? "border border-red-base bg-red-light text-red-base"
                  : "border border-transparent bg-white text-gray-500 hover:bg-gray-50"
              )}
            >
              <CircleArrowDown className="h-3.5 w-3.5" />
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "INCOME")}
              className={clsx(
                "cursor-pointer flex items-center justify-center gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                type === "INCOME"
                  ? "border border-success bg-green-light text-success"
                  : "border border-transparent bg-white text-gray-500 hover:bg-gray-50"
              )}
            >
              <CircleArrowUp className="h-3.5 w-3.5" />
              Receita
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <Input
              placeholder="Ex. Almoço no restaurante"
              className={clsx(
                errors.title ? "border-red-base" : "border-gray-300 focus:border-brand-base"
              )}
              {...register("title")}
            />
            {errors.title && <p className="text-xs text-red-base">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Data</label>
              <input type="hidden" {...register("date")} />
              <DatePicker
                value={dateValue}
                onChange={(value) => setValue("date", value, { shouldValidate: true, shouldDirty: true })}
                className={clsx(
                  errors.date ? "border-red-base" : "border-gray-300 focus:border-brand-base"
                )}
              />
              {errors.date && <p className="text-xs text-red-base">{errors.date.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Valor</label>
              <div
                className={clsx(
                  "flex items-center border rounded-lg px-3 py-2.5 gap-1 transition-colors",
                  errors.amount ? "border-red-base" : "border-gray-300 focus-within:border-brand-base"
                )}
              >
                <span className="text-sm text-gray-700 font-medium">R$</span>
                <Input
                  placeholder="0,00"
                  className="h-auto border-0 bg-transparent p-0 text-sm text-gray-900 font-medium placeholder:text-gray-700 focus:border-0"
                  {...register("amount")}
                />
              </div>
              {errors.amount && <p className="text-xs text-red-base">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <Select
              onValueChange={(v) => setValue("categoryId", v)}
              defaultValue={editingTransaction?.category?.id}
            >
              <SelectTrigger className={clsx(errors.categoryId && "border-red-base")}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-xs text-red-base">{errors.categoryId.message}</p>}
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
