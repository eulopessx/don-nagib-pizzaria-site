import { Link, NavLink } from 'react-router-dom'
import { Menu, Phone, ShoppingCart, User, X, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import logoHeader from '../../assets/images/logo-header-don-nagib.png'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'Início', to: '/' },
  { label: 'Cardápio', to: '/cardapio' },
  { label: 'Carrinho', to: '/carrinho' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const { isAuthenticated, isAdmin } = useAuth()

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-shell">
          <Link to="/" className="header-logo" onClick={closeMenu}>
            <img src={logoHeader} alt="Don Nagib Pizzaria Delivery" />
          </Link>

          <nav className="desktop-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-active' : 'nav-link'
                }
              >
                {item.label}
              </NavLink>
            ))}

            <NavLink
              to={isAuthenticated ? '/minha-conta' : '/login'}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              {isAuthenticated ? 'Minha conta' : 'Login'}
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-active' : 'nav-link'
                }
              >
                Admin
              </NavLink>
            )}
          </nav>

          <div className="header-actions">
            <a
              href="https://wa.me/5512992325636"
              target="_blank"
              rel="noreferrer"
              className="header-whatsapp"
            >
              <Phone size={15} />
              <span>WhatsApp</span>
            </a>

            {isAdmin && (
              <Link to="/admin" className="header-cart" aria-label="Admin">
                <ShieldCheck size={17} />
              </Link>
            )}

            <Link
              to={isAuthenticated ? '/minha-conta' : '/login'}
              className="header-cart"
              aria-label="Conta"
            >
              <User size={17} />
            </Link>

            <Link to="/carrinho" className="header-cart" aria-label="Carrinho">
              <ShoppingCart size={17} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu card">
            <nav className="mobile-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <NavLink
                to={isAuthenticated ? '/minha-conta' : '/login'}
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'
                }
              >
                {isAuthenticated ? 'Minha conta' : 'Login'}
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'
                  }
                >
                  Admin
                </NavLink>
              )}

              <a
                href="https://wa.me/5512992325636"
                target="_blank"
                rel="noreferrer"
                className="mobile-whatsapp"
                onClick={closeMenu}
              >
                Pedir no WhatsApp
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}