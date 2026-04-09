import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, MapPin, ShoppingBag, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getMyDefaultAddress, getMyProfile } from '../services/accountService'
import { useDeliveryZones } from '../hooks/useDeliveryZones'

export default function CheckoutPage() {
  const { cartItems, subtotal } = useCart()
  const { user } = useAuth()
  const { zones: deliveryZones, loading: deliveryZonesLoading } = useDeliveryZones()

  const [deliveryType, setDeliveryType] = useState('delivery')
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [cardType, setCardType] = useState('credit')
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

  useEffect(() => {
    async function loadSavedData() {
      if (!user?.id) return

      const [profileResult, addressResult] = await Promise.all([
        getMyProfile(user.id),
        getMyDefaultAddress(user.id),
      ])

      if (profileResult.data) {
        setCustomerData((prev) => ({
          ...prev,
          name: profileResult.data.full_name || '',
          phone: profileResult.data.phone || '',
        }))
      }

      if (addressResult.data) {
        setCustomerData((prev) => ({
          ...prev,
          street: addressResult.data.street || '',
          number: addressResult.data.number || '',
          neighborhood: addressResult.data.neighborhood || '',
          complement: addressResult.data.complement || '',
        }))
      }
    }

    loadSavedData()
  }, [user])

  const deliveryFee = useMemo(() => {
    if (deliveryType !== 'delivery') return 0

    const selectedZone = deliveryZones.find(
      (zone) => zone.neighborhood === customerData.neighborhood
    )

    return selectedZone ? Number(selectedZone.fee) : 0
  }, [deliveryType, customerData.neighborhood, deliveryZones])

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
    if (paymentMethod === 'card') {
      return cardType === 'debit' ? 'Cartão - Débito' : 'Cartão - Crédito'
    }
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
    const totalItem = item.price * item.quantity

    if (item.halfHalf) {
      return `• ${item.quantity}x Pizza Meio a Meio | Tamanho ${item.size}
  - 1/2 ${item.halfHalf.flavorOne}
  - 1/2 ${item.halfHalf.flavorTwo}
  - Valor aplicado: R$ ${formatMoney(totalItem)}`
    }

    const sizeText = item.size ? ` | Tamanho ${item.size}` : ''
    return `• ${item.quantity}x ${item.name}${sizeText} — R$ ${formatMoney(totalItem)}`
  })
  .join('\n')

    const addressText =
      deliveryType === 'delivery'
        ? `*Endereço:*
Rua: ${customerData.street}, Nº ${customerData.number}
Bairro: ${customerData.neighborhood}
Complemento: ${customerData.complement || 'Não informado'}`
        : '*Retirada:* No local'

    const changeText =
      paymentMethod === 'cash'
        ? `Troco para: ${customerData.changeFor || 'Não informado'}`
        : ''

    const message = `🍕 *Novo pedido - Don Nagib*

*Cliente:* ${customerData.name}
*Telefone:* ${customerData.phone}

*Tipo:* ${deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}

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
                  className={deliveryType === 'delivery' ? 'checkout-toggle-btn active' : 'checkout-toggle-btn'}
                  onClick={() => setDeliveryType('delivery')}
                >
                  Entrega
                </button>

                <button
                  type="button"
                  className={deliveryType === 'pickup' ? 'checkout-toggle-btn active' : 'checkout-toggle-btn'}
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
                  <input name="name" value={customerData.name} onChange={handleChange} placeholder="Seu nome" />
                </div>

                <div className="checkout-field">
                  <label>Telefone</label>
                  <input name="phone" value={customerData.phone} onChange={handleChange} placeholder="(12) 99999-9999" />
                </div>

                {deliveryType === 'delivery' && (
                  <>
                    <div className="checkout-field">
                      <label>Rua</label>
                      <input name="street" value={customerData.street} onChange={handleChange} placeholder="Rua / Avenida" />
                    </div>

                    <div className="checkout-field">
                      <label>Número</label>
                      <input name="number" value={customerData.number} onChange={handleChange} placeholder="Número" />
                    </div>

                    <div className="checkout-field">
                      <label>Bairro</label>
                      <select name="neighborhood" value={customerData.neighborhood} onChange={handleChange}>
                        <option value="">
                          {deliveryZonesLoading ? 'Carregando bairros...' : 'Selecione o bairro'}
                        </option>
                        {deliveryZones.map((zone) => (
                          <option key={zone.id} value={zone.neighborhood}>
                            {zone.neighborhood} — R$ {Number(zone.fee).toFixed(2).replace('.', ',')}
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
                  className={paymentMethod === 'pix' ? 'checkout-toggle-btn active' : 'checkout-toggle-btn'}
                  onClick={() => setPaymentMethod('pix')}
                >
                  Pix
                </button>

                <button
                  type="button"
                  className={paymentMethod === 'card' ? 'checkout-toggle-btn active' : 'checkout-toggle-btn'}
                  onClick={() => setPaymentMethod('card')}
                >
                  Cartão
                </button>

                <button
                  type="button"
                  className={paymentMethod === 'cash' ? 'checkout-toggle-btn active' : 'checkout-toggle-btn'}
                  onClick={() => setPaymentMethod('cash')}
                >
                  Dinheiro
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="checkout-payment-options checkout-suboptions">
                  <button
                    type="button"
                    className={cardType === 'credit' ? 'checkout-toggle-btn active' : 'checkout-toggle-btn'}
                    onClick={() => setCardType('credit')}
                  >
                    Crédito
                  </button>

                  <button
                    type="button"
                    className={cardType === 'debit' ? 'checkout-toggle-btn active' : 'checkout-toggle-btn'}
                    onClick={() => setCardType('debit')}
                  >
                    Débito
                  </button>
                </div>
              )}

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
                <div key={`${item.name}-${item.size ?? 'unico'}`} className="checkout-summary-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {item.size ? `Tamanho ${item.size}` : 'Item único'} • Qtd. {item.quantity}
                    </p>
                  </div>

                  <span>
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
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