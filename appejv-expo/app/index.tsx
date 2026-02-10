import { useEffect } from 'react'
import { Redirect } from 'expo-router'
import { useAuth } from '../src/contexts/AuthContext'
import { View, ActivityIndicator, Text } from 'react-native'

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

  // Redirect based on user role
  console.log('User role:', user.role)
  if (user.role === 'customer') {
    return <Redirect href="/(customer)/dashboard" />
  }

  if (['sale', 'admin', 'sale_admin'].includes(user.role)) {
    return <Redirect href="/(sales)/dashboard" />
  }

  return <Redirect href="/(auth)/login" />
}
