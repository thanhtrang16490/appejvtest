import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/AuthContext'
import NotificationButton from './NotificationButton'
import { APP_CONFIG } from '../constants/config'

interface AppHeaderProps {
  /** Show notification bell icon. Default: true */
  showNotification?: boolean
  /** Override the menu navigation target. Default: '/(sales)/menu' */
  menuHref?: string
}

export default function AppHeader({
  showNotification = true,
  menuHref = '/(sales)/menu',
}: AppHeaderProps) {
  const router = useRouter()
  const { user } = useAuth()

  const handlePhonePress = () => {
    const url = `tel:${APP_CONFIG.hotline}`
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url)
        } else {
          Alert.alert('Hotline', APP_CONFIG.hotline)
        }
      })
      .catch(() => Alert.alert('Hotline', APP_CONFIG.hotline))
  }

  return (
    <View style={styles.topHeader}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoTitle}>{APP_CONFIG.name}</Text>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.phoneButton}
          onPress={handlePhonePress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Gọi hotline ${APP_CONFIG.hotline}`}
          accessibilityRole="button"
        >
          <Ionicons name="call" size={20} color="#10b981" />
        </TouchableOpacity>

        {showNotification && <NotificationButton userId={user?.id} />}

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push(menuHref as any)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Mở menu"
          accessibilityRole="button"
        >
          <Ionicons name="menu" size={24} color="#111827" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    borderRadius: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
