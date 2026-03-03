'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

const positionClasses = {
  left: 'left-0 top-0 bottom-0 h-full',
  right: 'right-0 top-0 bottom-0 h-full',
  top: 'top-0 left-0 right-0 w-full',
  bottom: 'bottom-0 left-0 right-0 w-full',
}

const sizeClasses = {
  left: {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full',
  },
  right: {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full',
  },
  top: {
    sm: 'max-h-[25vh]',
    md: 'max-h-[50vh]',
    lg: 'max-h-[75vh]',
    full: 'max-h-full',
  },
  bottom: {
    sm: 'max-h-[25vh]',
    md: 'max-h-[50vh]',
    lg: 'max-h-[75vh]',
    full: 'max-h-full',
  },
}

const slideInClasses = {
  left: {
    enter: 'translate-x-0',
    exit: '-translate-x-full',
  },
  right: {
    enter: 'translate-x-0',
    exit: 'translate-x-full',
  },
  top: {
    enter: 'translate-y-0',
    exit: '-translate-y-full',
  },
  bottom: {
    enter: 'translate-y-0',
    exit: 'translate-y-full',
  },
}

export default function Sheet({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={sheetRef}
        className={cn(
          'fixed bg-white shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          'overflow-y-auto',
          positionClasses[position],
          sizeClasses[position][size],
          isOpen ? slideInClasses[position].enter : slideInClasses[position].exit,
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            {title && (
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ml-auto"
                aria-label="Đóng"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// Sheet Footer Component
export function SheetFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white',
        className
      )}
    >
      {children}
    </div>
  )
}

// Sheet Body Component
export function SheetBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}
