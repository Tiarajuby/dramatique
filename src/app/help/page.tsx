'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

const FAQS = [
  { q: 'How do I watch episodes for free?', a: 'The first 2 episodes of every series are completely free — no account or coins needed. Just tap Watch and enjoy. From episode 3 onwards, you can unlock using coins or by watching 2 short ads.' },
  { q: 'What are coins and how do I get them?', a: 'Coins are our virtual currency used to unlock episodes. You can buy coin packs starting from ₹89, earn 5 free coins daily by checking in, earn 30 coins per friend you invite, or watch short ads to earn 3 coins each.' },
  { q: 'What is VIP and what does it include?', a: 'VIP gives you unlimited access to all episodes with no coins needed, ad-free viewing, early access to new series, and all 12 language options. VIP costs ₹950/month or ₹5,700/year (50% savings).' },
  { q: 'Can I watch on multiple devices?', a: 'Yes. Your Dramatique account works on any device — phone, tablet, or desktop. Your watch history and coin balance sync automatically across all devices.' },
  { q: 'How do I cancel my VIP subscription?', a: 'Go to Profile → Settings → Account → Manage Subscription. You can cancel anytime and will retain VIP access until the end of your current billing period.' },
  { q: 'My payment failed — what do I do?', a: 'Try again with a different payment method, or check with your bank. If you were charged but coins weren\'t credited, contact support@dramatique.com with your transaction ID.' },
  { q: 'How do I change the language?', a: 'Go to Profile → Settings → Language, and select from our 12 available languages. You can also change language on the episode player screen.' },
  { q: 'Can I download episodes to watch offline?', a: 'Offline download is coming soon for VIP members. For now, all content streams online.' },
  { q: 'How do I report a bug or issue?', a: 'Contact us at support@dramatique.com or use the Contact Us page. Please include your device type, browser, and a description of the issue.' },
  { q: 'Why is an episode not playing?', a: 'Check your internet connection first. If the issue persists, try refreshing the page or clearing your browser cache. If a specific episode is broken, contact support with the series name and episode number.' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-brand-dark transition-colors">
        <span className="text-white font-semibold text-sm pr-4">{q}</span>
        {open ? <ChevronUp size={16} className="text-brand-red flex-shrink-0" /> : <ChevronDown size={16} className="text-brand-subtle flex-shrink-0" />}
      </button>
      {open && <div className="px-4 pb-4 text-brand-subtle text-sm leading-relaxed border-t border-brand-border pt-3">{a}</div>}
    </div>
  )
}

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const filtered = FAQS.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-5 md:px-8">

        <div className="text-center mb-8">
          <h1 className="text-white font-bold text-3xl mb-2">Help & Support</h1>
          <p className="text-brand-subtle text-sm">Find answers to common questions</p>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-2xl px-4 py-3 mb-6">
          <Search size={18} className="text-brand-subtle flex-shrink-0" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search help articles..."
            className="flex-1 bg-transparent text-white placeholder-brand-muted text-sm outline-none" />
        </div>

        {/* QUICK LINKS */}
        {!search && (
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { icon: '🪙', label: 'Coins & Payment', href: '/coins' },
              { icon: '👑', label: 'VIP Plans', href: '/vip' },
              { icon: '📧', label: 'Contact Us', href: '/contact' },
              { icon: '💸', label: 'Refund Policy', href: '/refund' },
            ].map(item => (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-xl p-3.5 hover:border-brand-muted transition-colors">
                <span className="text-xl">{item.icon}</span>
                <span className="text-white font-semibold text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* FAQ */}
        <h2 className="text-white font-bold text-lg mb-4">
          {search ? `${filtered.length} results for "${search}"` : 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-2">
          {filtered.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>

        {/* CONTACT */}
        <div className="mt-8 bg-brand-card border border-brand-border rounded-2xl p-5 text-center">
          <p className="text-white font-bold mb-1">Still need help?</p>
          <p className="text-brand-subtle text-sm mb-4">Our support team responds within 24 hours.</p>
          <Link href="/contact" className="btn-primary px-6 py-2.5 inline-block">Contact Support</Link>
        </div>

      </div>
    </main>
  )
}
