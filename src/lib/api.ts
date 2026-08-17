/**
 * API Layer — Dramatiqué (consumer-facing)
 *
 * Single source of truth for all consumer data calls. Backed by real
 * Supabase queries — this is the one file consumer pages talk to, so
 * the underlying data source can keep changing without touching pages.
 */

import { supabase } from './supabase'
import { Series, FeedSection } from '@/types'

// ── Shared helpers ──────────────────────────────────────
let categoryCache: Map<string, string> | null = null
async function getCategoryMap(): Promise<Map<string, string>> {
  if (categoryCache) return categoryCache
  const { data } = await supabase.from('categories').select('id, name')
  categoryCache = new Map((data || []).map(c => [c.id, c.name]))
  return categoryCache
}

function mapSeries(row: any, categoryNameById: Map<string, string>): Series {
  const isNew = row.created_at && (Date.now() - new Date(row.created_at).getTime()) < 14 * 24 * 60 * 60 * 1000
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    genre: categoryNameById.get(row.primary_category_id) || 'Drama',
    synopsis: row.synopsis || '',
    thumbnail_url: row.thumbnail_url || '',
    hero_url: row.hero_url || row.thumbnail_url || '',
    language: row.language,
    total_episodes: row.total_episodes,
    lock_from_episode: row.lock_from_episode,
    coin_cost_per_episode: row.coin_cost_per_episode,
    is_published: row.is_published,
    created_at: row.created_at,
    is_new: isNew,
    views: row.views,
    rating: row.rating,
    is_vip: row.is_vip,
    is_trending: row.is_trending,
    tags: row.tags || [],
  }
}

// ── SERIES ──────────────────────────────────────────────
export const seriesApi = {
  getFeed: async (): Promise<FeedSection[]> => {
    const categoryNameById = await getCategoryMap()
    const { data: rows } = await supabase.from('series').select('*').eq('is_published', true)
    const all = (rows || []).map(r => mapSeries(r, categoryNameById))

    const sections: FeedSection[] = [
      { id: 'trending', title: 'Trending Now', subtitle: "What everyone's watching", kind: 'ranked', series: [...all].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6) },
      { id: 'new', title: 'New & Hot', subtitle: 'Fresh drops this week', kind: 'standard', series: all.filter(s => s.is_new) },
      { id: 'vip', title: 'VIP Exclusives', subtitle: 'Unlimited with VIP', kind: 'standard', series: all.filter(s => s.is_vip) },
      { id: 'picks', title: 'Top Rated', subtitle: 'Highest rated on Dramatiqué', kind: 'standard', series: [...all].sort((a, b) => (b.rating || 0) - (a.rating || 0)) },
    ]
    // Only show sections that actually have content — an empty real catalog
    // shouldn't render a wall of empty rows
    return sections.filter(s => s.series.length > 0)
  },

  getHero: async (): Promise<Series[]> => {
    const categoryNameById = await getCategoryMap()
    const { data } = await supabase.from('series').select('*').eq('is_published', true).eq('is_featured', true).limit(5)
    if (data && data.length > 0) return data.map(r => mapSeries(r, categoryNameById))
    // No featured series set yet — fall back to the most recent published ones
    const { data: fallback } = await supabase.from('series').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3)
    return (fallback || []).map(r => mapSeries(r, categoryNameById))
  },

  getContinueWatching: async (): Promise<Series[]> => {
    const { data: session } = await supabase.auth.getSession()
    const uid = session.session?.user?.id
    if (!uid) return []

    const categoryNameById = await getCategoryMap()
    const { data: progress } = await supabase
      .from('watch_progress')
      .select('*, series(*)')
      .eq('user_id', uid)
      .order('last_watched_at', { ascending: false })
      .limit(10)

    return (progress || [])
      .filter((p: any) => p.series)
      .map((p: any) => ({
        ...mapSeries(p.series, categoryNameById),
        progress: p.progress_percent,
        last_episode: p.episode_number,
      }))
  },

  getAll: async (): Promise<Series[]> => {
    const categoryNameById = await getCategoryMap()
    const { data } = await supabase.from('series').select('*').eq('is_published', true).order('created_at', { ascending: false })
    return (data || []).map(r => mapSeries(r, categoryNameById))
  },

  getBySlug: async (slug: string): Promise<Series> => {
    const categoryNameById = await getCategoryMap()
    const { data, error } = await supabase.from('series').select('*').eq('slug', slug).eq('is_published', true).single()
    if (error || !data) throw new Error(`Series not found: ${slug}`)
    return mapSeries(data, categoryNameById)
  },

  search: async (query: string): Promise<Series[]> => {
    const categoryNameById = await getCategoryMap()
    let q = supabase.from('series').select('*').eq('is_published', true)
    if (query.trim()) q = q.or(`title.ilike.%${query}%,synopsis.ilike.%${query}%`)
    const { data } = await q
    return (data || []).map(r => mapSeries(r, categoryNameById))
  },

  getByGenre: async (genre: string): Promise<Series[]> => {
    const categoryNameById = await getCategoryMap()
    if (genre === 'All') return seriesApi.getAll()
    let categoryId: string | undefined
    categoryNameById.forEach((name, id) => { if (name === genre) categoryId = id })
    if (!categoryId) return []
    const { data } = await supabase.from('series').select('*').eq('is_published', true).eq('primary_category_id', categoryId)
    return (data || []).map(r => mapSeries(r, categoryNameById))
  },

  getRecommended: async (excludeId: string): Promise<Series[]> => {
    const categoryNameById = await getCategoryMap()
    const { data } = await supabase.from('series').select('*').eq('is_published', true).neq('id', excludeId).limit(6)
    return (data || []).map(r => mapSeries(r, categoryNameById))
  },
}

