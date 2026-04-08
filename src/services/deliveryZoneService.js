import { supabase } from '../lib/supabase'

export async function getDeliveryZones() {
  return supabase
    .from('delivery_zones')
    .select('*')
    .order('fee', { ascending: true })
    .order('neighborhood', { ascending: true })
}

export async function getActiveDeliveryZones() {
  return supabase
    .from('delivery_zones')
    .select('*')
    .eq('active', true)
    .order('fee', { ascending: true })
    .order('neighborhood', { ascending: true })
}

export async function createDeliveryZone(zone) {
  return supabase
    .from('delivery_zones')
    .insert({
      ...zone,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
}

export async function updateDeliveryZone(id, zone) {
  return supabase
    .from('delivery_zones')
    .update({
      ...zone,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
}

export async function deleteDeliveryZone(id) {
  return supabase
    .from('delivery_zones')
    .delete()
    .eq('id', id)
}