import { useCallback, useMemo, useState } from 'react'
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../api/transactions'
import { HttpError } from '../api/http'
import type {
  CreateTransactionRequest,
  Transaction,
  TransactionSummary,
  TransactionType,
  UpdateTransactionRequest,
} from '../types/transaction'

type FilterType = TransactionType | 'all'

const EMPTY_SUMMARY: TransactionSummary = {
  incomeTotal: 0,
  expenseTotal: 0,
  balance: 0,
}

function normalizeSummary(summary: unknown): TransactionSummary {
  if (!summary || typeof summary !== 'object') {
    return EMPTY_SUMMARY
  }

  const candidate = summary as Partial<TransactionSummary>

  return {
    incomeTotal: typeof candidate.incomeTotal === 'number' ? candidate.incomeTotal : 0,
    expenseTotal: typeof candidate.expenseTotal === 'number' ? candidate.expenseTotal : 0,
    balance: typeof candidate.balance === 'number' ? candidate.balance : 0,
  }
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.payload?.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}

function sortByDateDesc(items: Transaction[]): Transaction[] {
  return [...items].sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
}

export function useTransactionsStore() {
  const [items, setItems] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<TransactionSummary>(EMPTY_SUMMARY)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<FilterType>('all')

  const loadTransactions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getTransactions(filterType === 'all' ? {} : { type: filterType })
      setItems(sortByDateDesc(response.items))
      setSummary(normalizeSummary(response.summary))
    } catch (loadError: unknown) {
      setError(extractErrorMessage(loadError))
      setSummary(EMPTY_SUMMARY)
    } finally {
      setIsLoading(false)
    }
  }, [filterType])

  const addTransaction = useCallback(async (payload: CreateTransactionRequest) => {
    setIsMutating(true)
    setError(null)
    try {
      const created = await createTransaction(payload)
      setItems((prev) => sortByDateDesc([created, ...prev]))
      await loadTransactions()
    } catch (createError: unknown) {
      setError(extractErrorMessage(createError))
      throw createError
    } finally {
      setIsMutating(false)
    }
  }, [loadTransactions])

  const editTransaction = useCallback(
    async (id: string, payload: UpdateTransactionRequest) => {
      setIsMutating(true)
      setError(null)
      try {
        const updated = await updateTransaction(id, payload)
        setItems((prev) =>
          sortByDateDesc(prev.map((item) => (item.id === id ? updated : item))),
        )
        await loadTransactions()
      } catch (updateError: unknown) {
        setError(extractErrorMessage(updateError))
        throw updateError
      } finally {
        setIsMutating(false)
      }
    },
    [loadTransactions],
  )

  const removeTransaction = useCallback(
    async (id: string) => {
      setIsMutating(true)
      setError(null)
      const previousItems = items
      setItems((prev) => prev.filter((item) => item.id !== id))
      try {
        await deleteTransaction(id)
        await loadTransactions()
      } catch (deleteError: unknown) {
        setItems(previousItems)
        setError(extractErrorMessage(deleteError))
        throw deleteError
      } finally {
        setIsMutating(false)
      }
    },
    [items, loadTransactions],
  )

  const filteredItems = useMemo(() => {
    if (filterType === 'all') {
      return items
    }
    return items.filter((item) => item.type === filterType)
  }, [items, filterType])

  return {
    items: filteredItems,
    summary,
    isLoading,
    isMutating,
    error,
    filterType,
    setFilterType,
    loadTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
    clearError: () => setError(null),
  }
}
