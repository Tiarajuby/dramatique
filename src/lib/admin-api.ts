/**
 * Admin API Layer — Dramatiqué
 *
 * Write-capable, admin-shaped data access. Kept separate from the consumer
 * `api.ts` on purpose: admin endpoints are write-heavy, paginated/filterable,
 * and in production sit behind admin auth on a different route prefix
 * (`/api/admin/*`). Both layers share the same mock source today, so there's
 * no duplication — only a clean split that matches the real backend.
 *
 * When the backend lands, swap the bodies here for fetch() calls to /api/admin/*.
 */

import {
  MOCK_CATEGORIES, MOCK_SUBCATEGORIES, ADMIN_SERIES, ADMIN_EPISODES,
  ADMIN_USERS, ADMIN_TRANSACTIONS, DASHBOARD_STATS, REVENUE_CHART, TOP_SERIES,
} from './admin-mock-data'
import { supabase } from './supabase'

// Simulated latency so loading states are real and testable
const wait = (ms = 300) => new Promise(r => setTimeout(r, ms))

// Generic list envelope — mirrors how a paginated backend responds
export interface ListResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

function paginate<T>(all: T[], page = 1, pageSize = 50): ListResult<T> {
  const start = (page - 1) * pageSize
  return { items: all.slice(start, start + pageSize), total: all.length, page, pageSize }
}

// ── DASHBOARD ──────────────────────────────────────────
// ── DASHBOARD ──────────────────────────────────────────
export const adminDashboardApi = {
  getStats: async () => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [
      { count: usersTotal },
      { count: usersToday },
      { count: usersWeek },
      { count: seriesPublished },
      { count: seriesDraft },
      { count: episodesTotal },
      { count: vipActive },
      { count: coinTxToday },
      { data: revenueToday },
      { data: revenueWeek },
      { data: revenueMonth },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
      supabase.from('series').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('series').select('*', { count: 'exact', head: true }).eq('is_published', false),
      supabase.from('episodes').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_vip', true).gt('vip_until', now.toISOString()),
      supabase.from('coin_ledger').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('transactions').select('amount_inr').eq('status', 'success').gte('created_at', todayStart),
      supabase.from('transactions').select('amount_inr').eq('status', 'success').gte('created_at', weekStart),
      supabase.from('transactions').select('amount_inr').eq('status', 'success').gte('created_at', monthStart),
    ])

    const sum = (rows: any[] | null) => (rows || []).reduce((s, r) => s + r.amount_inr, 0)

    return {
      users: { total: usersTotal || 0, today: usersToday || 0, week: usersWeek || 0 },
      series: { total: (seriesPublished || 0) + (seriesDraft || 0), published: seriesPublished || 0, draft: seriesDraft || 0 },
      episodes: { total: episodesTotal || 0 },
      revenue: { today: sum(revenueToday), week: sum(revenueWeek), month: sum(revenueMonth) },
      vip: { active: vipActive || 0 },
      coinTransactions: { today: coinTxToday || 0 },
      // paywallHitRate / adUnlockRate removed — no event-tracking source exists yet.
      // Would need a page/interaction analytics table to compute honestly.
    }
  },

  getRevenueChart: async () => {
    const days = 30
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    const [{ data: txns }, { data: users }] = await Promise.all([
      supabase.from('transactions').select('amount_inr, created_at').eq('status', 'success').gte('created_at', since),
      supabase.from('profiles').select('created_at').gte('created_at', since),
    ])

    const chart: { day: number; revenue: number; users: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dayKey = date.toISOString().slice(0, 10)
      const revenue = (txns || []).filter(t => t.created_at.slice(0, 10) === dayKey).reduce((s, t) => s + t.amount_inr, 0)
      const newUsers = (users || []).filter(u => u.created_at.slice(0, 10) === dayKey).length
      chart.push({ day: days - i, revenue, users: newUsers })
    }
    return chart
  },

  getTopSeries: async () => {
    const { data } = await supabase.from('series').select('title, views').eq('is_published', true).order('views', { ascending: false }).limit(5)
    // revenue per series needs a real payments pipeline connected first — shown as 0 until then
    return (data || []).map(s => ({ title: s.title, views: s.views, revenue: 0 }))
  },
}

