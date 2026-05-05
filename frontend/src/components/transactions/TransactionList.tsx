import type { Transaction } from '../../types/transaction'
import { TransactionItem } from './TransactionItem'

interface TransactionListProps {
  items: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionList({ items, onEdit, onDelete }: TransactionListProps) {
  if (!items.length) {
    return <p className="card">Событий пока нет. Добавьте первую операцию.</p>
  }

  return (
    <ul className="transaction-list card">
      {items.map((item) => (
        <TransactionItem
          key={item.id}
          transaction={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
