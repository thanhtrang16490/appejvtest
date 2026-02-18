import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text3D, Center, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface ProductBoxProps {
  emoji: string
  color: string
  position: [number, number, number]
  delay: number
}

function ProductBox({ emoji, color, position, delay }: ProductBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() + delay
      meshRef.current.rotation.y = time * 0.3
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2
    }
  })
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <Center position={[position[0], position[1], position[2] + 0.6]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
        >
          {emoji}
          <meshStandardMaterial color="#ffffff" />
        </Text3D>
      </Center>
    </Float>
  )
}

export default function FloatingProduct3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <ProductBox emoji="🐷" color="#ec4899" position={[-2, 0, 0]} delay={0} />
        <ProductBox emoji="🐔" color="#f59e0b" position={[0, 0, 0]} delay={1} />
        <ProductBox emoji="🐟" color="#3b82f6" position={[2, 0, 0]} delay={2} />
      </Canvas>
    </div>
  )
}
