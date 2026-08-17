import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface PaywallState {
  // State
  isOpen: boolean
  episodeId: string | null
  episodeNumber: number | null
  seriesId: string | null
  seriesTitle: string | null
  coinCost: number
  unlockedEpisodes: Set<string>

  // Actions
  openPaywall: (params: {
    episodeId: string
    episodeNumber: number
    seriesId: string
    seriesTitle: string
    coinCost: number
  }) => void
  closePaywall: () => void
  markUnlocked: (episodeId: string) => void
  isUnlocked: (episodeId: string) => boolean
}

export const usePaywallStore = create<PaywallState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isOpen: false,
      episodeId: null,
      episodeNumber: null,
      seriesId: null,
      seriesTitle: null,
      coinCost: 5,
      unlockedEpisodes: new Set(),

      // Open paywall with episode context
      openPaywall: (params) => {
        set(
          {
            isOpen: true,
            episodeId: params.episodeId,
            episodeNumber: params.episodeNumber,
            seriesId: params.seriesId,
            seriesTitle: params.seriesTitle,
            coinCost: params.coinCost,
          },
          false,
          'paywall/open'
        )
      },

      closePaywall: () => {
        set(
          { isOpen: false },
          false,
          'paywall/close'
        )
      },

      // Mark episode as unlocked after coin deduction or ad watch
      markUnlocked: (episodeId: string) => {
        set(
          state => {
            const next = new Set(Array.from(state.unlockedEpisodes))
            next.add(episodeId)
            return { unlockedEpisodes: next, isOpen: false }
          },
          false,
          'paywall/markUnlocked'
        )
      },

      isUnlocked: (episodeId: string): boolean => {
        return get().unlockedEpisodes.has(episodeId)
      },
    }),
    { name: 'PaywallStore' }
  )
)
