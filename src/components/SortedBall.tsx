
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
        context.font = `38px Consolas`
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(number.toString(), x , y + 5)
    }

    ctx.scale(0.5, 1)
    circle((40)+((80)*0), 80, 30, ctx)
    circle((40)+((80)*1), 80, 30, ctx)
    circle((40)+((80)*2), 80, 30, ctx)
    circle((40)+((80)*3), 80, 30, ctx)
    circle((40)+((80)*4), 80, 30, ctx)
    circle((40)+((80)*5), 80, 30, ctx)
    circle((40)+((80)*6), 80, 30, ctx)
    circle((40)+((80)*7), 80, 30, ctx)

    circle((40)+((80)*0), 160, 30, ctx)
    circle((40)+((80)*1), 160, 30, ctx)
    circle((40)+((80)*2), 160, 30, ctx)
    circle((40)+((80)*3), 160, 30, ctx)
    circle((40)+((80)*4), 160, 30, ctx)
    circle((40)+((80)*5), 160, 30, ctx)
    circle((40)+((80)*6), 160, 30, ctx)
    circle((40)+((80)*7), 160, 30, ctx)

    circle((40)+((80)*0), 240, 30, ctx)
    circle((40)+((80)*1), 240, 30, ctx)
    circle((40)+((80)*2), 240, 30, ctx)
    circle((40)+((80)*3), 240, 30, ctx)
    circle((40)+((80)*4), 240, 30, ctx)
    circle((40)+((80)*5), 240, 30, ctx)
    circle((40)+((80)*6), 240, 30, ctx)
    circle((40)+((80)*7), 240, 30, ctx)


    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
}

export function SortedBall({ number = 1, ...props }: ThreeElements['mesh'] & { number?: number }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const texture = useMemo(() => createBingoTexture(number), [number])

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.1
            meshRef.current.rotation.x += 0.06
        }
    })
    
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={1}
        >
            {/* <planeGeometry args={[1, 1]}/> */}
            <sphereGeometry args={[1, 64, 64]}/>
            <meshStandardMaterial map={texture} />
        </mesh>
    )
}