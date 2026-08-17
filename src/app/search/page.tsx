'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useAllSeries } from '@/hooks'
import { GENRES } from '@/types'
import SeriesCard from '@/components/series/SeriesCard'

const TRENDING_SEARCHES = ['CEO Romance', 'Revenge', 'Werewolf', 'Billionaire', 'Forbidden', 'Dragon']

export default function SearchPage() {
  const { data: MOCK_SERIES = [] } = useAllSeries()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(MOCK_SERIES)

  useEffect(() => {
    if (!query.trim()) { setResults(MOCK_SERIES); return }
    const q = query.toLowerCase()
    setResults(MOCK_SERIES.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q) ||
      s.synopsis.toLowerCase().includes(q)
    ))
  }, [query])

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">

        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-2xl px-5 py-4 mb-6 mt-2">
          <Search size={20} className="text-brand-subtle flex-shrink-0" />
          <input
            type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search series, genres, stories..."
            className="flex-1 bg-transparent text-white placeholder-brand-muted text-base outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-brand-subtle hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        {!query ? (
          <>
            {/* TRENDING SEARCHES */}
            <div className="mb-8">
              <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Trending Searches</h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map(t => (
                  <button key={t} onClick={() => setQuery(t)}
                    className="px-4 py-2 bg-brand-card border border-brand-border rounded-full text-sm text-brand-text hover:text-white hover:border-brand-muted transition-colors">
                    🔥 {t}
                  </button>
                ))}
              </div>
            </div>

            {/* BROWSE BY GENRE */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Browse by Genre</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {GENRES.map((genre, i) => {
                  const colors = ['from-red-900/60','from-purple-900/60','from-blue-900/60','from-green-900/60','from-yellow-900/60','from-pink-900/60','from-indigo-900/60','from-orange-900/60','from-teal-900/60']
                  return (
                    <button key={genre} onClick={() => setQuery(genre)}
                      className={`relative h-16 rounded-xl bg-gradient-to-r ${colors[i % colors.length]} to-brand-card border border-brand-border overflow-hidden hover:border-brand-muted transition-colors text-left px-4`}>
                      <span className="text-white font-bold text-sm">{genre}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* RESULTS */}
            <p className="text-brand-subtle text-sm mb-5">
              {results.length > 0
                ? <><span className="text-white font-bold">{results.length}</span> results for "<span className="text-brand-red">{query}</span>"</>
                : <>No results for "<span className="text-brand-red">{query}</span>"</>
              }
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4">
                {results.map(s => <SeriesCard key={s.id} series={s} size="sm" />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-white font-bold text-lg mb-2">No results found</p>
                <p className="text-brand-subtle text-sm">Try a different search term or browse by genre</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
