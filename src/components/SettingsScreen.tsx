
import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'

import { Text, Plane, Html } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'

import { RoundedPlane } from './base/RoundedPlane'
import { SmallPanel } from './base/SmallPanel'

import { LetterBingo } from './LetterBingo'
import { Ball, type BallHandle } from './Ball'
import { Buttom } from './base/Buttom'
import { ZoomControl } from './base/ZoomControl'

import { postBall, getBalls, postZoom, getZoom, postBallClear } from '../api'

function rollNewNumber(balls: number[]): number | null {
    const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1)
    const remaining = allNumbers.filter(n => !balls.includes(n))

    if (remaining.length === 0) return null // todos sorteados

    // Fisher-Yates Shuffle
    for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[remaining[i], remaining[j]] = [remaining[j], remaining[i]]
    }

    return remaining[0]
}

export function LastedNumbers() {
  const numbers = Array.from({ length: 8 }, (_, i) => i + 1)
  return (
    <>
        {numbers.map((number, index) => {
                const x = index * 2.1 - (7 * 2.1) / 2
                return (
                    <>
                        <RoundedPlane width={2} height={1.4} rounded={[0,0,0,0]} position={[x, 0, 0]} color='#008037' />
                        <mesh position={[x, -0.1, 0]}>
                            <Text
                                fontSize={1.3}
                                color="#F8B737"
                                anchorX="center"
                                anchorY="middle"
                                font="/fonts/impact.ttf"
                            >
                                B-{number}
                            </Text>
                        </mesh>
                    </>
                )
            }
        )}
    </>
  )
}

export function SettingsScreen({ ...props }: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const ballRefs = useRef<Map<number, React.RefObject<BallHandle | null>>>(new Map())
    const [balls, setBalls] = useState<number[]>([])
    const [ctrlZoomPanel, setCtrlZoomPanel] = useState(73)
    const [sortedZoomPanel, setSortedZoomPanel] = useState(73)

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
            setBalls(data.balls)
            data.balls.forEach((n) => {
                const ref = ballRefs.current.get(n)
                if (ref?.current) ref.current.activate()
            })
        })
        .catch(err => console.error('Erro ao carregar bolas:', err))

        getZoom().then(data => {
            setCtrlZoomPanel(data.ctrlZoomPanel)
            setSortedZoomPanel(data.sortedZoomPanel)
        })
        .catch(err => console.error('Erro ao carregar Zoom:', err))
    }, [])

    useEffect(() => {
        handleReleaseZoom()
    }, [ctrlZoomPanel, sortedZoomPanel])

    const handleBallClick = async (number: number) => {
        try {
            const data = await postBall(number)
            setBalls(data.balls)
        } catch (err) {
            console.error('Erro ao enviar número:', err)
        }
    }

    const handleReleaseZoom = async () => {
        try {
            await postZoom(ctrlZoomPanel, sortedZoomPanel)
        } catch (err) {
            console.error('Erro ao enviar número:', err)
        }
    }

    const handleBallClear = async () => {
        try {
            await postBallClear()
            ballRefs.current.forEach((ref) => {
                if (ref.current) ref.current.deactivate()
            })
        } catch (err) {
            console.error('Erro ao limpar todas as marcações', err)
        }
    }

    const handleRollNumber = async () => {
        const sortedNumber = rollNewNumber(balls)
        console.log(sortedNumber)
    }

    return (
        <mesh
            {...props}
            ref={meshRef}
        >
            <mesh position={[0, 4.35, 0]}>
                <Text
                    position={[0, 0, 0]}
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

                <mesh position={[-5.70, 0.08, 0]}>
                    <SmallPanel number='O-68' fontSize={2.7} height={3.04} width={5.5} positionPanel={[0,0,0]} positionText={[0,-0.1,0]} rounded={[0, 0, 0.2, 0.2]}/>
                </mesh>
                <mesh position={[-1.3, 0.85, 0]}>
                    <SmallPanel number='O-68' fontSize={1.5} height={1.5} width={3.1} positionPanel={[0,0,0]} positionText={[0,-0.1,0]}/>
                </mesh>
                <mesh position={[-1.3, -0.7, 0]}>
                    <SmallPanel number='O-68' fontSize={1.5} height={1.5} width={3.1} positionPanel={[0,0,0]} positionText={[0,-0.1,0]}/>
                </mesh>
                <mesh position={[1.9, 0.85, 0]}>
                    <SmallPanel number='O-68' fontSize={1.5} height={1.5} width={3.1} positionPanel={[0,0,0]} positionText={[0,-0.1,0]} rounded={[0.2, 0, 0, 0]}/>
                </mesh>
                <mesh position={[1.9, -0.7, 0]}>
                    <SmallPanel number='O-68' fontSize={1.5} height={1.5} width={3.1} positionPanel={[0,0,0]} positionText={[0,-0.1,0]} rounded={[0, 0.2, 0, 0]}/>
                </mesh>
                <Buttom text='SORTE!' height={1.5} fontSize={0.8} color="#d90429" position={[4.9, 0.85, 0]} onClick={() => {}} />
                <Buttom text='LIMPAR' height={1.5} fontSize={0.76} color="#00c2cb" fontColor='#024D50' position={[4.9, -0.7, 0]} onClick={() => {}} />
                <ZoomControl 
                    position={[7.4,0.55,0]} 
                    number={ctrlZoomPanel}
                    text='ZOOM CONTROLE' 
                    onClick={(direction: 'top' | 'right' | 'bottom' | 'left') => { 
                        if(direction == "left") {
                            setCtrlZoomPanel(ctrlZoomPanel - 1)
                        } else if(direction == "right") {
                            setCtrlZoomPanel(ctrlZoomPanel + 1)
                        }
                    }}
                />
                <ZoomControl 
                    position={[7.4,-0.9,0]} 
                    number={sortedZoomPanel}
                    text='ZOOM SORTEIO'
                    color='#d90429'
                    fontColor='#d90429'
                    onClick={(direction: 'top' | 'right' | 'bottom' | 'left') => { 
                        if(direction == "left") {
                            setSortedZoomPanel(sortedZoomPanel - 1)
                        } else if(direction == "right") {
                            setSortedZoomPanel(sortedZoomPanel + 1)
                        }
                    }}
                />
            </mesh>

            <mesh>
                {/* <Plane
                    args={[100, 100]} // cobre toda a tela
                    position={[0, 0, 9.9]} // quase na frente da câmera (z = 10)
                >
                    <meshStandardMaterial
                    color="black"
                    transparent
                    opacity={0.5} // 0.5 = 50% transparente
                    />
                </Plane> */}
            {/* <SortedBall number={79} position={[0, 0, 0]} /> */}
            </mesh>
        </mesh>
    )
}