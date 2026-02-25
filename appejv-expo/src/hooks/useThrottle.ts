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
  // Initialize to 0 so the first update always passes through immediately
  const lastExecuted = useRef<number>(0)

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastExecution = now - lastExecuted.current

    // Leading-edge only: update immediately if enough time has passed
    if (timeSinceLastExecution >= interval) {
      lastExecuted.current = now
      setThrottledValue(value)
    }
    // No trailing timeout — prevents stale value from firing after rapid updates
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
  // Initialize to 0 so the first call always fires immediately
  const lastExecuted = useRef<number>(0)
  const timeoutId = useRef<number | null>(null)

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
