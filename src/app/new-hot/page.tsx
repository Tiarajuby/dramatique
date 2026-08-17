'use client'

import { useState } from 'react'
import { useAllSeries } from '@/hooks'
import SeriesCard from '@/components/series/SeriesCard'
import { Flame, Sparkles, TrendingUp, Star } from 'lucide-react'

const TABS = [
  { id: 'trending',  label: 'Trending',     icon: Flame },
  { id: 'new',       label: 'New Releases',  icon: Sparkles },
  { id: 'top-rated', label: 'Top Rated',     icon: Star },
  { id: 'most-watched', label: 'Most Watched', icon: TrendingUp },
]

export default function NewHotPage() {
  const { data: MOCK_SERIES = [] } = useAllSeries()
  const [tab, setTab] = useState('trending')

  const series = {
    trending:     MOCK_SERIES,
    new:          MOCK_SERIES.filter(s => s.is_new),
    'top-rated':  [...MOCK_SERIES].sort((a,b) => (b.rating||0)-(a.rating||0)),
    'most-watched': [...MOCK_SERIES].sort((a,b) => (b.views||0)-(a.views||0)),
  }[tab] || MOCK_SERIES

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Flame size={28} className="text-brand-red" />
            <h1 className="text-white font-bold text-3xl">New & Hot</h1>
          </div>
          <p className="text-brand-subtle text-sm">The latest drops and hottest series right now</p>
        </div>

        {/* TABS */}
        <div className="flex gap-1 bg-brand-card border border-brand-border rounded-xl p-1 mb-8 overflow-x-auto scroll-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${tab === id ? 'bg-brand-red text-white' : 'text-brand-subtle hover:text-white'}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* FEATURED — top series */}
        {series[0] && (
          <div className="relative rounded-2xl overflow-hidden mb-8 h-48 md:h-64">
            <img src={series[0].hero_url || series[0].thumbnail_url} alt={series[0].title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent" />
            <div className="absolute inset-0 flex items-center px-6 md:px-10">
              <div>
                <span className="badge-new mb-2 inline-block">#{1} {TABS.find(t=>t.id===tab)?.label}</span>
                <h2 className="text-white font-bold text-2xl md:text-3xl mb-2">{series[0].title}</h2>
                <p className="text-brand-subtle text-sm mb-4 hidden md:block max-w-md">{series[0].synopsis}</p>
                <a href={`/series/${series[0].slug}`} className="btn-primary inline-flex items-center gap-2">▶ Watch Now</a>
              </div>
            </div>
          </div>
        )}

        {/* SERIES GRID */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4">
          {series.map((s, i) => (
            <div key={s.id} className="relative">
              {i < 3 && (
                <div className="absolute -top-2 -left-1 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white text-[10px] font-black z-10">
                  {i+1}
                </div>
              )}
              <SeriesCard series={s} size="sm" />
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
