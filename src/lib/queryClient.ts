import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 5 minutes — no unnecessary refetches
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes after component unmounts
      gcTime: 10 * 60 * 1000,
      // Retry failed requests once before showing error
      retry: 1,
      // Don't refetch when user switches tabs — saves bandwidth
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
