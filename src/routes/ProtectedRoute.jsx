import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth()

  if (authLoading) {
    return (
      <main className="section">
        <div className="container">
          <div className="card" style={{ padding: '32px' }}>
            Carregando...
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}