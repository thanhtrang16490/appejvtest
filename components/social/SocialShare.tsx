'use client'

import { Button } from '@/components/ui/button'
import { Share2, Facebook, MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'

interface SocialShareProps {
  url?: string
  title?: string
  description?: string
}

export function SocialShare({ 
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'APPE JV Việt Nam - Thức ăn chăn nuôi chất lượng cao',
  description = 'Chuyên sản xuất thức ăn heo, gia cầm, thủy sản'
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    zalo: `https://zalo.me/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
  }

  const handleShare = async (platform: keyof typeof shareLinks | 'native') => {
    if (platform === 'native' && typeof window !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else if (platform !== 'native') {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400')
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy')
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* Native Share (mobile) */}
      {typeof window !== 'undefined' && 'share' in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('native')}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Chia sẻ
        </Button>
      )}

      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="gap-2 hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2]"
      >
        <Facebook className="w-4 h-4" />
        Facebook
      </Button>

      {/* Zalo */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('zalo')}
        className="gap-2 hover:bg-[#0068ff] hover:text-white hover:border-[#0068ff]"
      >
        <MessageCircle className="w-4 h-4" />
        Zalo
      </Button>

      {/* Telegram */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('telegram')}
        className="gap-2 hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc]"
      >
        <Send className="w-4 h-4" />
        Telegram
      </Button>

      {/* Copy Link */}
      <Button
        variant="outline"
        size="sm"
        onClick={copyLink}
        className="gap-2"
      >
        {copied ? '✓ Đã copy' : 'Copy link'}
      </Button>
    </div>
  )
}
