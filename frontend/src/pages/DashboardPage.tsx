import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TransactionFormModal } from '../components/transactions/TransactionFormModal'
import { TransactionList } from '../components/transactions/TransactionList'
import { useAuthStore } from '../store/authStore'
import { useTransactionsStore } from '../store/transactionsStore'
import type { Transaction, TransactionType } from '../types/transaction'
import { formatCurrency } from '../utils/currency'

type FilterType = TransactionType | 'all'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const {
    items,
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
    clearError,
  } = useTransactionsStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    void loadTransactions()
  }, [loadTransactions, filterType])

  const openCreateModal = () => {
    clearError()
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const openEditModal = (transaction: Transaction) => {
    clearError()
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить событие?')) {
      return
    }

    await removeTransaction(id)
  }

  return (
    <main className="container dashboard-page">
      <header className="card dashboard-header">
        <div>
          <h2>Здравствуйте, {user?.name ?? 'Пользователь'}!</h2>
          <p className="subtitle">{user?.email}</p>
        </div>
        <button type="button" onClick={() => void handleLogout()}>
          Выйти
        </button>
      </header>

      <section className="summary-grid">
        <article className="card">
          <p className="summary-label">Доходы</p>
          <p className="summary-value income">{formatCurrency(summary.incomeTotal)}</p>
        </article>
        <article className="card">
          <p className="summary-label">Расходы</p>
          <p className="summary-value expense">{formatCurrency(summary.expenseTotal)}</p>
        </article>
        <article className="card">
          <p className="summary-label">Баланс</p>
          <p className="summary-value">{formatCurrency(summary.balance)}</p>
        </article>
      </section>

      <section className="card controls-row">
        <label>
          Тип
          <select
            value={filterType}
            onChange={(event) => setFilterType(event.target.value as FilterType)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </label>

        <button type="button" onClick={openCreateModal}>
          Добавить событие
        </button>
      </section>

      {error ? <p className="error-text">{error}</p> : null}
      {isLoading ? <p className="card">Загрузка...</p> : null}
      {!isLoading ? (
        <TransactionList items={items} onEdit={openEditModal} onDelete={(id) => void handleDelete(id)} />
      ) : null}

      <TransactionFormModal
        key={`${editingTransaction?.id ?? 'create'}-${isModalOpen ? 'open' : 'closed'}`}
        isOpen={isModalOpen}
        isLoading={isMutating}
        initialTransaction={editingTransaction}
        onClose={() => setIsModalOpen(false)}
        onCreate={addTransaction}
        onUpdate={editTransaction}
      />
    </main>
  )
}
