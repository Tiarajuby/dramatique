'use client'

import { useState } from 'react'
import { useAllSeries } from '@/hooks'
import SeriesCard from '@/components/series/SeriesCard'
import EmptyState from '@/components/ui/EmptyState'
import { BookMarked, Play } from 'lucide-react'

export default function MyListPage() {
  const { data: MOCK_SERIES = [] } = useAllSeries()
  // Mock: first 3 series are saved
  const [saved] = useState(MOCK_SERIES.slice(0, 3))
  const [continueWatching] = useState(MOCK_SERIES.slice(0, 2).map((s, i) => ({ ...s, progress: i === 0 ? 65 : 30, lastEp: i === 0 ? 4 : 2 })))

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookMarked size={24} className="text-brand-red" />
            <h1 className="text-white font-bold text-3xl">My List</h1>
          </div>
          <p className="text-brand-subtle text-sm">Your saved series and continue watching</p>
        </div>

        {/* CONTINUE WATCHING */}
        {continueWatching.length > 0 && (
          <section className="mb-10">
            <h2 className="text-white font-bold text-lg mb-4">▶ Continue Watching</h2>
            <div className="flex flex-col gap-3">
              {continueWatching.map(s => (
                <div key={s.id} className="flex items-center gap-4 bg-brand-card border border-brand-border rounded-xl p-3 hover:border-brand-muted transition-colors group">
                  <div className="relative w-20 flex-shrink-0 aspect-[2/3] rounded-lg overflow-hidden">
                    <img src={s.thumbnail_url} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate mb-1">{s.title}</p>
                    <p className="text-brand-subtle text-xs mb-2">Episode {s.lastEp} · {s.genre}</p>
                    {/* PROGRESS BAR */}
                    <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
                      <div className="h-full bg-brand-red rounded-full" style={{ width: `${s.progress}%` }} />
                    </div>
                    <p className="text-brand-muted text-[10px] mt-1">{s.progress}% watched</p>
                  </div>
                  <a href={`/series/${s.slug}`} className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-red flex items-center justify-center hover:bg-brand-redHover transition-colors">
                    <Play size={16} fill="white" className="text-white ml-0.5" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SAVED SERIES */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">🔖 Saved Series</h2>
            <span className="text-brand-subtle text-xs">{saved.length} series</span>
          </div>
          {saved.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4">
              {saved.map(s => <SeriesCard key={s.id} series={s} size="sm" />)}
            </div>
          ) : (
            <EmptyState
              icon="🔖"
              title="Nothing saved yet"
              description="Tap the bookmark icon on any series to save it here for later."
              actionLabel="Browse Series"
              actionHref="/categories"
            />
          )}
        </section>

      </div>
    </main>
  )
}
