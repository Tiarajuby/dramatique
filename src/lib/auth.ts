import { supabase } from './supabase'

/**
 * Real Supabase authentication functions. All three consumer login
 * methods route through here — nothing in the UI calls Supabase directly.
 */

// ── EMAIL + PASSWORD (used by admin login) ──────────────────────────────────────
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// ── EMAIL (magic link — no password to manage) ──────────────────────────────────────
export async function signInWithEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
}

// ── GOOGLE ──────────────────────────────────────
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
  // Browser navigates away to Google here — nothing else runs after this until redirect back.
}

// ── PHONE OTP — wired once Twilio is connected in Supabase ──────────────────────────────────────
export async function signInWithPhone(phone: string) {
  const { error } = await supabase.auth.signInWithOtp({ phone })
  if (error) throw error
}
export async function verifyPhoneOtp(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
  if (error) throw error
  return data
}

// ── SIGN OUT ──────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ── PROFILE FETCH — the app-specific row from `profiles`, keyed by auth user id ──────────────────────────────────────
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}
