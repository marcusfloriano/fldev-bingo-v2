
import * as THREE from 'three'
import { useRef } from 'react'
import type { ThreeElements, Vector3 } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { RoundedPlane } from './base/RoundedPlane'

type SmallPanelProps = {
    number: string
    width?: number
    height?: number
    fontSize?: number
    positionPanel: Vector3
    positionText:Vector3
    rounded?: [number, number, number, number]
} & ThreeElements['mesh']

function SmallPanel({ 
    number = "",
    width = 3,
    height = 1.5,
    fontSize = 1.4,
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
                <RoundedPlane width={width} height={height} rounded={rounded} color='#008037' />
            </mesh>
            <mesh position={positionText}>
                <Text
                    fontSize={fontSize}
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

type SortedPanelProps = {
    numbers: number[]
} & ThreeElements['mesh']

function getBingoLetter(number: number): string {
    if(number <= 15) {
        return "B-"+number
    } else if (number <= 30) {
        return "I-"+number
    } else if (number <= 45) {
        return "N-"+number
    } else if (number <= 60) {
        return "G-"+number
    } else if (number <= 75) {
        return "O-"+number
    }
    return ""
}

export function SortedPanel({ numbers = [], ...props }: SortedPanelProps ) {
    const meshRef = useRef<THREE.Mesh>(null!)

    return (
        <mesh
            {...props}
            ref={meshRef}
        >
            <mesh position={[-5.5, 0, 0]}>
                <RoundedPlane width={6} height={3} rounded={[0,0,0.3,0.3]} color='#008037' />
            </mesh>
            <mesh position={[-5.5, -0.2, 0]}>
                <Text
                    fontSize={3}
                    color="#F8B737"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/impact.ttf"
                >
                    {getBingoLetter(numbers[numbers.length-1])}
                </Text>
            </mesh>
            <SmallPanel height={3} width={4.2} fontSize={2.2} number={getBingoLetter(numbers[numbers.length-2])} positionPanel={[-0.15, 0, 0]} positionText={[-0.1,  -0.2, 0]} />

            <SmallPanel number={getBingoLetter(numbers[numbers.length-3])} positionPanel={[ 3.7,  0.76, 0]} positionText={[ 3.7,  0.68, 0]} />
            <SmallPanel number={getBingoLetter(numbers[numbers.length-4])} positionPanel={[ 3.7, -0.75, 0]} positionText={[ 3.7, -0.85, 0]} />

            <SmallPanel number={getBingoLetter(numbers[numbers.length-5])} positionPanel={[ 6.95,  0.76, 0]} positionText={[ 6.95,  0.68, 0]} rounded={[0.3,0,0,0]} />
            <SmallPanel number={getBingoLetter(numbers[numbers.length-6])}  positionPanel={[ 6.95, -0.75, 0]} positionText={[ 6.95, -0.85, 0]}  rounded={[0,0.3,0,0]} />

        </mesh>
    )
}