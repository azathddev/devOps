import { httpRequest } from './http'
import type {
  CreateTransactionRequest,
  Transaction,
  TransactionsQuery,
  TransactionsResponse,
  UpdateTransactionRequest,
} from '../types/transaction'

function buildQuery(query: TransactionsQuery): string {
  const search = new URLSearchParams()

  if (query.type) search.set('type', query.type)
  if (query.from) search.set('from', query.from)
  if (query.to) search.set('to', query.to)
  if (query.page) search.set('page', String(query.page))
  if (query.limit) search.set('limit', String(query.limit))

  const queryString = search.toString()
  return queryString ? `?${queryString}` : ''
}

export function getTransactions(query: TransactionsQuery = {}): Promise<TransactionsResponse> {
  return httpRequest<TransactionsResponse>(`/transactions${buildQuery(query)}`)
}

export function createTransaction(payload: CreateTransactionRequest): Promise<Transaction> {
  return httpRequest<Transaction>('/transactions', {
    method: 'POST',
    body: payload,
  })
}

export function updateTransaction(
  id: string,
  payload: UpdateTransactionRequest,
): Promise<Transaction> {
  return httpRequest<Transaction>(`/transactions/${id}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function deleteTransaction(id: string): Promise<void> {
  return httpRequest<void>(`/transactions/${id}`, {
    method: 'DELETE',
  })
}

npm run dev -- --host 0.0.0.0
