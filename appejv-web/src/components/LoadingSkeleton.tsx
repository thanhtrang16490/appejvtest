import React, { useEffect, useRef, useState } from 'react'

interface LoadingSkeletonProps {
  height?: string
  className?: string
}

export default function LoadingSkeleton({ height = '400px', className = '' }: LoadingSkeletonProps) {
  return (
    <div 
      className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl ${className}`}
      style={{ height }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      
      {/* Optional: Add skeleton content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500 font-medium">Đang tải...</span>
        </div>
      </div>
    </div>
  )
}

/**
 * 3D Component Loader with Intersection Observer
 * Only loads 3D components when they enter the viewport
 */
interface Lazy3DWrapperProps {
  children: React.ReactNode
  height?: string
  placeholder?: React.ReactNode
}

export function Lazy3DWrapper({ children, height = '400px', placeholder }: Lazy3DWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Start loading 100px before entering viewport
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsLoaded(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  return (
    <div ref={containerRef} className="relative w-full" style={{ height }}>
      {!isInView || !isLoaded ? (
        placeholder || <LoadingSkeleton height={height} />
      ) : null}
      
      {isInView && (
        <div className={`absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {children}
        </div>
      )}
    </div>
  )
}

