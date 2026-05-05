import { useState, type FormEvent } from 'react'
import type {
  CreateTransactionRequest,
  Transaction,
  TransactionType,
  UpdateTransactionRequest,
} from '../../types/transaction'
import { toDateTimeLocalValue } from '../../utils/date'

interface TransactionFormModalProps {
  isOpen: boolean
  isLoading: boolean
  initialTransaction: Transaction | null
  onClose: () => void
  onCreate: (payload: CreateTransactionRequest) => Promise<void>
  onUpdate: (id: string, payload: UpdateTransactionRequest) => Promise<void>
}

interface FormState {
  type: TransactionType
  amount: string
  currency: string
  category: string
  comment: string
  occurredAt: string
}

const INITIAL_FORM_STATE: FormState = {
  type: 'expense',
  amount: '',
  currency: 'RUB',
  category: '',
  comment: '',
  occurredAt: toDateTimeLocalValue(),
}

function getInitialState(transaction: Transaction | null): FormState {
  if (!transaction) {
    return {
      ...INITIAL_FORM_STATE,
      occurredAt: toDateTimeLocalValue(),
    }
  }

  return {
    type: transaction.type,
    amount: String(transaction.amount),
    currency: transaction.currency,
    category: transaction.category,
    comment: transaction.comment,
    occurredAt: toDateTimeLocalValue(transaction.occurredAt),
  }
}

export function TransactionFormModal({
  isOpen,
  isLoading,
  initialTransaction,
  onClose,
  onCreate,
  onUpdate,
}: TransactionFormModalProps) {
  const [state, setState] = useState<FormState>(() => getInitialState(initialTransaction))

  if (!isOpen) {
    return null
  }

  const title = initialTransaction ? 'Изменить событие' : 'Новое событие'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload: CreateTransactionRequest = {
      type: state.type,
      amount: Number(state.amount),
      currency: state.currency,
      category: state.category,
      comment: state.comment,
      occurredAt: new Date(state.occurredAt).toISOString(),
    }

    if (initialTransaction) {
      await onUpdate(initialTransaction.id, payload)
    } else {
      await onCreate(payload)
    }

    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal card">
        <h3>{title}</h3>
        <form className="form-grid" onSubmit={(event) => void handleSubmit(event)}>
          <label>
            Тип
            <select
              value={state.type}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  type: event.target.value as TransactionType,
                }))
              }
            >
              <option value="expense">Расход</option>
              <option value="income">Доход</option>
            </select>
          </label>

          <label>
            Сумма
            <input
              type="number"
              min="0"
              step="0.01"
              value={state.amount}
              onChange={(event) => setState((prev) => ({ ...prev, amount: event.target.value }))}
              required
            />
          </label>

          <label>
            Валюта
            <input
              type="text"
              value={state.currency}
              onChange={(event) =>
                setState((prev) => ({ ...prev, currency: event.target.value.toUpperCase() }))
              }
              minLength={3}
              maxLength={3}
              required
            />
          </label>

          <label>
            Категория
            <input
              type="text"
              value={state.category}
              onChange={(event) =>
                setState((prev) => ({ ...prev, category: event.target.value }))
              }
              required
            />
          </label>

          <label>
            Комментарий
            <input
              type="text"
              value={state.comment}
              onChange={(event) => setState((prev) => ({ ...prev, comment: event.target.value }))}
            />
          </label>

          <label>
            Дата и время
            <input
              type="datetime-local"
              value={state.occurredAt}
              onChange={(event) =>
                setState((prev) => ({ ...prev, occurredAt: event.target.value }))
              }
              required
            />
          </label>

          <div className="modal-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Сохраняем...' : 'Сохранить'}
            </button>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
