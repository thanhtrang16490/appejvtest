import { useState, useEffect } from 'react'

/**
 * Debounce a value - delays updating the value until after a specified delay
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if value changes before delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Debounce a callback function
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args)
    }, delay)

    setTimeoutId(newTimeoutId)
  }
}

/**
 * Example usage:
 * 
 * // Debounce a value
 * const [searchQuery, setSearchQuery] = useState('')
 * const debouncedSearch = useDebounce(searchQuery, 500)
 * 
 * useEffect(() => {
 *   // This will only run 500ms after user stops typing
 *   fetchResults(debouncedSearch)
 * }, [debouncedSearch])
 * 
 * // Debounce a callback
 * const debouncedSearch = useDebouncedCallback((query: string) => {
 *   fetchResults(query)
 * }, 500)
 * 
 * <TextInput onChangeText={debouncedSearch} />
 */
