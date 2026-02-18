import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// Floating orbs in background
function FloatingOrbs() {
  const orb1Ref = useRef<THREE.Mesh>(null)
  const orb2Ref = useRef<THREE.Mesh>(null)
  const orb3Ref = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.sin(time * 0.3) * 3
      orb1Ref.current.position.y = Math.cos(time * 0.2) * 2
      orb1Ref.current.position.z = Math.sin(time * 0.15) * 1
    }
    
    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.cos(time * 0.25) * 3.5
      orb2Ref.current.position.y = Math.sin(time * 0.3) * 2.5
      orb2Ref.current.position.z = Math.cos(time * 0.2) * 1.5
    }
    
    if (orb3Ref.current) {
      orb3Ref.current.position.x = Math.sin(time * 0.2) * 4
      orb3Ref.current.position.y = Math.cos(time * 0.25) * 1.5
      orb3Ref.current.position.z = Math.sin(time * 0.18) * 2
    }
  })
  
  return (
    <group>
      <Sphere ref={orb1Ref} args={[0.8, 32, 32]}>
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.15}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      <Sphere ref={orb2Ref} args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.12}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      <Sphere ref={orb3Ref} args={[0.6, 32, 32]}>
        <meshStandardMaterial
          color="#6366f1"
          transparent
          opacity={0.18}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
    </group>
  )
}

// Enhanced particle field with multiple layers
function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(3000 * 3)
    
    for (let i = 0; i < 3000; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 4 + Math.random() * 3
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    
    return positions
  }, [])
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.03
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })
  
  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#60a5fa"
        size={0.012}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

// Animated wave grid
function WaveGrid() {
  const ref = useRef<THREE.Mesh>(null)
  const initialPositions = useRef<Float32Array | null>(null)
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime()
      const geometry = ref.current.geometry
      const positions = geometry.attributes.position.array as Float32Array
      
      if (!initialPositions.current) {
        initialPositions.current = new Float32Array(positions)
      }
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = initialPositions.current[i]
        const y = initialPositions.current[i + 1]
        const distance = Math.sqrt(x * x + y * y)
        
        positions[i + 2] = 
          Math.sin(distance * 1.5 - time * 1.5) * 0.2 +
          Math.sin(x * 2 + time) * 0.1 +
          Math.cos(y * 2 + time) * 0.1
      }
      
      geometry.attributes.position.needsUpdate = true
      geometry.computeVertexNormals()
    }
  })
  
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -3, -2]}>
      <planeGeometry args={[15, 15, 60, 60]} />
      <meshStandardMaterial
        color="#3b82f6"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  )
}

// Rotating rings
function RotatingRings() {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.3
      ring1Ref.current.rotation.y = time * 0.2
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = time * 0.25
      ring2Ref.current.rotation.z = time * 0.15
    }
    
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = time * 0.35
      ring3Ref.current.rotation.z = time * 0.1
    }
  })
  
  return (
    <group position={[0, 0, -2]}>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.5, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.15}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3, 0.01, 16, 100]} />
        <meshStandardMaterial
          color="#6366f1"
          transparent
          opacity={0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#60a5fa" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color="#10b981"
        />
        
        <FloatingOrbs />
        <ParticleField />
        <WaveGrid />
        <RotatingRings />
      </Canvas>
    </div>
  )
}
