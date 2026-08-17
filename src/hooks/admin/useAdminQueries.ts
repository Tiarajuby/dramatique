'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  adminDashboardApi, adminSeriesApi, adminUserApi,
  adminTransactionApi, adminCategoryApi, adminEpisodeApi, adminAnalyticsApi,
  type SeriesFilters, type UserFilters, type TxnFilters,
} from '@/lib/admin-api'

/** Centralised query keys — precise cache control + easy invalidation */
export const adminKeys = {
  dashboard: ['admin', 'dashboard'] as const,
  series: (f?: SeriesFilters) => ['admin', 'series', f] as const,
  seriesOne: (id: string) => ['admin', 'series', id] as const,
  episodes: (seriesId: string) => ['admin', 'episodes', seriesId] as const,
  users: (f?: UserFilters) => ['admin', 'users', f] as const,
  userOne: (id: string) => ['admin', 'user', id] as const,
  txns: (f?: TxnFilters) => ['admin', 'txns', f] as const,
  categories: ['admin', 'categories'] as const,
  subcategories: (catId?: string) => ['admin', 'subcategories', catId] as const,
}

// ── DASHBOARD ──────────────────────────────────────
export function useAdminDashboard() {
  const stats = useQuery({ queryKey: [...adminKeys.dashboard, 'stats'], queryFn: adminDashboardApi.getStats })
  const chart = useQuery({ queryKey: [...adminKeys.dashboard, 'chart'], queryFn: adminDashboardApi.getRevenueChart })
  const top = useQuery({ queryKey: [...adminKeys.dashboard, 'top'], queryFn: adminDashboardApi.getTopSeries })
  return { stats, chart, top, isLoading: stats.isLoading || chart.isLoading || top.isLoading }
}

// ── SERIES ──────────────────────────────────────
export function useAdminSeries(filters: SeriesFilters = {}) {
  return useQuery({ queryKey: adminKeys.series(filters), queryFn: () => adminSeriesApi.list(filters) })
}
export function useAdminSeriesOne(id: string) {
  return useQuery({ queryKey: adminKeys.seriesOne(id), queryFn: () => adminSeriesApi.getById(id), enabled: !!id })
}
export function useSetSeriesStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'published' | 'draft' | 'archived' }) => adminSeriesApi.setStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'series'] }),
  })
}

// ── EPISODES ──────────────────────────────────────
export function useAdminEpisodes(seriesId: string) {
  return useQuery({ queryKey: adminKeys.episodes(seriesId), queryFn: () => adminEpisodeApi.listBySeries(seriesId), enabled: !!seriesId })
}
export function useAdminEpisodeOne(id: string) {
  return useQuery({ queryKey: ['admin', 'episode', id], queryFn: () => adminEpisodeApi.getById(id), enabled: !!id })
}

// ── USERS ──────────────────────────────────────
export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({ queryKey: adminKeys.users(filters), queryFn: () => adminUserApi.list(filters) })
}
export function useAdminUserOne(id: string) {
  return useQuery({ queryKey: adminKeys.userOne(id), queryFn: () => adminUserApi.getById(id), enabled: !!id })
}

// ── TRANSACTIONS ──────────────────────────────────────
export function useAdminTransactions(filters: TxnFilters = {}) {
  return useQuery({ queryKey: adminKeys.txns(filters), queryFn: () => adminTransactionApi.list(filters) })
}

// ── CATEGORIES ──────────────────────────────────────
export function useAdminCategories() {
  return useQuery({ queryKey: adminKeys.categories, queryFn: adminCategoryApi.listCategories })
}
export function useAdminSubcategories(catId?: string) {
  return useQuery({ queryKey: adminKeys.subcategories(catId), queryFn: () => adminCategoryApi.listSubcategories(catId) })
}

// ── ANALYTICS ──────────────────────────────────────────
export function useAdminGenrePerformance() {
  return useQuery({ queryKey: ['admin', 'analytics', 'genre'], queryFn: adminAnalyticsApi.getGenrePerformance })
}
export function useAdminVipSplit() {
  return useQuery({ queryKey: ['admin', 'analytics', 'vip-split'], queryFn: adminAnalyticsApi.getVipSplit })
}
export function useAdminProviderBreakdown() {
  return useQuery({ queryKey: ['admin', 'analytics', 'providers'], queryFn: adminAnalyticsApi.getProviderBreakdown })
}
export function useAdminRevenueByPack() {
  return useQuery({ queryKey: ['admin', 'analytics', 'revenue-pack'], queryFn: adminAnalyticsApi.getRevenueByPack })
}
export function useAdminRevenueByGateway() {
  return useQuery({ queryKey: ['admin', 'analytics', 'revenue-gateway'], queryFn: adminAnalyticsApi.getRevenueByGateway })
}
