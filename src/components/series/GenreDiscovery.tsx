'use client'

import Link from 'next/link'
import { GENRES } from '@/types'

// Genre tiles with distinct gradient identities — a browsing moment mid-feed
const GENRE_STYLE: Record<string, { icon: string; from: string }> = {
  'CEO Romance':      { icon: '💼', from: 'from-rose-900/70' },
  'Supernatural':     { icon: '🌙', from: 'from-purple-900/70' },
  'Revenge':          { icon: '⚔️', from: 'from-red-900/70' },
  'Forbidden Love':   { icon: '❤️‍🔥', from: 'from-pink-900/70' },
  'Crime Thriller':   { icon: '🔍', from: 'from-slate-800/80' },
  'Fantasy':          { icon: '🐉', from: 'from-emerald-900/70' },
  'Family Drama':     { icon: '👨‍👩‍👧', from: 'from-blue-900/70' },
  'Reincarnation':    { icon: '✨', from: 'from-indigo-900/70' },
  'Arranged Marriage':{ icon: '💍', from: 'from-amber-900/70' },
}

export default function GenreDiscovery() {
  return (
    <section className="mb-9 px-5 md:px-8">
      <div className="flex items-baseline gap-2.5 mb-3">
        <h2 className="text-brand-bright font-bold text-base sm:text-lg tracking-tight">Browse by Mood</h2>
        <span className="text-brand-subtle text-xs hidden sm:block">Find your next obsession</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {GENRES.map(genre => {
          const s = GENRE_STYLE[genre] || { icon: '🎭', from: 'from-brand-card' }
          return (
            <Link
              key={genre}
              href={`/categories?genre=${encodeURIComponent(genre)}`}
              className={`group relative h-20 rounded-xl overflow-hidden bg-gradient-to-br ${s.from} to-brand-card border border-white/5 hover:border-white/15 transition-all duration-300 ease-out-expo hover:-translate-y-0.5`}
            >
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <span className="text-white font-bold text-sm leading-tight">{genre}</span>
                <span className="text-2xl opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-transform duration-300">{s.icon}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
