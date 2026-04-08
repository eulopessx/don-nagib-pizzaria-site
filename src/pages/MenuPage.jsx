import { Pizza, Sparkles, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { usePublicMenu } from '../hooks/usePublicMenu'

export default function MenuPage() {
  const { addToCart } = useCart()
  const { groupedCategories, loading } = usePublicMenu()

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

                        {(item.has_size_m || item.has_size_g) ? (
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