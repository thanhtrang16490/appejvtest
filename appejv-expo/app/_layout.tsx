import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from '../src/contexts/AuthContext'
import ErrorBoundary from '../src/components/ErrorBoundary'
import { useEffect } from 'react'
import { OfflineManager } from '../src/lib/offline-manager'
import { Analytics } from '../src/lib/analytics'
import { initDeepLinking } from '../src/lib/deep-linking'
import { errorTracker } from '../src/lib/error-tracking'

/**
 * React Query client configuration.
 * - staleTime: data is fresh for 2 minutes before background refetch
 * - retry: retry failed requests up to 2 times
 * - refetchOnWindowFocus: disabled (mobile apps don't have window focus events)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

export default function RootLayout() {
  useEffect(() => {
    // Initialize services
    errorTracker.init()
    Analytics.initialize()

    // Initialize offline manager (non-blocking)
    OfflineManager.initialize().catch(err => {
      errorTracker.logError(err, { action: 'RootLayout.initOfflineManager' })
    })

    // Initialize deep linking
    const cleanupDeepLinking = initDeepLinking()

    return () => {
      cleanupDeepLinking()
    }
  }, [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(customer)" />
            <Stack.Screen name="(sales)" />
            <Stack.Screen name="(warehouse)" />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
