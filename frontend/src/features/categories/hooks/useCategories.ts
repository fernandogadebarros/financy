import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { graphqlClient } from "@/core/api/graphqlClient"
import {
  GET_CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "../graphql/categories.queries"
import type {
  CategoriesResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateCategoryResponse,
  UpdateCategoryResponse,
} from "../types/category.types"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await graphqlClient.request<CategoriesResponse>(GET_CATEGORIES)
      return data.categories
    },
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      const data = await graphqlClient.request<CreateCategoryResponse>(
        CREATE_CATEGORY,
        { input }
      )
      return data.createCategory
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateCategoryInput) => {
      const data = await graphqlClient.request<UpdateCategoryResponse>(
        UPDATE_CATEGORY,
        { id, input }
      )
      return data.updateCategory
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await graphqlClient.request(DELETE_CATEGORY, { id })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] })
      qc.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
