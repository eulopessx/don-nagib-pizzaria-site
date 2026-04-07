import { useAuth } from '../context/AuthContext'
import { LogOut, User } from 'lucide-react'

export default function AccountPage() {
  const { user, signOut } = useAuth()

  async function handleLogout() {
    const { error } = await signOut()

    if (error) {
      alert('Erro ao sair: ' + error.message)
    }
  }

  return (
    <main className="section">
      <div className="container">
        <div className="account-page">
          <div className="account-card card">
            <span className="badge">
              <User size={16} />
              Minha conta
            </span>

            <h1 className="section-title">Bem-vindo</h1>
            <p className="section-subtitle">
              Você entrou com o email:
            </p>

            <div className="account-user-box">
              <strong>{user?.email}</strong>
            </div>

            <div className="account-actions">
              <button className="btn btn-secondary" onClick={handleLogout}>
                <LogOut size={16} />
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}