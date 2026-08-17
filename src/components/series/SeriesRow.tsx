'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import SeriesCard, { SeriesCardSkeleton } from './SeriesCard'
import { Series } from '@/types'

interface SeriesRowProps {
  title: string
  series: Series[]
  loading?: boolean
  subtitle?: string
  kind?: 'standard' | 'continue' | 'spotlight' | 'ranked'
  seeAllHref?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function SeriesRow({ title, series, loading = false, subtitle, kind = 'standard', seeAllHref, size = 'md' }: SeriesRowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    if (!ref.current) return
    ref.current.scrollBy({ left: dir === 'right' ? ref.current.clientWidth * 0.75 : -ref.current.clientWidth * 0.75, behavior: 'smooth' })
  }

  const isRanked = kind === 'ranked'
  const cardSize = kind === 'spotlight' ? 'lg' : size

  return (
    <section className="mb-9">
      <div className="flex items-end justify-between mb-3 px-5 md:px-8">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-brand-bright font-bold text-base sm:text-lg tracking-tight">{title}</h2>
          {subtitle && <span className="text-brand-subtle text-xs hidden sm:block">{subtitle}</span>}
        </div>
        {seeAllHref && (
          <Link href={seeAllHref} className="group/see flex items-center gap-1 text-brand-subtle hover:text-white text-xs font-semibold transition-colors">
            See all
            <ArrowRight size={13} className="group-hover/see:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      <div className="relative group/row">
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-0 top-0 bottom-8 z-20 w-12 items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex bg-gradient-to-r from-brand-black via-brand-black/70 to-transparent"
        >
          <div className="w-9 h-9 rounded-full bg-brand-card/90 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-colors active:scale-90">
            <ChevronLeft size={17} className="text-white" />
          </div>
        </button>
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 top-0 bottom-8 z-20 w-12 items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex bg-gradient-to-l from-brand-black via-brand-black/70 to-transparent"
        >
          <div className="w-9 h-9 rounded-full bg-brand-card/90 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-colors active:scale-90">
            <ChevronRight size={17} className="text-white" />
          </div>
        </button>

        <div ref={ref} className={`scroll-row px-5 md:px-8 ${isRanked ? 'pl-8 md:pl-12' : ''}`}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SeriesCardSkeleton key={i} size={cardSize} />)
            : series.map((s, i) => (
                <SeriesCard key={s.id} series={s} size={cardSize} rank={isRanked ? i + 1 : undefined} />
              ))
          }
        </div>
      </div>
    </section>
  )
}
