import { useState, useEffect, useRef } from 'react'

interface Props {
  videoUrl: string
  fallbackImage?: string
  overlayOpacity?: number
}

export default function VideoHeroBackground({ 
  videoUrl, 
  fallbackImage = '/hero-fallback.jpg',
  overlayOpacity = 0.4 
}: Props) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Check connection speed
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    if (connection) {
      const effectiveType = connection.effectiveType
      // Only show video on good connections (4g, wifi)
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        setShowVideo(false)
      }
    }

    // Preload video
    if (videoRef.current && showVideo) {
      videoRef.current.load()
    }
  }, [showVideo])

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Video Background */}
      {showVideo ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleVideoLoaded}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            poster={fallbackImage}
          >
            <source src={videoUrl} type="video/mp4" />
            {/* Fallback image if video fails */}
          </video>

          {/* Video Overlay */}
          <div 
            className="absolute inset-0 bg-white"
            style={{ opacity: overlayOpacity }}
          />

          {/* Mute/Unmute Button */}
          {isVideoLoaded && (
            <button
              onClick={toggleMute}
              className="absolute bottom-8 right-8 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
              aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          )}
        </>
      ) : (
        // Fallback Image for slow connections
        <>
          <img
            src={fallbackImage}
            alt="APPE JV Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-white"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}
    </div>
  )
}
