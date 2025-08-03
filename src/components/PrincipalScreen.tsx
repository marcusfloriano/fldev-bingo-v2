
import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { Text, Plane } from '@react-three/drei'
import { LetterBingo } from './LetterBingo'
import { Ball, type BallHandle } from './Ball'
import { SortedPanel } from './SortedPanel'
import { connectWebSocket } from '../websocketClient'
import { SortedBall } from './SortedBall'

import { getBalls } from '../api'

export function useWebSocket(onData: (type: string, number: number, balls: number[], sorted: boolean) => void) {
  useEffect(() => {
    connectWebSocket('principal', 'ws://localhost:3001', (data) => {
        if(data.action == "balls") {
            onData(data.type, data.number, data.balls, data.sorted)
        }
    })
  }, [onData])
}

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

export function PrincipalScreen({ ...props }: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const ballRefs = useRef<Map<number, React.RefObject<BallHandle | null>>>(new Map())
    const [ball, setBalls] = useState<number[]>([])
    const [roll, setRoll] = useState(false)
    const [sortedBall, setSortedBall] = useState("?")
    const [animatedBall, setAnimatedBall] = useState(true)


    useWebSocket((type, number, balls, sorted) => {
        const ref = ballRefs.current.get(number)
        if(type == "added") {
            if(sorted) {
                setRoll(true)
                setAnimatedBall(true)
                setSortedBall("?")
                setTimeout(() => {
                    setAnimatedBall(false)
                    setSortedBall(getBingoLetter(number))
                    setBalls(balls)
                }, 3000)
                setTimeout(() => {
                    setRoll(false)
                }, 6000)
            } else {
                if (ref?.current) ref.current.activate()
            }
        } else if (type == "removed") {
            if (ref?.current) ref.current.deactivate()
        } else if(type == "cleared") {
            ballRefs.current.forEach((ref) => {
                if (ref.current) ref.current.deactivate()
            })
        }
    })

    const numbers = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15],
        [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
        [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],
        [46,47,48,49,50,51,52,53,54,55,56,57,58,59,60],
        [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75]
    ]

    const spacingX = 1.1
    const spacingY = 1.1

    useEffect(() => {
        getBalls().then(data => {
            setBalls(data.balls)
            data.balls.forEach((n) => {
                const ref = ballRefs.current.get(n)
                if (ref?.current) ref.current.activate()
            })
        })
        .catch(err => console.error('Erro ao carregar bolas:', err))
    }, [])
    
    return (
        <mesh
            {...props}
            ref={meshRef}
        >
            <mesh position={[0, 4.35, 0]}>
                <Text
                position={[0, 0, 0]} // 👈 acima da cena
                fontSize={0.7}
                color="#D80100"
                anchorX="center"
                anchorY="middle"
                font="/fonts/impact.ttf"
                >
                PARÓQUIA SÃO JUDAS TADEU
                </Text>
            </mesh>

            <mesh position={[-8.3, 3.50, 0]}>
                <LetterBingo letter='B' position={[0, -0.16, 0]} />
                <LetterBingo letter='I' position={[0, -1.26, 0]} />
                <LetterBingo letter='N' position={[0, -2.36, 0]} />
                <LetterBingo letter='G' position={[0, -3.46, 0]} />
                <LetterBingo letter='O' position={[0, -4.56, 0]} />
            </mesh>

            <mesh position={[0.3, 1.2, 0]}>
                {numbers.map((row, rowIndex) =>
                    row.map((number, colIndex) => {
                        const x = colIndex * spacingX - ((row.length - 1) * spacingX) / 2
                        const y = -rowIndex * spacingY + ((numbers.length - 1) * spacingY) / 2

                        const ref = useRef<BallHandle>(null)
                        ballRefs.current.set(number, ref)
                        return (
                            <Ball ref={ref} key={number} number={number} position={[x, y, 0]}/>
                        )
                    })
                )}
            </mesh>

            <mesh position={[0, -3.2, 0]}>
                <SortedPanel numbers={ball}/>
            </mesh>

            {roll && (
                <group>
                    <Plane
                        args={[100, 100]} // cobre toda a tela
                        position={[0, 0, 2]} // quase na frente da câmera (z = 10)
                    >
                        <meshStandardMaterial
                        color="black"
                        transparent
                        opacity={0.5} // 0.5 = 50% transparente
                        />
                    </Plane>
                    <SortedBall rotation={[0,0.8,0]} number={sortedBall} position={[0, 1.5, 3]} scale={0.7} animated={animatedBall}/>
                </group>
            )}

        </mesh>
    )
}