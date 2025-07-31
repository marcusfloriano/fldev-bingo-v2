
import * as THREE from 'three'
import { useRef } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { Text } from '@react-three/drei'


export function NewsPanel({ ...props }: ThreeElements['mesh'] ) {
    const meshRef = useRef<THREE.Mesh>(null!)

    return (
        <mesh
            {...props}
            ref={meshRef}
        >
            <Text
                fontSize={0.7}
                color="#008037"
                anchorX="center"
                anchorY="middle"
                font="/fonts/impact.ttf"
            >
                SEJAM BEM VINDO AO BINGO
            </Text>
            <Text
                position={[0, -1, 0]}
                fontSize={0.9}
                color="#008037"
                anchorX="center"
                anchorY="middle"
                font="/fonts/impact.ttf"
            >
                AGUARDEM A PRÓXIMA RODADA
            </Text>
            <Text
                position={[0, -2, 0]}
                fontSize={0.7}
                color="#D80100"
                anchorX="center"
                anchorY="middle"
                font="/fonts/impact.ttf"
            >
                Lembrando, vale somente HORIZONTAL e VERTICAL!!!
            </Text>
        </mesh>
    )
}