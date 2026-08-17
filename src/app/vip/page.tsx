'use client'

import { useState } from 'react'
import { Crown, Check } from 'lucide-react'

const PERKS = [
  'Unlimited episodes — no coins needed',
  'Ad-free viewing experience',
  'Early access to new series drops',
  'All languages unlocked',
  'HD quality streaming',
  'Watch on any device',
  'Cancel anytime',
  'Offline download (coming soon)',
]

const PLANS = [
  { id: 'monthly', label: 'Monthly', price_inr: 950, price_usd: 11.4, per: 'month', badge: '', save: '' },
  { id: 'annual',  label: 'Annual',  price_inr: 5700, price_usd: 68, per: 'year',  badge: 'SAVE 50%', save: '₹5,700' },
]

export default function VIPPage() {
  const [plan, setPlan] = useState('annual')
  const [currency, setCurrency] = useState<'inr'|'usd'>('inr')

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-lg mx-auto px-5 md:px-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center mx-auto mb-4">
            <Crown size={32} className="text-yellow-400" />
          </div>
          <h1 className="text-white font-bold text-3xl mb-2">Go VIP</h1>
          <p className="text-brand-subtle text-sm">Unlimited dramas. No interruptions. Pure emotion.</p>
        </div>

        {/* CURRENCY TOGGLE */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-brand-card border border-brand-border rounded-xl p-1">
            <button onClick={() => setCurrency('inr')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${currency==='inr' ? 'bg-brand-red text-white' : 'text-brand-subtle hover:text-white'}`}>₹ INR</button>
            <button onClick={() => setCurrency('usd')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${currency==='usd' ? 'bg-brand-red text-white' : 'text-brand-subtle hover:text-white'}`}>$ USD</button>
          </div>
        </div>

        {/* PLAN CARDS */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {PLANS.map(p => (
            <button key={p.id} onClick={() => setPlan(p.id)}
              className={`relative border-2 rounded-2xl p-4 text-center transition-all ${plan===p.id ? 'border-yellow-400 bg-yellow-400/5' : 'border-brand-border bg-brand-card hover:border-brand-muted'}`}>
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[9px] font-black px-2.5 py-0.5 rounded-full">
                  {p.badge}
                </div>
              )}
              <p className="text-white font-bold text-base mb-1">{p.label}</p>
              <p className="text-white font-black text-2xl">
                {currency==='inr' ? `₹${p.price_inr}` : `$${p.price_usd}`}
              </p>
              <p className="text-brand-subtle text-xs">per {p.per}</p>
              {p.id==='annual' && <p className="text-yellow-400 text-xs font-bold mt-1">≈ ₹475/mo</p>}
            </button>
          ))}
        </div>

        {/* PERKS */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5 mb-6">
          <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Everything included</h3>
          <div className="space-y-3">
            {PERKS.map(perk => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-green-400" />
                </div>
                <span className="text-brand-text text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-xl transition-colors text-base flex items-center justify-center gap-2 mb-3">
          <Crown size={18} /> Start VIP — {currency==='inr' ? `₹${PLANS.find(p=>p.id===plan)?.price_inr}` : `$${PLANS.find(p=>p.id===plan)?.price_usd}`}/{PLANS.find(p=>p.id===plan)?.per}
        </button>
        <p className="text-brand-muted text-[10px] text-center">Cancel anytime · Auto-renews · Secure payment</p>

      </div>
    </main>
  )
}
