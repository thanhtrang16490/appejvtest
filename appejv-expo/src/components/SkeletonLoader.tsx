import { View, StyleSheet, Animated, Easing } from 'react-native'
import { useEffect, useRef } from 'react'

interface SkeletonProps {
  width?: number | string
  height?: number
  borderRadius?: number
  style?: any
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 4, style }: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  })

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.productCard}>
      <Skeleton width="100%" height={120} borderRadius={8} />
      <View style={styles.productInfo}>
        <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
        <View style={styles.productFooter}>
          <Skeleton width={80} height={16} />
          <Skeleton width={60} height={20} borderRadius={10} />
        </View>
      </View>
    </View>
  )
}

export function OrderCardSkeleton() {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderLeft}>
          <Skeleton width={40} height={40} borderRadius={12} />
          <View style={styles.orderInfo}>
            <Skeleton width={120} height={16} style={{ marginBottom: 6 }} />
            <Skeleton width={100} height={12} style={{ marginBottom: 6 }} />
            <Skeleton width={80} height={12} />
          </View>
        </View>
        <Skeleton width={80} height={20} />
      </View>
      <View style={styles.orderActions}>
        <Skeleton width="48%" height={36} borderRadius={8} />
        <Skeleton width="48%" height={36} borderRadius={8} />
      </View>
    </View>
  )
}

export function StatCardSkeleton() {
  return (
    <View style={styles.statCard}>
      <Skeleton width={40} height={40} borderRadius={10} style={{ marginBottom: 12 }} />
      <Skeleton width="60%" height={24} style={{ marginBottom: 4 }} />
      <Skeleton width="80%" height={14} />
    </View>
  )
}

export function ListSkeleton({ count = 3, type = 'order' }: { count?: number; type?: 'order' | 'product' | 'stat' }) {
  const SkeletonComponent = 
    type === 'product' ? ProductCardSkeleton :
    type === 'stat' ? StatCardSkeleton :
    OrderCardSkeleton

  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e5e7eb',
  },
  listContainer: {
    gap: 12,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    marginTop: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  orderInfo: {
    flex: 1,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
})
