import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface User {
  id: string
  display_name: string
  phone?: string
  email?: string
  avatar_url?: string
  vip_until?: string | null
  referral_code?: string
}

interface AuthState {
  // State
  user: User | null
  isLoggedIn: boolean
  isVIP: boolean
  isLoading: boolean

  // Actions
  login: (user: User) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  setLoading: (loading: boolean) => void
  checkVIP: () => boolean
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isLoggedIn: false,
        isVIP: false,
        isLoading: false,

        // Login — called after OTP/Google verification
        login: (user: User) => {
          const isVIP = user.vip_until
            ? new Date(user.vip_until) > new Date()
            : false
          set({ user, isLoggedIn: true, isVIP }, false, 'auth/login')
        },

        // Logout — clear all user data
        logout: () => {
          set({ user: null, isLoggedIn: false, isVIP: false }, false, 'auth/logout')
        },

        // Update specific profile fields
        updateProfile: (updates: Partial<User>) => {
          const { user } = get()
          if (!user) return
          const updated = { ...user, ...updates }
          const isVIP = updated.vip_until
            ? new Date(updated.vip_until) > new Date()
            : false
          set({ user: updated, isVIP }, false, 'auth/updateProfile')
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading }, false, 'auth/setLoading')
        },

        // Check if VIP is still active
        checkVIP: () => {
          const { user } = get()
          if (!user?.vip_until) return false
          const active = new Date(user.vip_until) > new Date()
          set({ isVIP: active }, false, 'auth/checkVIP')
          return active
        },
      }),
      {
        name: 'dramatique-auth',
        // Only persist essential fields — not loading states
        partialize: (state) => ({
          user: state.user,
          isLoggedIn: state.isLoggedIn,
          isVIP: state.isVIP,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
)
