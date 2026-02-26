import Image from 'next/image'
import { useState } from 'react'
import { Skeleton } from './Skeleton'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  sizes,
  objectFit = 'cover'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Fallback image for errors
  const fallbackSrc = '/appejv-logo.png'

  if (hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <svg
          className="w-1/3 h-1/3 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <Skeleton className="absolute inset-0 z-10" />
      )}
      {fill ? (
        <Image
          src={src || fallbackSrc}
          alt={alt}
          fill
          className={`${objectFit === 'cover' ? 'object-cover' : 'object-contain'} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          priority={priority}
          sizes={sizes}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
        />
      ) : (
        <Image
          src={src || fallbackSrc}
          alt={alt}
          width={width || 400}
          height={height || 400}
          className={`${objectFit === 'cover' ? 'object-cover' : 'object-contain'} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          priority={priority}
          sizes={sizes}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
        />
      )}
    </div>
  )
}

// Product image with specific styling
export function ProductImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={200}
      height={200}
      className={`rounded-lg ${className}`}
      objectFit="cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}

// Avatar image with fallback to initials
export function AvatarImage({ 
  src, 
  alt, 
  fallbackText,
  size = 'md',
  className = '' 
}: { 
  src?: string
  alt: string
  fallbackText?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const [hasError, setHasError] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg'
  }

  if (!src || hasError) {
    return (
      <div className={`${sizeClasses[size]} bg-[#175ead] rounded-full flex items-center justify-center text-white font-bold ${className}`}>
        {fallbackText || alt.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  )
}
