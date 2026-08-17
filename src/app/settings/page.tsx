'use client'

import { useState } from 'react'
import { ChevronRight, Bell, Globe, Shield, Trash2, HelpCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import { LANGUAGES } from '@/types'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-brand-red' : 'bg-brand-border'}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  )
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({ newEpisode: true, dailyReward: true, vipExpiry: true, marketing: false })
  const [lang, setLang] = useState('en')

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-5 md:px-8">
        <h1 className="text-white font-bold text-3xl mb-8">Settings</h1>

        {/* NOTIFICATIONS */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-brand-red" />
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Notifications</h2>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
            {[
              { key: 'newEpisode', label: 'New Episode Alerts', desc: 'When new episodes drop' },
              { key: 'dailyReward', label: 'Daily Reward Reminder', desc: 'Claim your free coins' },
              { key: 'vipExpiry', label: 'VIP Expiry Warning', desc: '3 days before expiry' },
              { key: 'marketing', label: 'Promotions & Offers', desc: 'Special deals and new content' },
            ].map((item, i, arr) => (
              <div key={item.key} className={`flex items-center justify-between px-4 py-3.5 ${i < arr.length-1 ? 'border-b border-brand-border' : ''}`}>
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-brand-subtle text-xs">{item.desc}</p>
                </div>
                <Toggle on={notifs[item.key as keyof typeof notifs]} onToggle={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof notifs] }))} />
              </div>
            ))}
          </div>
        </section>

        {/* LANGUAGE */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={16} className="text-brand-red" />
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Language</h2>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => setLang(l.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${lang===l.code ? 'border-brand-red bg-brand-red/10 text-brand-red' : 'border-brand-border text-brand-text hover:border-brand-muted'}`}>
                  <span>{l.flag}</span>{l.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LEGAL */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-brand-red" />
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Legal</h2>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
            {[
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Refund Policy', href: '/refund' },
              { label: 'Help & Support', href: '/help' },
            ].map((item, i, arr) => (
              <Link key={item.href} href={item.href} className={`flex items-center justify-between px-4 py-3.5 hover:bg-brand-dark transition-colors ${i < arr.length-1 ? 'border-b border-brand-border' : ''}`}>
                <span className="text-brand-text text-sm">{item.label}</span>
                <ChevronRight size={16} className="text-brand-muted" />
              </Link>
            ))}
          </div>
        </section>

        {/* DANGER ZONE */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-brand-red" />
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Account</h2>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between px-4 py-3.5 border-b border-brand-border hover:bg-brand-dark transition-colors">
              <span className="text-brand-text text-sm">App Version</span>
              <span className="text-brand-subtle text-xs">v1.0.0</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-brand-dark transition-colors">
              <span className="text-red-400 text-sm flex items-center gap-2"><Trash2 size={14} /> Delete Account</span>
              <ChevronRight size={16} className="text-brand-muted" />
            </button>
          </div>
        </section>

      </div>
    </main>
  )
}
