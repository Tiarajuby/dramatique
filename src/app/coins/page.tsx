'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

const PACKS = [
  { id: 1, coins: 30,   bonus: 0,  price_inr: 89,   price_usd: 1.05, badge: '',           popular: false },
  { id: 2, coins: 100,  bonus: 10, price_inr: 285,  price_usd: 3.40, badge: '🔥 Popular',  popular: true  },
  { id: 3, coins: 350,  bonus: 50, price_inr: 950,  price_usd: 11.4, badge: '⭐ Best Value',popular: false },
  { id: 4, coins: 1200, bonus: 200,price_inr: 2850, price_usd: 34.0, badge: '💎 Premium',   popular: false },
]

const EARN_METHODS = [
  { icon: '📅', label: 'Daily Check-in',  coins: '+5',  desc: 'Visit every day' },
  { icon: '👥', label: 'Invite Friends',  coins: '+30', desc: 'Per friend who joins' },
  { icon: '📺', label: 'Watch Ads',       coins: '+3',  desc: 'Per ad watched' },
  { icon: '🎁', label: 'Welcome Bonus',   coins: '+10', desc: 'On first sign up' },
]

export default function CoinsPage() {
  const [currency, setCurrency] = useState<'inr'|'usd'>('inr')
  const [selected, setSelected] = useState(2)

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-5 md:px-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🪙</div>
          <h1 className="text-white font-bold text-3xl mb-2">Coin Shop</h1>
          <p className="text-brand-subtle text-sm">Buy coins to unlock episodes instantly</p>
          <div className="inline-flex items-center gap-2 mt-4 bg-brand-card border border-brand-border rounded-xl px-4 py-2">
            <span className="text-brand-subtle text-xs">Your balance:</span>
            <span className="text-white font-black text-lg">🪙 2</span>
          </div>
        </div>

        {/* CURRENCY TOGGLE */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-brand-card border border-brand-border rounded-xl p-1">
            <button onClick={() => setCurrency('inr')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${currency==='inr' ? 'bg-brand-red text-white' : 'text-brand-subtle hover:text-white'}`}>₹ INR</button>
            <button onClick={() => setCurrency('usd')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${currency==='usd' ? 'bg-brand-red text-white' : 'text-brand-subtle hover:text-white'}`}>$ USD</button>
          </div>
        </div>

        {/* COIN PACKS */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {PACKS.map(pack => (
            <button key={pack.id} onClick={() => setSelected(pack.id)}
              className={`relative border-2 rounded-2xl p-4 text-center transition-all ${selected === pack.id ? 'border-brand-red bg-brand-red/10' : pack.popular ? 'border-brand-red/40 bg-brand-card' : 'border-brand-border bg-brand-card hover:border-brand-muted'}`}>
              {pack.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-red text-white text-[9px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  {pack.badge}
                </div>
              )}
              {selected === pack.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-brand-red rounded-full flex items-center justify-center">
                  <Check size={11} className="text-white" />
                </div>
              )}
              <div className="text-3xl mb-2">🪙</div>
              <p className="text-white font-black text-2xl">{pack.coins}</p>
              {pack.bonus > 0 && <p className="text-green-400 text-xs font-semibold">+{pack.bonus} bonus</p>}
              <p className="text-brand-subtle text-xs mt-1">coins</p>
              <p className="text-brand-red font-black text-lg mt-2">
                {currency === 'inr' ? `₹${pack.price_inr}` : `$${pack.price_usd}`}
              </p>
            </button>
          ))}
        </div>

        {/* BUY BUTTON */}
        <button className="w-full btn-primary py-4 text-base mb-3 rounded-xl">
          Buy {PACKS.find(p=>p.id===selected)?.coins} Coins for {currency === 'inr' ? `₹${PACKS.find(p=>p.id===selected)?.price_inr}` : `$${PACKS.find(p=>p.id===selected)?.price_usd}`}
        </button>
        <p className="text-brand-muted text-[10px] text-center mb-8">Secure payment via Razorpay · Stripe · No subscription</p>

        {/* EARN FREE COINS */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
          <h3 className="text-white font-bold text-base mb-4">💰 Earn Free Coins</h3>
          <div className="grid grid-cols-2 gap-3">
            {EARN_METHODS.map(m => (
              <div key={m.label} className="bg-brand-dark rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <p className="text-white text-xs font-bold">{m.label}</p>
                  <p className="text-green-400 text-xs font-black">{m.coins} coins</p>
                  <p className="text-brand-muted text-[10px]">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
