'use client'

import { useState } from 'react'
import { X, Lock, Coins, Play, Crown, ChevronRight } from 'lucide-react'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  episodeNumber: number
  coinCost?: number
  seriesTitle?: string
}

const COIN_PACKS = [
  { id: 1, coins: 30,    price: '₹89',    label: 'Starter',    badge: '' },
  { id: 2, coins: 100,   price: '₹285',   label: 'Popular',    badge: '🔥 Popular' },
  { id: 3, coins: 350,   price: '₹950',   label: 'Best Value', badge: '⭐ Best Value' },
  { id: 4, coins: 1200,  price: '₹2,850', label: 'Premium',    badge: '' },
]

type View = 'main' | 'coins' | 'vip' | 'ads'

export default function PaywallModal({ isOpen, onClose, episodeNumber, coinCost = 5, seriesTitle = 'this series' }: PaywallModalProps) {
  const [view, setView] = useState<View>('main')
  const [adStep, setAdStep] = useState(0)
  const [adWatching, setAdWatching] = useState(false)
  const [userCoins] = useState(2)

  if (!isOpen) return null

  const handleWatchAd = () => {
    setAdWatching(true)
    setTimeout(() => {
      setAdStep(p => p + 1)
      setAdWatching(false)
    }, 3000)
  }

  // ── AD VIEW ──
  if (view === 'ads') {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-brand-card border border-brand-border rounded-2xl overflow-hidden animate-slide-up">
          <div className="p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Watch Ads to Unlock</h3>
              <button onClick={() => { setView('main'); setAdStep(0) }} className="text-brand-subtle hover:text-white"><X size={20} /></button>
            </div>

            {/* AD PROGRESS */}
            <div className="flex items-center gap-3 mb-6">
              {[1, 2].map(i => (
                <div key={i} className={`flex-1 h-2 rounded-full ${adStep >= i ? 'bg-brand-red' : 'bg-brand-border'}`} />
              ))}
            </div>
            <p className="text-brand-subtle text-sm text-center mb-6">
              {adStep === 0 ? 'Watch 2 short ads to unlock this episode free' : adStep === 1 ? '1 of 2 done — watch 1 more ad' : ''}
            </p>

            {adStep < 2 ? (
              <>
                {adWatching ? (
                  <div className="bg-brand-dark rounded-xl h-40 flex flex-col items-center justify-center gap-3 mb-5">
                    <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
                    <p className="text-brand-subtle text-sm">Ad playing...</p>
                  </div>
                ) : (
                  <button onClick={handleWatchAd} className="w-full btn-primary py-3 flex items-center justify-center gap-2 mb-3">
                    <Play size={16} fill="white" /> Watch Ad {adStep + 1} of 2
                  </button>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">✅</span>
                </div>
                <p className="text-white font-bold mb-1">Episode Unlocked!</p>
                <p className="text-brand-subtle text-sm mb-5">Enjoy Episode {episodeNumber}</p>
                <button onClick={onClose} className="w-full btn-primary py-3">▶ Watch Now</button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── VIP VIEW ──
  if (view === 'vip') {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-brand-card border border-brand-border rounded-2xl overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 p-5 border-b border-brand-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown size={20} className="text-yellow-400" />
                <h3 className="text-white font-bold text-lg">Go VIP</h3>
              </div>
              <button onClick={() => setView('main')} className="text-brand-subtle hover:text-white"><X size={20} /></button>
            </div>
            <p className="text-brand-subtle text-sm">Unlimited access to all episodes</p>
          </div>

          <div className="p-5">
            {/* PERKS */}
            <div className="space-y-2.5 mb-5">
              {['Unlimited episodes — no coins needed', 'Ad-free viewing experience', 'Early access to new series', 'All languages unlocked', 'Offline download (coming soon)'].map(perk => (
                <div key={perk} className="flex items-center gap-2.5 text-sm text-brand-text">
                  <span className="text-green-400 flex-shrink-0">✓</span>{perk}
                </div>
              ))}
            </div>

            {/* PLANS */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button className="border border-brand-border rounded-xl p-3 text-center hover:border-brand-red transition-colors group">
                <p className="text-white font-bold text-lg">₹950</p>
                <p className="text-brand-subtle text-xs">per month</p>
                <p className="text-brand-subtle text-[10px] mt-1">Monthly</p>
              </button>
              <button className="border-2 border-yellow-400/50 rounded-xl p-3 text-center bg-yellow-400/5 relative">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full">SAVE 50%</div>
                <p className="text-white font-bold text-lg">₹5,700</p>
                <p className="text-brand-subtle text-xs">per year</p>
                <p className="text-yellow-400 text-[10px] mt-1 font-semibold">Best Deal</p>
              </button>
            </div>

            <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Crown size={16} /> Start VIP Now
            </button>
            <button onClick={() => setView('main')} className="w-full text-brand-subtle text-sm mt-3 hover:text-white transition-colors">
              Maybe later
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── COIN SHOP VIEW ──
  if (view === 'coins') {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-brand-card border border-brand-border rounded-2xl overflow-hidden animate-slide-up">
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">🪙 Coin Shop</h3>
            <button onClick={() => setView('main')} className="text-brand-subtle hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-5">
            <p className="text-brand-subtle text-sm mb-4">Your balance: <span className="text-white font-bold">{userCoins} coins</span></p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {COIN_PACKS.map(pack => (
                <button key={pack.id} className={`relative border rounded-xl p-3 text-center hover:border-brand-red transition-all ${pack.badge ? 'border-brand-red/50 bg-brand-red/5' : 'border-brand-border'}`}>
                  {pack.badge && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-red text-white text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap">
                      {pack.badge}
                    </div>
                  )}
                  <p className="text-2xl mb-1">🪙</p>
                  <p className="text-white font-bold text-base">{pack.coins} coins</p>
                  <p className="text-brand-red font-bold text-sm mt-1">{pack.price}</p>
                </button>
              ))}
            </div>
            <button className="w-full btn-primary py-3">Continue to Payment</button>
            <p className="text-brand-subtle text-[10px] text-center mt-3">Secure payment via Razorpay · Stripe</p>
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN PAYWALL VIEW ──
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-brand-card border border-brand-border rounded-2xl overflow-hidden animate-slide-up">

        {/* HEADER */}
        <div className="relative p-5 border-b border-brand-border">
          <button onClick={onClose} className="absolute top-4 right-4 text-brand-subtle hover:text-white"><X size={20} /></button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-red/20 flex items-center justify-center flex-shrink-0">
              <Lock size={22} className="text-brand-red" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Episode {episodeNumber} is Locked</h3>
              <p className="text-brand-subtle text-xs mt-0.5">Choose how to unlock and keep watching</p>
            </div>
          </div>
        </div>

        {/* COIN BALANCE */}
        <div className="px-5 py-3 bg-brand-dark border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">🪙</span>
            <span className="text-brand-subtle">Your coins:</span>
            <span className="text-white font-bold">{userCoins}</span>
          </div>
          <span className="text-brand-subtle text-xs">Need: {coinCost} coins</span>
        </div>

        {/* OPTIONS */}
        <div className="p-5 flex flex-col gap-3">

          {/* OPTION 1: USE COINS */}
          {userCoins >= coinCost ? (
            <button onClick={onClose} className="w-full bg-brand-red hover:bg-brand-redHover text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              🪙 Use {coinCost} Coins — Unlock Now
            </button>
          ) : (
            <button onClick={() => setView('coins')} className="w-full bg-brand-red hover:bg-brand-redHover text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              🪙 Buy Coins to Unlock
              <ChevronRight size={16} />
            </button>
          )}

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-brand-border" />
            <span className="text-brand-subtle text-xs font-medium">or</span>
            <div className="flex-1 h-px bg-brand-border" />
          </div>

          {/* OPTION 2: WATCH ADS */}
          <button onClick={() => setView('ads')} className="w-full border border-brand-border hover:border-brand-muted text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            📺 Watch 2 Ads — Unlock Free
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-brand-border" />
            <span className="text-brand-subtle text-xs font-medium">or</span>
            <div className="flex-1 h-px bg-brand-border" />
          </div>

          {/* OPTION 3: VIP */}
          <button onClick={() => setView('vip')} className="w-full border border-yellow-400/40 hover:border-yellow-400 bg-yellow-400/5 hover:bg-yellow-400/10 text-yellow-400 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Crown size={16} /> Go VIP — Unlimited Access
          </button>

          <p className="text-brand-subtle text-[10px] text-center mt-1">
            VIP from ₹950/month · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}
