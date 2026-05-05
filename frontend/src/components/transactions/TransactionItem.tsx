import type { Transaction } from '../../types/transaction'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'

interface TransactionItemProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  return (
    <li className="transaction-item">
      <div>
        <p className="transaction-title">{transaction.category}</p>
        <p className="transaction-meta">{formatDate(transaction.occurredAt)}</p>
        {transaction.comment ? <p className="transaction-meta">{transaction.comment}</p> : null}
      </div>

      <div className="transaction-actions">
        <span className={transaction.type === 'income' ? 'amount-income' : 'amount-expense'}>
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount, transaction.currency)}
        </span>
        <button type="button" onClick={() => onEdit(transaction)}>
          Изменить
        </button>
        <button type="button" className="danger" onClick={() => onDelete(transaction.id)}>
          Удалить
        </button>
      </div>
    </li>
  )
}
