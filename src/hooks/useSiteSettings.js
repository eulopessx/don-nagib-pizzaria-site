import { useEffect, useMemo, useState } from 'react'
import { getSiteSettings } from '../services/siteSettingsService'

export function useSiteSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await getSiteSettings()

      if (!error && data) {
        const mapped = data.reduce((acc, item) => {
          acc[item.setting_key] = item.setting_value
          return acc
        }, {})
        setSettings(mapped)
      }

      setLoading(false)
    }

    loadSettings()
  }, [])

  const values = useMemo(
    () => ({
      storeName: settings.store_name || 'Don Nagib Pizzaria Delivery',
      storePhone: settings.store_phone || '(12) 99232-5636',
      storeWhatsapp: settings.store_whatsapp || '5512992325636',
      storeHours: settings.store_hours || '18:00 às 23:59',
      storeAddress: settings.store_address || 'Rua Iracema Souraty Ruve 378 - Pindamonhangaba/SP',
      heroTitle: settings.hero_title || 'A pizza que conquista no primeiro pedaço.',
      heroSubtitle:
        settings.hero_subtitle ||
        'Ingredientes de qualidade, massa crocante por fora, macia por dentro e tudo feito com muito carinho.',
      aboutText:
        settings.about_text ||
        'Ingredientes de qualidade, massa crocante e macia por dentro, tudo feito com muito carinho.',
      halfHalfAllowedCategories:
        settings.half_half_allowed_categories ||
        'Promocional,Tradicional,Premium,Pizzas Doces',
    }),
    [settings]
  )

  return { settings: values, loading }
}