import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, MapPin, ShoppingBag, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { deliveryZones } from '../data/deliveryZones'

export default function CheckoutPage() {
  const { cartItems, subtotal } = useCart()

  const [deliveryType, setDeliveryType] = useState('delivery')
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    notes: '',
    changeFor: '',
  })

  const deliveryFee = useMemo(() => {
    if (deliveryType !== 'delivery') return 0

    const selectedZone = deliveryZones.find(
      (zone) => zone.neighborhood === customerData.neighborhood
    )

    return selectedZone ? selectedZone.fee : 0
  }, [deliveryType, customerData.neighborhood])

  const total = subtotal + deliveryFee

  function handleChange(event) {
    const { name, value } = event.target
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function formatMoney(value) {
    return value.toFixed(2).replace('.', ',')
  }

  function getPaymentLabel() {
    if (paymentMethod === 'pix') return 'Pix'
    if (paymentMethod === 'card') return 'Cartão'
    if (paymentMethod === 'cash') return 'Dinheiro'
    return paymentMethod
  }

  function handleFinishOrder() {
    if (!customerData.name.trim()) {
      alert('Preencha o nome do cliente.')
      return
    }

    if (!customerData.phone.trim()) {
      alert('Preencha o telefone.')
      return
    }

    if (deliveryType === 'delivery') {
      if (!customerData.street.trim()) {
        alert('Preencha a rua.')
        return
      }

      if (!customerData.number.trim()) {
        alert('Preencha o número.')
        return
      }

      if (!customerData.neighborhood.trim()) {
        alert('Selecione o bairro.')
        return
      }
    }

    const itemsText = cartItems
      .map((item) => {
        const sizeText = item.size ? ` | Tamanho ${item.size}` : ''
        const totalItem = Number(item.price) * item.quantity

        return `• ${item.quantity}x ${item.name}${sizeText} — R$ ${formatMoney(totalItem)}`
      })
      .join('\n')

    const addressText =
      deliveryType === 'delivery'
        ? `Rua: ${customerData.street}, Nº ${customerData.number}
Bairro: ${customerData.neighborhood}
Complemento: ${customerData.complement || 'Não informado'}`
        : 'Retirada no local'

    const changeText =
      paymentMethod === 'cash'
        ? `Troco para: ${customerData.changeFor || 'Não informado'}`
        : ''

    const message = `🍕 *Novo pedido - Don Nagib*

*Cliente:* ${customerData.name}
*Telefone:* ${customerData.phone}

*Tipo:* ${deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}

*Endereço / Retirada:*
${addressText}

*Itens do pedido:*
${itemsText}

*Subtotal:* R$ ${formatMoney(subtotal)}
*Taxa de entrega:* ${deliveryType === 'delivery' ? `R$ ${formatMoney(deliveryFee)}` : 'Grátis'}
*Total:* R$ ${formatMoney(total)}

*Pagamento:* ${getPaymentLabel()}
${changeText ? `*${changeText}*\n` : ''}${customerData.notes ? `*Observações:* ${customerData.notes}` : '*Observações:* Nenhuma'}`

    const whatsappNumber = '5512992325636'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank')
  }

  const formattedSubtotal = formatMoney(subtotal)
  const formattedDeliveryFee = formatMoney(deliveryFee)
  const formattedTotal = formatMoney(total)

  if (cartItems.length === 0) {
    return (
      <main className="section">
        <div className="container">
          <div className="empty-cart card">
            <h2>Seu carrinho está vazio</h2>
            <p>Adicione itens antes de seguir para o checkout.</p>
            <Link to="/cardapio" className="btn btn-primary">
              Ir para o cardápio
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="section">
      <div className="container">
        <div className="section-heading">
          <span className="badge">
            <ShoppingBag size={16} />
            Finalizar pedido
          </span>
          <h1 className="section-title">Checkout</h1>
          <p className="section-subtitle">
            Preencha os dados para entrega ou retirada e revise o total do pedido.
          </p>
        </div>

        <div className="checkout-layout">
          <div className="checkout-form-area">
            <section className="checkout-card card">
              <div className="checkout-card-head">
                <Truck size={18} />
                <h2>Tipo de pedido</h2>
              </div>

              <div className="checkout-toggle-group">
                <button
                  type="button"
                  className={
                    deliveryType === 'delivery'
                      ? 'checkout-toggle-btn active'
                      : 'checkout-toggle-btn'
                  }
                  onClick={() => setDeliveryType('delivery')}
                >
                  Entrega
                </button>

                <button
                  type="button"
                  className={
                    deliveryType === 'pickup'
                      ? 'checkout-toggle-btn active'
                      : 'checkout-toggle-btn'
                  }
                  onClick={() => setDeliveryType('pickup')}
                >
                  Retirada
                </button>
              </div>
            </section>

            <section className="checkout-card card">
              <div className="checkout-card-head">
                <MapPin size={18} />
                <h2>Dados do cliente</h2>
              </div>

              <div className="checkout-form-grid">
                <div className="checkout-field">
                  <label>Nome</label>
                  <input
                    name="name"
                    value={customerData.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                  />
                </div>

                <div className="checkout-field">
                  <label>Telefone</label>
                  <input
                    name="phone"
                    value={customerData.phone}
                    onChange={handleChange}
                    placeholder="(12) 99999-9999"
                  />
                </div>

                {deliveryType === 'delivery' && (
                  <>
                    <div className="checkout-field">
                      <label>Rua</label>
                      <input
                        name="street"
                        value={customerData.street}
                        onChange={handleChange}
                        placeholder="Rua / Avenida"
                      />
                    </div>

                    <div className="checkout-field">
                      <label>Número</label>
                      <input
                        name="number"
                        value={customerData.number}
                        onChange={handleChange}
                        placeholder="Número"
                      />
                    </div>

                    <div className="checkout-field">
                      <label>Bairro</label>
                      <select
                        name="neighborhood"
                        value={customerData.neighborhood}
                        onChange={handleChange}
                      >
                        <option value="">Selecione o bairro</option>
                        {deliveryZones.map((zone) => (
                          <option key={zone.neighborhood} value={zone.neighborhood}>
                            {zone.neighborhood} — R$ {zone.fee.toFixed(2).replace('.', ',')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="checkout-field">
                      <label>Complemento</label>
                      <input
                        name="complement"
                        value={customerData.complement}
                        onChange={handleChange}
                        placeholder="Casa, ap, referência..."
                      />
                    </div>
                  </>
                )}

                <div className="checkout-field checkout-field-full">
                  <label>Observações</label>
                  <textarea
                    name="notes"
                    value={customerData.notes}
                    onChange={handleChange}
                    placeholder="Alguma observação sobre o pedido?"
                    rows="4"
                  />
                </div>
              </div>
            </section>

            <section className="checkout-card card">
              <div className="checkout-card-head">
                <CreditCard size={18} />
                <h2>Pagamento</h2>
              </div>

              <div className="checkout-payment-options">
                <button
                  type="button"
                  className={
                    paymentMethod === 'pix'
                      ? 'checkout-toggle-btn active'
                      : 'checkout-toggle-btn'
                  }
                  onClick={() => setPaymentMethod('pix')}
                >
                  Pix
                </button>

                <button
                  type="button"
                  className={
                    paymentMethod === 'card'
                      ? 'checkout-toggle-btn active'
                      : 'checkout-toggle-btn'
                  }
                  onClick={() => setPaymentMethod('card')}
                >
                  Cartão
                </button>

                <button
                  type="button"
                  className={
                    paymentMethod === 'cash'
                      ? 'checkout-toggle-btn active'
                      : 'checkout-toggle-btn'
                  }
                  onClick={() => setPaymentMethod('cash')}
                >
                  Dinheiro
                </button>
              </div>

              {paymentMethod === 'cash' && (
                <div className="checkout-form-grid checkout-cash-grid">
                  <div className="checkout-field">
                    <label>Troco para quanto?</label>
                    <input
                      name="changeFor"
                      value={customerData.changeFor}
                      onChange={handleChange}
                      placeholder="Ex: 100,00"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="checkout-summary card">
            <h2>Resumo do pedido</h2>

            <div className="checkout-summary-items">
              {cartItems.map((item) => (
                <div
                  key={`${item.name}-${item.size ?? 'unico'}`}
                  className="checkout-summary-item"
                >
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {item.size ? `Tamanho ${item.size}` : 'Item único'} • Qtd. {item.quantity}
                    </p>
                  </div>

                  <span>
                    R$ {(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-summary-totals">
              <div className="checkout-summary-line">
                <span>Subtotal</span>
                <strong>R$ {formattedSubtotal}</strong>
              </div>

              <div className="checkout-summary-line">
                <span>Entrega</span>
                <strong>
                  {deliveryType === 'pickup'
                    ? 'Grátis'
                    : customerData.neighborhood
                    ? `R$ ${formattedDeliveryFee}`
                    : 'Selecione o bairro'}
                </strong>
              </div>

              <div className="checkout-summary-line checkout-summary-total">
                <span>Total</span>
                <strong>R$ {formattedTotal}</strong>
              </div>
            </div>

            <button className="btn btn-primary checkout-finish-btn" onClick={handleFinishOrder}>
              Finalizar pedido no WhatsApp
            </button>

            <p className="checkout-summary-note">
              O pedido será enviado com todos os dados preenchidos para o WhatsApp da pizzaria.
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}