
import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'

function createBingoTexture(number: string): THREE.Texture {
    const size = 1200
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!

    // Fundo vermelho
    ctx.fillStyle = '#d00'
    ctx.fillRect(0, 0, size, size)

    const circle = (x: number, y: number, radius: number, context: CanvasRenderingContext2D) => {
        context.beginPath()
        context.fillStyle = '#000'
        context.arc(x, y, radius, 0, 2 * Math.PI)
        context.fill()

        context.beginPath()
        context.fillStyle = '#FFF'
        context.arc(x, y, radius * 0.96, 0, 2 * Math.PI)
        context.fill()

        context.fillStyle = '#000'
        context.font = `230px Impact`
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(number, x , y)
    }

    ctx.scale(0.5, 1)

    const numbers = Array.from({ length: 4 }, (_, i) => i + 1)
    numbers.map((num, index) => {
        const x = (index * 600 + 300) + (index * 0)
        circle(x, 600, 250, ctx)
    })

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
}

export function SortedBall({ number = '1', animated = true, ...props }: ThreeElements['mesh'] & { number?: string, animated?: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const texture = useMemo(() => createBingoTexture(number), [number])

    useFrame(() => {
        if (meshRef.current && animated) {
            meshRef.current.rotation.y += 0.1
            // meshRef.current.rotation.x += 0.06
        } else {
            meshRef.current.rotation.y = 0.8    
        }
    })
    
    return (
        <mesh
            {...props}
            ref={meshRef}
        >
            {/* <planeGeometry args={[10, 10]}/> */}
            <sphereGeometry args={[4.5, 64, 64]}/>
            <meshStandardMaterial map={texture} />
        </mesh>
    )
}