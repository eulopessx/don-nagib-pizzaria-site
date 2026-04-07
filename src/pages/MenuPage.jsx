import { menuCategories } from '../data/menuData'
import { Pizza, Sparkles, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function MenuPage() {
  const { addToCart } = useCart()

  function handleAddPizza(item, sizeLabel, price) {
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
      price: item.price,
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
            Pizzas promocionais, tradicionais, premium, doces, bebidas e adicionais
            em um cardápio organizado e fácil de navegar.
          </p>
        </div>

        <div className="menu-category-links card">
          {menuCategories.map((category) => (
            <a key={category.id} href={`#${category.id}`} className="menu-category-link">
              {category.title}
            </a>
          ))}
        </div>

        <div className="menu-sections">
          {menuCategories.map((category) => (
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
                  <article key={item.name} className="menu-item-card card">
                    <div className="menu-item-top">
                      <h3>{item.name}</h3>
                    </div>

                    {item.description && <p>{item.description}</p>}

                    {item.sizes ? (
                      <div className="menu-prices menu-prices-actions">
                        <div className="menu-price-box">
                          <span>M</span>
                          <strong>R$ {item.sizes.m}</strong>
                          <button
                            className="menu-add-btn"
                            onClick={() => handleAddPizza(item, 'M', item.sizes.m)}
                          >
                            <ShoppingCart size={16} />
                            Adicionar
                          </button>
                        </div>

                        <div className="menu-price-box">
                          <span>G</span>
                          <strong>R$ {item.sizes.g}</strong>
                          <button
                            className="menu-add-btn"
                            onClick={() => handleAddPizza(item, 'G', item.sizes.g)}
                          >
                            <ShoppingCart size={16} />
                            Adicionar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="menu-single-price menu-single-price-action">
                        <strong>R$ {item.price}</strong>
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
      </div>
    </main>
  )
}