
import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'

import { Html } from '@react-three/drei'
import { Text } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'

import { LetterBingo } from './LetterBingo'
import { Ball, type BallHandle } from './Ball'

import { postBall, getBalls } from '../api'

const handleBallClick = async (number: number) => {
  try {
    await postBall(number)
  } catch (err) {
    console.error('Erro ao enviar número:', err)
  }
}

export function SettingsScreen({ ...props }: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const ballRefs = useRef<Map<number, React.RefObject<BallHandle | null>>>(new Map())

    const ALL_NUMBERS = [
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
                PAINEL DE CONTROLE DO BINGO
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
                {ALL_NUMBERS.map((row, rowIndex) =>
                    row.map((number, colIndex) => {
                        const x = colIndex * spacingX - ((row.length - 1) * spacingX) / 2
                        const y = -rowIndex * spacingY + ((ALL_NUMBERS.length - 1) * spacingY) / 2
                        
                        const ref = useRef<BallHandle>(null)
                        ballRefs.current.set(number, ref)

                        return (
                            <Ball ref={ref} key={number} number={number} position={[x, y, 0]} onClick={handleBallClick} />
                        )
                    })
                )}
            </mesh>

            <mesh position={[0, -3.2, 0]}>
                
            </mesh>
        </mesh>
    )
}