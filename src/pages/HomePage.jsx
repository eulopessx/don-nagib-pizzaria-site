import { Link } from 'react-router-dom'
import {
  FlameKindling,
  MapPin,
  Phone,
  Pizza,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'
import logoDonNagib from '../assets/images/logo-don-nagib.png'

const featuredPizzas = [
  {
    name: 'Mussarela Promocional',
    description: 'Molho de tomate, mussarela, tomate, orégano e azeitona.',
    price: 'R$ 29,90',
  },
  {
    name: 'Calabresa',
    description: 'Molho de tomate, mussarela, calabresa, cebola, orégano e azeitona.',
    price: 'R$ 29,90',
  },
  {
    name: 'Suprema Don Nagib',
    description:
      'Presunto, palmito, ervilha, milho, lombo, frango, calabresa, bacon, cebola, orégano e azeitona.',
    price: 'R$ 69,90',
  },
]

const deliveryFees = [
  { region: 'Liberdade, Cdhu, Vale das Acácias, César Park, Portal dos Eucaliptos', fee: 'R$ 3,00' },
  { region: 'Ipê 1, Ipê 2, Mantiqueira, Pasin, Vila São Benedito, Vila São João, Vila São José', fee: 'R$ 4,00' },
  { region: 'Centro de Moreira César, Azeredo, Laerte Assunção, Padre Rodolfo', fee: 'R$ 5,00' },
  { region: 'Jardim Regina, Feital, Cidade Nova, Bairro das Campinas', fee: 'R$ 10,00' },
  { region: 'Centro de Pindamonhangaba', fee: 'R$ 12,00' },
]

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid card">
            <div className="hero-content">
              <span className="badge">
                <FlameKindling size={16} />
                Sabor marcante, entrega rápida
              </span>

              <h1 className="hero-title">
                A pizza que conquista no primeiro pedaço.
              </h1>

              <p className="hero-text">
                Ingredientes de qualidade, massa crocante por fora, macia por dentro
                e tudo feito com muito carinho para transformar sua noite em um
                momento especial.
              </p>

              <div className="hero-actions">
                <Link to="/cardapio" className="btn btn-primary">
                  Ver cardápio
                </Link>

                <a
                  className="btn btn-secondary"
                  href="https://wa.me/5512992325636"
                  target="_blank"
                  rel="noreferrer"
                >
                  Pedir no WhatsApp
                </a>
              </div>

              <div className="hero-highlights">
                <div className="mini-card card">
                  <Truck size={20} />
                  <h3>Entrega e retirada</h3>
                  <p>Escolha receber em casa ou retirar seu pedido.</p>
                </div>

                <div className="mini-card card">
                  <Pizza size={20} />
                  <h3>Cardápio variado</h3>
                  <p>Opções promocionais, tradicionais, premium e doces.</p>
                </div>

                <div className="mini-card card">
                  <MapPin size={20} />
                  <h3>Atendimento local</h3>
                  <p>Pindamonhangaba e regiões com taxa por bairro.</p>
                </div>
              </div>
            </div>

            <div className="hero-image-wrap">
              <img
                src={logoDonNagib}
                alt="Don Nagib Pizzaria Delivery"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="badge">Destaques</span>
            <h2 className="section-title">Sabores para abrir o apetite</h2>
            <p className="section-subtitle">
              Uma seleção inicial dos sabores que mais chamam atenção no cardápio da
              Don Nagib.
            </p>
          </div>

          <div className="featured-grid">
            {featuredPizzas.map((pizza) => (
              <article key={pizza.name} className="featured-card card">
                <span className="featured-price">{pizza.price}</span>
                <h3>{pizza.name}</h3>
                <p>{pizza.description}</p>
                <Link to="/cardapio" className="featured-link">
                  Ver no cardápio
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <span className="badge">Entrega</span>
            <h2 className="section-title">Taxas por região</h2>
            <p className="section-subtitle">
              Valores informados no briefing da pizzaria para facilitar o pedido.
            </p>
          </div>

          <div className="fees-grid">
            {deliveryFees.map((item) => (
              <div key={item.region} className="fee-card card">
                <strong>{item.fee}</strong>
                <p>{item.region}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-box card">
            <div>
              <span className="badge">Peça agora</span>
              <h2 className="section-title">Sua próxima pizza está aqui.</h2>
              <p className="section-subtitle">
                Faça seu pedido pelo cardápio online ou fale direto no WhatsApp da
                Don Nagib.
              </p>
            </div>

            <div className="cta-actions">
              <Link to="/cardapio" className="btn btn-primary">
                <ShoppingBag size={18} />
                Abrir cardápio
              </Link>

              <a
                className="btn btn-secondary"
                href="https://wa.me/5512992325636"
                target="_blank"
                rel="noreferrer"
              >
                <Phone size={18} />
                Chamar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="badge">Por que escolher a Don Nagib</span>
            <h2 className="section-title">Muito mais que pizza</h2>
            <p className="section-subtitle">
              Uma pizzaria feita para unir sabor, cuidado e praticidade no seu pedido.
            </p>
          </div>

          <div className="featured-grid">
            <article className="featured-card card">
              <Star size={20} />
              <h3>Ingredientes de qualidade</h3>
              <p>Sabores pensados para entregar uma experiência marcante do começo ao fim.</p>
            </article>

            <article className="featured-card card">
              <FlameKindling size={20} />
              <h3>Massa crocante e macia</h3>
              <p>Crocante por fora, macia por dentro, do jeito que o cliente lembra e pede de novo.</p>
            </article>

            <article className="featured-card card">
              <Truck size={20} />
              <h3>Pedido fácil e rápido</h3>
              <p>Site, WhatsApp e no futuro conta do cliente para pedir sem preencher tudo outra vez.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}