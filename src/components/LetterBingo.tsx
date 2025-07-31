
import * as THREE from 'three'
import { useRef } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { Text } from '@react-three/drei'


export function LetterBingo({ letter = 'B', ...props }: ThreeElements['mesh'] & { letter?: string }) {
    const meshRef = useRef<THREE.Mesh>(null!)

    return (
        <mesh
            {...props}
            ref={meshRef}
        >
            <Text
                fontSize={0.9}
                color="#D80100"
                anchorX="center"
                anchorY="middle"
                font="/fonts/impact.ttf"
            >
                {letter}
            </Text>
        </mesh>
    )
}