import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface CoinTransaction {
  id: string
  amount: number
  type: 'credit' | 'debit'
  source: 'purchase' | 'ad' | 'checkin' | 'referral' | 'unlock' | 'bonus'
  description: string
  created_at: string
}

interface CoinState {
  // State
  balance: number
  transactions: CoinTransaction[]
  isLoading: boolean
  lastCheckin: string | null

  // Actions
  setBalance: (balance: number) => void
  addCoins: (amount: number, source: CoinTransaction['source'], description: string) => void
  deductCoins: (amount: number, description: string) => boolean
  hasEnough: (amount: number) => boolean
  claimDailyReward: () => boolean
  setLoading: (loading: boolean) => void
}

export const useCoinStore = create<CoinState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        balance: 0,
        transactions: [],
        isLoading: false,
        lastCheckin: null,

        setBalance: (balance: number) => {
          set({ balance }, false, 'coins/setBalance')
        },

        // Credit coins — purchase, reward, referral etc.
        addCoins: (amount: number, source: CoinTransaction['source'], description: string) => {
          const tx: CoinTransaction = {
            id: `tx_${Date.now()}`,
            amount,
            type: 'credit',
            source,
            description,
            created_at: new Date().toISOString(),
          }
          set(
            state => ({
              balance: state.balance + amount,
              transactions: [tx, ...state.transactions].slice(0, 100), // Keep last 100
            }),
            false,
            'coins/addCoins'
          )
        },

        // Deduct coins — returns false if insufficient balance
        deductCoins: (amount: number, description: string): boolean => {
          const { balance } = get()
          if (balance < amount) return false

          const tx: CoinTransaction = {
            id: `tx_${Date.now()}`,
            amount,
            type: 'debit',
            source: 'unlock',
            description,
            created_at: new Date().toISOString(),
          }
          set(
            state => ({
              balance: state.balance - amount,
              transactions: [tx, ...state.transactions].slice(0, 100),
            }),
            false,
            'coins/deductCoins'
          )
          return true
        },

        // Check if user has enough coins without deducting
        hasEnough: (amount: number): boolean => {
          return get().balance >= amount
        },

        // Daily reward claim — returns false if already claimed today
        claimDailyReward: (): boolean => {
          const { lastCheckin, addCoins } = get()
          const today = new Date().toDateString()
          if (lastCheckin === today) return false

          addCoins(5, 'checkin', 'Daily check-in reward')
          set({ lastCheckin: today }, false, 'coins/claimDailyReward')
          return true
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading }, false, 'coins/setLoading')
        },
      }),
      {
        name: 'dramatique-coins',
        partialize: (state) => ({
          balance: state.balance,
          transactions: state.transactions,
          lastCheckin: state.lastCheckin,
        }),
      }
    ),
    { name: 'CoinStore' }
  )
)
