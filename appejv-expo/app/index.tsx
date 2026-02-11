import { useEffect } from 'react'
import { Redirect } from 'expo-router'
import { useAuth } from '../src/contexts/AuthContext'
import { View, ActivityIndicator, Text } from 'react-native'
import { shouldUseNewAdminRoutes } from '../src/lib/feature-flags'

export default function Index() {
  const { user, loading } = useAuth()

  console.log('Index - loading:', loading, 'user:', user)

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={{ marginTop: 16, color: '#666' }}>Loading...</Text>
      </View>
    )
  }

  if (!user) {
    console.log('No user, redirecting to login')
    return <Redirect href="/(auth)/login" />
  }

  // Redirect based on user role with feature flags
  console.log('User role:', user.role)
  
  if (user.role === 'customer') {
    return <Redirect href="/(customer)/dashboard" />
  }

  // Admin routing with feature flag
  if (user.role === 'admin') {
    if (shouldUseNewAdminRoutes(user.role)) {
      console.log('Using new admin routes')
      return <Redirect href="/(admin)/dashboard" />
    } else {
      console.log('Using old admin routes (backward compatibility)')
      return <Redirect href="/(sales)/dashboard" />
    }
  }

  // Sales roles (sale_admin, sale)
  if (['sale', 'sale_admin'].includes(user.role)) {
    return <Redirect href="/(sales)/dashboard" />
  }

  return <Redirect href="/(auth)/login" />
}