// ── SERIES ──────────────────────────────────────────
export interface SeriesFilters { search?: string; status?: string; page?: number; pageSize?: number }

// Resolves a category NAME (what the forms work with) to its real database ID
async function resolveCategoryId(name: string): Promise<string | null> {
  if (!name) return null
  const { data, error } = await supabase.from('categories').select('id').eq('name', name).single()
  if (error) throw new Error(`Category "${name}" not found`)
  return data.id
}
// Resolves subcategory NAMEs to their real IDs (skips any that don't match)
async function resolveSubcategoryIds(names: string[]): Promise<string[]> {
  if (!names.length) return []
  const { data, error } = await supabase.from('subcategories').select('id, name').in('name', names)
  if (error) throw error
  return (data || []).map(s => s.id)
}

function mapSeriesRow(row: any, categoryNameById: Map<string, string>, subNames: string[]) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    synopsis: row.synopsis || '',
    thumbnail_url: row.thumbnail_url || '',
    hero_url: row.hero_url || '',
    primary_category: categoryNameById.get(row.primary_category_id) || '',
    subcategories: subNames,
    tags: (row.tags || []).join(', '),
    language: row.language,
    total_episodes: row.total_episodes,
    lock_from_episode: row.lock_from_episode,
    coin_cost: row.coin_cost_per_episode,
    coin_cost_per_episode: row.coin_cost_per_episode,
    is_featured: row.is_featured,
    status: row.is_published ? 'published' : 'draft',
    views: row.views,
    revenue: 0, // not yet computed — needs an aggregate over coin_ledger unlocks, separate pass
    created_at: row.created_at,
  }
}

