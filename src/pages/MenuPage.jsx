import { useMemo, useState } from 'react'
import { Pizza, Sparkles, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { usePublicMenu } from '../hooks/usePublicMenu'
import { useSiteSettings } from '../hooks/useSiteSettings'

export default function MenuPage() {
  const { addToCart } = useCart()
  const { groupedCategories, loading, products } = usePublicMenu()
  const { settings } = useSiteSettings()

  const [halfFlavorOne, setHalfFlavorOne] = useState('')
  const [halfFlavorTwo, setHalfFlavorTwo] = useState('')
  const [halfSize, setHalfSize] = useState('M')

  const allowedHalfHalfCategories = useMemo(() => {
    return settings.halfHalfAllowedCategories
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }, [settings.halfHalfAllowedCategories])

  const pizzaFlavors = useMemo(() => {
    return products.filter(
      (item) =>
        allowedHalfHalfCategories.includes(item.category) &&
        (item.has_size_m || item.has_size_g)
    )
  }, [products, allowedHalfHalfCategories])

  const halfFlavorOneData = useMemo(
    () => pizzaFlavors.find((item) => item.id === halfFlavorOne),
    [pizzaFlavors, halfFlavorOne]
  )

  const halfFlavorTwoData = useMemo(
    () => pizzaFlavors.find((item) => item.id === halfFlavorTwo),
    [pizzaFlavors, halfFlavorTwo]
  )

  const halfHalfPrice = useMemo(() => {
    if (!halfFlavorOneData || !halfFlavorTwoData) return null

    const priceOne =
      halfSize === 'M'
        ? Number(halfFlavorOneData.price_m || 0)
        : Number(halfFlavorOneData.price_g || 0)

    const priceTwo =
      halfSize === 'M'
        ? Number(halfFlavorTwoData.price_m || 0)
        : Number(halfFlavorTwoData.price_g || 0)

    if (!priceOne || !priceTwo) return null

    return Math.max(priceOne, priceTwo)
  }, [halfFlavorOneData, halfFlavorTwoData, halfSize])

  function handleAddSizedProduct(item, sizeLabel, price) {
    addToCart({
      name: item.name,
      size: sizeLabel,
      price,
    })
  }

  function handleAddSingleItem(item) {
    addToCart({
      name: item.name,
      size: null,
      price: item.price_single,
    })
  }

  function handleAddHalfAndHalf() {
    if (!halfFlavorOne || !halfFlavorTwo) {
      alert('Selecione os dois sabores.')
      return
    }

    if (halfFlavorOne === halfFlavorTwo) {
      alert('Escolha dois sabores diferentes.')
      return
    }

    if (!halfFlavorOneData || !halfFlavorTwoData) {
      alert('Sabores inválidos.')
      return
    }

    if (
      !allowedHalfHalfCategories.includes(halfFlavorOneData.category) ||
      !allowedHalfHalfCategories.includes(halfFlavorTwoData.category)
    ) {
      alert('Esses sabores não podem ser usados no meio a meio.')
      return
    }

    if (!halfHalfPrice) {
      alert(`Um dos sabores não possui tamanho ${halfSize}.`)
      return
    }

    addToCart({
      name: `Pizza Meio a Meio`,
      size: halfSize,
      price: halfHalfPrice,
      halfHalf: {
        flavorOne: halfFlavorOneData.name,
        flavorTwo: halfFlavorTwoData.name,
      },
    })

    setHalfFlavorOne('')
    setHalfFlavorTwo('')
    setHalfSize('M')
  }

  return (
    <main className="section">
      <div className="container">
        <div className="section-heading">
          <span className="badge">
            <Pizza size={16} />
            Cardápio Don Nagib
          </span>
          <h1 className="section-title">Escolha seu sabor ideal</h1>
          <p className="section-subtitle">
            Cardápio carregado diretamente do painel administrativo.
          </p>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '24px' }}>
            Carregando cardápio...
          </div>
        ) : groupedCategories.length === 0 ? (
          <div className="card" style={{ padding: '24px' }}>
            Nenhum produto ativo encontrado no cardápio.
          </div>
        ) : (
          <>
            <section className="half-half-card card">
              <div className="menu-section-head">
                <span className="badge">
                  <Sparkles size={15} />
                  Monte sua pizza meio a meio
                </span>
                <h2 className="menu-section-title">Escolha 2 sabores</h2>
                <p className="section-subtitle">
                  O valor da pizza meio a meio será definido pelo sabor de maior valor, conforme o tamanho selecionado.
                </p>
              </div>

              <div className="half-half-grid">
                <div className="checkout-field">
                  <label>Primeira metade</label>
                  <select
                    value={halfFlavorOne}
                    onChange={(e) => setHalfFlavorOne(e.target.value)}
                  >
                    <option value="">Selecione o primeiro sabor</option>
                    {pizzaFlavors.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.category} — {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="checkout-field">
                  <label>Segunda metade</label>
                  <select
                    value={halfFlavorTwo}
                    onChange={(e) => setHalfFlavorTwo(e.target.value)}
                  >
                    <option value="">Selecione o segundo sabor</option>
                    {pizzaFlavors.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.category} — {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="checkout-field">
                  <label>Tamanho</label>
                  <select value={halfSize} onChange={(e) => setHalfSize(e.target.value)}>
                    <option value="M">M</option>
                    <option value="G">G</option>
                  </select>
                </div>

                <div className="half-half-action">
                  <button className="menu-add-btn" onClick={handleAddHalfAndHalf}>
                    <ShoppingCart size={16} />
                    Adicionar pizza meio a meio
                  </button>
                </div>
              </div>

              <div className="half-half-preview">
                <strong>Preço calculado:</strong>{' '}
                {halfHalfPrice
                  ? `R$ ${halfHalfPrice.toFixed(2).replace('.', ',')}`
                  : 'Selecione dois sabores válidos'}
              </div>
            </section>

            <div className="menu-category-links card">
              {groupedCategories.map((category) => (
                <a key={category.id} href={`#${category.id}`} className="menu-category-link">
                  {category.title}
                </a>
              ))}
            </div>

            <div className="menu-sections">
              {groupedCategories.map((category) => (
                <section key={category.id} id={category.id} className="menu-section-block">
                  <div className="menu-section-head">
                    <span className="badge">
                      <Sparkles size={15} />
                      {category.title}
                    </span>
                    <h2 className="menu-section-title">{category.title}</h2>
                  </div>

                  <div className="menu-items-grid">
                    {category.items.map((item) => (
                      <article key={item.id} className="menu-item-card card">
                        <div className="menu-item-top">
                          <h3>{item.name}</h3>
                        </div>

                        {item.description && <p>{item.description}</p>}

                        {item.has_size_m || item.has_size_g ? (
                          <div className="menu-prices menu-prices-actions">
                            {item.has_size_m && (
                              <div className="menu-price-box">
                                <span>M</span>
                                <strong>
                                  R$ {Number(item.price_m || 0).toFixed(2).replace('.', ',')}
                                </strong>
                                <button
                                  className="menu-add-btn"
                                  onClick={() =>
                                    handleAddSizedProduct(
                                      item,
                                      'M',
                                      Number(item.price_m || 0)
                                    )
                                  }
                                >
                                  <ShoppingCart size={16} />
                                  Adicionar
                                </button>
                              </div>
                            )}

                            {item.has_size_g && (
                              <div className="menu-price-box">
                                <span>G</span>
                                <strong>
                                  R$ {Number(item.price_g || 0).toFixed(2).replace('.', ',')}
                                </strong>
                                <button
                                  className="menu-add-btn"
                                  onClick={() =>
                                    handleAddSizedProduct(
                                      item,
                                      'G',
                                      Number(item.price_g || 0)
                                    )
                                  }
                                >
                                  <ShoppingCart size={16} />
                                  Adicionar
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="menu-single-price menu-single-price-action">
                            <strong>
                              R$ {Number(item.price_single || 0).toFixed(2).replace('.', ',')}
                            </strong>
                            <button
                              className="menu-add-btn"
                              onClick={() => handleAddSingleItem(item)}
                            >
                              <ShoppingCart size={16} />
                              Adicionar
                            </button>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}