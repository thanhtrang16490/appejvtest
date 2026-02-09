import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

interface Brand {
  name: string
  logo: string
  description: string
  isParent?: boolean
}

interface SatelliteProps {
  brand: Brand
  index: number
  total: number
}

function Trail({ positions, color }: { positions: THREE.Vector3[], color: string }) {
  const lineRef = useRef<THREE.Line | null>(null)
  
  useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 })
    lineRef.current = new THREE.Line(geometry, material)
  }, [color])
  
  useFrame(() => {
    if (lineRef.current && positions.length > 1) {
      const posArray = new Float32Array(positions.flatMap(p => [p.x, p.y, p.z]))
      lineRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(posArray, 3)
      )
      lineRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return lineRef.current ? <primitive object={lineRef.current} /> : null
}

function Satellite({ brand, index, total }: SatelliteProps) {
  const meshRef = useRef<THREE.Group>(null)
  const trailPositions = useRef<THREE.Vector3[]>([])
  const maxTrailLength = 400
  
  const orbitRadius = 4
  const orbitSpeed = 0.3 + (index % 3) * 0.1
  const phaseOffset = (index * Math.PI * 2) / total
  
  const orbitPlane = index % 3
  const inclinations = [
    { x: Math.PI / 2, y: 0, z: 0 },
    { x: Math.PI / 3, y: Math.PI / 4, z: 0 },
    { x: Math.PI / 6, y: -Math.PI / 4, z: 0 }
  ]
  
  const inclination = inclinations[orbitPlane]
  const trailColors = ['#175ead', '#2575be', '#1e90ff']
  const trailColor = trailColors[orbitPlane]
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    
    const time = clock.getElapsedTime() * orbitSpeed + phaseOffset
    
    const x = Math.cos(time) * orbitRadius
    const y = Math.sin(time) * orbitRadius
    const z = 0
    
    const rotatedX = x * Math.cos(inclination.y) - z * Math.sin(inclination.y)
    const rotatedZ = x * Math.sin(inclination.y) + z * Math.cos(inclination.y)
    const rotatedY = y * Math.cos(inclination.x) - rotatedZ * Math.sin(inclination.x)
    const finalZ = y * Math.sin(inclination.x) + rotatedZ * Math.cos(inclination.x)
    
    meshRef.current.position.set(rotatedX, rotatedY, finalZ)
    
    trailPositions.current.push(new THREE.Vector3(rotatedX, rotatedY, finalZ))
    if (trailPositions.current.length > maxTrailLength) {
      trailPositions.current.shift()
    }
    
    meshRef.current.lookAt(0, 0, 10)
  })

  return (
    <>
      <Trail positions={trailPositions.current} color={trailColor} />
      
      <group ref={meshRef}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive={trailColor}
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
        
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial
            color={trailColor}
            transparent
            opacity={0.2}
          />
        </mesh>
        
        <Html
          center
          distanceFactor={8}
          style={{
            transition: 'all 0.2s',
            opacity: 1,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg flex items-center justify-center p-3 border-2 border-gray-200 group-hover:border-[#2575be] group-hover:scale-110 transition-all">
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
        </Html>
      </group>
    </>
  )
}

function OrbitRings() {
  const rings = useMemo(() => {
    const ringObjects = []
    const radius = 4
    
    const orbitPlanes = [
      { x: Math.PI / 2, y: 0, z: 0 },
      { x: Math.PI / 3, y: Math.PI / 4, z: 0 },
      { x: Math.PI / 6, y: -Math.PI / 4, z: 0 }
    ]
    
    const colors = ['#175ead', '#2575be', '#175ead']
    
    for (let i = 0; i < orbitPlanes.length; i++) {
      const points = []
      const segments = 64
      const inclination = orbitPlanes[i]
      
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const z = 0
        
        const rotatedX = x * Math.cos(inclination.y) - z * Math.sin(inclination.y)
        const rotatedZ = x * Math.sin(inclination.y) + z * Math.cos(inclination.y)
        const rotatedY = y * Math.cos(inclination.x) - rotatedZ * Math.sin(inclination.x)
        const finalZ = y * Math.sin(inclination.x) + rotatedZ * Math.cos(inclination.x)
        
        points.push(new THREE.Vector3(rotatedX, rotatedY, finalZ))
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineDashedMaterial({
        color: colors[i],
        opacity: 0.25,
        transparent: true,
        dashSize: 0.1,
        gapSize: 0.1
      })
      const line = new THREE.Line(geometry, material)
      line.computeLineDistances()
      
      ringObjects.push(line)
    }
    
    return ringObjects
  }, [])

  return (
    <>
      {rings.map((ring, i) => (
        <primitive key={i} object={ring} />
      ))}
    </>
  )
}

function CenterSphere({ logo }: { logo: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.1
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#175ead"
          emissive="#2575be"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      <Html center distanceFactor={6}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#175ead] to-[#2575be] rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-2xl flex items-center justify-center p-6 border-2 border-[#175ead]">
            <img 
              src={logo}
              alt="A Group Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <p className="text-sm font-bold text-[#175ead]">A Group</p>
          </div>
        </div>
      </Html>
    </group>
  )
}

interface EcosystemOrbit3DProps {
  brands: Brand[]
}

export default function EcosystemOrbit3D({ brands }: EcosystemOrbit3DProps) {
  const satellites = brands.filter(b => !b.isParent)
  const parent = brands.find(b => b.isParent)

  return (
    <div className="relative w-full h-[500px] md:h-[600px] z-0">
      <Canvas
        camera={{ position: [0, 4, 10], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />

        {parent && <CenterSphere logo={parent.logo} />}
        <OrbitRings />

        {satellites.map((brand, index) => (
          <Satellite
            key={index}
            brand={brand}
            index={index}
            total={satellites.length}
          />
        ))}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  )
}
