
import * as THREE from 'three'
import { useRef } from 'react'

import { Html } from '@react-three/drei'
import { Text } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'

import { LetterBingo } from './LetterBingo'
import { Ball } from './Ball'

const handleBallClick = async (number: number) => {
  try {
    const response = await fetch('http://localhost:3001/balls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number })
    })
    if (!response.ok) {
      throw new Error(`Erro do servidor: ${response.status}`)
    }
    const data = await response.json()
    console.log(data)
  } catch (err) {
    console.error('Erro ao enviar número:', err)
  }
}

export function SettingsScreen({ ...props }: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)

    const numbers = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15],
        [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
        [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],
        [46,47,48,49,50,51,52,53,54,55,56,57,58,59,60],
        [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75]
    ]

    const spacingX = 1.1
    const spacingY = 1.1

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
                {numbers.map((row, rowIndex) =>
                    row.map((number, colIndex) => {
                        const x = colIndex * spacingX - ((row.length - 1) * spacingX) / 2
                        const y = -rowIndex * spacingY + ((numbers.length - 1) * spacingY) / 2
                        return (
                            <Ball key={number} number={number} position={[x, y, 0]} onClick={handleBallClick}/>
                        )
                    })
                )}
            </mesh>

            <mesh position={[0, -3.2, 0]}>
                
            </mesh>
        </mesh>
    )
}