export const adminSeriesApi = {
  list: async (filters: SeriesFilters = {}): Promise<ListResult<any>> => {
    const page = filters.page || 1
    const pageSize = filters.pageSize || 50
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('series').select('*', { count: 'exact' })
    if (filters.search) query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`)
    if (filters.status && filters.status !== 'all') query = query.eq('is_published', filters.status === 'published')

    const { data: rows, error, count } = await query.order('created_at', { ascending: false }).range(from, to)
    if (error) throw error

    const { data: categories } = await supabase.from('categories').select('id, name')
    const categoryNameById = new Map((categories || []).map(c => [c.id, c.name]))

    const ids = (rows || []).map(r => r.id)
    let subsBySeriesId = new Map<string, string[]>()
    if (ids.length) {
      const { data: links } = await supabase
        .from('series_subcategories')
        .select('series_id, subcategories(name)')
        .in('series_id', ids)
      ;(links || []).forEach((l: any) => {
        // Supabase can return the joined row as an object or a single-item array
        // depending on the query shape — handle both so nothing gets silently dropped
        const name = Array.isArray(l.subcategories) ? l.subcategories[0]?.name : l.subcategories?.name
        if (!name) return
        const arr = subsBySeriesId.get(l.series_id) || []
        arr.push(name)
        subsBySeriesId.set(l.series_id, arr)
      })
    }

    return {
      items: (rows || []).map(r => mapSeriesRow(r, categoryNameById, subsBySeriesId.get(r.id) || [])),
      total: count || 0,
      page, pageSize,
    }
  },

  getById: async (id: string) => {
    const { data: row, error } = await supabase.from('series').select('*').eq('id', id).single()
    if (error) throw error

    const { data: categories } = await supabase.from('categories').select('id, name')
    const categoryNameById = new Map((categories || []).map(c => [c.id, c.name]))

    const { data: links } = await supabase
      .from('series_subcategories')
      .select('subcategories(name)')
      .eq('series_id', id)
    const subNames = (links || []).map((l: any) => Array.isArray(l.subcategories) ? l.subcategories[0]?.name : l.subcategories?.name).filter(Boolean)

    return mapSeriesRow(row, categoryNameById, subNames)
  },

  create: async (payload: any) => {
    const categoryId = await resolveCategoryId(payload.primary_category)
    const subIds = await resolveSubcategoryIds(payload.subcategories || [])

    const { data: series, error } = await supabase.from('series').insert({
      title: payload.title,
      slug: payload.slug,
      synopsis: payload.synopsis || '',
      thumbnail_url: payload.thumbnail_url || null,
      hero_url: payload.hero_url || null,
      language: payload.language || 'English',
      primary_category_id: categoryId,
      tags: payload.tags ? payload.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      lock_from_episode: payload.lock_from_episode || 3,
      coin_cost_per_episode: payload.coin_cost_per_episode || 5,
      is_published: payload.status === 'published',
      is_featured: !!payload.is_featured,
    }).select().single()
    if (error) throw error

    if (subIds.length) {
      await supabase.from('series_subcategories').insert(subIds.map(sid => ({ series_id: series.id, subcategory_id: sid })))
    }
    return series
  },

  update: async (id: string, payload: any) => {
    const categoryId = payload.primary_category ? await resolveCategoryId(payload.primary_category) : undefined
    const subIds = payload.subcategories ? await resolveSubcategoryIds(payload.subcategories) : undefined

    const updates: any = {}
    if (payload.title !== undefined) updates.title = payload.title
    if (payload.slug !== undefined) updates.slug = payload.slug
    if (payload.synopsis !== undefined) updates.synopsis = payload.synopsis
    if (payload.language !== undefined) updates.language = payload.language
    if (categoryId !== undefined) updates.primary_category_id = categoryId
    if (payload.tags !== undefined) updates.tags = payload.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    if (payload.lock_from_episode !== undefined) updates.lock_from_episode = payload.lock_from_episode
    if (payload.coin_cost_per_episode !== undefined) updates.coin_cost_per_episode = payload.coin_cost_per_episode
    if (payload.is_featured !== undefined) updates.is_featured = payload.is_featured
    if (payload.status !== undefined) updates.is_published = payload.status === 'published'

    const { data, error } = await supabase.from('series').update(updates).eq('id', id).select().single()
    if (error) throw error

    if (subIds !== undefined) {
      await supabase.from('series_subcategories').delete().eq('series_id', id)
      if (subIds.length) {
        await supabase.from('series_subcategories').insert(subIds.map(sid => ({ series_id: id, subcategory_id: sid })))
      }
    }
    return data
  },

  setStatus: async (id: string, status: 'published' | 'draft' | 'archived') => {
    // Real schema tracks only published/unpublished — 'archived' collapses to unpublished for now
    const { data, error } = await supabase.from('series').update({ is_published: status === 'published' }).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  remove: async (id: string) => {
    const { error } = await supabase.from('series').delete().eq('id', id)
    if (error) throw error
    return { id, deleted: true }
  },

  duplicate: async (id: string) => {
    const original = await adminSeriesApi.getById(id)
    return adminSeriesApi.create({ ...original, title: `${original.title} (Copy)`, slug: `${original.slug}-copy-${Date.now()}`, status: 'draft' })
  },
}

// ── EPISODES ──────────────────────────────────────────
export const adminEpisodeApi = {
  listBySeries: async (seriesId: string) => {
    const { data, error } = await supabase.from('episodes').select('*').eq('series_id', seriesId).order('episode_number')
    if (error) throw error
    return (data || []).map(e => ({
      id: e.id,
      series_id: e.series_id,
      number: e.episode_number,
      title: e.title,
      duration_seconds: e.duration_seconds,
      is_free: e.is_free,
      coin_cost: e.coin_cost,
      video_url: e.video_id || '',
      status: e.status,
      views: e.views,
      created_at: e.created_at,
    }))
  },

  getById: async (id: string) => {
    const { data, error } = await supabase.from('episodes').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  create: async (seriesId: string, payload: any) => {
    const { data, error } = await supabase.from('episodes').insert({
      series_id: seriesId,
      episode_number: payload.number,
      title: payload.title || `Episode ${payload.number}`,
      duration_seconds: payload.duration_seconds || 60,
      is_free: !!payload.is_free,
      coin_cost: payload.coin_cost ?? null,
      video_id: payload.video_id || null,
      subtitles_url: payload.subtitles_url || null,
      status: payload.video_id ? 'ready' : 'pending',
      publish_date: payload.publish_date || null,
    }).select().single()
    if (error) throw error
    return data
    // series.total_episodes updates automatically via the DB trigger we built earlier
  },

  update: async (id: string, payload: any) => {
    const { data, error } = await supabase.from('episodes').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  setFree: async (id: string, isFree: boolean) => {
    const { data, error } = await supabase.from('episodes').update({ is_free: isFree }).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  remove: async (id: string) => {
    const { error } = await supabase.from('episodes').delete().eq('id', id)
    if (error) throw error
    return { id, deleted: true }
  },
}

// ── CATEGORIES ──────────────────────────────────────────
export const adminCategoryApi = {
  listCategories: async () => {
    const { data: categories, error } = await supabase.from('categories').select('*').order('display_order')
    if (error) throw error
    const { data: series } = await supabase.from('series').select('primary_category_id')
    const counts = new Map<string, number>()
    ;(series || []).forEach(s => { if (s.primary_category_id) counts.set(s.primary_category_id, (counts.get(s.primary_category_id) || 0) + 1) })
    return (categories || []).map(c => ({ ...c, series_count: counts.get(c.id) || 0 }))
  },

  listSubcategories: async (categoryId?: string) => {
    let query = supabase.from('subcategories').select('*').order('display_order')
    if (categoryId) query = query.eq('category_id', categoryId)
    const { data: subs, error } = await query
    if (error) throw error
    const { data: links } = await supabase.from('series_subcategories').select('subcategory_id')
    const counts = new Map<string, number>()
    ;(links || []).forEach(l => counts.set(l.subcategory_id, (counts.get(l.subcategory_id) || 0) + 1))
    return (subs || []).map(s => ({ ...s, series_count: counts.get(s.id) || 0 }))
  },

  createCategory: async (payload: any) => {
    const { data, error } = await supabase.from('categories').insert(payload).select().single()
    if (error) throw error
    return data
  },
  updateCategory: async (id: string, payload: any) => {
    const { data, error } = await supabase.from('categories').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  removeCategory: async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    return { id, deleted: true }
  },
  createSubcategory: async (payload: any) => {
    const { data, error } = await supabase.from('subcategories').insert(payload).select().single()
    if (error) throw error
    return data
  },
  updateSubcategory: async (id: string, payload: any) => {
    const { data, error } = await supabase.from('subcategories').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  removeSubcategory: async (id: string) => {
    const { error } = await supabase.from('subcategories').delete().eq('id', id)
    if (error) throw error
    return { id, deleted: true }
  },
}

// ── USERS ──────────────────────────────────────────
export interface UserFilters { search?: string; segment?: 'all' | 'vip' | 'non-vip'; page?: number; pageSize?: number }

// Real `profiles` rows use different field names/units than the UI was built
// against (total_spent_inr in paise, created_at as a timestamp, is_banned as
// a boolean). This maps each row once here so no page component needs to change.
function mapProfileToAdminUser(p: any) {
  return {
    id: p.id,
    display_name: p.display_name || 'Unnamed',
    phone: p.phone || '—',
    email: p.email || '—',
    coins: p.coins,
    is_vip: p.is_vip,
    vip_until: p.vip_until,
    total_spent: Math.round((p.total_spent_inr || 0) / 100),
    joined: new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: p.is_banned ? 'banned' : 'active',
  }
}

export const adminUserApi = {
  list: async (filters: UserFilters = {}): Promise<ListResult<ReturnType<typeof mapProfileToAdminUser>>> => {
    const page = filters.page || 1
    const pageSize = filters.pageSize || 50
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('profiles').select('*', { count: 'exact' })

    if (filters.search) {
      const q = filters.search
      query = query.or(`display_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`)
    }
    if (filters.segment === 'vip') query = query.eq('is_vip', true)
    if (filters.segment === 'non-vip') query = query.eq('is_vip', false)

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to)
    if (error) throw error

    return {
      items: (data || []).map(mapProfileToAdminUser),
      total: count || 0,
      page,
      pageSize,
    }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
    if (error) throw error
    return mapProfileToAdminUser(data)
  },

  creditCoins: async (id: string, amount: number, reason: string) => {
    const { data, error } = await supabase.rpc('admin_adjust_coins', { target_user_id: id, delta: amount, reason_text: reason })
    if (error) throw error
    return data
  },
  deductCoins: async (id: string, amount: number, reason: string) => {
    const { data, error } = await supabase.rpc('admin_adjust_coins', { target_user_id: id, delta: -amount, reason_text: reason })
    if (error) throw error
    return data
  },
  grantVIP: async (id: string, until: string) => {
    const { data, error } = await supabase.from('profiles').update({ is_vip: true, vip_until: until }).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  revokeVIP: async (id: string) => {
    const { data, error } = await supabase.from('profiles').update({ is_vip: false, vip_until: null }).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  setBanned: async (id: string, banned: boolean) => {
    const { data, error } = await supabase.from('profiles').update({ is_banned: banned }).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  getLedger: async (id: string) => {
    const { data, error } = await supabase.from('coin_ledger').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(20)
    if (error) throw error
    return (data || []).map((tx: any) => ({
      source: tx.source, desc: tx.description,
      amount: tx.direction === 'credit' ? tx.amount : -tx.amount,
      date: new Date(tx.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    }))
  },
  getWatchHistory: async (id: string) => {
    const { data, error } = await supabase.from('watch_progress').select('*, series(title)').eq('user_id', id).order('last_watched_at', { ascending: false }).limit(20)
    if (error) throw error
    return (data || []).filter((p: any) => p.series).map((p: any) => ({
      series: p.series.title, ep: p.episode_number,
      when: new Date(p.last_watched_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }))
  },
}

// ── TRANSACTIONS ──────────────────────────────────────────
export interface TxnFilters { search?: string; status?: string; gateway?: string; type?: string }

export const adminTransactionApi = {
  list: async (filters: TxnFilters = {}) => {
    let query = supabase.from('transactions').select('*, profiles(display_name)').order('created_at', { ascending: false })
    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status)
    if (filters.gateway && filters.gateway !== 'all') query = query.eq('gateway', filters.gateway)
    if (filters.type && filters.type !== 'all') query = query.eq('type', filters.type)

    const { data, error } = await query
    if (error) throw error

    let rows = (data || []).map((t: any) => ({
      id: t.id,
      user_name: t.profiles?.display_name || 'Unknown',
      type: t.type === 'coin_purchase' ? 'purchase' : 'vip',
      desc: t.description,
      amount_inr: Math.round(t.amount_inr / 100),
      coins: t.coins_purchased,
      gateway: t.gateway,
      status: t.status,
      date: new Date(t.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    }))

    if (filters.search) {
      const q = filters.search.toLowerCase()
      rows = rows.filter(t => t.user_name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
    }
    return rows
  },
  exportCsv: async () => { await wait(400); return { url: 'mock://export.csv' } },
}

// ── ANALYTICS ──────────────────────────────────────────
export const adminAnalyticsApi = {
  getGenrePerformance: async () => {
    const { data: categories } = await supabase.from('categories').select('id, name')
    const { data: series } = await supabase.from('series').select('primary_category_id, views').eq('is_published', true)
    const viewsByCategory = new Map<string, number>()
    ;(series || []).forEach(s => {
      if (!s.primary_category_id) return
      viewsByCategory.set(s.primary_category_id, (viewsByCategory.get(s.primary_category_id) || 0) + (s.views || 0))
    })
    const totalViews = Array.from(viewsByCategory.values()).reduce((a, b) => a + b, 0) || 1
    return (categories || [])
      .map(c => ({ genre: c.name, views: viewsByCategory.get(c.id) || 0, percent: Math.round(((viewsByCategory.get(c.id) || 0) / totalViews) * 100) }))
      .filter(g => g.views > 0)
      .sort((a, b) => b.views - a.views)
  },

  getVipSplit: async () => {
    const [{ count: vip }, { count: total }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_vip', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ])
    return { vip: vip || 0, free: (total || 0) - (vip || 0), total: total || 0 }
  },

  getProviderBreakdown: async () => {
    const { data, error } = await supabase.rpc('admin_provider_breakdown')
    if (error) throw error
    return (data || []) as { provider: string; count: number }[]
  },

  getRevenueByPack: async () => {
    const { data } = await supabase.from('transactions').select('description, amount_inr').eq('status', 'success').eq('type', 'coin_purchase')
    const byPack = new Map<string, number>()
    ;(data || []).forEach(t => byPack.set(t.description, (byPack.get(t.description) || 0) + t.amount_inr))
    const total = Array.from(byPack.values()).reduce((a, b) => a + b, 0) || 1
    return Array.from(byPack.entries()).map(([pack, revenue]) => ({ pack, revenue: Math.round(revenue / 100), percent: Math.round((revenue / total) * 100) }))
  },

  getRevenueByGateway: async () => {
    const { data } = await supabase.from('transactions').select('gateway, amount_inr').eq('status', 'success')
    const byGateway = new Map<string, number>()
    ;(data || []).forEach(t => byGateway.set(t.gateway, (byGateway.get(t.gateway) || 0) + t.amount_inr))
    const total = Array.from(byGateway.values()).reduce((a, b) => a + b, 0) || 1
    return Array.from(byGateway.entries()).map(([gateway, amount]) => ({ gateway, amount: Math.round(amount / 100), percent: Math.round((amount / total) * 100) }))
  },
}

// ── SETTINGS ──────────────────────────────────────────
export const adminSettingsApi = {
  get: async () => {
    const { data, error } = await supabase.from('app_settings').select('*').eq('id', true).single()
    if (error) throw error
    return {
      app_name: data.app_name,
      tagline: data.tagline,
      support_email: data.support_email,
      maintenance_mode: data.maintenance_mode,
      free_episodes: data.free_episodes,
      ad_unlock_count: data.ad_unlock_count,
      daily_ad_limit: data.daily_ad_limit,
      daily_checkin_coins: data.daily_checkin_coins,
      referrer_coins: data.referrer_coins,
      referred_coins: data.referred_coins,
      welcome_bonus: data.welcome_bonus,
      instagram: data.instagram_url || '',
      tiktok: data.tiktok_url || '',
      youtube: data.youtube_url || '',
    }
  },
  update: async (settings: any) => {
    const { error } = await supabase.from('app_settings').update({
      app_name: settings.app_name,
      tagline: settings.tagline,
      support_email: settings.support_email,
      maintenance_mode: settings.maintenance_mode,
      free_episodes: settings.free_episodes,
      ad_unlock_count: settings.ad_unlock_count,
      daily_ad_limit: settings.daily_ad_limit,
      daily_checkin_coins: settings.daily_checkin_coins,
      referrer_coins: settings.referrer_coins,
      referred_coins: settings.referred_coins,
      welcome_bonus: settings.welcome_bonus,
      instagram_url: settings.instagram,
      tiktok_url: settings.tiktok,
      youtube_url: settings.youtube,
      updated_at: new Date().toISOString(),
    }).eq('id', true)
    if (error) throw error
  },
}

// ── NOTIFICATIONS ──────────────────────────────────────────
export interface NotificationPayload { title: string; body: string; target_segment: string; deep_link?: string }

export const adminNotificationApi = {
  list: async () => {
    const { data, error } = await supabase.from('notifications').select('*').order('sent_at', { ascending: false }).limit(20)
    if (error) throw error
    return (data || []).map((n: any) => ({
      title: n.title, body: n.body, target: n.target_segment,
      sent: new Date(n.sent_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      reach: n.reach_count,
    }))
  },
  send: async (payload: NotificationPayload, reachEstimate: number) => {
    const { data: session } = await supabase.auth.getSession()
    const { error } = await supabase.from('notifications').insert({
      title: payload.title, body: payload.body, target_segment: payload.target_segment,
      deep_link: payload.deep_link || null, reach_count: reachEstimate,
      created_by: session.session?.user?.id,
    })
    if (error) throw error
    // NOT CONNECTED: this persists the notification but doesn't push it to
    // devices — that needs a push provider (Firebase Cloud Messaging or
    // OneSignal) wired in. Flagged for setup — see chat notes.
  },
  estimateReach: async (segment: string): Promise<number> => {
    let query = supabase.from('profiles').select('*', { count: 'exact', head: true })
    if (segment === 'vip') query = query.eq('is_vip', true)
    if (segment === 'non-vip') query = query.eq('is_vip', false)
    if (segment === 'inactive') query = query.lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    const { count } = await query
    return count || 0
  },
}
