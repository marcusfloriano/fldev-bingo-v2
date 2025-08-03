
import * as THREE from 'three'
import { useRef, useMemo, useState, useEffect } from 'react'
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

    Array.from({ length: 4 }).forEach((_, index) => {
        const x = (index * 600 + 300)
        circle(x, 600, 250, ctx)
    })

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
}

type SortedBallProps = {
    number?: string, 
    animated?: boolean
} & ThreeElements['mesh']

export function SortedBall({
    number = '1',
    animated = true,
    ...props 
}: SortedBallProps) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const texture = useMemo(() => createBingoTexture(number), [number])
    const [shouldLerp, setShouldLerp] = useState(false)
    const targetRotationY = 0.8

    useEffect(() => {
        if (!animated) {
            setShouldLerp(true)
        }
    }, [animated])

    useFrame(() => {
        const mesh = meshRef.current
        if (!mesh) return

        if (animated) {
            mesh.rotation.y += 0.03
        } else if (shouldLerp) {
            mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotationY, 0.1)

            if (Math.abs(mesh.rotation.y - targetRotationY) < 0.001) {
                mesh.rotation.y = targetRotationY
                setShouldLerp(false)
            }
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