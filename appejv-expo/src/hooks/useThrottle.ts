import { useState, useEffect, useRef } from 'react'

/**
 * Hook để throttle một value
 * Giới hạn số lần update trong một khoảng thời gian
 * 
 * @param value - Value cần throttle
 * @param interval - Interval time in milliseconds
 * @returns Throttled value
 * 
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0)
 * const throttledScrollY = useThrottle(scrollY, 100)
 * 
 * // throttledScrollY chỉ update mỗi 100ms
 * ```
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastExecuted = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastExecution = now - lastExecuted.current

    if (timeSinceLastExecution >= interval) {
      lastExecuted.current = now
      setThrottledValue(value)
    } else {
      const timeoutId = setTimeout(() => {
        lastExecuted.current = Date.now()
        setThrottledValue(value)
      }, interval - timeSinceLastExecution)

      return () => clearTimeout(timeoutId)
    }
  }, [value, interval])

  return throttledValue
}

/**
 * Hook để throttle một callback function
 * 
 * @param callback - Function cần throttle
 * @param interval - Interval time in milliseconds
 * @returns Throttled callback
 * 
 * @example
 * ```tsx
 * const handleScroll = useThrottledCallback((event) => {
 *   console.log('Scroll position:', event.nativeEvent.contentOffset.y)
 * }, 100)
 * 
 * <ScrollView onScroll={handleScroll} />
 * ```
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number = 500
): (...args: Parameters<T>) => void {
  const lastExecuted = useRef<number>(Date.now())
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  return (...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastExecution = now - lastExecuted.current

    if (timeSinceLastExecution >= interval) {
      lastExecuted.current = now
      callback(...args)
    } else {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }

      timeoutId.current = setTimeout(() => {
        lastExecuted.current = Date.now()
        callback(...args)
      }, interval - timeSinceLastExecution)
    }
  }
}
