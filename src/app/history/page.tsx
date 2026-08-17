'use client'

import { useAllSeries } from '@/hooks'
import EmptyState from '@/components/ui/EmptyState'
import { History, Play, Trash2 } from 'lucide-react'

export default function HistoryPage() {
  const { data: catalog = [] } = useAllSeries()
  const HISTORY = catalog.slice(0, 5).map((s, i) => ({
    ...s, watchedEp: i + 1, watchedAt: `${i + 1} day${i > 0 ? 's' : ''} ago`, progress: 20 + i * 15,
  }))
  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <History size={24} className="text-brand-red" />
            <h1 className="text-white font-bold text-3xl">Watch History</h1>
          </div>
          <button className="flex items-center gap-2 text-brand-subtle hover:text-white text-xs border border-brand-border hover:border-brand-muted px-3 py-2 rounded-lg transition-colors">
            <Trash2 size={13} /> Clear All
          </button>
        </div>

        {HISTORY.length > 0 ? (
          <div className="flex flex-col gap-3">
            {HISTORY.map(s => (
              <div key={s.id} className="flex items-center gap-4 bg-brand-card border border-brand-border rounded-xl p-3 hover:border-brand-muted transition-colors">
                <div className="relative w-16 flex-shrink-0 aspect-[2/3] rounded-lg overflow-hidden">
                  <img src={s.thumbnail_url} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate mb-0.5">{s.title}</p>
                  <p className="text-brand-subtle text-xs mb-1">Episode {s.watchedEp} · {s.genre}</p>
                  <p className="text-brand-muted text-[10px]">{s.watchedAt}</p>
                  <div className="w-full h-0.5 bg-brand-border rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-brand-red/60 rounded-full" style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
                <a href={`/series/${s.slug}`} className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-dark border border-brand-border flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-colors">
                  <Play size={14} fill="white" className="text-white ml-0.5" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="📺" title="No watch history" description="Start watching series and your history will appear here." actionLabel="Start Watching" actionHref="/" />
        )}
      </div>
    </main>
  )
}
