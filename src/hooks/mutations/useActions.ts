import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi, coinApi } from '@/lib/api'
import { useCoinStore, usePaywallStore, useUIStore } from '@/store'
import { userKeys } from '../queries/useUser'

// ── UNLOCK EPISODE ──────────────────────────────────────────
export function useUnlockEpisode() {
  const { hasEnough, setBalance } = useCoinStore()
  const { markUnlocked } = usePaywallStore()
  const { showToast } = useUIStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ episodeId, coinCost }: { episodeId: string; coinCost: number }) => {
      // Client-side check first — fast feedback before hitting the server
      if (!hasEnough(coinCost)) {
        throw new Error('Insufficient coins')
      }
      // Server does the real, authoritative deduction — atomic and audit-logged
      return coinApi.unlockEpisode(episodeId)
    },

    onSuccess: (data, variables) => {
      // Sync local balance to the real server-confirmed value, not a local guess
      if (data.newBalance !== undefined) setBalance(data.newBalance)
      markUnlocked(variables.episodeId)
      queryClient.invalidateQueries({ queryKey: userKeys.coinBalance() })
      showToast('Episode unlocked! Enjoy 🎬', 'success')
    },

    onError: (error: Error) => {
      if (error.message === 'Insufficient coins') {
        showToast('Not enough coins. Buy more to continue.', 'error')
      } else {
        showToast('Failed to unlock. Please try again.', 'error')
      }
    },
  })
}

// ── TOGGLE SAVE SERIES ──────────────────────────────────────────
export function useToggleSave() {
  const { showToast } = useUIStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (seriesId: string) => userApi.toggleSave(seriesId),

    onMutate: async (seriesId) => {
      await queryClient.cancelQueries({ queryKey: userKeys.savedList() })
      const previous = queryClient.getQueryData(userKeys.savedList())
      return { previous }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.savedList() })
      showToast(data.saved ? 'Added to My List ✅' : 'Removed from My List', 'success')
    },

    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(userKeys.savedList(), context.previous)
      }
      showToast('Failed to update list. Try again.', 'error')
    },
  })
}

// ── CLAIM DAILY REWARD ──────────────────────────────────────────
export function useClaimReward() {
  const { setBalance, balance } = useCoinStore()
  const { showToast } = useUIStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.claimDailyReward,

    onSuccess: (data) => {
      setBalance(balance + data.coins)
      queryClient.invalidateQueries({ queryKey: userKeys.coinBalance() })
      showToast(`Daily reward claimed! +${data.coins} coins 🎁`, 'success')
    },

    onError: (error: Error) => {
      if (error.message?.includes('Already claimed')) {
        showToast('Already claimed today. Come back tomorrow!', 'info')
      } else {
        showToast('Failed to claim reward. Try again.', 'error')
      }
    },
  })
}

// ── SAVE WATCH PROGRESS ──────────────────────────────────────────
export function useSaveProgress() {
  return useMutation({
    mutationFn: ({ seriesId, episodeId, episodeNumber, progressPercent }: { seriesId: string; episodeId: string; episodeNumber: number; progressPercent: number }) =>
      userApi.saveProgress(seriesId, episodeId, episodeNumber, progressPercent),
    // Silent — no toast for progress saves
  })
}
