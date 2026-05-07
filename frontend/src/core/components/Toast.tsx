import { useEffect } from "react"
import clsx from "clsx"
import { CircleCheck, CircleAlert, X } from "lucide-react"
import { useToastStore, type ToastItem } from "./toastStore"

export function Toaster() {
  const items = useToastStore((s) => s.items)
  const remove = useToastStore((s) => s.remove)

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {items.map((t) => (
        <ToastEntry key={t.id} item={t} onClose={() => remove(t.id)} />
      ))}
    </div>
  )
}

function ToastEntry({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  useEffect(() => {
    const id = setTimeout(onClose, 4000)
    return () => clearTimeout(id)
  }, [onClose])

  const isSuccess = item.type === "success"
  const Icon = isSuccess ? CircleCheck : CircleAlert

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "flex items-start gap-2 min-w-[260px] max-w-sm rounded-lg border px-4 py-3 shadow-md bg-white",
        isSuccess ? "border-success" : "border-red-base"
      )}
    >
      <Icon className={clsx("h-4 w-4 mt-0.5 shrink-0", isSuccess ? "text-success" : "text-red-base")} />
      <p className="flex-1 text-sm text-gray-700">{item.message}</p>
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="cursor-pointer text-gray-400 hover:text-gray-600"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
