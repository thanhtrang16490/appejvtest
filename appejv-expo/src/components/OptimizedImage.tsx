import { useState } from 'react'
import { View, Image, StyleSheet, ActivityIndicator, ImageProps, ViewStyle, ImageStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface OptimizedImageProps extends Omit<ImageProps, 'source' | 'style'> {
  source: string | { uri: string } | number
  width?: number
  height?: number
  placeholder?: React.ReactElement
  fallback?: React.ReactElement
  showLoader?: boolean
  borderRadius?: number
  style?: ViewStyle
}

export function OptimizedImage({
  source,
  width,
  height,
  placeholder,
  fallback,
  showLoader = true,
  borderRadius = 0,
  style,
  ...props
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const imageSource = typeof source === 'string' ? { uri: source } : source

  const containerSizeStyle: ViewStyle = {
    ...(width != null ? { width } : {}),
    ...(height != null ? { height } : {}),
    ...(borderRadius ? { borderRadius } : {}),
  }

  const imageSizeStyle: ImageStyle = {
    ...(width != null ? { width } : {}),
    ...(height != null ? { height } : {}),
    ...(borderRadius ? { borderRadius } : {}),
  }

  const containerStyle = [styles.container, containerSizeStyle, style]

  if (error) {
    return (
      <View style={containerStyle}>
        {fallback || (
          <View style={styles.fallback}>
            <Ionicons name="image-outline" size={32} color="#d1d5db" />
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={containerStyle}>
      {loading && showLoader && (
        <View style={styles.loader}>
          {placeholder || <ActivityIndicator size="small" color="#3b82f6" />}
        </View>
      )}
      <Image
        {...props}
        source={imageSource}
        style={[
          styles.image,
          imageSizeStyle,
          loading ? styles.hidden : undefined,
        ]}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false)
          setError(true)
        }}
        resizeMode={props.resizeMode || 'cover'}
      />
    </View>
  )
}

// Lazy loading image with intersection observer simulation
export function LazyImage(props: OptimizedImageProps) {
  const [shouldLoad, setShouldLoad] = useState(false)

  // Simple lazy loading - load after mount
  // In production, use react-native-intersection-observer or similar
  useState(() => {
    const timer = setTimeout(() => setShouldLoad(true), 100)
    return () => clearTimeout(timer)
  })

  if (!shouldLoad) {
    return (
      <View style={[styles.container, props.style]}>
        <View style={styles.placeholder}>
          <ActivityIndicator size="small" color="#d1d5db" />
        </View>
      </View>
    )
  }

  return <OptimizedImage {...props} />
}

// Product image with aspect ratio
export function ProductImage({
  source,
  size = 120,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & { size?: number }) {
  return (
    <OptimizedImage
      source={source}
      width={size}
      height={size}
      borderRadius={8}
      {...props}
    />
  )
}

// Avatar image
export function AvatarImage({
  source,
  size = 40,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & { size?: number }) {
  return (
    <OptimizedImage
      source={source}
      width={size}
      height={size}
      borderRadius={size / 2}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hidden: {
    opacity: 0,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
})
