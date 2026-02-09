import { Suspense } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import EcosystemOrbit3D from './EcosystemOrbit3D'

interface Brand {
  name: string
  logo: string
  description: string
  isParent?: boolean
}

interface Props {
  brands: Brand[]
}

export default function EcosystemOrbit3DWrapper({ brands }: Props) {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải 3D visualization...</p>
          </div>
        </div>
      }>
        <EcosystemOrbit3D brands={brands} />
      </Suspense>
    </ErrorBoundary>
  )
}
