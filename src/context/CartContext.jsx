import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext()

function parsePrice(value) {
  if (typeof value === 'number') return value
  if (!value) return 0
  return Number(String(value).replace(',', '.'))
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  function addToCart(item) {
    const normalizedItem = {
      ...item,
      price: parsePrice(item.price),
    }

    setCartItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (cartItem) =>
          cartItem.name === normalizedItem.name &&
          cartItem.size === normalizedItem.size
      )

      if (existingIndex !== -1) {
        return currentItems.map((cartItem, index) =>
          index === existingIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }

      return [...currentItems, { ...normalizedItem, quantity: 1 }]
    })
  }

  function increaseQuantity(name, size) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.name === name && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  function decreaseQuantity(name, size) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.name === name && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function removeFromCart(name, size) {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.name === name && item.size === size)
      )
    )
  }

  function clearCart() {
    setCartItems([])
  }

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  )

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}