import { useQuery } from '@tanstack/react-query'
import { userApi, coinApi } from '@/lib/api'
import { useAuthStore } from '@/store'

export const userKeys = {
  all: ['user'] as const,
  profile: (id: string) => [...userKeys.all, 'profile', id] as const,
  savedList: () => [...userKeys.all, 'savedList'] as const,
  watchHistory: () => [...userKeys.all, 'watchHistory'] as const,
  coinBalance: () => [...userKeys.all, 'coinBalance'] as const,
  transactions: () => [...userKeys.all, 'transactions'] as const,
}

// ── COIN BALANCE ──────────────────────────────────────────
export function useCoinBalance() {
  const { isLoggedIn } = useAuthStore()
  return useQuery({
    queryKey: userKeys.coinBalance(),
    queryFn: coinApi.getBalance,
    enabled: isLoggedIn,
    staleTime: 30 * 1000, // 30 seconds — balance changes frequently
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  })
}

// ── SAVED LIST ──────────────────────────────────────────
export function useSavedList() {
  const { isLoggedIn } = useAuthStore()
  return useQuery({
    queryKey: userKeys.savedList(),
    queryFn: userApi.getSavedList,
    enabled: isLoggedIn,
    staleTime: 2 * 60 * 1000,
  })
}

// ── WATCH HISTORY ──────────────────────────────────────────
export function useWatchHistory() {
  const { isLoggedIn } = useAuthStore()
  return useQuery({
    queryKey: userKeys.watchHistory(),
    queryFn: userApi.getWatchHistory,
    enabled: isLoggedIn,
    staleTime: 2 * 60 * 1000,
  })
}

// ── TRANSACTIONS ──────────────────────────────────────────
export function useTransactions() {
  const { isLoggedIn } = useAuthStore()
  return useQuery({
    queryKey: userKeys.transactions(),
    queryFn: coinApi.getTransactions,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
  })
}
