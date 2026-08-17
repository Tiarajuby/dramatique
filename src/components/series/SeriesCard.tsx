'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Bookmark, Share2, Star, Eye, Lock, Crown, Flame, Check } from 'lucide-react'
import { Series } from '@/types'

function fmt(v: number) {
  return v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`
}

const WIDTHS = { sm: 'w-32 sm:w-36', md: 'w-36 sm:w-44', lg: 'w-44 sm:w-52' }

export default function SeriesCard({ series, size = 'md', rank }: { series: Series; size?: 'sm' | 'md' | 'lg'; rank?: number }) {
  const [saved, setSaved] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const enterTimer = useRef<ReturnType<typeof setTimeout>>()

  // Intent-delayed hover — prevents accidental firing while scrolling a rail
  const onEnter = useCallback(() => {
    enterTimer.current = setTimeout(() => setHovered(true), 180)
  }, [])
  const onLeave = useCallback(() => {
    clearTimeout(enterTimer.current)
    setHovered(false)
  }, [])

  const w = WIDTHS[size]
  const hasProgress = typeof series.progress === 'number' && series.progress > 0

  return (
    <div
      className={`${w} flex-shrink-0 relative`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Link href={`/series/${series.slug}`} className="block">
        <div className="w-full aspect-[2/3] relative bg-brand-card rounded-xl overflow-hidden group ring-1 ring-white/5">
          {!imgErr ? (
            <Image
              src={series.thumbnail_url}
              alt={series.title}
              fill
              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
              onError={() => setImgErr(true)}
              sizes="208px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/25 to-brand-dark flex items-center justify-center">
              <span className="font-display text-4xl text-brand-red/40">D</span>
            </div>
          )}

          {/* Permanent cinematic base gradient — grounds text, adds depth */}
          <div className="absolute inset-0 cine-fade opacity-80" />

          {/* Rank number for ranked rails (Top 10 style) */}
          {rank !== undefined && (
            <span className="absolute -left-1 bottom-1 font-display text-white/90 leading-none pointer-events-none"
              style={{ fontSize: size === 'lg' ? '4.5rem' : '3.5rem', WebkitTextStroke: '2px rgba(232,0,29,0.9)' }}>
              {rank}
            </span>
          )}

          {/* TOP-LEFT badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
            {series.is_vip && (
              <span className="flex items-center gap-1 bg-brand-gold text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-glow-gold">
                <Crown size={9} className="fill-black" /> VIP
              </span>
            )}
            {series.is_new && !series.is_vip && <span className="badge-new">New</span>}
            {series.is_trending && (
              <span className="flex items-center gap-0.5 bg-brand-red text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                <Flame size={9} className="fill-white" /> Hot
              </span>
            )}
          </div>

          {/* Coin-lock chip — signals monetisation right on the card */}
          {!series.is_vip && (
            <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/55 backdrop-blur-sm text-brand-gold text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              <Lock size={8} /> Ep {series.lock_from_episode}+
            </div>
          )}

          {/* Bottom meta: views (or rating) sitting on the gradient */}
          {rank === undefined && (
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              {series.views ? (
                <span className="flex items-center gap-1 text-white/75 text-[10px] font-medium">
                  <Eye size={10} /> {fmt(series.views)}
                </span>
              ) : <span />}
              {series.rating && (
                <span className="flex items-center gap-0.5 text-brand-gold text-[10px] font-bold">
                  <Star size={9} fill="currentColor" /> {series.rating}
                </span>
              )}
            </div>
          )}

          {/* Continue-watching progress bar */}
          {hasProgress && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
              <div className="h-full bg-brand-red" style={{ width: `${series.progress}%` }} />
            </div>
          )}
        </div>

        {/* Title block below artwork */}
        <div className="mt-2 px-0.5">
          <p className="text-brand-bright text-xs font-semibold truncate">{series.title}</p>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-brand-subtle text-[10px] truncate">{series.genre}</span>
            {hasProgress
              ? <span className="text-brand-red text-[10px] font-semibold flex-shrink-0">Ep {series.last_episode}</span>
              : <span className="text-brand-subtle text-[10px] flex-shrink-0">{series.total_episodes} eps</span>}
          </div>
        </div>
      </Link>

      {/* ── RICH HOVER REVEAL ── desktop only, intent-delayed ── */}
      {hovered && (
        <div
          className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-brand-cardHover rounded-2xl overflow-hidden shadow-card-hover z-50 animate-scale-in origin-bottom border border-white/10"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={onLeave}
        >
          <div className="relative w-full aspect-video">
            {!imgErr ? (
              <Image src={series.hero_url || series.thumbnail_url} alt={series.title} fill className="object-cover" sizes="256px" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-red/30 to-brand-dark" />
            )}
            <div className="absolute inset-0 cine-fade" />
            <div className="absolute bottom-2 left-3 right-3">
              <div className="flex items-center gap-1.5 mb-1">
                {series.is_vip && <span className="flex items-center gap-1 bg-brand-gold text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase"><Crown size={8} className="fill-black" />VIP</span>}
                {series.is_new && <span className="badge-new">New</span>}
                {series.rating && <span className="flex items-center gap-0.5 text-brand-gold text-[10px] font-bold ml-auto"><Star size={9} fill="currentColor" />{series.rating}</span>}
              </div>
              <h3 className="text-white font-bold text-sm leading-tight">{series.title}</h3>
            </div>
          </div>

          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-2 text-brand-subtle text-[10px]">
              <span className="text-brand-red font-semibold">{series.genre}</span>
              <span className="w-0.5 h-0.5 rounded-full bg-brand-muted" />
              <span>{series.total_episodes} episodes</span>
              <span className="w-0.5 h-0.5 rounded-full bg-brand-muted" />
              <span>{series.language}</span>
            </div>
            <p className="text-brand-text text-[11px] leading-relaxed mb-3 line-clamp-2">{series.synopsis}</p>

            {/* tags */}
            {series.tags && series.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {series.tags.slice(0, 3).map(t => (
                  <span key={t} className="text-[9px] text-brand-subtle border border-brand-border rounded-full px-1.5 py-0.5">{t}</span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Link href={`/series/${series.slug}`} className="flex-1 h-9 rounded-lg bg-brand-red hover:bg-brand-redHover flex items-center justify-center gap-1.5 transition-colors active:scale-[0.97]">
                <Play size={14} fill="white" className="text-white" />
                <span className="text-white text-xs font-bold">{hasProgress ? 'Resume' : 'Watch'}</span>
              </Link>
              <button
                onClick={(e) => { e.preventDefault(); setSaved(!saved) }}
                aria-label={saved ? 'Remove from list' : 'Add to list'}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all active:scale-90 ${saved ? 'bg-brand-red' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
              >
                {saved ? <Check size={15} className="text-white" /> : <Bookmark size={14} className="text-brand-text" />}
              </button>
              <button
                onClick={(e) => e.preventDefault()}
                aria-label="Share"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all active:scale-90"
              >
                <Share2 size={13} className="text-brand-text" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function SeriesCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const w = WIDTHS[size]
  return (
    <div className={`${w} flex-shrink-0`}>
      <div className="aspect-[2/3] skeleton rounded-xl" />
      <div className="mt-2 space-y-1.5">
        <div className="skeleton h-3 rounded w-4/5" />
        <div className="skeleton h-2.5 rounded w-2/3" />
      </div>
    </div>
  )
}
