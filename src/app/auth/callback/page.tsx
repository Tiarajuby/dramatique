'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/**
 * Landing page after a magic-link click or Google OAuth redirect.
 * Supabase's client library reads the auth code from the URL automatically
 * and turns it into a session — we just wait for that, then bounce home.
 * The actual profile sync into Zustand happens in AuthProvider (global listener).
 */
export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const finish = async () => {
      // Give Supabase's client a moment to process the URL fragment/code
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.replace('/')
      } else {
        // No session yet — listen once for the auth event Supabase fires after processing
        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'SIGNED_IN') {
            sub.subscription.unsubscribe()
            router.replace('/')
          }
        })
        // Safety net: if nothing fires within a few seconds, go home anyway
        setTimeout(() => router.replace('/'), 4000)
      }
    }
    finish()
  }, [router])

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-brand-subtle text-sm">Signing you in...</p>
      </div>
    </div>
  )
}
