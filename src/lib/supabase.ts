import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local')
}

/**
 * Single Supabase client for the whole app — consumer and admin both use this.
 * Uses the publishable key, which is safe client-side because every table
 * has Row Level Security (RLS) policies controlling exactly what each
 * request is allowed to read/write. See supabase/schema.sql for policies.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
