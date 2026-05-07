import { z } from "zod"

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a hex like #RRGGBB")

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  color: hexColor,
  icon: z.string().trim().min(1).max(40),
  description: z.string().trim().max(280).optional().nullable(),
})

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  color: hexColor.optional(),
  icon: z.string().trim().min(1).max(40).optional(),
  description: z.string().trim().max(280).nullable().optional(),
})

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>
