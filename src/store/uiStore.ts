import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface UIState {
  // State
  toasts: Toast[]
  language: string
  isMobileMenuOpen: boolean
  isSearchOpen: boolean

  // Actions
  showToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
  setLanguage: (language: string) => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
  openSearch: () => void
  closeSearch: () => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        toasts: [],
        language: 'en',
        isMobileMenuOpen: false,
        isSearchOpen: false,

        showToast: (message: string, type: ToastType = 'success') => {
          const id = `toast_${Date.now()}`
          set(
            state => ({ toasts: [...state.toasts, { id, message, type }] }),
            false,
            'ui/showToast'
          )
          // Auto remove after 3.5 seconds
          setTimeout(() => get().removeToast(id), 3500)
        },

        removeToast: (id: string) => {
          set(
            state => ({ toasts: state.toasts.filter(t => t.id !== id) }),
            false,
            'ui/removeToast'
          )
        },

        setLanguage: (language: string) => {
          set({ language }, false, 'ui/setLanguage')
        },

        openMobileMenu: () => set({ isMobileMenuOpen: true }, false, 'ui/openMenu'),
        closeMobileMenu: () => set({ isMobileMenuOpen: false }, false, 'ui/closeMenu'),
        openSearch: () => set({ isSearchOpen: true }, false, 'ui/openSearch'),
        closeSearch: () => set({ isSearchOpen: false }, false, 'ui/closeSearch'),
      }),
      {
        name: 'dramatique-ui',
        // Only persist language preference
        partialize: (state) => ({ language: state.language }),
      }
    ),
    { name: 'UIStore' }
  )
)
