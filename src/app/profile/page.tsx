'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Coins, Crown, History, BookMarked,
  Gift, Settings, LogOut, ChevronRight,
  Share2, Copy, Check
} from 'lucide-react'
import LoginModal from '@/components/ui/LoginModal'
import { useAuthStore } from '@/store/authStore'
import { useCoinStore } from '@/store/coinStore'
import { signOut } from '@/lib/auth'

const COIN_PACKS = [
  { coins: 30,   price: '₹89',    badge: '' },
  { coins: 100,  price: '₹285',   badge: '🔥' },
  { coins: 350,  price: '₹950',   badge: '⭐' },
  { coins: 1200, price: '₹2,850', badge: '' },
]

export default function ProfilePage() {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)
  const user = useAuthStore(s => s.user)
  const coins = useCoinStore(s => s.balance)
  const [loginOpen, setLoginOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)
  const referralCode = user?.referral_code || '—'

  const copyReferral = () => {
    navigator.clipboard.writeText(`Join Dramatique and get 10 free coins! Use my code: ${referralCode} — dramatique.com`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-brand-black pt-16 pb-24 md:pb-12 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-brand-card border border-brand-border flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">🎭</span>
          </div>
          <h1 className="text-white font-bold text-2xl mb-2">Your Profile</h1>
          <p className="text-brand-subtle text-sm mb-6 leading-relaxed">
            Sign in to track your watch history, manage coins, and unlock your favourite episodes.
          </p>
          <button onClick={() => setLoginOpen(true)} className="btn-primary px-8 py-3 text-base w-full">
            Log In / Sign Up
          </button>
          <p className="text-brand-subtle text-xs mt-3">Get 10 free coins on sign up 🎁</p>
        </div>
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-black pt-16 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* USER HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-red to-red-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-2xl">{user?.display_name?.[0]?.toUpperCase() || 'D'}</span>
            )}
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">{user?.display_name || 'Drama Fan'}</h1>
            <p className="text-brand-subtle text-sm">{user?.email || user?.phone || ''}</p>
          </div>
          <Link href="/settings" className="ml-auto p-2 text-brand-subtle hover:text-white">
            <Settings size={20} />
          </Link>
        </div>

        {/* COIN BALANCE CARD */}
        <div className="bg-gradient-to-r from-brand-red/20 to-brand-dark border border-brand-red/30 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-brand-subtle text-xs uppercase tracking-widest mb-1">Coin Balance</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl">🪙</span>
                <span className="text-white font-black text-3xl">{coins}</span>
              </div>
            </div>
            <button className="btn-primary px-4 py-2 text-xs">Buy Coins</button>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {COIN_PACKS.map(pack => (
              <button key={pack.coins} className="bg-brand-card border border-brand-border rounded-xl p-2 text-center hover:border-brand-red transition-colors">
                <p className="text-white font-bold text-sm">{pack.coins}</p>
                <p className="text-brand-red text-xs font-semibold">{pack.price}</p>
                {pack.badge && <p className="text-[10px] mt-0.5">{pack.badge}</p>}
              </button>
            ))}
          </div>
        </div>

        {/* VIP CARD */}
        <div className="bg-gradient-to-r from-yellow-900/30 to-brand-dark border border-yellow-400/20 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown size={24} className="text-yellow-400" />
            <div>
              <p className="text-white font-bold text-sm">Go VIP</p>
              <p className="text-brand-subtle text-xs">Unlimited episodes from ₹950/mo</p>
            </div>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded-xl text-xs transition-colors">
            Upgrade
          </button>
        </div>

        {/* DAILY REWARD */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift size={18} className="text-brand-red" />
              <h3 className="text-white font-semibold text-sm">Daily Reward</h3>
            </div>
            <span className="text-brand-subtle text-xs">🔥 3 day streak</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 mb-3">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[9px] font-bold ${i < 3 ? 'bg-brand-red/20 border border-brand-red/40 text-brand-red' : i === 3 ? 'bg-brand-red border border-brand-red text-white' : 'bg-brand-dark border border-brand-border text-brand-muted'}`}>
                <span>{i < 3 ? '✓' : i === 3 ? '🪙' : '🪙'}</span>
                <span className="mt-0.5">{i < 3 ? '' : '+5'}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setCheckedIn(true)} disabled={checkedIn}
            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors ${checkedIn ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'btn-primary'}`}>
            {checkedIn ? '✅ Claimed Today — +5 Coins' : 'Claim +5 Coins Today'}
          </button>
        </div>

        {/* INVITE FRIENDS */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Share2 size={18} className="text-brand-red" />
            <h3 className="text-white font-semibold text-sm">Invite Friends</h3>
            <span className="text-brand-subtle text-xs ml-auto">+30 coins per friend</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-brand-dark border border-brand-border rounded-xl px-3 py-2.5 text-brand-subtle text-sm font-mono">
              {referralCode}
            </div>
            <button onClick={copyReferral} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors flex-shrink-0 ${copied ? 'bg-green-500/20 text-green-400' : 'bg-brand-red text-white hover:bg-brand-redHover'}`}>
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
        </div>

        {/* MENU ITEMS */}
        <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden mb-4">
          {[
            { icon: History,    label: 'Watch History',  href: '/history' },
            { icon: BookMarked, label: 'My List',         href: '/my-list' },
            { icon: Settings,   label: 'Settings',        href: '/settings' },
          ].map(({ icon: Icon, label, href }, i, arr) => (
            <Link key={label} href={href} className={`flex items-center gap-3 px-4 py-3.5 hover:bg-brand-dark transition-colors ${i < arr.length - 1 ? 'border-b border-brand-border' : ''}`}>
              <Icon size={18} className="text-brand-subtle" />
              <span className="text-brand-text text-sm font-medium flex-1">{label}</span>
              <ChevronRight size={16} className="text-brand-muted" />
            </Link>
          ))}
        </div>

        {/* LOGOUT */}
        <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-2 text-brand-subtle hover:text-white text-sm font-medium py-3 rounded-xl border border-brand-border hover:border-brand-muted transition-colors">
          <LogOut size={16} />
          Log Out
        </button>

      </div>
    </main>
  )
}
