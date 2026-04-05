export const TRANSACTION_TYPES = ["INCOME", "EXPENSE"] as const
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

export interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  date: string
  category?: {
    id: string
    name: string
    color: string
    icon: string
  }
}

export interface CreateTransactionInput {
  title: string
  amount: number
  type: TransactionType
  date: string
  categoryId?: string
}

export interface UpdateTransactionInput {
  id: string
  title?: string
  amount?: number
  type?: TransactionType
  date?: string
  categoryId?: string
}

export interface TransactionsResponse {
  transactions: Transaction[]
}

export interface CreateTransactionResponse {
  createTransaction: Transaction
}

export interface UpdateTransactionResponse {
  updateTransaction: Transaction
}

export interface DeleteTransactionResponse {
  deleteTransaction: boolean
}

export interface TransactionModalProps {
  open: boolean
  onClose: () => void
  editingTransaction?: Transaction
}
