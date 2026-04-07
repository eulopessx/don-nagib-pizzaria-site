import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react'
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../services/productService'

const initialForm = {
  name: '',
  description: '',
  category: 'Promocional',
  has_sizes: true,
  price_m: '',
  price_g: '',
  price_single: '',
  active: true,
}

export default function AdminPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState(initialForm)

  async function loadProducts() {
    setLoading(true)
    const { data, error } = await getProducts()

    if (error) {
      setErrorMessage(error.message)
    } else {
      setProducts(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setErrorMessage('')

    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      has_sizes: formData.has_sizes,
      price_m: formData.has_sizes && formData.price_m ? Number(String(formData.price_m).replace(',', '.')) : null,
      price_g: formData.has_sizes && formData.price_g ? Number(String(formData.price_g).replace(',', '.')) : null,
      price_single: !formData.has_sizes && formData.price_single ? Number(String(formData.price_single).replace(',', '.')) : null,
      active: formData.active,
    }

    const result = editingId
      ? await updateProduct(editingId, payload)
      : await createProduct(payload)

    if (result.error) {
      setErrorMessage(result.error.message)
    } else {
      setMessage(editingId ? 'Produto atualizado com sucesso.' : 'Produto criado com sucesso.')
      setFormData(initialForm)
      setEditingId(null)
      await loadProducts()
    }

    setSaving(false)
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'Promocional',
      has_sizes: product.has_sizes,
      price_m: product.price_m ?? '',
      price_g: product.price_g ?? '',
      price_single: product.price_single ?? '',
      active: product.active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Deseja excluir este produto?')
    if (!confirmed) return

    const { error } = await deleteProduct(id)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setMessage('Produto excluído com sucesso.')
    await loadProducts()
  }

  function resetForm() {
    setEditingId(null)
    setFormData(initialForm)
    setMessage('')
    setErrorMessage('')
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = `${product.name} ${product.description || ''} ${product.category}`.toLowerCase()
      return text.includes(search.toLowerCase())
    })
  }, [products, search])

  return (
    <main className="section">
      <div className="container">
        <div className="section-heading">
          <span className="badge">
            <ShieldCheck size={16} />
            Painel administrativo
          </span>
          <h1 className="section-title">Gerenciar produtos</h1>
          <p className="section-subtitle">
            Cadastre, edite e exclua itens do cardápio direto pelo painel.
          </p>
        </div>

        <form className="admin-form card" onSubmit={handleSubmit}>
          <div className="checkout-card-head">
            <Plus size={18} />
            <h2>{editingId ? 'Editar produto' : 'Novo produto'}</h2>
          </div>

          <div className="checkout-form-grid">
            <div className="checkout-field">
              <label>Nome</label>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome do produto" />
            </div>

            <div className="checkout-field">
              <label>Categoria</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option>Promocional</option>
                <option>Tradicional</option>
                <option>Premium</option>
                <option>Pizzas Doces</option>
                <option>Bebidas</option>
                <option>Adicionais</option>
              </select>
            </div>

            <div className="checkout-field checkout-field-full">
              <label>Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Descrição do produto"
              />
            </div>

            <div className="checkout-field">
              <label>
                <input
                  type="checkbox"
                  name="has_sizes"
                  checked={formData.has_sizes}
                  onChange={handleChange}
                />{' '}
                Possui tamanhos M e G
              </label>
            </div>

            <div className="checkout-field">
              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />{' '}
                Produto ativo
              </label>
            </div>

            {formData.has_sizes ? (
              <>
                <div className="checkout-field">
                  <label>Preço M</label>
                  <input name="price_m" value={formData.price_m} onChange={handleChange} placeholder="29,90" />
                </div>

                <div className="checkout-field">
                  <label>Preço G</label>
                  <input name="price_g" value={formData.price_g} onChange={handleChange} placeholder="35,00" />
                </div>
              </>
            ) : (
              <div className="checkout-field">
                <label>Preço único</label>
                <input
                  name="price_single"
                  value={formData.price_single}
                  onChange={handleChange}
                  placeholder="15,00"
                />
              </div>
            )}
          </div>

          {message && <div className="auth-message success">{message}</div>}
          {errorMessage && <div className="auth-message error">{errorMessage}</div>}

          <div className="admin-form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : editingId ? 'Atualizar produto' : 'Cadastrar produto'}
            </button>

            <button className="btn btn-secondary" type="button" onClick={resetForm}>
              Limpar formulário
            </button>
          </div>
        </form>

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
        </div>

        {loading ? (
          <div className="card" style={{ padding: '24px' }}>Carregando produtos...</div>
        ) : (
          <div className="admin-products-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="admin-product-card card">
                <div className="admin-product-top">
                  <span className="admin-product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                </div>

                {product.description && <p>{product.description}</p>}

                <div className="admin-product-prices">
                  {product.has_sizes ? (
                    <>
                      <div className="admin-price-pill">
                        <span>M</span>
                        <strong>R$ {Number(product.price_m || 0).toFixed(2).replace('.', ',')}</strong>
                      </div>
                      <div className="admin-price-pill">
                        <span>G</span>
                        <strong>R$ {Number(product.price_g || 0).toFixed(2).replace('.', ',')}</strong>
                      </div>
                    </>
                  ) : (
                    <div className="admin-price-pill single">
                      <span>Único</span>
                      <strong>R$ {Number(product.price_single || 0).toFixed(2).replace('.', ',')}</strong>
                    </div>
                  )}
                </div>

                <div className="admin-card-actions">
                  <button className="btn btn-secondary" type="button" onClick={() => handleEdit(product)}>
                    <Pencil size={16} />
                    Editar
                  </button>

                  <button className="btn btn-secondary" type="button" onClick={() => handleDelete(product.id)}>
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}