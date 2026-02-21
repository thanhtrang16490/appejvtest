import { useState, useEffect } from 'react'

export default function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 34,
    seconds: 56
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes--
          } else {
            minutes = 59
            if (hours > 0) {
              hours--
            } else {
              hours = 23
              if (days > 0) {
                days--
              }
            }
          }
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            animation: 'shimmer 3s infinite'
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          {/* Icon */}
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold text-lg">ƯU ĐÃI THÁNG 2</span>
          </div>

          {/* Message */}
          <div className="flex-1">
            <span className="font-semibold">
              Giảm 15% cho đơn hàng đầu tiên + Tư vấn kỹ thuật miễn phí
            </span>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Còn:</span>
            <div className="flex gap-1">
              <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded min-w-[2.5rem] text-center">
                <div className="font-bold">{timeLeft.days}</div>
                <div className="text-xs opacity-90">ngày</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded min-w-[2.5rem] text-center">
                <div className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs opacity-90">giờ</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded min-w-[2.5rem] text-center">
                <div className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs opacity-90">phút</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded min-w-[2.5rem] text-center">
                <div className="font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs opacity-90">giây</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a
            href="/lien-he"
            className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            Nhận ưu đãi →
          </a>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
