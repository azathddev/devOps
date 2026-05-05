type AuthTab = 'login' | 'register'

interface AuthTabsProps {
  activeTab: AuthTab
  onTabChange: (tab: AuthTab) => void
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="auth-tabs">
      <button
        type="button"
        className={activeTab === 'login' ? 'active' : ''}
        onClick={() => onTabChange('login')}
      >
        Вход
      </button>
      <button
        type="button"
        className={activeTab === 'register' ? 'active' : ''}
        onClick={() => onTabChange('register')}
      >
        Регистрация
      </button>
    </div>
  )
}
