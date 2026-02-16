import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/AuthContext'
import NotificationButton from './NotificationButton'

interface AppHeaderProps {
  showNotification?: boolean
}

export default function AppHeader({ showNotification = true }: AppHeaderProps) {
  const router = useRouter()
  const { user } = useAuth()

  const handlePhonePress = () => {
    // Số hotline - có thể thay đổi theo nhu cầu
    const phoneNumber = '0123456789'
    Linking.openURL(`tel:${phoneNumber}`)
  }

  return (
    <View style={styles.topHeader}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoTitle}>APPE JV</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.phoneButton}
          onPress={handlePhonePress}
        >
          <Ionicons name="call" size={20} color="#10b981" />
        </TouchableOpacity>
        {showNotification && <NotificationButton userId={user?.id} />}
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => router.push('/(sales)/menu')}
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
