'use client'

import { useState } from 'react'
import { useAllSeries } from '@/hooks'
import { GENRES } from '@/types'
import SeriesCard from '@/components/series/SeriesCard'

const GENRE_ICONS: Record<string, string> = {
  'CEO Romance': '💼', 'Supernatural': '🌙', 'Revenge': '⚔️',
  'Forbidden Love': '❤️‍🔥', 'Crime Thriller': '🔍', 'Fantasy': '🐉',
  'Family Drama': '👨‍👩‍👧', 'Reincarnation': '✨', 'Arranged Marriage': '💍',
}

export default function CategoriesPage() {
  const { data: MOCK_SERIES = [] } = useAllSeries()
  const [selected, setSelected] = useState('All')

  const filtered = selected === 'All'
    ? MOCK_SERIES
    : MOCK_SERIES.filter(s => s.genre === selected)

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-white font-bold text-3xl mb-2">Categories</h1>
          <p className="text-brand-subtle text-sm">Browse by genre — find your next obsession</p>
        </div>

        {/* GENRE GRID — visual cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3 mb-8">
          <button
            onClick={() => setSelected('All')}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selected === 'All' ? 'border-brand-red bg-brand-red/10' : 'border-brand-border bg-brand-card hover:border-brand-muted'}`}
          >
            <span className="text-2xl">🎬</span>
            <span className={`text-[10px] font-bold text-center leading-tight ${selected === 'All' ? 'text-brand-red' : 'text-brand-text'}`}>All</span>
          </button>
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => setSelected(genre)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selected === genre ? 'border-brand-red bg-brand-red/10' : 'border-brand-border bg-brand-card hover:border-brand-muted'}`}
            >
              <span className="text-2xl">{GENRE_ICONS[genre] || '🎭'}</span>
              <span className={`text-[10px] font-bold text-center leading-tight ${selected === genre ? 'text-brand-red' : 'text-brand-text'}`}>{genre}</span>
            </button>
          ))}
        </div>

        {/* FILTER CHIPS — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto scroll-hide mb-8 pb-1">
          {['All', ...GENRES].map(g => (
            <button
              key={g}
              onClick={() => setSelected(g)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${selected === g ? 'bg-brand-red border-brand-red text-white' : 'border-brand-border text-brand-text hover:border-brand-muted hover:text-white'}`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* RESULTS COUNT */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-brand-subtle text-sm">
            <span className="text-white font-bold">{filtered.length}</span> series in{' '}
            <span className="text-brand-red font-semibold">{selected}</span>
          </p>
          <select className="bg-brand-card border border-brand-border text-brand-text text-xs rounded-lg px-3 py-1.5 outline-none">
            <option>Most Popular</option>
            <option>Newest First</option>
            <option>Top Rated</option>
            <option>Most Episodes</option>
          </select>
        </div>

        {/* SERIES GRID */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4">
            {filtered.map(s => <SeriesCard key={s.id} series={s} size="sm" />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎭</p>
            <p className="text-white font-bold text-xl mb-2">No series yet</p>
            <p className="text-brand-subtle text-sm">We're adding {selected} dramas soon. Check back!</p>
          </div>
        )}
      </div>
    </main>
  )
}
