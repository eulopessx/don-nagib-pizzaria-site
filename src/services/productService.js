import { supabase } from '../lib/supabase'

export async function getProducts() {
  return supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
}

export async function createProduct(product) {
  return supabase
    .from('products')
    .insert({
      ...product,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
}

export async function updateProduct(id, product) {
  return supabase
    .from('products')
    .update({
      ...product,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
}

export async function deleteProduct(id) {
  return supabase
    .from('products')
    .delete()
    .eq('id', id)
}