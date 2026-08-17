'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { signInWithPassword, fetchProfile } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { user } = await signInWithPassword(email, password)
      if (!user) throw new Error('Sign-in failed')

      const profile = await fetchProfile(user.id)

      if (!profile.is_admin) {
        // Valid account, but not authorized for admin — sign out immediately
        await supabase.auth.signOut()
        setError('This account does not have admin access.')
        setLoading(false)
        return
      }

      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials'
        ? 'Invalid email or password'
        : (err.message || 'Something went wrong. Try again.'))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* LOGO */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Dramatique" className="h-14 w-auto mx-auto mb-3" onError={e => { e.currentTarget.style.display = 'none' }} />
          <p className="text-[#404060] text-xs uppercase tracking-widest font-semibold">Admin Panel</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="bg-[#15151d] border border-[#24242f] rounded-2xl p-6 space-y-4">
          <h1 className="text-white font-bold text-xl mb-5">Sign in to Admin</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-[#8b8b9a] text-xs font-semibold uppercase tracking-wider block mb-1.5">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@dramatique.com"
              className="w-full bg-[#0a0a0f] border border-[#24242f] rounded-xl px-4 py-3 text-white placeholder-[#5a5a68] text-sm outline-none focus:border-[#e8001d] transition-colors"
            />
          </div>

          <div>
            <label className="text-[#8b8b9a] text-xs font-semibold uppercase tracking-wider block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0f] border border-[#24242f] rounded-xl px-4 py-3 text-white placeholder-[#5a5a68] text-sm outline-none focus:border-[#e8001d] transition-colors pr-10"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a68] hover:text-white">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#e8001d] hover:bg-[#c8001a] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
