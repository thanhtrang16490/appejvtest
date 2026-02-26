/**
 * usePushNotifications Hook
 * Quản lý push notifications: xin quyền, lấy token, lưu vào Supabase
 */

import { useEffect, useRef, useState } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { supabase } from '../lib/supabase'
import { errorTracker } from '../lib/error-tracking'

// Cấu hình handler hiển thị notification khi app đang mở
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

interface UsePushNotificationsOptions {
  userId?: string
  /** Callback khi user tap vào notification */
  onNotificationTap?: (data: Record<string, any>) => void
}

export function usePushNotifications({ userId, onNotificationTap }: UsePushNotificationsOptions = {}) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined')
  const notificationListener = useRef<Notifications.EventSubscription | null>(null)
  const responseListener = useRef<Notifications.EventSubscription | null>(null)

  useEffect(() => {
    if (!userId) return

    registerForPushNotifications(userId)

    // Lắng nghe notification khi app đang mở
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      if (__DEV__) {
        console.log('[PushNotifications] Received:', notification.request.content.title)
      }
    })

    // Lắng nghe khi user tap vào notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as Record<string, any>
      if (__DEV__) {
        console.log('[PushNotifications] Tapped:', data)
      }
      onNotificationTap?.(data)
    })

    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [userId])

  const registerForPushNotifications = async (uid: string) => {
    try {
      // Chỉ hoạt động trên thiết bị thật
      if (!Device.isDevice) {
        if (__DEV__) console.warn('[PushNotifications] Chỉ hoạt động trên thiết bị thật')
        return
      }

      // Xin quyền
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      setPermissionStatus(finalStatus)

      if (finalStatus !== 'granted') {
        if (__DEV__) console.warn('[PushNotifications] Quyền bị từ chối')
        return
      }

      // Tạo Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Thông báo chung',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#175ead',
          sound: 'default',
        })

        await Notifications.setNotificationChannelAsync('orders', {
          name: 'Đơn hàng',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10b981',
          sound: 'default',
        })
      }

      // Lấy Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync()
      const token = tokenData.data
      setExpoPushToken(token)

      // Lưu token vào Supabase profiles
      if (token) {
        await supabase
          .from('profiles')
          .update({ push_token: token, push_token_updated_at: new Date().toISOString() })
          .eq('id', uid)

        if (__DEV__) console.log('[PushNotifications] Token saved:', token.slice(0, 20) + '...')
      }
    } catch (error) {
      errorTracker.logError(error as Error, { action: 'usePushNotifications.register' })
    }
  }

  return {
    expoPushToken,
    permissionStatus,
  }
}

/**
 * Gửi local notification ngay lập tức
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
  channelId = 'default'
): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
      },
      trigger: null, // Gửi ngay
    })
    return id
  } catch (error) {
    errorTracker.logError(error as Error, { action: 'sendLocalNotification' })
    return null
  }
}

/**
 * Gửi notification sau X giây
 */
export async function scheduleNotificationAfter(
  title: string,
  body: string,
  seconds: number,
  data?: Record<string, any>
): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, data: data || {}, sound: 'default' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
    })
    return id
  } catch (error) {
    errorTracker.logError(error as Error, { action: 'scheduleNotificationAfter' })
    return null
  }
}

/**
 * Xóa badge
 */
export async function clearBadge(): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(0)
  } catch {
    // Silently fail
  }
}
