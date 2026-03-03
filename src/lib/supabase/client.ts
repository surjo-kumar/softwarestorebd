import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Key is missing')
}

// Singleton instance
export const supabase = createSupabaseClient(supabaseUrl || '', supabaseAnonKey || '')

// Compatibility wrapper
export const createClient = () => supabase
