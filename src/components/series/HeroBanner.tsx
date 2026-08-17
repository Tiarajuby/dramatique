'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, BookmarkPlus, Check, ChevronLeft, ChevronRight, Star, Crown } from 'lucide-react'
import { Series } from '@/types'

export default function HeroBanner({ series, loading = false }: { series: Series[]; loading?: boolean }) {
  const [current, setCurrent] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (series.length <= 1) return
    const t = setInterval(() => setCurrent(p => (p + 1) % series.length), 7000)
    return () => clearInterval(t)
  }, [series.length])

  if (loading) {
    return <div className="relative w-full h-[68vh] sm:h-[74vh] md:h-[86vh] skeleton" />
  }
  if (!series.length) return null
  const active = series[current]

  return (
    <div className="relative w-full h-[68vh] sm:h-[74vh] md:h-[86vh] overflow-hidden">
      {series.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-[1200ms] ease-smooth ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`absolute inset-0 ${i === current ? 'animate-ken-burns' : ''}`}>
            <Image src={s.hero_url || s.thumbnail_url} alt={s.title} fill className="object-cover object-center" priority={i === 0} sizes="100vw" />
          </div>
        </div>
      ))}

      {/* Layered cinematic gradients — deeper, moodier */}
      <div className="absolute inset-0 cine-fade-r" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/40 via-transparent to-transparent" />

      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="px-5 md:px-12 pb-24 md:pb-0 max-w-2xl" key={active.id}>
          <div className="animate-slide-up">
            <div className="flex items-center gap-2.5 mb-4">
              {active.is_vip && (
                <span className="flex items-center gap-1 bg-brand-gold text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                  <Crown size={10} className="fill-black" /> VIP
                </span>
              )}
              <span className="text-brand-red text-xs font-black uppercase tracking-[0.2em]">{active.genre}</span>
              {active.rating && (
                <span className="flex items-center gap-1 text-brand-gold text-xs font-bold">
                  <Star size={12} fill="currentColor" /> {active.rating}
                </span>
              )}
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-white leading-[0.92] mb-4 text-balance drop-shadow-2xl">
              {active.title}
            </h1>

            <p className="text-brand-text text-sm sm:text-base leading-relaxed mb-5 max-w-lg line-clamp-3">{active.synopsis}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6 text-brand-subtle text-xs font-medium">
              <span>{active.total_episodes} Episodes</span>
              <span className="w-1 h-1 rounded-full bg-brand-muted" />
              <span className="text-green-400">Free through Ep {active.lock_from_episode - 1}</span>
              <span className="w-1 h-1 rounded-full bg-brand-muted" />
              <span>{active.language}</span>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/series/${active.slug}`} className="flex items-center gap-2 bg-brand-red hover:bg-brand-redHover text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 text-sm shadow-glow-red active:scale-[0.97]">
                <Play size={17} fill="white" /> Watch Free
              </Link>
              <button
                onClick={() => setSaved(!saved)}
                className={`flex items-center gap-2 border font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm backdrop-blur-sm active:scale-[0.97] ${saved ? 'border-brand-red text-white bg-brand-red/15' : 'border-white/20 text-white bg-white/5 hover:bg-white/10 hover:border-white/30'}`}
              >
                {saved ? <><Check size={16} /> Saved</> : <><BookmarkPlus size={16} /> My List</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {series.length > 1 && (
        <div className="absolute bottom-8 md:bottom-10 right-5 md:right-12 flex items-center gap-2 z-10">
          <button onClick={() => setCurrent(p => (p - 1 + series.length) % series.length)} aria-label="Previous" className="w-8 h-8 rounded-full bg-black/40 backdrop-blur border border-white/10 hover:bg-brand-red hover:border-brand-red flex items-center justify-center transition-colors active:scale-90">
            <ChevronLeft size={15} className="text-white" />
          </button>
          <div className="flex gap-1.5">
            {series.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} className={`transition-all duration-300 rounded-full h-1.5 ${i === current ? 'w-6 bg-brand-red' : 'w-1.5 bg-white/30 hover:bg-white/50'}`} />
            ))}
          </div>
          <button onClick={() => setCurrent(p => (p + 1) % series.length)} aria-label="Next" className="w-8 h-8 rounded-full bg-black/40 backdrop-blur border border-white/10 hover:bg-brand-red hover:border-brand-red flex items-center justify-center transition-colors active:scale-90">
            <ChevronRight size={15} className="text-white" />
          </button>
        </div>
      )}
    </div>
  )
}
