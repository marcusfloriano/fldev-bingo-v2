import { useRef } from 'react'
import * as THREE from 'three'
import type { ThreeElements } from '@react-three/fiber'

type Direction = 'top' | 'right' | 'bottom' | 'left'

type ArrowProps = {
  position?: [number, number, number]
  color?: string,
  direction?: Direction
} & ThreeElements['group']


export function Arrow({ 
    position = [0, 0, 0], 
    color = '#FF5733',
    direction = 'right',
    ...props
}: ArrowProps) {
  const groupRef = useRef<THREE.Group>(null!)

  let p1: [number, number, number] = [0, 0, 0]
  let p2: [number, number, number] = [0.2, 0, 0]

  let r1: [number, number, number] = [0,0,Math.PI / 2]
  let r2: [number, number, number] = [0,0,-Math.PI / 2]

  if(direction == "top") {
    r1 = [0,0,0]
    r2 = [0,0,0]

    p2 = [0,0.2,0]
  } else if(direction == "bottom") {
    r1 = [0,0,0]
    r2 = [0,0,-Math.PI]
    p1 = [0.2,0.2,0]
  } else if(direction == "left") {
    r1 = [0,0,Math.PI/2]
    r2 = [0,0,Math.PI/2]
    p1 = [0.2,0,0]
    p2 = [0,0,0]
  }
  return (
    <group 
      ref={groupRef} 
      position={position}
      {...props}
    >
      {/* Haste da seta */}
      <mesh position={p1} rotation={r1}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Ponta da seta */}
      <mesh position={p2} rotation={r2}>
        <coneGeometry args={[0.25, 0.3, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}
