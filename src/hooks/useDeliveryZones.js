import { useEffect, useState } from 'react'
import { getActiveDeliveryZones } from '../services/deliveryZoneService'

export function useDeliveryZones() {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadZones() {
      const { data, error } = await getActiveDeliveryZones()

      if (!error && data) {
        setZones(data)
      }

      setLoading(false)
    }

    loadZones()
  }, [])

  return { zones, loading }
}