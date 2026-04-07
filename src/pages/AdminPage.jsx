import { useMemo, useState } from 'react'
import { Search, ShieldCheck, Pizza, Sparkles } from 'lucide-react'
import { menuCategories } from '../data/menuData'

function flattenMenu(categories) {
  return categories.flatMap((category) =>
    category.items.map((item) => ({
      categoryId: category.id,
      categoryTitle: category.title,
      ...item,
    }))
  )
}

export default function AdminPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const allProducts = useMemo(() => flattenMenu(menuCategories), [])

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.categoryId === selectedCategory

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [allProducts, search, selectedCategory])

  return (
    <main className="section">
      <div className="container">
        <div className="section-heading">
          <span className="badge">
            <ShieldCheck size={16} />
            Painel administrativo
          </span>
          <h1 className="section-title">Gerenciar cardápio</h1>
          <p className="section-subtitle">
            Visualize os produtos da Don Nagib e prepare a base para edição,
            cadastro e integração com Supabase.
          </p>
        </div>

        <div className="admin-toolbar card">
          <div className="admin-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas as categorias</option>
              {menuCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-summary-grid">
          <div className="admin-summary-card card">
            <Pizza size={20} />
            <strong>{allProducts.length}</strong>
            <span>Total de itens</span>
          </div>

          <div className="admin-summary-card card">
            <Sparkles size={20} />
            <strong>{menuCategories.length}</strong>
            <span>Categorias</span>
          </div>

          <div className="admin-summary-card card">
            <Search size={20} />
            <strong>{filteredProducts.length}</strong>
            <span>Resultados</span>
          </div>
        </div>

        <div className="admin-products-grid">
          {filteredProducts.map((product) => (
            <article key={`${product.categoryId}-${product.name}`} className="admin-product-card card">
              <div className="admin-product-top">
                <span className="admin-product-category">{product.categoryTitle}</span>
                <h3>{product.name}</h3>
              </div>

              {product.description && <p>{product.description}</p>}

              {product.sizes ? (
                <div className="admin-product-prices">
                  <div className="admin-price-pill">
                    <span>M</span>
                    <strong>R$ {product.sizes.m}</strong>
                  </div>
                  <div className="admin-price-pill">
                    <span>G</span>
                    <strong>R$ {product.sizes.g}</strong>
                  </div>
                </div>
              ) : (
                <div className="admin-product-prices">
                  <div className="admin-price-pill single">
                    <span>Único</span>
                    <strong>R$ {product.price}</strong>
                  </div>
                </div>
              )}

              <div className="admin-card-actions">
                <button className="btn btn-secondary" type="button">
                  Editar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}