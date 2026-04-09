import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    clearCart,
  } = useCart()

  const formattedSubtotal = subtotal.toFixed(2).replace('.', ',')

  return (
    <main className="section">
      <div className="container">
        <div className="section-heading">
          <span className="badge">
            <ShoppingCart size={16} />
            Seu carrinho
          </span>
          <h1 className="section-title">Confira seu pedido</h1>
          <p className="section-subtitle">
            Revise os itens antes de seguir para o checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart card">
            <h2>Seu carrinho está vazio</h2>
            <p>Adicione pizzas, bebidas ou adicionais para continuar.</p>
            <Link to="/cardapio" className="btn btn-primary">
              Ir para o cardápio
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item) => (
                <article
                  key={`${item.name}-${item.size ?? 'unico'}-${item.halfHalf?.flavorOne ?? ''}-${item.halfHalf?.flavorTwo ?? ''}`}
                  className="cart-item card"
                >
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>

                    {item.halfHalf ? (
                      <p>
                        Meio a meio: {item.halfHalf.flavorOne} / {item.halfHalf.flavorTwo} •
                        Tamanho {item.size} • R$ {item.price.toFixed(2).replace('.', ',')}
                      </p>
                    ) : (
                      <p>
                        {item.size ? `Tamanho ${item.size}` : 'Item único'} • R${' '}
                        {item.price.toFixed(2).replace('.', ',')}
                      </p>
                    )}
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-qty-controls">
                      <button onClick={() => decreaseQuantity(item.name, item.size)}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.name, item.size)}>
                        <Plus size={16} />
                      </button>
                    </div>

                    <strong className="cart-item-total">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </strong>

                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.name, item.size)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-summary card">
              <h2>Resumo</h2>
              <div className="cart-summary-line">
                <span>Subtotal</span>
                <strong>R$ {formattedSubtotal}</strong>
              </div>

              <p className="cart-summary-note">
                A taxa de entrega e a forma de pagamento serão definidas no checkout.
              </p>

              <div className="cart-summary-actions">
                <Link to="/checkout" className="btn btn-primary">
                  Ir para checkout
                </Link>

                <button className="btn btn-secondary" onClick={clearCart}>
                  Limpar carrinho
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}