// ── USER ──────────────────────────────────────────────
async function requireUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  const uid = data.session?.user?.id
  if (!uid) throw new Error('Not signed in')
  return uid
}

export const userApi = {
  getProfile: async () => {
    const uid = await requireUserId()
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single()
    if (error) throw error
    return data
  },

  getSavedList: async (): Promise<Series[]> => {
    const uid = await requireUserId()
    const categoryNameById = await getCategoryMap()
    const { data } = await supabase.from('saved_series').select('series(*)').eq('user_id', uid).order('saved_at', { ascending: false })
    return (data || []).filter((r: any) => r.series).map((r: any) => mapSeries(r.series, categoryNameById))
  },

  getWatchHistory: async () => {
    const uid = await requireUserId()
    const categoryNameById = await getCategoryMap()
    const { data } = await supabase
      .from('watch_progress')
      .select('*, series(*)')
      .eq('user_id', uid)
      .order('last_watched_at', { ascending: false })
    return (data || []).filter((p: any) => p.series).map((p: any) => ({
      ...mapSeries(p.series, categoryNameById),
      watchedEp: p.episode_number,
      watchedAt: new Date(p.last_watched_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      progress: p.progress_percent,
    }))
  },

  toggleSave: async (seriesId: string): Promise<{ saved: boolean }> => {
    const uid = await requireUserId()
    const { data: existing } = await supabase.from('saved_series').select('*').eq('user_id', uid).eq('series_id', seriesId).maybeSingle()
    if (existing) {
      await supabase.from('saved_series').delete().eq('user_id', uid).eq('series_id', seriesId)
      return { saved: false }
    }
    await supabase.from('saved_series').insert({ user_id: uid, series_id: seriesId })
    return { saved: true }
  },

  isSaved: async (seriesId: string): Promise<boolean> => {
    const uid = await requireUserId().catch(() => null)
    if (!uid) return false
    const { data } = await supabase.from('saved_series').select('series_id').eq('user_id', uid).eq('series_id', seriesId).maybeSingle()
    return !!data
  },

  // Real write — meaningful continuous tracking depends on real video
  // player integration (Cloudflare Stream), which is separate future work.
  // This plumbing is ready for whenever that lands.
  saveProgress: async (seriesId: string, episodeId: string, episodeNumber: number, progressPercent: number): Promise<void> => {
    const uid = await requireUserId()
    await supabase.from('watch_progress').upsert({
      user_id: uid, series_id: seriesId, episode_id: episodeId,
      episode_number: episodeNumber, progress_percent: progressPercent,
      completed: progressPercent >= 95, last_watched_at: new Date().toISOString(),
    }, { onConflict: 'user_id,series_id' })
  },

  claimDailyReward: async (): Promise<{ coins: number; streak: number }> => {
    const { data, error } = await supabase.rpc('claim_daily_checkin')
    if (error) throw error
    return data
  },
}

// ── COINS ──────────────────────────────────────────────
export const coinApi = {
  getBalance: async (): Promise<number> => {
    const uid = await requireUserId()
    const { data, error } = await supabase.from('profiles').select('coins').eq('id', uid).single()
    if (error) throw error
    return data.coins
  },

  getTransactions: async () => {
    const uid = await requireUserId()
    const { data } = await supabase.from('coin_ledger').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(50)
    return (data || []).map((tx: any) => ({
      id: tx.id, type: tx.source, desc: tx.description,
      coins: tx.direction === 'credit' ? tx.amount : -tx.amount,
      date: new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'success',
    }))
  },

  unlockEpisode: async (episodeId: string): Promise<{ success: boolean; newBalance?: number }> => {
    const { data, error } = await supabase.rpc('unlock_episode', { target_episode_id: episodeId, method_used: 'coin' })
    if (error) throw error
    const balance = await coinApi.getBalance()
    return { success: true, newBalance: balance }
  },

  checkUnlocked: async (episodeId: string): Promise<boolean> => {
    const uid = await requireUserId().catch(() => null)
    if (!uid) return false
    const { data } = await supabase.from('episode_unlocks').select('id').eq('user_id', uid).eq('episode_id', episodeId).maybeSingle()
    return !!data
  },
}

// ── PAYMENTS ──────────────────────────────────────────────
// NOT CONNECTED — needs a real payment gateway (Razorpay for India, Stripe
// for international) plus a secure server-side route to verify payment
// signatures. That verification step must never run in the browser, since
// it requires a secret key. Flagged for setup — see chat notes.
export const paymentApi = {
  createOrder: async (packId: number, currency: string) => {
    throw new Error('Payments are not connected yet — needs Razorpay/Stripe setup.')
  },
  verifyPayment: async (paymentId: string, orderId: string, signature: string) => {
    throw new Error('Payments are not connected yet — needs Razorpay/Stripe setup.')
  },
}

// ── ADS ──────────────────────────────────────────────
// NOT CONNECTED — needs a real ad network SDK (e.g. Google AdMob) integrated
// into the app to actually serve and confirm rewarded-ad views. Flagged for
// setup — see chat notes.
export const adApi = {
  recordAdWatch: async (episodeId: string, adNumber: number): Promise<{ adsWatched: number; unlocked: boolean }> => {
    throw new Error('Ad network is not connected yet — needs AdMob (or similar) setup.')
  },
  getDailyAdLimit: async (): Promise<{ used: number; limit: number }> => {
    const { data } = await supabase.from('app_settings').select('daily_ad_limit').eq('id', true).single()
    return { used: 0, limit: data?.daily_ad_limit ?? 3 }
  },
}
