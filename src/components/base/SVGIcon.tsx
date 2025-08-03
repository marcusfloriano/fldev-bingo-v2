import { useLoader } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/Addons.js'
import * as THREE from 'three'
import type { ThreeElements } from '@react-three/fiber'

type SVGIconProps = {
  position?: [x: number, y: number, z: number]
  url?: string,
  scale?: number,
} & ThreeElements['group']

export function SVGIcon({
    url = '/vite.svg',
    scale = 0.03, 
    position = [0, 0, 0],
    ...props
}: SVGIconProps) {
  const { paths } = useLoader(SVGLoader, url)
  return (
    <group scale={[scale, -scale, scale]} position={position} {...props}>
      <mesh position={[22,23,1]}>
        <sphereGeometry args={[32,32,32]}/>
        <meshStandardMaterial color="#CCCCCC"/>
      </mesh>
      <mesh position={[0,0,40]}>
      {paths.map((path, i) => (
        <group key={i} position={[0,0,0]}>
          {path.toShapes(false).map((shape, j) => {
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 0.5,
              bevelEnabled: false,
            })
            const material = new THREE.MeshBasicMaterial({
              color: path.color?.getHex?.() || 0xff0000, // fallback
              side: THREE.DoubleSide,
            })

            return <mesh key={j} geometry={geometry} material={material} />
          })}
        </group>
      ))}
      </mesh>
    </group>
  )
}
