
import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'

function createBingoTexture(number: number): THREE.Texture {
    const size = 320
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!

    // Fundo vermelho
    ctx.fillStyle = '#CCC'
    ctx.fillRect(0, 0, size, size)

    const circle = (x: number, y: number, radius: number, context: CanvasRenderingContext2D) => {
        context.beginPath()
        context.fillStyle = '#FFF'
        context.arc(x, y, radius * 1.5, 0, 2 * Math.PI)
        context.fill()

        context.fillStyle = '#000'
        context.font = `700 70px 'Roboto Mono', monospace`
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(number.toString(), x , y + 5)
    }

    ctx.scale(0.5, 1)
    circle(size, size / 2, 50, ctx)


    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
}

export function Ball({ number = 1, ...props }: ThreeElements['mesh'] & { number?: number }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const texture = useMemo(() => createBingoTexture(number), [number])

    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={0.5}
            rotation={[0, Math.PI * 1.5, 0]}
        >
            {/* <planeGeometry args={[1, 1]}/> */}
            <sphereGeometry args={[1, 64, 64]}/>
            <meshStandardMaterial map={texture} />
        </mesh>
    )
}