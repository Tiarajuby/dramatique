'use client'

import { useState } from 'react'
import { Copy, Check, Share2, Gift } from 'lucide-react'

const STEPS = [
  { icon: '📲', title: 'Share your link', desc: 'Send your unique invite link to friends' },
  { icon: '✅', title: 'Friend signs up', desc: 'They create a Dramatique account' },
  { icon: '🪙', title: 'Both get coins', desc: 'You get +30 coins, they get +10 coins' },
]

export default function InvitePage() {
  const [copied, setCopied] = useState(false)
  const referralCode = 'DRAMA-X7K2'
  const referralLink = `https://dramatique.com/join/${referralCode}`

  const copy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Join Dramatique', text: 'Watch amazing short dramas! Use my link to get 10 free coins.', url: referralLink })
    } else { copy() }
  }

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-lg mx-auto px-5 md:px-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎁</div>
          <h1 className="text-white font-bold text-3xl mb-2">Invite Friends</h1>
          <p className="text-brand-subtle text-sm">Share Dramatique and earn free coins together</p>
        </div>

        {/* REWARD CARD */}
        <div className="bg-gradient-to-r from-brand-red/20 to-brand-dark border border-brand-red/30 rounded-2xl p-5 mb-6 text-center">
          <div className="flex items-center justify-center gap-6">
            <div>
              <p className="text-white font-black text-3xl">🪙 30</p>
              <p className="text-brand-subtle text-xs mt-1">You earn</p>
            </div>
            <div className="w-px h-12 bg-brand-border" />
            <div>
              <p className="text-white font-black text-3xl">🪙 10</p>
              <p className="text-brand-subtle text-xs mt-1">Friend gets</p>
            </div>
          </div>
          <p className="text-brand-muted text-xs mt-4">Per friend who signs up using your link</p>
        </div>

        {/* HOW IT WORKS */}
        <div className="mb-6">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">How it works</h3>
          <div className="flex flex-col gap-3">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-4 bg-brand-card border border-brand-border rounded-xl p-4">
                <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-xl flex-shrink-0">{step.icon}</div>
                <div>
                  <p className="text-white font-bold text-sm">{step.title}</p>
                  <p className="text-brand-subtle text-xs">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REFERRAL LINK */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5 mb-4">
          <p className="text-white font-bold text-sm mb-3">Your unique invite link</p>
          <div className="flex gap-2 mb-3">
            <div className="flex-1 bg-brand-dark border border-brand-border rounded-xl px-3 py-2.5 text-brand-subtle text-xs font-mono truncate">
              {referralLink}
            </div>
            <button onClick={copy} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors flex-shrink-0 ${copied ? 'bg-green-500/20 text-green-400' : 'bg-brand-red text-white hover:bg-brand-redHover'}`}>
              {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
            </button>
          </div>
          <p className="text-brand-muted text-[10px]">Your code: <span className="text-white font-bold">{referralCode}</span></p>
        </div>

        {/* SHARE BUTTON */}
        <button onClick={share} className="w-full flex items-center justify-center gap-2 btn-primary py-3.5 rounded-xl mb-6">
          <Share2 size={16} /> Share with Friends
        </button>

        {/* STATS */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
          <h3 className="text-white font-bold text-sm mb-4">Your referral stats</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-white font-black text-2xl">0</p>
              <p className="text-brand-subtle text-xs">Invited</p>
            </div>
            <div>
              <p className="text-white font-black text-2xl">0</p>
              <p className="text-brand-subtle text-xs">Joined</p>
            </div>
            <div>
              <p className="text-white font-black text-2xl">🪙 0</p>
              <p className="text-brand-subtle text-xs">Earned</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
