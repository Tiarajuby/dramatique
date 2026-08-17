import { useQuery } from '@tanstack/react-query'
import { seriesApi } from '@/lib/api'

// Query keys — centralised to avoid typos and enable precise invalidation
export const seriesKeys = {
  all: ['series'] as const,
  feed: () => [...seriesKeys.all, 'feed'] as const,
  hero: () => [...seriesKeys.all, 'hero'] as const,
  detail: (slug: string) => [...seriesKeys.all, 'detail', slug] as const,
  search: (query: string) => [...seriesKeys.all, 'search', query] as const,
  byGenre: (genre: string) => [...seriesKeys.all, 'genre', genre] as const,
  recommended: (excludeId: string) => [...seriesKeys.all, 'recommended', excludeId] as const,
}

// ── HOME FEED ──────────────────────────────────────────
export function useSeriesFeed() {
  return useQuery({
    queryKey: seriesKeys.feed(),
    queryFn: seriesApi.getFeed,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// ── HERO BANNER ──────────────────────────────────────────
export function useHeroSeries() {
  return useQuery({
    queryKey: seriesKeys.hero(),
    queryFn: seriesApi.getHero,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// ── CONTINUE WATCHING ──────────────────────────────────────────
export function useContinueWatching() {
  return useQuery({
    queryKey: [...seriesKeys.all, 'continue'],
    queryFn: seriesApi.getContinueWatching,
    staleTime: 60 * 1000,
  })
}

// ── ALL SERIES (catalog) ──────────────────────────────────────────
export function useAllSeries() {
  return useQuery({
    queryKey: [...seriesKeys.all, 'catalog'],
    queryFn: seriesApi.getAll,
    staleTime: 5 * 60 * 1000,
  })
}

// ── SERIES DETAIL ──────────────────────────────────────────
export function useSeriesDetail(slug: string) {
  return useQuery({
    queryKey: seriesKeys.detail(slug),
    queryFn: () => seriesApi.getBySlug(slug),
    enabled: !!slug, // Don't fetch if no slug
    staleTime: 5 * 60 * 1000,
  })
}

// ── SEARCH ──────────────────────────────────────────
export function useSeriesSearch(query: string) {
  return useQuery({
    queryKey: seriesKeys.search(query),
    queryFn: () => seriesApi.search(query),
    staleTime: 60 * 1000, // 1 minute — search results change more often
    placeholderData: (prev) => prev, // Keep previous results while searching
  })
}

// ── BY GENRE ──────────────────────────────────────────
export function useSeriesByGenre(genre: string) {
  return useQuery({
    queryKey: seriesKeys.byGenre(genre),
    queryFn: () => seriesApi.getByGenre(genre),
    staleTime: 5 * 60 * 1000,
  })
}

// ── RECOMMENDATIONS ──────────────────────────────────────────
export function useRecommended(excludeId: string) {
  return useQuery({
    queryKey: seriesKeys.recommended(excludeId),
    queryFn: () => seriesApi.getRecommended(excludeId),
    enabled: !!excludeId,
    staleTime: 10 * 60 * 1000,
  })
}
