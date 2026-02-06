'use client';

import { useEffect, useRef } from 'react';

interface Brand {
  name: string;
  logo: string;
  description: string;
  isParent?: boolean;
}

interface EcosystemOrbitProps {
  brands: Brand[];
}

export function EcosystemOrbit({ brands }: EcosystemOrbitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const satellites = brands.filter(b => !b.isParent);
  const parent = brands.find(b => b.isParent);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      containerRef.current.style.transform = `
        perspective(1000px) 
        rotateX(${deltaY * -10}deg) 
        rotateY(${deltaX * 10}deg)
      `;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative max-w-5xl mx-auto mb-16">
      <div 
        ref={containerRef}
        className="relative w-full aspect-square max-w-2xl mx-auto transition-transform duration-200 ease-out"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* Center - A Group */}
        {parent && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(50px)'
            }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#175ead] to-[#2575be] rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-2xl flex items-center justify-center p-6 border-4 border-[#175ead] group-hover:scale-110 transition-transform">
                <img 
                  src={parent.logo}
                  alt={`${parent.name} Logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <p className="text-sm font-bold text-[#175ead]">{parent.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Orbit Rings with 3D effect */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'rotateX(60deg)'
          }}
        >
          <div className="absolute inset-0 border-2 border-dashed border-[#175ead]/20 rounded-full"></div>
        </div>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%]"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'rotateX(60deg)'
          }}
        >
          <div className="absolute inset-0 border-2 border-dashed border-[#2575be]/15 rounded-full"></div>
        </div>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%]"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'rotateX(60deg)'
          }}
        >
          <div className="absolute inset-0 border border-dashed border-[#175ead]/10 rounded-full"></div>
        </div>

        {/* Satellites - Brands with 3D orbit */}
        {satellites.map((brand, index) => {
          const angle = (index * 360) / satellites.length;
          const radius = 45;
          const orbitDuration = 20 + index * 2;
          const verticalOffset = Math.sin((index * Math.PI * 2) / satellites.length) * 20;
          
          return (
            <div
              key={index}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                animation: `orbit3d ${orbitDuration}s linear infinite`,
                animationDelay: `${-index * (orbitDuration / satellites.length)}s`,
                transform: `rotateX(60deg) rotateZ(${angle}deg)`
              }}
            >
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 group"
                style={{
                  transform: `translateY(-${radius}%) translateX(-50%) rotateX(-60deg) rotateZ(-${angle}deg) translateZ(${verticalOffset}px)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#175ead]/20 to-[#2575be]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg flex items-center justify-center p-3 border-2 border-gray-200 group-hover:border-[#2575be] group-hover:scale-110 transition-all">
                    <img 
                      src={brand.logo}
                      alt={`${brand.name} Logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded shadow-md">
                      {brand.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
