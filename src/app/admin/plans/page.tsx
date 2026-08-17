'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, AdminCard, SectionHeader, FormField, Input, Toggle, AdminBtn } from '@/components/admin/AdminUI'
import { Plus, Edit, Trash2 } from 'lucide-react'

const INITIAL_COIN_PLANS = [
  { id: 1, name: 'Starter', coins: 30, bonus: 0, price_inr: 89, price_usd: 1.05, badge: '', is_active: true },
  { id: 2, name: 'Popular', coins: 100, bonus: 10, price_inr: 285, price_usd: 3.40, badge: '🔥 Popular', is_active: true },
  { id: 3, name: 'Best Value', coins: 350, bonus: 50, price_inr: 950, price_usd: 11.40, badge: '⭐ Best Value', is_active: true },
  { id: 4, name: 'Premium', coins: 1200, bonus: 200, price_inr: 2850, price_usd: 34.00, badge: '💎 Premium', is_active: true },
]

const INITIAL_VIP_PLANS = [
  { id: 1, name: 'Monthly VIP', period: 'month', price_inr: 950, price_usd: 11.40, is_active: true, badge: '🔥 Popular' },
  { id: 2, name: 'Annual VIP', period: 'year', price_inr: 5700, price_usd: 68.00, is_active: true, badge: '⭐ Best Deal' },
]

const VIP_PERKS = [
  'Unlimited episodes — no coins needed',
  'Ad-free viewing experience',
  'Early access to new series',
  'All languages unlocked',
  'HD quality streaming',
  'Cancel anytime',
]

export default function PlansManagerPage() {
  const [coinPlans, setCoinPlans] = useState(INITIAL_COIN_PLANS)
  const [vipPlans, setVipPlans] = useState(INITIAL_VIP_PLANS)
  const [editingCoin, setEditingCoin] = useState<any>(null)

  const toggleCoin = (id: number) => setCoinPlans(p => p.map(plan => plan.id === id ? { ...plan, is_active: !plan.is_active } : plan))
  const toggleVIP = (id: number) => setVipPlans(p => p.map(plan => plan.id === id ? { ...plan, is_active: !plan.is_active } : plan))

  return (
    <AdminLayout>
      <AdminPageHeader title="Plans Manager" subtitle="Manage coin packs and VIP subscription plans" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* COIN PLANS */}
        <div>
          <SectionHeader
            title="🪙 Coin Plans"
            action={<AdminBtn variant="primary" size="sm"><Plus size={13} /> Add Plan</AdminBtn>}
          />
          <div className="space-y-3">
            {coinPlans.map(plan => (
              <AdminCard key={plan.id}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-bold text-sm">{plan.name}</p>
                      {plan.badge && <span className="text-[10px] bg-[#e8001d]/15 text-[#e8001d] px-1.5 py-0.5 rounded font-bold">{plan.badge}</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div>
                        <p className="text-[#5a5a68]">Coins</p>
                        <p className="text-yellow-400 font-bold">{plan.coins} {plan.bonus > 0 && <span className="text-green-400">+{plan.bonus}</span>}</p>
                      </div>
                      <div>
                        <p className="text-[#5a5a68]">Price INR</p>
                        <p className="text-white font-bold">₹{plan.price_inr}</p>
                      </div>
                      <div>
                        <p className="text-[#5a5a68]">Price USD</p>
                        <p className="text-white font-bold">${plan.price_usd}</p>
                      </div>
                      <div>
                        <p className="text-[#5a5a68]">Status</p>
                        <Toggle on={plan.is_active} onToggle={() => toggleCoin(plan.id)} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => setEditingCoin(plan)} className="p-1.5 hover:bg-[#24242f] rounded-lg text-[#8b8b9a] hover:text-white transition-colors">
                      <Edit size={13} />
                    </button>
                    <button className="p-1.5 hover:bg-red-500/10 rounded-lg text-[#8b8b9a] hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>
        </div>

        {/* VIP PLANS */}
        <div>
          <SectionHeader title="👑 VIP Plans" />
          <div className="space-y-3 mb-5">
            {vipPlans.map(plan => (
              <AdminCard key={plan.id}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-bold text-sm">{plan.name}</p>
                      {plan.badge && <span className="text-[10px] bg-yellow-400/15 text-yellow-400 px-1.5 py-0.5 rounded font-bold">{plan.badge}</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div>
                        <p className="text-[#5a5a68]">Price INR</p>
                        <p className="text-white font-bold">₹{plan.price_inr}/{plan.period}</p>
                      </div>
                      <div>
                        <p className="text-[#5a5a68]">Price USD</p>
                        <p className="text-white font-bold">${plan.price_usd}/{plan.period}</p>
                      </div>
                      <div>
                        <p className="text-[#5a5a68]">Status</p>
                        <Toggle on={plan.is_active} onToggle={() => toggleVIP(plan.id)} />
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-[#24242f] rounded-lg text-[#8b8b9a] hover:text-white transition-colors">
                    <Edit size={13} />
                  </button>
                </div>
              </AdminCard>
            ))}
          </div>

          {/* VIP PERKS */}
          <AdminCard>
            <SectionHeader title="VIP Perks" action={<AdminBtn variant="ghost" size="sm"><Edit size={12} /> Edit</AdminBtn>} />
            <div className="space-y-2">
              {VIP_PERKS.map((perk, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span className="text-[#c2c2ce]">{perk}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* EDIT COIN PLAN MODAL */}
      {editingCoin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#15151d] border border-[#24242f] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">Edit Coin Plan</h3>
              <button onClick={() => setEditingCoin(null)} className="text-[#8b8b9a] hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <FormField label="Plan Name"><Input defaultValue={editingCoin.name} /></FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Coins"><Input type="number" defaultValue={editingCoin.coins} /></FormField>
                <FormField label="Bonus Coins"><Input type="number" defaultValue={editingCoin.bonus} /></FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Price ₹"><Input type="number" defaultValue={editingCoin.price_inr} /></FormField>
                <FormField label="Price $"><Input type="number" defaultValue={editingCoin.price_usd} /></FormField>
              </div>
              <FormField label="Badge Label" hint="e.g. 🔥 Popular"><Input defaultValue={editingCoin.badge} /></FormField>
            </div>
            <div className="flex gap-3 mt-5">
              <AdminBtn variant="outline" onClick={() => setEditingCoin(null)}>Cancel</AdminBtn>
              <AdminBtn variant="primary" onClick={() => setEditingCoin(null)}>Save Changes</AdminBtn>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
