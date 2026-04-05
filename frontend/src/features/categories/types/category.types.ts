export interface Category {
  id: string
  name: string
  description?: string
  color: string
  icon: string
  _count?: {
    transactions: number
  }
}

export interface CreateCategoryInput {
  name: string
  description?: string
  color: string
  icon: string
}

export interface UpdateCategoryInput {
  id: string
  name?: string
  description?: string
  color?: string
  icon?: string
}

export interface CategoriesResponse {
  categories: Category[]
}

export interface CreateCategoryResponse {
  createCategory: Category
}

export interface UpdateCategoryResponse {
  updateCategory: Category
}

export interface DeleteCategoryResponse {
  deleteCategory: boolean
}

export interface CategoryModalProps {
  open: boolean
  onClose: () => void
  editing?: Category
}
