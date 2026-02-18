import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null)
  
  const helixPoints = []
  const connections = []
  
  // Create DNA helix structure
  for (let i = 0; i < 50; i++) {
    const angle = (i / 50) * Math.PI * 4
    const y = (i / 50) * 5 - 2.5
    const radius = 0.5
    
    // First strand
    helixPoints.push({
      position: [
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      ] as [number, number, number],
      color: '#3b82f6'
    })
    
    // Second strand (opposite)
    helixPoints.push({
      position: [
        Math.cos(angle + Math.PI) * radius,
        y,
        Math.sin(angle + Math.PI) * radius
      ] as [number, number, number],
      color: '#10b981'
    })
    
    // Connection between strands
    if (i % 3 === 0) {
      connections.push({
        start: helixPoints[i * 2].position,
        end: helixPoints[i * 2 + 1].position
      })
    }
  }
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Helix spheres */}
      {helixPoints.map((point, i) => (
        <mesh key={i} position={point.position}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={point.color} metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
      
      {/* Connections */}
      {connections.map((conn, i) => {
        const start = new THREE.Vector3(...conn.start)
        const end = new THREE.Vector3(...conn.end)
        const direction = end.clone().sub(start)
        const length = direction.length()
        const midpoint = start.clone().add(direction.multiplyScalar(0.5))
        
        return (
          <mesh key={`conn-${i}`} position={midpoint.toArray()}>
            <cylinderGeometry args={[0.02, 0.02, length, 8]} />
            <meshStandardMaterial color="#6366f1" opacity={0.6} transparent />
          </mesh>
        )
      })}
    </group>
  )
}

export default function DNA3DHelix() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <DNAHelix />
      </Canvas>
    </div>
  )
}
