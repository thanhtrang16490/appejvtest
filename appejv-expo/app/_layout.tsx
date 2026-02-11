import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../src/contexts/AuthContext'
import ErrorBoundary from '../src/components/ErrorBoundary'

const queryClient = new QueryClient()

export default function RootLayout() {
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
