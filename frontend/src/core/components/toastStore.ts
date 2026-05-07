import { create } from "zustand"

export type ToastType = "success" | "error"

export interface ToastItem {
  id: number
  type: ToastType
  message: string
}

interface ToastState {
  items: ToastItem[]
  push: (type: ToastType, message: string) => void
  remove: (id: number) => void
}

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  push: (type, message) =>
    set((state) => ({
      items: [...state.items, { id: Date.now() + Math.random(), type, message }],
    })),
  remove: (id) => set((state) => ({ items: state.items.filter((t) => t.id !== id) })),
}))

export const toast = {
  success: (message: string) => useToastStore.getState().push("success", message),
  error: (message: string) => useToastStore.getState().push("error", message),
}
