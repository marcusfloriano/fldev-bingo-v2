import * as THREE from 'three'
import { useRef, useMemo, useState, forwardRef, useImperativeHandle } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'

function createBingoTexture(number: number, bgColor: string, fontColor: string): THREE.Texture {
  const size = 320
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Fundo
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  ctx.scale(0.5, 1)
  ctx.fillStyle = fontColor
  ctx.font = `700 180px impact`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(number.toString(), size, size / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export type BallHandle = {
  activate: () => void
  deactivate: () => void
}

type BallProps = ThreeElements['mesh'] & {
  number: number
  onClick?: (number: number) => void
}

export const Ball = forwardRef<BallHandle, BallProps>(({ number = 1, onClick, ...props }, ref) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [selected, setSelected] = useState(false)
  const [scaleUp, setScaleUp] = useState(false)
  const baseScale = 0.5

  const fontColor = selected ? '#F8B737' : '#919191'
  const bgColor = selected ? '#008037' : '#CCC'
  const texture = useMemo(() => createBingoTexture(number, bgColor, fontColor), [number, bgColor, fontColor])

  useImperativeHandle(ref, () => ({
    activate: () => {
      setSelected(true)
      setScaleUp(true)
    },
    deactivate: () => {
      setSelected(false)
      setScaleUp(false)
    }
  }))

  useFrame(() => {
    if (!meshRef.current) return
    const scale = meshRef.current.scale

    if (scaleUp) {
      if (scale.x < 0.7) {
        scale.setScalar(scale.x + 0.02)
      } else {
        setScaleUp(false)
      }
    } else {
      if (scale.x > baseScale) {
        scale.setScalar(scale.x - 0.02)
      }
    }
  })

  const handleClick = () => {
    setSelected(prev => !prev)
    setScaleUp(true)
    onClick?.(number)
  }

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={baseScale}
      rotation={[0, Math.PI * 1.5, 0]}
      onClick={handleClick}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
})
