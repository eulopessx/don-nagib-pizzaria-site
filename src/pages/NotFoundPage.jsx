import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Página não encontrada</h1>
        <p className="section-subtitle">
          A página que você tentou acessar não existe.
        </p>

        <div style={{ marginTop: '24px' }}>
          <Link to="/" className="btn btn-primary">
            Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  )
}