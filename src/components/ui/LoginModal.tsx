'use client'

import { useState } from 'react'
import { X, Phone, Mail, ChevronLeft, Loader2, Clock, MailCheck } from 'lucide-react'
import { signInWithEmail, signInWithGoogle } from '@/lib/auth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type Step = 'options' | 'email' | 'email-sent' | 'phone-soon'

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [step, setStep] = useState<Step>('options')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const reset = () => { setStep('options'); setEmail(''); setError('') }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      // Browser redirects away to Google here — no further code runs until the
      // /auth/callback page brings the user back with a real session.
    } catch (err: any) {
      setError(err.message || 'Could not start Google sign-in. Try again.')
      setLoading(false)
    }
  }

  const handleSendMagicLink = async () => {
    if (!email || !email.includes('@')) return
    setLoading(true)
    setError('')
    try {
      await signInWithEmail(email)
      setStep('email-sent')
    } catch (err: any) {
      setError(err.message || 'Could not send the link. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-brand-card border border-brand-border rounded-2xl overflow-hidden animate-slide-up">

        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-brand-border">
          <div className="flex items-center gap-2">
            {step !== 'options' && (
              <button onClick={() => setStep('options')} className="text-brand-subtle hover:text-white mr-1">
                <ChevronLeft size={20} />
              </button>
            )}
            <div className="bg-brand-red px-2 py-0.5 rounded">
              <span className="font-display text-white font-black text-base leading-none block">DRAMA</span>
              <span className="font-display text-white font-black text-base leading-none block -mt-0.5">TIQUE</span>
            </div>
          </div>
          <button onClick={() => { reset(); onClose() }} className="text-brand-subtle hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">

          {/* ── OPTIONS ── */}
          {step === 'options' && (
            <>
              <h2 className="text-white font-bold text-xl mb-1">Welcome back</h2>
              <p className="text-brand-subtle text-sm mb-6">Sign in to access your coins, watch history and more</p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-red-400 text-xs mb-4">
                  {error}
                </div>
              )}

              {/* GOOGLE */}
              <button onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-60 text-black font-semibold py-3 rounded-xl transition-colors mb-3">
                {loading ? <Loader2 size={18} className="animate-spin" /> : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {loading ? 'Connecting...' : 'Continue with Google'}
              </button>

              {/* PHONE — visible, honestly marked as coming soon rather than a broken flow */}
              <button onClick={() => setStep('phone-soon')} className="w-full flex items-center justify-center gap-3 border border-brand-border hover:border-brand-muted text-white font-semibold py-3 rounded-xl transition-colors mb-3">
                <Phone size={18} className="text-brand-subtle" />
                Continue with Phone
                <span className="text-[9px] bg-brand-dark text-brand-subtle px-1.5 py-0.5 rounded uppercase tracking-wide ml-1">Soon</span>
              </button>

              {/* EMAIL */}
              <button onClick={() => setStep('email')} className="w-full flex items-center justify-center gap-3 border border-brand-border hover:border-brand-muted text-white font-semibold py-3 rounded-xl transition-colors">
                <Mail size={18} className="text-brand-subtle" />
                Continue with Email
              </button>

              <p className="text-brand-subtle text-[10px] text-center mt-5 leading-relaxed">
                By continuing you agree to our Terms of Service and Privacy Policy
              </p>
            </>
          )}

          {/* ── EMAIL INPUT ── */}
          {step === 'email' && (
            <>
              <h2 className="text-white font-bold text-xl mb-1">Enter your email</h2>
              <p className="text-brand-subtle text-sm mb-5">We'll send you a magic link to sign in — no password needed</p>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-red-400 text-xs mb-4">
                  {error}
                </div>
              )}
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMagicLink()}
                placeholder="you@example.com"
                className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-muted text-sm outline-none focus:border-brand-red transition-colors mb-4"
              />
              <button onClick={handleSendMagicLink} disabled={!email.includes('@') || loading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </>
          )}

          {/* ── EMAIL SENT ── */}
          {step === 'email-sent' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-brand-red/15 flex items-center justify-center mx-auto mb-4">
                <MailCheck size={28} className="text-brand-red" />
              </div>
              <h2 className="text-white font-bold text-xl mb-2">Check your inbox</h2>
              <p className="text-brand-subtle text-sm mb-1">We sent a sign-in link to</p>
              <p className="text-white text-sm font-semibold mb-5">{email}</p>
              <p className="text-brand-subtle text-xs mb-5">Click the link on this device to finish signing in. You can close this window.</p>
              <button onClick={() => { reset(); onClose() }} className="w-full btn-outline py-3">
                Close
              </button>
            </div>
          )}

          {/* ── PHONE COMING SOON ── */}
          {step === 'phone-soon' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-brand-dark flex items-center justify-center mx-auto mb-4">
                <Clock size={26} className="text-brand-subtle" />
              </div>
              <h2 className="text-white font-bold text-xl mb-2">Phone sign-in is almost here</h2>
              <p className="text-brand-subtle text-sm mb-5">We're finishing setup for OTP sign-in. Use Google or Email for now — your account carries over either way.</p>
              <button onClick={() => setStep('options')} className="w-full btn-outline py-3">
                Back to sign-in options
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
