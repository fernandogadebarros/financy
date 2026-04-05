import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  color: z.string().min(1, "Selecione uma cor"),
  icon: z.string().min(1, "Selecione um ícone"),
})

export type CategoryFormData = z.infer<typeof categorySchema>
