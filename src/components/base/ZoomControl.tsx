import { useRef } from 'react'
import * as THREE from 'three'
import type { ThreeElements } from '@react-three/fiber'
import { Arrow } from './Arrow'
import { Text } from '@react-three/drei'

type ZoomControlProps = {
    text: string
    number: number
    min?: number
    max?: number
    fontSize?: number
    fontColor?: string
    position?: [number, number, number]
    color?: string
    onClick: (diretion: 'top' | 'right' | 'bottom' | 'left') => void
} & ThreeElements['group']


export function ZoomControl({
    text = "ZOOM",
    number = 73,
    fontSize = 0.5,
    fontColor = '#FF5733',
    position = [0, 0, 0], 
    color = '#FF5733',
    onClick,
    ...props
}: ZoomControlProps) {
  const groupRef = useRef<THREE.Group>(null!)

  return (
    <group ref={groupRef} position={position} {...props}>
      <Text
          position={[0,0.5,0]}
          fontSize={fontSize * 0.6}
          color={fontColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/impact.ttf"
      >
        {text}
    </Text>
        <Arrow 
            color={color} direction='right' position={[0.6,0,0]}
            onPointerOver={() => {
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
                document.body.style.cursor = 'default'
            }}
            onClick={() => {onClick('right')}}
        />
      <Text
          position={[0,0,0]}
          fontSize={fontSize}
          color={fontColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/impact.ttf"
      >
        {number}
    </Text>
        <Arrow color={color} direction='left' position={[-0.8,0,0]}
            onPointerOver={() => {
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
                document.body.style.cursor = 'default'
            }}
            onClick={() => {onClick('left')}}
        />
    </group>
  )
}
