import { supabase } from '../lib/supabase'

export async function getMyProfile(userId) {
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

export async function upsertMyProfile(profile) {
  return supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single()
}

export async function getMyDefaultAddress(userId) {
  return supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .maybeSingle()
}

export async function upsertMyDefaultAddress(address) {
  const { user_id } = address

  const existing = await supabase
    .from('addresses')
    .select('id')
    .eq('user_id', user_id)
    .eq('is_default', true)
    .maybeSingle()

  if (existing.error) {
    return { data: null, error: existing.error }
  }

  if (existing.data?.id) {
    return supabase
      .from('addresses')
      .update(address)
      .eq('id', existing.data.id)
      .select()
      .single()
  }

  return supabase
    .from('addresses')
    .insert({ ...address, is_default: true })
    .select()
    .single()
}