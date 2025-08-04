
import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { Text, Plane } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'

import { SmallPanel } from './base/SmallPanel'

import { LetterBingo } from './LetterBingo'
import { Ball, type BallHandle } from './Ball'
import { Buttom } from './base/Buttom'
import { ZoomControl } from './base/ZoomControl'

import { SortedBall } from './SortedBall'

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

export function ControlScreen({ ...props }: ThreeElements['mesh']) {
    const { camera } = useThree()
    const listener = new THREE.AudioListener()
    camera.add(listener)
    const sound = new THREE.Audio(listener)
    let url: string = ""

    const meshRef = useRef<THREE.Mesh>(null!)
    const ballRefs = useRef<Map<number, React.RefObject<BallHandle | null>>>(new Map())

    const [balls, setBalls] = useState<number[]>([])
    const [ctrlZoomPanel, setCtrlZoomPanel] = useState(73)
    const [sortedZoomPanel, setSortedZoomPanel] = useState(73)
    const [scaleSortedBall, setScaleSortedBall] = useState(1)
    const [roll, setRoll] = useState(false)
    const [sortedBall, setSortedBall] = useState("?")
    const [sortedMusic, setSortedMusic] = useState(true)
    const [animatedBall, setAnimatedBall] = useState(true)

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

    useFrame(() => {
        if(scaleSortedBall <= 4.5) {
            setScaleSortedBall(scaleSortedBall + 0.1)
        }
    })

    const playSound = () => {
        if(!sortedMusic) return
        const loader = new THREE.AudioLoader()

        const sorteio = Math.floor(Math.random() * 5) + 1
        url = `/sounds/musica-roleta-${sorteio}.mp3`

        loader.load(url, (buffer) => {
            sound.setBuffer(buffer)
            sound.setLoop(false)
            sound.setVolume(1.5)
            sound.play()

            // Remover listener depois de tocar
            sound.onEnded = () => {
            camera.remove(listener)
            }
        })
    }

    const playSong = (song: string) => {
        const loader = new THREE.AudioLoader()
        if(url === `/sounds/instants/${song}`) {
            sound.stop()
            url = ""
        } else {
            url = `/sounds/instants/${song}`
            loader.load(url, (buffer) => {
                sound.stop()
                sound.setBuffer(buffer)
                sound.setLoop(false)
                sound.setVolume(1.5)
                sound.play()

                // Remover listener depois de tocar
                sound.onEnded = () => {
                    camera.remove(listener)
                    url = ""
                }
            })
        }
    }

    const toggleSortedMusic = (toggle: boolean) => {
        setSortedMusic(toggle)
    }

    useEffect(() => {
        (window as any).toggleSortedMusic = toggleSortedMusic;
        (window as any).playSoundFromUI = playSong;
    }, [])

    const handleBallClick = async (number: number) => {
        try {
            const data = await postBall(number, false)
            setBalls(data.balls)
        } catch (err) {
            console.error('Erro ao enviar número:', err)
        }
    }

    const handleReleaseZoom = async (ctrl: number, panel: number) => {
        try {
            await postZoom(ctrl, panel)
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
            setBalls([])
        } catch (err) {
            console.error('Erro ao limpar todas as marcações', err)
        }
    }

    const handleRollNumber = async () => {
        const sortedNumber = rollNewNumber(balls)
        if(sortedNumber) {
            try {
                const data = await postBall(sortedNumber, true)
                const ref = ballRefs.current.get(sortedNumber)
                if (ref?.current) ref.current.activate()
                setAnimatedBall(false)
                setBalls(data.balls)
                setRoll(true)
                setSortedBall(getBingoLetter(sortedNumber))
                playSound()
                setTimeout(() => {
                    setSortedBall(getBingoLetter(sortedNumber))
                    setAnimatedBall(false)
                }, 3000)
                setTimeout(() => {
                    setRoll(false)
                }, 6000)
            } catch (err) {
                console.error('Erro ao enviar número:', err)
            }
        }
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
                    <SmallPanel number={getBingoLetter(balls[balls.length-1])} fontSize={2.7} height={3.04} width={5.5} positionPanel={[0,0,0]} positionText={[0,-0.1,0]} rounded={[0, 0, 0.2, 0.2]}/>
                </mesh>
                <mesh position={[-1.3, 0.85, 0]}>
                    <SmallPanel number={getBingoLetter(balls[balls.length-2])} fontSize={1.5} height={1.5} width={3.1} positionPanel={[0,0,0]} positionText={[0,-0.1,0]}/>
                </mesh>
                <mesh position={[-1.3, -0.7, 0]}>
                    <SmallPanel number={getBingoLetter(balls[balls.length-3])} fontSize={1.5} height={1.5} width={3.1} positionPanel={[0,0,0]} positionText={[0,-0.1,0]}/>
                </mesh>
                <mesh position={[1.9, 0.85, 0]}>
                    <SmallPanel number={getBingoLetter(balls[balls.length-4])} fontSize={1.5} height={1.5} width={3.1} positionPanel={[0,0,0]} positionText={[0,-0.1,0]} rounded={[0.2, 0, 0, 0]}/>
                </mesh>
                <mesh position={[1.9, -0.7, 0]}>
                    <SmallPanel number={getBingoLetter(balls[balls.length-5])} fontSize={1.5} height={1.5} width={3.1} positionPanel={[0,0,0]} positionText={[0,-0.1,0]} rounded={[0, 0.2, 0, 0]}/>
                </mesh>
                <Buttom text='SORTEIO' height={1.5} fontSize={0.7} color="#d90429" position={[4.9, 0.85, 0]} onClick={handleRollNumber} />
                <Buttom text='LIMPAR' height={1.5} fontSize={0.76} color="#00c2cb" fontColor='#024D50' position={[7.4, -0.7, 0]} onClick={() => {handleBallClear()}} />
                <ZoomControl 
                    position={[7.4,0.55,0]} 
                    number={ctrlZoomPanel}
                    text='ZOOM CONTROLE' 
                    onClick={(direction: 'top' | 'right' | 'bottom' | 'left') => { 
                        if(direction == "left") {
                            handleReleaseZoom(ctrlZoomPanel - 1, sortedZoomPanel)
                            setCtrlZoomPanel(ctrlZoomPanel - 1)
                        } else if(direction == "right") {
                            handleReleaseZoom(ctrlZoomPanel + 1, sortedZoomPanel)
                            setCtrlZoomPanel(ctrlZoomPanel + 1)
                        }
                    }}
                />
                <ZoomControl 
                    position={[4.9,-0.9,0]} 
                    number={sortedZoomPanel}
                    text='ZOOM SORTEIO'
                    color='#d90429'
                    fontColor='#d90429'
                    onClick={(direction: 'top' | 'right' | 'bottom' | 'left') => { 
                        if(direction == "left") {
                            handleReleaseZoom(ctrlZoomPanel, sortedZoomPanel - 1)
                            setSortedZoomPanel(sortedZoomPanel - 1)
                        } else if(direction == "right") {
                            handleReleaseZoom(ctrlZoomPanel, sortedZoomPanel + 1)
                            setSortedZoomPanel(sortedZoomPanel + 1)
                        }
                    }}
                />
            </mesh>

            {roll && (
                <group>
                    <Plane
                        args={[100, 100]} // cobre toda a tela
                        position={[0, 0, 2]} // quase na frente da câmera (z = 10)
                        onPointerDown={(e) => {e.stopPropagation()}}
                        onClick={(e) => {e.stopPropagation()}}
                        onPointerOver={(e) => {e.stopPropagation()}}
                        onPointerOut={(e) => {e.stopPropagation()}}
                    >
                        <meshStandardMaterial
                        color="black"
                        transparent
                        opacity={0.5} // 0.5 = 50% transparente
                        />
                    </Plane>
                    <SortedBall rotation={[0,0.8,0]} number={sortedBall} position={[0, 0, 3]} scale={1} animated={animatedBall}/>
                </group>
            )}
        </mesh>
    )
}