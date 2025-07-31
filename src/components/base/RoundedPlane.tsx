import * as THREE from 'three'
import { useMemo } from 'react'
import type { ThreeElements } from '@react-three/fiber'

type RoundedPlaneProps = {
  width?: number
  height?: number
  rounded?: [number, number, number, number] // [top, right, bottom, left]
  color?: string
} & ThreeElements['mesh']

export function RoundedPlane({
  width = 3,
  height = 1.5,
  rounded = [0, 0, 0, 0],
  color = '#ffffff',
  ...props
}: RoundedPlaneProps) {
  const shape = useMemo(() => {
    const [rt, rr, rb, rl] = rounded
    const w = width
    const h = height

    const shape = new THREE.Shape()

    shape.moveTo(-w / 2 + rl, -h / 2)

    // Bottom edge (left to right)
    shape.lineTo(w / 2 - rr, -h / 2)
    if (rr > 0) shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + rr)

    // Right edge (bottom to top)
    shape.lineTo(w / 2, h / 2 - rt)
    if (rt > 0) shape.quadraticCurveTo(w / 2, h / 2, w / 2 - rt, h / 2)

    // Top edge (right to left)
    shape.lineTo(-w / 2 + rl, h / 2)
    if (rl > 0) shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - rl)

    // Left edge (top to bottom)
    shape.lineTo(-w / 2, -h / 2 + rb)
    if (rb > 0) shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + rb, -h / 2)

    return shape
  }, [width, height, rounded])

  return (
    <mesh {...props}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
