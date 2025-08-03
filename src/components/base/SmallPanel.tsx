import * as THREE from 'three'
import { useRef } from 'react'
import type { ThreeElements, Vector3 } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { RoundedPlane } from './RoundedPlane'

type SmallPanelProps = {
    number: string
    color?: string
    width?: number
    height?: number
    fontSize?: number
    fontColor?: string
    positionPanel: Vector3
    positionText:Vector3
    rounded?: [number, number, number, number]
} & ThreeElements['mesh']

export function SmallPanel({ 
    number = "",
    color = "#F8B737",
    width = 3,
    height = 1.5,
    fontSize = 1.4,
    fontColor = "#008037",
    positionPanel = [0, 0, 0],
    positionText = [0, 0, 0],
    rounded = [0, 0, 0, 0],
    ...props 
}: SmallPanelProps) {
    const meshRef = useRef<THREE.Mesh>(null!)

    return (
        <mesh
            {...props}
            ref={meshRef}
        >
            <mesh position={positionPanel}>
                <RoundedPlane width={width} height={height} rounded={rounded} color={fontColor} />
            </mesh>
            <mesh position={positionText}>
                <Text
                    fontSize={fontSize}
                    color={color}
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/impact.ttf">
                    {number}
                </Text>
            </mesh>
        </mesh>
    )
}