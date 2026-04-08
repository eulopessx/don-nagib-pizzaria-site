import { useEffect, useMemo, useState } from 'react'
import { getActiveProducts } from '../services/productService'

const CATEGORY_ORDER = [
  'Promocional',
  'Tradicional',
  'Premium',
  'Pizzas Doces',
  'Bebidas',
  'Adicionais',
]

export function usePublicMenu() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await getActiveProducts()

      if (!error && data) {
        setProducts(data)
      }

      setLoading(false)
    }

    loadProducts()
  }, [])

  const groupedCategories = useMemo(() => {
    const grouped = CATEGORY_ORDER.map((category) => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      title: category,
      items: products.filter((product) => product.category === category),
    })).filter((category) => category.items.length > 0)

    return grouped
  }, [products])

  return {
    products,
    groupedCategories,
    loading,
  }
}