import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WaveParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  
  const { positions, colors } = useMemo(() => {
    const count = 100 * 100
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    let i = 0
    for (let xi = 0; xi < 100; xi++) {
      for (let zi = 0; zi < 100; zi++) {
        const x = (xi - 50) * 0.1
        const z = (zi - 50) * 0.1
        
        positions[i * 3] = x
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = z
        
        // Gradient color from blue to cyan
        const colorMix = xi / 100
        colors[i * 3] = 0.2 + colorMix * 0.3 // R
        colors[i * 3 + 1] = 0.5 + colorMix * 0.3 // G
        colors[i * 3 + 2] = 0.9 // B
        
        i++
      }
    }
    
    return { positions, colors }
  }, [])
  
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime()
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      let i = 0
      for (let xi = 0; xi < 100; xi++) {
        for (let zi = 0; zi < 100; zi++) {
          const x = positions[i * 3]
          const z = positions[i * 3 + 2]
          
          const distance = Math.sqrt(x * x + z * z)
          const y = Math.sin(distance * 2 - time * 2) * 0.3 + 
                    Math.sin(x * 3 + time) * 0.1 +
                    Math.cos(z * 3 + time) * 0.1
          
          positions[i * 3 + 1] = y
          i++
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

export default function ParticleWave3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 3, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <WaveParticles />
      </Canvas>
    </div>
  )
}
