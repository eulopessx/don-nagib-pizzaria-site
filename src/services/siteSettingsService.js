import { supabase } from '../lib/supabase'

export async function getSiteSettings() {
  return supabase
    .from('site_settings')
    .select('*')
    .order('setting_key', { ascending: true })
}

export async function upsertSiteSetting(setting_key, setting_value) {
  return supabase
    .from('site_settings')
    .upsert({
      setting_key,
      setting_value,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
}