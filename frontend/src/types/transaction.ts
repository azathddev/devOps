export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: string
  category: string
  comment: string
  occurredAt: string
  createdAt: string
  updatedAt: string
}

export interface TransactionSummary {
  incomeTotal: number
  expenseTotal: number
  balance: number
}

export interface TransactionsResponse {
  items: Transaction[]
  summary: TransactionSummary
}

export interface TransactionsQuery {
  type?: TransactionType
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface CreateTransactionRequest {
  type: TransactionType
  amount: number
  currency: string
  category: string
  comment: string
  occurredAt: string
}

export type UpdateTransactionRequest = Partial<CreateTransactionRequest>
