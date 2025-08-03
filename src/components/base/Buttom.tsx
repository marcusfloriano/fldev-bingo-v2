import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { ThreeElements } from '@react-three/fiber'

type ButtomProps = {
  width?: number
  height?: number
  position?: [number, number, number]
  fontSize?: number
  color?: string
  fontColor?: string
  text?: string
  onClick: () => void
} & ThreeElements['mesh']

function darkenColor(hex: string, amount: number = 0.05): string {
  const color = new THREE.Color(hex)
  const hsl = { h: 0, s: 0, l: 0 }
  color.getHSL(hsl)
  hsl.l = Math.max(0, hsl.l - amount) // reduz a luminosidade
  color.setHSL(hsl.h, hsl.s, hsl.l)
  return `#${color.getHexString()}`
}

export function Buttom({
  width = 2.5,
  height = 1,
  fontSize = 0.35,
  position = [0, 0, 0],
  color = '#219EBC',
  fontColor = '#FFFFFF',
  text = 'CLIQUE AQUI',
  onClick 
}: ButtomProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
    //   meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        scale={pressed ? 0.99 : 1}
        position={[0, pressed ? -0.02 : 0, 0]}
        onPointerDown={() => {
          setPressed(true)
        }}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setPressed(false)
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        onClick={() => {
          setPressed(true)
          setTimeout(() => setPressed(false), 100)
          onClick()
        }}
      >
        <RoundedBox
          args={[width, height, 0]}
          radius={0.2}
          smoothness={10}
        >
          <meshStandardMaterial color={hovered ? darkenColor(color) : color} />
        </RoundedBox>
        <Text
          position={[0, 0, 0.01]}
          fontSize={fontSize}
          color={fontColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/impact.ttf"
        >
          {text}
        </Text>
      </mesh>
    </group>
  )
}
