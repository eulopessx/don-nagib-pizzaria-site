import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { signIn, signUp, signInWithGoogle, isAuthenticated, authLoading } = useAuth()

  const [mode, setMode] = useState('login')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setMessage('')
    setErrorMessage('')
  }, [mode])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setErrorMessage('')

    const email = formData.email.trim()
    const password = formData.password.trim()

    if (!email || !password) {
      setErrorMessage('Preencha email e senha.')
      setLoading(false)
      return
    }

    try {
      if (mode === 'register') {
        if (password.length < 6) {
          setErrorMessage('A senha deve ter pelo menos 6 caracteres.')
          setLoading(false)
          return
        }

        if (password !== formData.confirmPassword.trim()) {
          setErrorMessage('As senhas não coincidem.')
          setLoading(false)
          return
        }

        const { error } = await signUp({ email, password })

        if (error) {
          setErrorMessage(error.message)
        } else {
          setMessage(
            'Cadastro realizado. Confira seu email para confirmar a conta, se a confirmação estiver ativa.'
          )
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
          })
        }
      } else {
        const { error } = await signIn({ email, password })

        if (error) {
          setErrorMessage(error.message)
        }
      }
    } catch {
      setErrorMessage('Ocorreu um erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    setErrorMessage('')

    const { error } = await signInWithGoogle()

    if (error) {
      setErrorMessage(error.message)
      setGoogleLoading(false)
    }
  }

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/minha-conta" replace />
  }

  return (
    <main className="section">
      <div className="container">
        <div className="auth-page">
          <div className="auth-card card">
            <div className="auth-head">
              <span className="badge">
                {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
                {mode === 'login' ? 'Entrar' : 'Criar conta'}
              </span>

              <h1 className="section-title">
                {mode === 'login' ? 'Acesse sua conta' : 'Cadastre-se'}
              </h1>

              <p className="section-subtitle">
                {mode === 'login'
                  ? 'Entre para salvar seus dados e facilitar seus próximos pedidos.'
                  : 'Crie sua conta para salvar endereço, telefone e acompanhar seus pedidos.'}
              </p>
            </div>

            <div className="auth-switch">
              <button
                type="button"
                className={mode === 'login' ? 'auth-switch-btn active' : 'auth-switch-btn'}
                onClick={() => setMode('login')}
              >
                Login
              </button>

              <button
                type="button"
                className={mode === 'register' ? 'auth-switch-btn active' : 'auth-switch-btn'}
                onClick={() => setMode('register')}
              >
                Cadastro
              </button>
            </div>

            <div className="auth-social">
              <button
                type="button"
                className="btn btn-secondary auth-google-btn"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                {googleLoading ? 'Abrindo Google...' : 'Continuar com Google'}
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="checkout-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seuemail@exemplo.com"
                />
              </div>

              <div className="checkout-field">
                <label>Senha</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Sua senha"
                />
              </div>

              {mode === 'register' && (
                <div className="checkout-field">
                  <label>Confirmar senha</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme sua senha"
                  />
                </div>
              )}

              {message && <div className="auth-message success">{message}</div>}
              {errorMessage && <div className="auth-message error">{errorMessage}</div>}

              <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                {loading
                  ? 'Carregando...'
                  : mode === 'login'
                  ? 'Entrar'
                  : 'Criar conta'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}