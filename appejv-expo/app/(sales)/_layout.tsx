import { Tabs, usePathname } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { hasTeamFeatures } from '../../src/lib/feature-flags'

// Create a global event emitter for scroll events
let scrollListeners: ((visible: boolean) => void)[] = []

export const emitScrollVisibility = (visible: boolean) => {
  scrollListeners.forEach(listener => listener(visible))
}

export const subscribeToScroll = (listener: (visible: boolean) => void) => {
  scrollListeners.push(listener)
  return () => {
    scrollListeners = scrollListeners.filter(l => l !== listener)
  }
}

export default function SalesLayout() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const translateY = useRef(new Animated.Value(0)).current
  const insets = useSafeAreaInsets()

  // Fetch user profile to check role
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        // Profile is already in user object from AuthContext
        setProfile(user)
      }
    }
    fetchProfile()
  }, [user])

  // Check if user has team features
  const showTeamTab = profile && hasTeamFeatures(profile.role)

  // Hide bottom nav on selling page
  const shouldHideTabBar = pathname.includes('/selling')

  useEffect(() => {
    const unsubscribe = subscribeToScroll((visible) => {
      Animated.spring(translateY, {
        toValue: visible ? 0 : 100,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start()
    })

    return unsubscribe
  }, [])

  // Reset tab bar visibility when route changes
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start()
  }, [pathname])

  // Calculate tab bar height with safe area
  const tabBarHeight = 60 + insets.bottom

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#175ead',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: shouldHideTabBar ? { display: 'none' } : {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
          transform: [{ translateY }],
        } as any,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Tổng quan',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "grid" : "grid-outline"}
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "receipt" : "receipt-outline"}
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="selling"
        options={{
          title: 'Bán hàng',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "cart" : "cart-outline"}
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Khách hàng',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "people" : "people-outline"}
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Báo cáo',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "bar-chart" : "bar-chart-outline"}
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      {/* Team tab - only for sale_admin */}
      <Tabs.Screen
        name="team"
        options={{
          title: 'Team',
          href: showTeamTab ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "people-circle" : "people-circle-outline"}
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      {/* Hidden pages - not shown in bottom nav */}
      <Tabs.Screen
        name="inventory"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="export"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}
