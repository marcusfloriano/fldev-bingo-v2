
import * as THREE from 'three'
import { useRef } from 'react'
import type { ThreeElements, Vector3 } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { RoundedPlane } from './base/RoundedPlane'

type SmallPanelProps = {
    number: string
    positionPanel: Vector3
    positionText:Vector3
    rounded?: [number, number, number, number]
} & ThreeElements['mesh']

function SmallPanel({ 
    number = "",
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
                <RoundedPlane width={3} height={1.5} rounded={rounded} color='#008037' />
            </mesh>
            <mesh position={positionText}>
                <Text
                    fontSize={1.4}
                    color="#F8B737"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/impact.ttf"
                >
                    {number}
                </Text>
            </mesh>
        </mesh>
    )
}

export function SortedPanel({ ...props }: ThreeElements['mesh'] ) {
    const meshRef = useRef<THREE.Mesh>(null!)

    return (
        <mesh
            {...props}
            ref={meshRef}
        >
            <mesh position={[-4.90, 0, 0]}>
                <RoundedPlane width={7.2} height={3} rounded={[0,0,0.3,0.3]} color='#008037' />
            </mesh>
            <mesh position={[-4.90, -0.2, 0]}>
                <Text
                    fontSize={3}
                    color="#F8B737"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/impact.ttf"
                >
                    O-75
                </Text>
            </mesh>
            <SmallPanel number="B-15" positionPanel={[0.45,  0.76, 0]} positionText={[0.45,  0.68, 0]} />
            <SmallPanel number="B-15" positionPanel={[0.45, -0.75, 0]} positionText={[0.45, -0.85, 0]} />

            <SmallPanel number="B-15" positionPanel={[ 3.7,  0.76, 0]} positionText={[ 3.7,  0.68, 0]} />
            <SmallPanel number="B-15" positionPanel={[ 3.7, -0.75, 0]} positionText={[ 3.7, -0.85, 0]} />

            <SmallPanel number="B-15" positionPanel={[ 6.95,  0.76, 0]} positionText={[ 6.95,  0.68, 0]} rounded={[0.3,0,0,0]} />
            <SmallPanel number="B-15"  positionPanel={[ 6.95, -0.75, 0]} positionText={[ 6.95, -0.85, 0]}  rounded={[0,0.3,0,0]} />

        </mesh>
    )
}