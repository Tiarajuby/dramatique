'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { fetchProfile } from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'
import { useCoinStore } from '@/store/coinStore'

/**
 * Keeps Zustand in sync with the real Supabase session — mounted once at
 * the app root. Runs on load (restores an existing session) and again on
 * every login/logout/token-refresh event, anywhere in the app.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const login = useAuthStore(s => s.login)
  const logout = useAuthStore(s => s.logout)
  const setBalance = useCoinStore(s => s.setBalance)

  useEffect(() => {
    const syncFromSession = async (userId: string) => {
      try {
        const profile = await fetchProfile(userId)
        login({
          id: profile.id,
          display_name: profile.display_name,
          email: profile.email ?? undefined,
          phone: profile.phone ?? undefined,
          avatar_url: profile.avatar_url ?? undefined,
          vip_until: profile.vip_until,
          referral_code: profile.referral_code,
        })
        setBalance(profile.coins)
      } catch (err) {
        console.error('Failed to load profile after auth change:', err)
      }
    }

    // Restore session on first load (e.g. page refresh)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) syncFromSession(data.session.user.id)
    })

    // React to login / logout / token refresh anywhere in the app
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        syncFromSession(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        logout()
        setBalance(0)
      }
    })

    return () => sub.subscription.unsubscribe()
  }, [login, logout, setBalance])

  return <>{children}</>
}
