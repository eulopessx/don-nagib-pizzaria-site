import logoDonNagib from '../../assets/images/logo-don-nagib.png'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-shell card">
          <div className="footer-brand">
            <img src={logoDonNagib} alt="Don Nagib Pizzaria Delivery" />
            <p>
              Ingredientes de qualidade, massa crocante por fora, macia por dentro
              e tudo feito com carinho.
            </p>
          </div>

          <div className="footer-column">
            <h3>Contato</h3>
            <p>WhatsApp: (12) 99232-5636</p>
            <p>E-mail: jeannagibb@gmail.com</p>
            <p>18:00 às 23:59</p>
          </div>

          <div className="footer-column">
            <h3>Endereço</h3>
            <p>Rua Iracema Souraty Ruve 378</p>
            <p>Pindamonhangaba - SP</p>
          </div>
        </div>
      </div>
    </footer>
  )
}