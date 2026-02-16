import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../src/contexts/AuthContext'
import ErrorBoundary from '../src/components/ErrorBoundary'
import { useEffect } from 'react'
import { OfflineManager } from '../src/lib/offline-manager'
import { Analytics } from '../src/lib/analytics'
import { initDeepLinking } from '../src/lib/deep-linking'

const queryClient = new QueryClient()

export default function RootLayout() {
  useEffect(() => {
    // Initialize offline manager
    OfflineManager.initialize()
    
    // Initialize analytics
    Analytics.initialize()
    
    // Initialize deep linking
    const cleanupDeepLinking = initDeepLinking()
    
    return () => {
      // Cleanup on unmount
      OfflineManager.clearQueue()
      cleanupDeepLinking()
    }
  }, [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(customer)" />
            <Stack.Screen name="(sales)" />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
